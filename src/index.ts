import { App } from 'vue';
import createAuth0Client, { Auth0ClientOptions } from '@auth0/auth0-spa-js';
import Plugin from './plugin';
import AuthenticationGuard from './AuthenticationGuard';

export default {
    install (app: App, options: Auth0ClientOptions): void {
        app.config.globalProperties.$auth = Plugin.properties;

        createAuth0Client(options).then((value) => Plugin.initialize(app, value));
    },
};

export { AuthenticationGuard };
