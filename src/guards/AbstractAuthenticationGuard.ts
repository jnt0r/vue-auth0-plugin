import { RouteLocationNormalized } from 'vue-router';
import Plugin from '../plugin';
import { watch } from 'vue';

export default async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    autoLogin: boolean,
): Promise<boolean> => {
    // define verify method for later use
    const verify = async () => {
        if (Plugin.state.authenticated) {
            return true;
        }
        if (autoLogin) {
            await Plugin.properties.loginWithRedirect({ appState: { targetUrl: to.fullPath } });
        }
        return false;
    };

    // if not loading, verify request
    if (!Plugin.state.loading) {
        return verify();
    }

    // if loading, watch for loading property to change and then verify
    return new Promise<boolean>((resolve) => {
        const unwatch = watch(() => Plugin.state.loading, async () => {
            if (!Plugin.state.loading) {
                unwatch();
                resolve(verify());
            }
        });
    });
};
