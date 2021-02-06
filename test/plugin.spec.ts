import {deepEqual, instance, mock, verify, when} from "ts-mockito";
import {Auth0Client, User} from "@auth0/auth0-spa-js";
import Plugin from '../src/plugin';

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

    test('should set state when not authenticated', (done) => {
        when(client.getUser()).thenResolve(undefined);
        when(client.isAuthenticated()).thenResolve(false);

        return Plugin.initialize(instance(client), jest.fn()).then(() => {
            expect(Plugin.state.isAuthenticated).toBeFalsy();
            expect(Plugin.state.loading).toBeFalsy();
            expect(Plugin.state.user).toBeUndefined();
            done();
        });
    });

    test('should set state according to auth0 response', async (done) => {
        const clientInstance = instance(client);
        const user: User = {
            name: 'mike',
        };

        when(client.getUser()).thenResolve(user);
        when(client.isAuthenticated()).thenResolve(true);

        let actual = await clientInstance.getUser();
        expect(actual).not.toBeNull();
        expect(actual).not.toBeUndefined();
        expect(client.isAuthenticated()).toBeTruthy();

        return Plugin.initialize(clientInstance, jest.fn()).then(() => {
            expect(Plugin.state.isAuthenticated).toBeTruthy();
            expect(Plugin.state.loading).toBeFalsy();
            expect(Plugin.state.user).toEqual(user);
            done();
        });
    });

    test('should set state according to auth0 response', async (done) => {
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

        let callback = jest.fn();
        return Plugin.initialize(clientInstance, callback).then(() => {
            verify(client.handleRedirectCallback()).called();

            expect(callback).toHaveBeenCalledWith(appState);
            done();
        });

    });
});

describe('methods should be delegated', () => {
    const client: Auth0Client = mock<Auth0Client>();
    const clientInstance = instance(client);


    it('logout', async () => {
        await Plugin.initialize(clientInstance, jest.fn());
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
});
