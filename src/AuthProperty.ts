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

export default interface AuthProperty {
    authenticated: boolean;
    getAuthenticatedAsPromise: () => Promise<boolean>;
    loading: boolean;
    user?: User;
    client?: Auth0Client,
    getIdTokenClaims: (options?: GetIdTokenClaimsOptions) => Promise<IdToken>,
    // Any type defined by auth0-spa-js.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getTokenSilently: (options?: GetTokenSilentlyOptions) => Promise<any>,
    getTokenWithPopup: (options?: GetTokenWithPopupOptions, config?: PopupConfigOptions) => Promise<string>,
    handleRedirectCallback: (url?: string) => Promise<void>,
    loginWithRedirect: (options?: RedirectLoginOptions) => Promise<void>,
    loginWithPopup: (options?: PopupLoginOptions, config?: PopupConfigOptions) => Promise<void>,
    logout: (options?: LogoutOptions) => void,
}
