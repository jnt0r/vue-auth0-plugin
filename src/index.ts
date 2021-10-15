import { App } from 'vue';
import createAuth0Client, { Auth0ClientOptions } from '@auth0/auth0-spa-js';
import Plugin from './plugin';
import AuthenticationGuard from './AuthenticationGuard';

export default {
    install (app: App, options: Auth0ClientOptions): void {
        // global $auth property is deprecated
        app.config.globalProperties.$auth = Plugin.properties;
        app.provide('auth', Plugin.properties);

        createAuth0Client(options).then((client) => Plugin.initialize(app, client));
    },
};

const AuthenticationState = Plugin.state;
const AuthenticationProperties = Plugin.properties;
export { AuthenticationGuard, AuthenticationState, AuthenticationProperties };
