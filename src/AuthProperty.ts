import {ComputedRef} from "vue";
import {
    GetIdTokenClaimsOptions,
    GetTokenSilentlyOptions,
    GetTokenWithPopupOptions,
    LogoutOptions,
    PopupConfigOptions,
    PopupLoginOptions,
    RedirectLoginOptions,
    User
} from "@auth0/auth0-spa-js";

export default interface AuthProperty {
    isAuthenticated: ComputedRef<boolean>;
    loading: ComputedRef<boolean>;
    user: ComputedRef<User>;
    getIdTokenClaims: (options?: GetIdTokenClaimsOptions) => void,
    getTokenSilently: (options?: GetTokenSilentlyOptions) => void,
    getTokenWithPopup: (options?: GetTokenWithPopupOptions, config?: PopupConfigOptions) => void,
    handleRedirectCallback: () => void,
    loginWithRedirect: (options?: RedirectLoginOptions) => void,
    loginWithPopup: (options?: PopupLoginOptions, config?: PopupConfigOptions) => void,
    logout: (options?: LogoutOptions) => void,
}
