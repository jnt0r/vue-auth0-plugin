import {App, reactive, readonly, ref} from "vue";
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
    User
} from "@auth0/auth0-spa-js";
import AuthProperty from "./AuthProperty";

const state = reactive({
    loading: true,
    isAuthenticated: false,
    user: undefined,
    popupOpen: false,
    error: undefined,
} as {
    loading: boolean,
    isAuthenticated: boolean,
    user?: User,
    popupOpen: boolean,
    error?: string
});

const properties = reactive({
    isAuthenticated: false,
    loading: true,
    user: undefined,
    getIdTokenClaims,
    getTokenSilently,
    getTokenWithPopup,
    handleRedirectCallback,
    loginWithRedirect,
    loginWithPopup,
    logout,
}) as AuthProperty;

Object.defineProperties(properties, {
    isAuthenticated: {
        get() {
            return state.isAuthenticated;
        },
        enumerable: false,
    },
    loading: {
        get() {
            return state.loading;
        },
        enumerable: false,
    },
    user: {
        get() {
            return state.user;
        },
        enumerable: false,
    }
});

let client: Auth0Client;

async function initialize(app: App, value: Auth0Client): Promise<void> {
    client = value;

    try {
        // If the user is returning to the app after authentication
        if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
            // handle the redirect and retrieve tokens
            const {appState} = await client.handleRedirectCallback();

            // Notify subscribers that the redirect callback has happened, passing the appState
            // (useful for retrieving any pre-authentication state)
            app.config.globalProperties.$router.push(appState && appState.targetUrl ? appState.targetUrl : '/');
        }
    } catch (e) {
        state.error = e;
    } finally {
        // Initialize our internal authentication state
        state.isAuthenticated = await client.isAuthenticated();
        state.user = await client.getUser();
        state.loading = false;
    }
}

export default {
    state,
    properties,
    initialize
}

async function loginWithPopup(options?: PopupLoginOptions, config?: PopupConfigOptions): Promise<void> {
    state.popupOpen = true;

    try {
        await client.loginWithPopup(options, config);
    } catch (e) {
        console.error(e);
    } finally {
        state.popupOpen = false;
    }

    state.user = await client.getUser();
    state.isAuthenticated = true;
}

async function handleRedirectCallback(url?: string): Promise<void> {
    state.loading = true;

    try {
        await client.handleRedirectCallback(url);
        state.user = await client.getUser();
        state.isAuthenticated = true;
    } catch (e) {
        state.error = e;
    } finally {
        state.loading = false;
    }
}

function loginWithRedirect(options?: RedirectLoginOptions): Promise<void> {
    return client.loginWithRedirect(options);
}

function getIdTokenClaims(options?: GetIdTokenClaimsOptions): Promise<IdToken> {
    return client.getIdTokenClaims(options);
}

function getTokenSilently(options?: GetTokenSilentlyOptions): Promise<any> {
    return client.getTokenSilently(options);
}

function getTokenWithPopup(options?: GetTokenWithPopupOptions, config?: PopupConfigOptions): Promise<string> {
    return client.getTokenWithPopup(options, config);
}

function logout(options?: LogoutOptions): void {
    return client.logout(options);
}
