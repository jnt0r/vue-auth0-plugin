import {computed, reactive} from "vue";
import {
    Auth0Client,
    GetIdTokenClaimsOptions,
    GetTokenSilentlyOptions,
    GetTokenWithPopupOptions,
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

const properties = {
    isAuthenticated: computed(() => state.isAuthenticated),
    loading: computed(() => state.loading),
    user: computed(() => state.user),
    getIdTokenClaims,
    getTokenSilently,
    getTokenWithPopup,
    handleRedirectCallback,
    loginWithRedirect,
    loginWithPopup,
    logout,
} as AuthProperty;

let client: Auth0Client;

async function initialize(value: Auth0Client, callbackRedirect: (appState: any) => any): Promise<void> {
    client = value;

    try {
        // If the user is returning to the app after authentication
        if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
            // handle the redirect and retrieve tokens
            const {appState} = await client.handleRedirectCallback();

            // Notify subscribers that the redirect callback has happened, passing the appState
            // (useful for retrieving any pre-authentication state)
            callbackRedirect(appState);
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

async function loginWithPopup(options?: PopupLoginOptions, config?: PopupConfigOptions) {
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

async function handleRedirectCallback() {
    state.loading = true;

    try {
        await client.handleRedirectCallback();
        state.user = await client.getUser();
        state.isAuthenticated = true;
    } catch (e) {
        state.error = e;
    } finally {
        state.loading = false;
    }
}

function loginWithRedirect(options?: RedirectLoginOptions) {
    return client.loginWithRedirect(options);
}

function getIdTokenClaims(options?: GetIdTokenClaimsOptions) {
    return client.getIdTokenClaims(options);
}

function getTokenSilently(options?: GetTokenSilentlyOptions) {
    return client.getTokenSilently(options);
}

function getTokenWithPopup(options?: GetTokenWithPopupOptions, config?: PopupConfigOptions) {
    return client.getTokenWithPopup(options, config);
}

function logout(options?: LogoutOptions) {
    return client.logout(options);
}
