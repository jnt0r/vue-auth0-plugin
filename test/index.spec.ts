import Auth0VuePlugin from "../src";
import {createApp} from "vue";
import {mount} from "@vue/test-utils";

describe('Auth0VuePlugin', () => {
    it('should be vue plugin', () => {
        expect(Auth0VuePlugin).toMatchObject({
            install: expect.any(Function),
        });
    });

    it('should be installable', () => {
        const app = createApp({render: () => null});
        app.use(Auth0VuePlugin, {
            callbackRedirect: () => {
            },
            domain: 'domain',
            client_id: 'clientID',
        });
    });

    it('should add global parameter', () => {
        const wrapper = mount({render: () => null}, {
            global: {
                plugins: [[Auth0VuePlugin, {
                    callbackRedirect: () => {
                    },
                    domain: 'domain',
                    client_id: 'clientID',
                }]]
            }
        });

        // @ts-ignore
        expect(wrapper.vm.$auth).toBeDefined();
        // @ts-ignore
        expect(wrapper.vm.$auth).toMatchObject({
            isAuthenticated: expect.anything(),
            loading: expect.anything(),
            user: expect.anything(),
            getIdTokenClaims: expect.any(Function),
            getTokenSilently: expect.any(Function),
            getTokenWithPopup: expect.any(Function),
            handleRedirectCallback: expect.any(Function),
            loginWithRedirect: expect.any(Function),
            loginWithPopup: expect.any(Function),
            logout: expect.any(Function),
        });
        // @ts-ignore
        expect(wrapper.vm.$auth.isAuthenticated.value).toBe(false);
        // @ts-ignore
        expect(wrapper.vm.$auth.loading.value).toBe(true);
        // @ts-ignore
        expect(wrapper.vm.$auth.user.value).toEqual({});
    });
});
