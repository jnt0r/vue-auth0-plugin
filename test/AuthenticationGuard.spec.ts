import { RouteLocationNormalized } from 'vue-router';
import { instance, mock, when } from 'ts-mockito';
import authPlugin from '../src/plugin';
import AuthenticationGuard from '../src/AuthenticationGuard';

describe('AuthenticationGuard', () => {
    it('should call loginWithRedirect when not authenticated', async () => {
        const to: RouteLocationNormalized = mock();
        const from: RouteLocationNormalized = mock();
        const next = jest.fn();
        when(to.fullPath).thenReturn('/targetRoute');
        authPlugin.state.authenticated = false;
        authPlugin.state.loading = false;
        authPlugin.properties.loginWithRedirect = jest.fn();

        await AuthenticationGuard(instance(to), instance(from), next);

        return expect(authPlugin.properties.loginWithRedirect).toBeCalledWith(expect.objectContaining({
            appState: { targetUrl: '/targetRoute' },
        }));
    });

    it('should call next() when authenticated and not loading', async () => {
        const next = jest.fn();
        const to: RouteLocationNormalized = mock();
        const from: RouteLocationNormalized = mock();

        authPlugin.state.authenticated = true;
        authPlugin.state.loading = false;

        await AuthenticationGuard(instance(to), instance(from), next);

        return expect(next).toBeCalled();
    });

    it('should call next() when finished loading', async () => {
        const next = jest.fn();
        const to: RouteLocationNormalized = mock();
        const from: RouteLocationNormalized = mock();
        authPlugin.properties.loginWithRedirect = jest.fn();
        authPlugin.state.authenticated = true;
        authPlugin.state.loading = true;

        AuthenticationGuard(instance(to), instance(from), next);

        expect(next).not.toBeCalled();

        authPlugin.state.loading = false;

        await new Promise((resolve) => setTimeout(resolve, 100));

        return expect(next).toBeCalled();
    });

    it('should call loginWithRedirect when finished loading', async () => {
        const next = jest.fn();
        const to: RouteLocationNormalized = mock();
        when(to.fullPath).thenReturn('/targetRoute');
        const from: RouteLocationNormalized = mock();
        authPlugin.properties.loginWithRedirect = jest.fn();
        authPlugin.state.authenticated = false;
        authPlugin.state.loading = true;

        AuthenticationGuard(instance(to), instance(from), next);

        expect(authPlugin.properties.loginWithRedirect).not.toBeCalled();

        authPlugin.state.loading = false;

        // Needs small delay because of watchEffect.
        await new Promise((resolve) => setTimeout(resolve, 500));

        return expect(authPlugin.properties.loginWithRedirect).toBeCalledWith(expect.objectContaining({
            appState: { targetUrl: '/targetRoute' },
        }));
    });
});
