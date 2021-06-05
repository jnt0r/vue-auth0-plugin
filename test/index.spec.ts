import VueAuth0Plugin from "../src";
import {createApp} from "vue";
import {mount} from "@vue/test-utils";

describe('VueAuth0Plugin', () => {
    it('should be vue plugin', () => {
        expect(VueAuth0Plugin).toMatchObject({
            install: expect.any(Function),
        });
    });

    it('should be installable', () => {
        const app = createApp({render: () => null});
        app.use(VueAuth0Plugin, {
            domain: 'domain',
            client_id: 'clientID',
        });
    });

    it('should add global property $auth', () => {
        const wrapper = mount({render: () => null}, {
            global: {
                plugins: [[VueAuth0Plugin, {
                    domain: 'domain',
                    client_id: 'clientID',
                }]]
            }
        });

        // @ts-ignore
        expect(wrapper.vm.$auth).toBeDefined();
        // @ts-ignore
        expect(wrapper.vm.$auth).toMatchObject({
            isAuthenticated: expect.any(Boolean),
            loading: expect.any(Boolean),
            user: undefined,
            getIdTokenClaims: expect.any(Function),
            getTokenSilently: expect.any(Function),
            getTokenWithPopup: expect.any(Function),
            handleRedirectCallback: expect.any(Function),
            loginWithRedirect: expect.any(Function),
            loginWithPopup: expect.any(Function),
            logout: expect.any(Function),
        });
    });

});
