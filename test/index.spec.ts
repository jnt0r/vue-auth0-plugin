import VueAuth0Plugin, { AuthenticationState } from '../src';
import { createApp, Plugin as VuePlugin } from 'vue';
import { mount } from '@vue/test-utils';
import '../src/vue.d';
import Plugin from '../src/plugin';
import { Auth0Client } from '@auth0/auth0-spa-js';
import AuthProperty from '../src/AuthProperty';

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
        expect(VueAuth0Plugin).toMatchObject<VuePlugin>({
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

    it('should provide property auth', () => {
        const wrapper = mount({ render: () => null, inject: [ 'auth' ] }, {
            global: {
                plugins: [ [ VueAuth0Plugin, {
                    domain: 'domain',
                    clientId: 'clientID',
                } ] ],
            },
        });

        expect(wrapper.vm.auth).toMatchObject<AuthProperty>({
            authenticated: expect.any(Boolean),
            getAuthenticatedAsPromise: expect.any(Function),
            loading: expect.any(Boolean),
            user: undefined,
            client: expect.any(Auth0Client),
            error: undefined,
            getIdTokenClaims: expect.any(Function),
            getTokenSilently: expect.any(Function),
            getTokenWithPopup: expect.any(Function),
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
        Plugin.state.error = 'This is an error';

        expect(AuthenticationState).toEqual(Plugin.state);
    });
});
