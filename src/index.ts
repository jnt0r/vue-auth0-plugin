import { App, inject } from 'vue';
import createAuth0Client, { Auth0ClientOptions } from '@auth0/auth0-spa-js';
import Plugin from './plugin';
import AuthenticationGuard from './AuthenticationGuard';
import AuthProperty from './AuthProperty';

const vueAuthInjectionKey = 'auth'

export default {
    install (app: App, options: Auth0ClientOptions): void {
        // global $auth property is deprecated
        app.config.globalProperties.$auth = Plugin.properties;
        app.provide(vueAuthInjectionKey, Plugin.properties);

        createAuth0Client(options).then((client) => Plugin.initialize(app, client));
    },
};

const injectAuth = () => inject<AuthProperty>(vueAuthInjectionKey)

const AuthenticationState = Plugin.state;
const AuthenticationProperties = Plugin.properties;
export { AuthenticationGuard, AuthenticationState, AuthenticationProperties, injectAuth, vueAuthInjectionKey as injectionKey };
