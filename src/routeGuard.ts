import {NavigationGuardNext, RouteLocationNormalized} from "vue-router";
import Plugin from "./plugin";
import {watchEffect} from "vue";

export default (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const {isAuthenticated, loading, loginWithRedirect} = Plugin.properties;

    const verify = () => {
        // If the user is authenticated, continue with the route
        if (isAuthenticated.value) {
            return next();
        }
        // Otherwise, log in
        loginWithRedirect({appState: {targetUrl: to.fullPath}});
    };

    // If loading has already finished, check our auth state using `fn()`
    if (!loading.value) {
        return verify();
    }

    // Watch for the loading property to change before we check isAuthenticated
    watchEffect(() => {
        if (!loading.value) {
            return verify();
        }
    });
};
