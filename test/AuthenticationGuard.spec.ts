import { RouteLocationNormalized } from 'vue-router';
import { instance, mock, when } from 'ts-mockito';
import authPlugin from '../src/plugin';
import AuthenticationGuard from '../src/AuthenticationGuard';

describe('AuthenticationGuard', () => {
    it('should call loginWithRedirect when not authenticated', async () => {
        const to: RouteLocationNormalized = mock();
        const from: RouteLocationNormalized = mock();
        when(to.fullPath).thenReturn('/targetRoute');
        authPlugin.state.authenticated = false;
        authPlugin.state.loading = false;
        authPlugin.properties.loginWithRedirect = jest.fn();

        const returnValue = await AuthenticationGuard(instance(to), instance(from));

        expect(returnValue).toBeFalsy();
        return expect(authPlugin.properties.loginWithRedirect).toBeCalledWith(expect.objectContaining({
            appState: { targetUrl: '/targetRoute' },
        }));
    });

    it('should return true when authenticated and not loading', async () => {
        const to: RouteLocationNormalized = mock();
        const from: RouteLocationNormalized = mock();

        authPlugin.state.authenticated = true;
        authPlugin.state.loading = false;

        return expect(AuthenticationGuard(instance(to), instance(from))).resolves.toBeTruthy();
    });

    it('should return true when finished loading', async () => {
        const to: RouteLocationNormalized = mock();
        const from: RouteLocationNormalized = mock();
        authPlugin.properties.loginWithRedirect = jest.fn();
        authPlugin.state.authenticated = true;
        authPlugin.state.loading = true;

        let resolved = false;
        let returnValue;
        AuthenticationGuard(instance(to), instance(from))
            .then((value) => {
                resolved = true;
                returnValue = value;
            });

        expect(resolved).toBeFalsy();

        authPlugin.state.loading = false;

        await new Promise((resolve) => setTimeout(resolve, 100));

        expect(resolved).toBeTruthy();
        expect(returnValue).toBeTruthy();
    });

    it('should call loginWithRedirect when finished loading', async () => {
        const to: RouteLocationNormalized = mock();
        when(to.fullPath).thenReturn('/targetRoute');
        const from: RouteLocationNormalized = mock();
        authPlugin.properties.loginWithRedirect = jest.fn();
        authPlugin.state.authenticated = false;
        authPlugin.state.loading = true;

        AuthenticationGuard(instance(to), instance(from));

        expect(authPlugin.properties.loginWithRedirect).not.toBeCalled();

        authPlugin.state.loading = false;

        // Needs small delay because of watchEffect.
        await new Promise((resolve) => setTimeout(resolve, 500));

        return expect(authPlugin.properties.loginWithRedirect).toBeCalledWith(expect.objectContaining({
            appState: { targetUrl: '/targetRoute' },
        }));
    });
});
