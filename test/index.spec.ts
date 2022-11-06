import VueAuth0Plugin, { AuthenticationState } from '../src';
import { createApp } from 'vue';
import { mount } from '@vue/test-utils';
import '../src/vue.d';
import Plugin from '../src/plugin';
import { Auth0Client } from '@auth0/auth0-spa-js';

describe('VueAuth0Plugin', () => {
    /* eslint-disable */
    const JSDOM = require('jsdom').JSDOM;
    Object.defineProperty(global.self, 'crypto', {
        value: {
            getRandomValues: (arr: string | any[]) => {
                // @ts-ignore
                return crypto.randomBytes(arr.length);
            },
        },
    });
    // @ts-ignore
    global.crypto.subtle = {}; // this gets around the 'auth0-spa-js must run on a secure origin' error
    /* eslint-enable */

    it('should be vue plugin', () => {
        expect(VueAuth0Plugin).toMatchObject({
            install: expect.any(Function),
        });
    });

    it('should be installable', () => {
        const app = createApp({ render: () => null });
        app.use(VueAuth0Plugin, {
            domain: 'domain',
            clientId: 'clientID',
        });
    });

    it('should add global property $auth', () => {
        const wrapper = mount({ render: () => null }, {
            global: {
                plugins: [ [ VueAuth0Plugin, {
                    domain: 'domain',
                    clientId: 'clientID',
                } ] ],
            },

        });

        expect(wrapper.vm.$auth).toMatchObject({
            authenticated: expect.any(Boolean),
            getAuthenticatedAsPromise: expect.any(Function),
            loading: expect.any(Boolean),
            user: undefined,
            client: expect.any(Auth0Client),
            getIdTokenClaims: expect.any(Function),
            getTokenSilently: expect.any(Function),
            getTokenWithPopup: expect.any(Function),
            handleRedirectCallback: expect.any(Function),
            loginWithRedirect: expect.any(Function),
            loginWithPopup: expect.any(Function),
            logout: expect.any(Function),
        });
    });

    it('should provide property auth', () => {
        const wrapper = mount({ render: () => null, inject: [ 'auth' ] }, {
            global: {
                plugins: [ [ VueAuth0Plugin, {
                    domain: 'domain',
                    clientId: 'clientID',
                } ] ],
            },
        });

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(wrapper.vm.auth).toMatchObject({
            authenticated: expect.any(Boolean),
            getAuthenticatedAsPromise: expect.any(Function),
            loading: expect.any(Boolean),
            user: undefined,
            client: expect.any(Auth0Client),
            getIdTokenClaims: expect.any(Function),
            getTokenSilently: expect.any(Function),
            getTokenWithPopup: expect.any(Function),
            handleRedirectCallback: expect.any(Function),
            loginWithRedirect: expect.any(Function),
            loginWithPopup: expect.any(Function),
            logout: expect.any(Function),
        });
    });

    it('should export AuthenticationState', () => {
        expect(AuthenticationState).toEqual(Plugin.state);

        Plugin.state.loading = true;
        Plugin.state.authenticated = true;
        Plugin.state.user = { name: 'TestUser' };

        expect(AuthenticationState).toEqual(Plugin.state);
    });
});
