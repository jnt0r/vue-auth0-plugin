import { deepEqual, instance, mock, reset, resetCalls, verify, when } from 'ts-mockito';
import { Auth0Client, User } from '@auth0/auth0-spa-js';
import Plugin from '../src/plugin';
import { createApp } from 'vue';
import { AuthenticationProperties, AuthenticationState } from '../src';
import resetModules = jest.resetModules;

/* eslint-disable */
/** Workaround for ts-mockito Bug **/
export const resolvableInstance = <T extends {}>(mock: T) => new Proxy<T>(instance(mock), {
    get(target, name: PropertyKey) {
        if (['Symbol(Symbol.toPrimitive)', 'then', 'catch'].includes(name.toString())) {
            return undefined;
        }

        return (target as any)[name];
    },
});

/* eslint-enable */

function setQueryValue (search: string) {
    const location = {
        ...window.location,
        search,
    };
    Object.defineProperty(window, 'location', {
        writable: true,
        value: location,
    });
}

describe('initialize', () => {
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

    afterEach(() => {
        resetModules();
        resetCalls(client);
        reset(client);

        setQueryValue('');
        Plugin.state.error = undefined;
        window.location.replace = () => {};
        app.config.globalProperties.$router = undefined;
    });

    const client: Auth0Client = mock<Auth0Client>();
    const app = createApp({ render: () => null });

    test('should set state when not authenticated', (done) => {
        when(client.getUser()).thenResolve(undefined);
        when(client.isAuthenticated()).thenResolve(false);

        expect(Plugin.properties.error).toBeUndefined();
        Plugin.initialize(app, instance(client)).then(() => {
            verify(client.handleRedirectCallback()).never();

            expect(Plugin.properties.authenticated).toBeFalsy();
            expect(Plugin.properties.loading).toBeFalsy();
            expect(Plugin.properties.user).toBeUndefined();
            expect(Plugin.properties.error).toBeUndefined();
            done();
        });
    });

    test('should set state when error occurred', (done) => {
        setQueryValue('?code=some_code&state=state_1234');

        when(client.handleRedirectCallback()).thenThrow(new Error('An error occurred!'));
        when(client.getUser()).thenResolve(undefined);

        expect(Plugin.properties.error).toBeUndefined();
        Plugin.initialize(app, instance(client)).then(() => {
            verify(client.handleRedirectCallback()).called();

            expect(Plugin.properties.authenticated).toBeFalsy();
            expect(Plugin.properties.loading).toBeFalsy();
            expect(Plugin.properties.user).toBeUndefined();
            expect(Plugin.properties.error).toEqual(new Error('An error occurred!'));
            done();
        });
    });

    test('should set state when authenticated', (done) => {
        const clientInstance = instance(client);
        const user: User = {
            name: 'mike',
        };

        when(client.getUser()).thenResolve(user);
        when(client.isAuthenticated()).thenResolve(true);

        expect(Plugin.properties.error).toBeUndefined();
        Plugin.initialize(app, clientInstance).then(() => {
            verify(client.handleRedirectCallback()).never();

            expect(Plugin.properties.authenticated).toBeTruthy();
            expect(Plugin.properties.loading).toBeFalsy();
            expect(Plugin.properties.user).toEqual(user);
            expect(Plugin.properties.error).toBeUndefined();
            done();
        });
    });

    test('should handle redirect and navigate using router', (done) => {
        const clientInstance = instance(client);
        setQueryValue('?code=code123&state=state456');
        when(client.handleRedirectCallback()).thenResolve({ appState: {} });

        // mock vue-router
        const routerPush = jest.fn();
        app.config.globalProperties.$router = {};
        app.config.globalProperties.$router.push = routerPush;
        app.config.globalProperties.$router.query = {
            someOtherProperty: 'ShouldStayInState',
            code: 'SomeCode',
            state: 'SomeState',
            error: 'SomeError',
            error_description: 'Some Error Description',
        };

        Plugin.initialize(app, clientInstance).then(() => {
            verify(client.handleRedirectCallback()).called();

            expect(routerPush).toHaveBeenCalledWith(
                { path: '/', replace: true },
                { someOtherProperty: 'ShouldStayInState' });
            done();
        });
    });

    test('should handle redirect and navigate using router and targetUrl', (done) => {
        const clientInstance = instance(client);
        setQueryValue('?code=code123&state=state456');
        when(client.handleRedirectCallback()).thenResolve({ appState: { targetUrl: '/testUrl' } });

        // mock vue-router
        const routerPush = jest.fn();
        app.config.globalProperties.$router = {};
        app.config.globalProperties.$router.push = routerPush;
        app.config.globalProperties.$router.query = {
            someOtherProperty: 'ShouldStayInState',
            code: 'SomeCode',
            state: 'SomeState',
            error: 'SomeError',
            error_description: 'Some Error Description',
        };

        Plugin.initialize(app, clientInstance).then(() => {
            verify(client.handleRedirectCallback()).called();

            expect(routerPush).toHaveBeenCalledWith(
                { path: '/testUrl', replace: true },
                { someOtherProperty: 'ShouldStayInState' });
            done();
        });
    });

    test('should handle redirect and navigate without router', (done) => {
        const clientInstance = instance(client);
        setQueryValue('?code=code123&state=state456');
        when(client.handleRedirectCallback()).thenResolve({ appState: {} });
        const replaceFn = jest.fn();
        window.location.replace = replaceFn;

        Plugin.initialize(app, clientInstance).then(() => {
            verify(client.handleRedirectCallback()).called();

            expect(replaceFn).toHaveBeenCalledWith('/');
            done();
        });
    });

    test('should handle redirect and navigate without router and targetUrl', (done) => {
        const clientInstance = instance(client);
        setQueryValue('?code=code123&state=state456');
        when(client.handleRedirectCallback()).thenResolve({ appState: { targetUrl: '/testUrl' } });
        const replaceFn = jest.fn();
        window.location.replace = replaceFn;

        Plugin.initialize(app, clientInstance).then(() => {
            verify(client.handleRedirectCallback()).called();

            expect(replaceFn).toHaveBeenCalledWith('/testUrl');
            done();
        });
    });

    it('should expose initialised Auth0Client as client property', async () => {
        const client = new Auth0Client({ clientId: '', domain: '' });

        return Plugin.initialize(app, client).then(() => {
            expect(Plugin.properties.client).toBeInstanceOf(Auth0Client);
            expect(Plugin.properties.client).toEqual(client);
        });
    });
});

