import VueAuth0Plugin, { AuthenticationState } from '../src';
import { createApp } from 'vue';
import { mount } from '@vue/test-utils';
import '../src/vue.d';
import Plugin from '../src/plugin';

describe('VueAuth0Plugin', () => {
    it('should be vue plugin', () => {
        expect(VueAuth0Plugin).toMatchObject({
            install: expect.any(Function),
        });
    });

    it('should be installable', () => {
        const app = createApp({ render: () => null });
        app.use(VueAuth0Plugin, {
            domain: 'domain',
            client_id: 'clientID',
        });
    });

    it('should add global property $auth', () => {
        const wrapper = mount({ render: () => null }, {
            global: {
                plugins: [ [ VueAuth0Plugin, {
                    domain: 'domain',
                    client_id: 'clientID',
                } ] ],
            },

        });

        expect(wrapper.vm.$auth).toMatchObject({
            authenticated: expect.any(Boolean),
            loading: expect.any(Boolean),
            user: undefined,
            client: undefined,
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
                    client_id: 'clientID',
                } ] ],
            },
        });

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(wrapper.vm.auth).toMatchObject({
            authenticated: expect.any(Boolean),
            loading: expect.any(Boolean),
            user: undefined,
            client: undefined,
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
