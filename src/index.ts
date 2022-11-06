import { App, inject } from 'vue';
import { Auth0Client, Auth0ClientOptions } from '@auth0/auth0-spa-js';
import Plugin from './plugin';
import AuthProperty from './AuthProperty';
import AuthenticationGuardWithoutLoginRedirect from './guards/AuthenticationGuardWithoutLoginRedirect';
import AuthenticationGuardWithLoginRedirect from './guards/AuthenticationGuardWithLoginRedirect';

const vueAuthInjectionKey = 'auth';

export default {
    install (app: App, options: Auth0ClientOptions): void {
        app.provide(vueAuthInjectionKey, Plugin.properties);

        const client = new Auth0Client(options);
        Plugin.initialize(app, client);
    },
};

const injectAuth = () => inject<AuthProperty>(vueAuthInjectionKey);

const AuthenticationState = Plugin.state;
const AuthenticationProperties = Plugin.properties;
export {
    AuthenticationGuardWithLoginRedirect as AuthenticationGuard,
    AuthenticationGuardWithoutLoginRedirect,
    AuthenticationState,
    AuthenticationProperties,
    injectAuth,
    vueAuthInjectionKey as injectionKey,
};
