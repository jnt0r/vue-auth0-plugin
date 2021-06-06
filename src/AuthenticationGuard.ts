import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import Plugin from './plugin';
import { watch } from 'vue';

export default async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
): Promise<void> => {
    // define verify method for later use
    const verify = async () => {
        if (Plugin.state.authenticated) {
            return next();
        }
        return Plugin.properties.loginWithRedirect({ appState: { targetUrl: to.fullPath } });
    };

    // if not loading, verify request
    if (!Plugin.state.loading) {
        return verify();
    }

    // if loading, watch for loading property to change and then verify
    const unwatch = watch(() => Plugin.state.loading, async () => {
        if (!Plugin.state.loading) {
            unwatch();
            return verify();
        }
    });
};
