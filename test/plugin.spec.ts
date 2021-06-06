import {deepEqual, instance, mock, verify, when} from "ts-mockito";
import {Auth0Client, User} from "@auth0/auth0-spa-js";
import Plugin from '../src/plugin';
import {App, createApp} from "vue";

/** Workaround for ts-mockito Bug **/
export const resolvableInstance = <T extends {}>(mock: T) => new Proxy<T>(instance(mock), {
    get(target, name: PropertyKey) {
        if (["Symbol(Symbol.toPrimitive)", "then", "catch"].includes(name.toString())) {
            return undefined;
        }

        return (target as any)[name];
    },
});

describe('initialize', () => {
    const JSDOM = require('jsdom').JSDOM
    Object.defineProperty(global.self, 'crypto', {
        value: {
            getRandomValues: (arr: string | any[]) => {
                // @ts-ignore
                return crypto.randomBytes(arr.length);
            }
        }
    })
    // @ts-ignore
    global.crypto["subtle"] = {} // this gets around the 'auth0-spa-js must run on a secure origin' error

    const client: Auth0Client = mock<Auth0Client>();
    const app = createApp({render: () => null});

    test('should set state when not authenticated', (done) => {
        when(client.getUser()).thenResolve(undefined);
        when(client.isAuthenticated()).thenResolve(false);

        return Plugin.initialize(app, instance(client)).then(() => {
            expect(Plugin.properties.authenticated).toBeFalsy();
            expect(Plugin.properties.loading).toBeFalsy();
            expect(Plugin.properties.user).toBeUndefined();
            done();
        });
    });

    test('should set state when authenticated', async (done) => {
        const clientInstance = instance(client);
        const user: User = {
            name: 'mike',
        };

        when(client.getUser()).thenResolve(user);
        when(client.isAuthenticated()).thenResolve(true);

        return Plugin.initialize(app, clientInstance).then(() => {
            expect(Plugin.properties.authenticated).toBeTruthy();
            expect(Plugin.properties.loading).toBeFalsy();
            expect(Plugin.properties.user).toEqual(user);
            done();
        });
    });

    test('should handle redirect and navigate using router', async (done) => {
        const clientInstance = instance(client);
        const appState = {};

        when(client.handleRedirectCallback()).thenResolve({appState});

        global["window"] = Object.create(window);
        const search = "?code=code123&state=state456";
        Object.defineProperty(window, 'location', {
            value: {
                search: search
            }
        });

        // mock vue-router
        let router_push = jest.fn();
        app.config.globalProperties.$router = {};
        app.config.globalProperties.$router.push = router_push;

        return Plugin.initialize(app, clientInstance).then(() => {
            verify(client.handleRedirectCallback()).called();

            expect(router_push).toHaveBeenCalledWith('/');
            done();
        });

    });
});

describe('methods should be delegated', () => {
    const client: Auth0Client = mock<Auth0Client>();
    const clientInstance = instance(client);
    const app = createApp({render: () => null});

    beforeAll(async () => {
        await Plugin.initialize(app, clientInstance);
    });

    it('logout', async () => {
        Plugin.properties.logout();
        verify(client.logout(deepEqual(undefined))).called();

        Plugin.properties.logout({returnTo: 'someLocation'});
        verify(client.logout(deepEqual({returnTo: 'someLocation'}))).called();
    });

    it('getIdTokenClaims', () => {
        Plugin.properties.getIdTokenClaims();
        verify(client.getIdTokenClaims(deepEqual(undefined))).called();

        Plugin.properties.getIdTokenClaims({scope: 'someScope'});
        verify(client.getIdTokenClaims(deepEqual({scope: 'someScope'}))).called();
    });

    it('loginWithRedirect', () => {
        Plugin.properties.loginWithRedirect();
        verify(client.loginWithRedirect(deepEqual(undefined))).called();

        Plugin.properties.loginWithRedirect({login_hint: 'Some login hint'});
        verify(client.loginWithRedirect(deepEqual({login_hint: 'Some login hint'}))).called();
    });

    it('loginWithPopup', () => {
        Plugin.properties.loginWithPopup();
        verify(client.loginWithPopup(deepEqual(undefined), deepEqual(undefined))).called();

        Plugin.properties.loginWithPopup({login_hint: 'Some login hint'}, {timeoutInSeconds: 5000});
        verify(client.loginWithPopup(deepEqual({login_hint: 'Some login hint'}), deepEqual({timeoutInSeconds: 5000}))).called();
    });

    it('getTokenSilently', () => {
        Plugin.properties.getTokenSilently();
        verify(client.getTokenSilently(deepEqual(undefined))).called();

        Plugin.properties.getTokenSilently({redirect_uri: 'some redirect uri'});
        verify(client.getTokenSilently(deepEqual({redirect_uri: 'some redirect uri'}))).called();
    });

    it('getTokenWithPopup', () => {
        Plugin.properties.getTokenWithPopup();
        verify(client.getTokenWithPopup(deepEqual(undefined), deepEqual(undefined))).called();

        Plugin.properties.getTokenWithPopup({login_hint: 'some login hint'}, {timeoutInSeconds: 5000});
        verify(client.getTokenWithPopup(deepEqual({login_hint: 'some login hint'}), deepEqual({timeoutInSeconds: 5000}))).called();
    });

    it('handleRedirectCallback', () => {
        Plugin.properties.handleRedirectCallback();
        verify(client.handleRedirectCallback(deepEqual(undefined))).called();

        Plugin.properties.handleRedirectCallback('/test');
        verify(client.handleRedirectCallback('/test')).called();
    });
});

describe('properties should be reactive', () => {
    it('isAuthenticated should be reactive ', () => {
        Plugin.state.authenticated = false;
        expect(Plugin.properties.authenticated).toBeFalsy();

        Plugin.state.authenticated = true;
        expect(Plugin.properties.authenticated).toBeTruthy();
    });
})
