import {ComputedRef} from "vue";
import {
    GetIdTokenClaimsOptions,
    GetTokenSilentlyOptions,
    GetTokenWithPopupOptions,
    LogoutOptions,
    PopupLoginOptions,
    RedirectLoginOptions,
    User
} from "@auth0/auth0-spa-js";

export default interface AuthProperty {
    isAuthenticated: ComputedRef<boolean>;
    loading: ComputedRef<boolean>;
    user: ComputedRef<User>;
    getIdTokenClaims: (options: GetIdTokenClaimsOptions) => void,
    getTokenSilently: (options: GetTokenSilentlyOptions) => void,
    getTokenWithPopup: (options: GetTokenWithPopupOptions) => void,
    handleRedirectCallback: () => void,
    loginWithRedirect: (options: RedirectLoginOptions) => void,
    loginWithPopup: (options: PopupLoginOptions) => void,
    logout: (options: LogoutOptions) => void,
}
