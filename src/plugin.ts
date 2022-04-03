import { App, reactive, watch } from 'vue';
import {
    Auth0Client,
    GetIdTokenClaimsOptions,
    GetTokenSilentlyOptions,
    GetTokenWithPopupOptions,
    IdToken,
    LogoutOptions,
    PopupConfigOptions,
    PopupLoginOptions,
    RedirectLoginOptions,
    User,
} from '@auth0/auth0-spa-js';
import AuthProperty from './AuthProperty';

const state = reactive({
    loading: true,
    authenticated: false,
    getAuthenticatedAsPromise: () => new Promise<boolean>((resolve) => {
        const unwatch = watch(() => state.loading, async () => {
            if (!state.loading) {
                unwatch();
                resolve(state.authenticated);
            }
        });
    }),
    user: undefined,
    popupOpen: false,
    error: undefined,
} as {
    loading: boolean,
    authenticated: boolean,
    getAuthenticatedAsPromise: () => Promise<boolean>,
    user?: User,
    popupOpen: boolean,
    error?: unknown
});

const properties = reactive({
    authenticated: false,
    getAuthenticatedAsPromise: state.getAuthenticatedAsPromise,
    loading: true,
    user: undefined,
    client: undefined,
    error: undefined,
    getIdTokenClaims,
    getTokenSilently,
    getTokenWithPopup,
    handleRedirectCallback,
    loginWithRedirect,
    loginWithPopup,
    logout,
}) as AuthProperty;

Object.defineProperties(properties, {
    authenticated: {
        get () {
            return state.authenticated;
        },
        enumerable: false,
    },
    loading: {
        get () {
            return state.loading;
        },
        enumerable: false,
    },
    user: {
        get () {
            return state.user;
        },
        enumerable: false,
    },
    error: {
        get () {
            return state.error;
        },
        enumerable: false,
    },
});

let client: Auth0Client;

async function initialize (app: App, authClient: Auth0Client): Promise<void> {
    client = authClient;

    // set client property to created Auth0Client instance
    properties.client = client;

    try {
        // If the user is returning to the app after authentication
        if (window.location.search.includes('state=') || window.location.search.includes('code=')) {
            // handle the redirect and retrieve tokens
            const { appState } = await client.handleRedirectCallback();

            window.history.replaceState(
                { ...window.history.state, code: undefined, state: undefined },
                document.title, window.location.pathname);

            // Notify subscribers that the redirect callback has happened, passing the appState
            // (useful for retrieving any pre-authentication state)
            app.config.globalProperties.$router.push(appState && appState.targetUrl ? appState.targetUrl : '/');
        }
    } catch (e: unknown) {
        state.error = e;
    } finally {
        // Initialize our internal authentication state
        state.authenticated = await client.isAuthenticated();
        state.user = await client.getUser();
        state.loading = false;
    }
}

export default {
    state,
    properties,
    initialize,
};

async function loginWithPopup (options?: PopupLoginOptions, config?: PopupConfigOptions): Promise<void> {
    state.popupOpen = true;
    state.loading = true;

    try {
        await client.loginWithPopup(options, config);
    } catch (e: unknown) {
        state.error = e;
    } finally {
        state.popupOpen = false;
        state.loading = false;
        state.user = await client.getUser();
        state.authenticated = await client.isAuthenticated();
    }
}

async function handleRedirectCallback (url?: string): Promise<void> {
    state.loading = true;

    try {
        await client.handleRedirectCallback(url);
        state.user = await client.getUser();
        state.authenticated = await client.isAuthenticated();
    } catch (e: unknown) {
        state.error = e;
    } finally {
        state.loading = false;
    }
}

function loginWithRedirect (options?: RedirectLoginOptions): Promise<void> {
    return client.loginWithRedirect(options);
}

function getIdTokenClaims (options?: GetIdTokenClaimsOptions): Promise<IdToken | undefined> {
    return client.getIdTokenClaims(options);
}

// Type any defined by auth0-spa-js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getTokenSilently (options?: GetTokenSilentlyOptions): Promise<any> {
    return client.getTokenSilently(options);
}

function getTokenWithPopup (options?: GetTokenWithPopupOptions, config?: PopupConfigOptions): Promise<string> {
    return client.getTokenWithPopup(options, config);
}

function logout (options?: LogoutOptions): Promise<void> | void {
    return client.logout(options);
}