describe('methods should be delegated', () => {
    const client: Auth0Client = mock<Auth0Client>();
    const clientInstance = instance(client);
    const app = createApp({ render: () => null });

    beforeAll(async () => {
        await Plugin.initialize(app, clientInstance);
    });

    it('logout', async () => {
        Plugin.properties.logout();
        verify(client.logout(deepEqual(undefined))).called();

        Plugin.properties.logout({ clientId: '1234' });
        verify(client.logout(deepEqual({ clientId: '1234' }))).called();
    });

    it('getIdTokenClaims', () => {
        Plugin.properties.getIdTokenClaims();
        verify(client.getIdTokenClaims()).called();
    });

    it('loginWithRedirect', () => {
        Plugin.properties.loginWithRedirect();
        verify(client.loginWithRedirect(deepEqual(undefined))).called();

        Plugin.properties.loginWithRedirect({ fragment: 'some fragment' });
        verify(client.loginWithRedirect(deepEqual({ fragment: 'some fragment' }))).called();
    });

    it('loginWithPopup', () => {
        Plugin.properties.loginWithPopup();
        verify(client.loginWithPopup(deepEqual(undefined), deepEqual(undefined))).called();

        Plugin.properties.loginWithPopup({ authorizationParams: { login_hint: 'some login hint' } },
            { timeoutInSeconds: 5000 });
        verify(client.loginWithPopup(
            deepEqual({ authorizationParams: { login_hint: 'some login hint' } }),
            deepEqual({ timeoutInSeconds: 5000 })),
        ).called();
    });

    it('getTokenSilently', () => {
        Plugin.properties.getTokenSilently();
        verify(client.getTokenSilently(deepEqual(undefined))).called();

        Plugin.properties.getTokenSilently({ detailedResponse: false });
        verify(client.getTokenSilently(deepEqual({ detailedResponse: false }))).called();
    });

    it('getTokenWithPopup', () => {
        Plugin.properties.getTokenWithPopup();
        verify(client.getTokenWithPopup(deepEqual(undefined), deepEqual(undefined))).called();

        Plugin.properties.getTokenWithPopup({ cacheMode: 'on' }, { timeoutInSeconds: 5000 });
        verify(client.getTokenWithPopup(
            deepEqual({ cacheMode: 'on' }),
            deepEqual({ timeoutInSeconds: 5000 })),
        ).called();
    });
});

describe('properties should be reactive', () => {
    it('authenticated should be reactive ', () => {
        Plugin.state.authenticated = false;
        expect(Plugin.properties.authenticated).toBeFalsy();

        Plugin.state.authenticated = true;
        expect(Plugin.properties.authenticated).toBeTruthy();
    });
});

describe('getAuthenticatedAsPromise', () => {
    it('should resolve to false when not authenticated', async function () {
        Plugin.state.loading = true;
        Plugin.state.authenticated = false;
        const authenticatedAsPromise = AuthenticationState.getAuthenticatedAsPromise();
        Plugin.state.loading = false;
        await expect(authenticatedAsPromise)
            .resolves.toBeFalsy();
    });

    it('should resolve to true when authenticated', async function () {
        Plugin.state.loading = true;
        Plugin.state.authenticated = true;
        const authenticatedAsPromise = AuthenticationState.getAuthenticatedAsPromise();
        Plugin.state.loading = false;
        await expect(authenticatedAsPromise)
            .resolves.toBeTruthy();
    });
});

describe('LoginWithPopup', () => {
    const client: Auth0Client = mock<Auth0Client>();
    const clientInstance = instance(client);
    const app = createApp({ render: () => null });

    beforeAll(async () => {
        await Plugin.initialize(app, clientInstance);
    });

    it('should set error when authentication failed', (done) => {
        when(client.loginWithPopup(undefined, undefined)).thenThrow(new Error('This is an error'));
        when(client.getUser()).thenResolve(undefined);

        AuthenticationProperties.loginWithPopup().then(() => {
            expect(Plugin.state.authenticated).toBeFalsy();
            expect(Plugin.state.user).toBeUndefined();
            expect(Plugin.state.loading).toBeFalsy();
            expect(Plugin.state.error).toEqual(new Error('This is an error'));
            done();
        });
    });

    it('should reset properties before login', (done) => {
        const promise = new Promise<void>(function (resolve) {
            expect(Plugin.state.loading).toBeTruthy();
            expect(Plugin.state.popupOpen).toBeTruthy();
            expect(Plugin.state.error).toBeUndefined();

            resolve();
        });

        when(client.loginWithPopup(undefined, undefined)).thenReturn(promise);

        Plugin.state.error = 'This is an error!';
        AuthenticationProperties.loginWithPopup().then(() => {
            expect(Plugin.state.loading).toBeFalsy();
            expect(Plugin.state.popupOpen).toBeFalsy();
            done();
        });
    });
});
