import {
    Auth0Client,
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
    error: unknown,
    getIdTokenClaims: () => Promise<IdToken | undefined>,
    getTokenSilently: (options?: GetTokenSilentlyOptions) => Promise<string>,
    getTokenWithPopup: (options?: GetTokenWithPopupOptions, config?: PopupConfigOptions) => Promise<string | undefined>,
    handleRedirectCallback: (url?: string) => Promise<void>,
    loginWithRedirect: (options?: RedirectLoginOptions) => Promise<void>,
    loginWithPopup: (options?: PopupLoginOptions, config?: PopupConfigOptions) => Promise<void>,
    logout: (options?: LogoutOptions) => void,
}
