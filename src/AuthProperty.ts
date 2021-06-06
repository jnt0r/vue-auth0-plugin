import {
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

export default interface AuthProperty {
    authenticated: boolean;
    loading: boolean;
    user?: User;
    getIdTokenClaims: (options?: GetIdTokenClaimsOptions) => Promise<IdToken>,
    getTokenSilently: (options?: GetTokenSilentlyOptions) => Promise<any>,
    getTokenWithPopup: (options?: GetTokenWithPopupOptions, config?: PopupConfigOptions) => Promise<string>,
    handleRedirectCallback: (url?: string) => Promise<void>,
    loginWithRedirect: (options?: RedirectLoginOptions) => Promise<void>,
    loginWithPopup: (options?: PopupLoginOptions, config?: PopupConfigOptions) => Promise<void>,
    logout: (options?: LogoutOptions) => void,
}
