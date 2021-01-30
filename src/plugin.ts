import {computed, reactive} from "vue";
import {
    Auth0Client,
    GetIdTokenClaimsOptions,
    GetTokenSilentlyOptions,
    GetTokenWithPopupOptions, LogoutOptions,
    RedirectLoginOptions,
    User
} from "@auth0/auth0-spa-js";
import AuthProperty from "./AuthProperty";

const state = reactive({
    loading: true,
    isAuthenticated: false,
    user: {} as User | undefined,
    popupOpen: false,
    error: null,
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

async function loginWithPopup() {
    state.popupOpen = true;

    try {
        await client.loginWithPopup();
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

function loginWithRedirect(options: RedirectLoginOptions) {
    return client.loginWithRedirect(options);
}

function getIdTokenClaims(o: GetIdTokenClaimsOptions) {
    return client.getIdTokenClaims(o);
}

function getTokenSilently(o: GetTokenSilentlyOptions) {
    return client.getTokenSilently(o);
}

function getTokenWithPopup(o: GetTokenWithPopupOptions) {
    return client.getTokenWithPopup(o);
}

function logout(o: LogoutOptions) {
    return client.logout(o);
}
