import {RouteLocationNormalized} from "vue-router";
import {instance, mock, when} from "ts-mockito";
import authPlugin from "../src/plugin";
import RouteGuard from "../src/routeGuard";

describe('RouteGuard', () => {
    it('should call loginWithRedirect when not authenticated', () => {
        let next = jest.fn();
        const to: RouteLocationNormalized = mock();
        when(to.fullPath).thenReturn('/targetRoute');
        const from: RouteLocationNormalized = mock();
        authPlugin.state.isAuthenticated = false;
        authPlugin.state.loading = false;
        authPlugin.properties.loginWithRedirect = jest.fn();

        RouteGuard(instance(to), instance(from), next);

        expect(authPlugin.properties.loginWithRedirect).toBeCalledWith(expect.objectContaining({
            appState: {targetUrl: '/targetRoute'}
        }));
    });

    it('should call next() when authenticated', () => {
        let next = jest.fn();
        const to: RouteLocationNormalized = mock();
        const from: RouteLocationNormalized = mock();
        authPlugin.state.isAuthenticated = true;
        authPlugin.state.loading = false;

        RouteGuard(instance(to), instance(from), next);

        expect(next).toBeCalled();
    });

    it('should call next() when finished loading', async () => {
        const next = jest.fn();
        const to: RouteLocationNormalized = mock();
        const from: RouteLocationNormalized = mock();
        authPlugin.properties.loginWithRedirect = jest.fn();
        authPlugin.state.isAuthenticated = true;
        authPlugin.state.loading = true;

        RouteGuard(instance(to), instance(from), next);

        expect(next).not.toBeCalled();

        authPlugin.state.loading = false;

        // Needs small delay because of watchEffect.
        await new Promise((r) => setTimeout(r, 500));
        expect(next).toBeCalled();
    });

    it('should call loginWithRedirect when finished loading', async () => {
        let next = jest.fn();
        const to: RouteLocationNormalized = mock();
        when(to.fullPath).thenReturn('/targetRoute');
        const from: RouteLocationNormalized = mock();
        authPlugin.properties.loginWithRedirect = jest.fn();
        authPlugin.state.isAuthenticated = false;
        authPlugin.state.loading = true;

        RouteGuard(instance(to), instance(from), next);

        expect(authPlugin.properties.loginWithRedirect).not.toBeCalled();

        authPlugin.state.loading = false;

        // Needs small delay because of watchEffect.
        await new Promise((r) => setTimeout(r, 500));
        expect(authPlugin.properties.loginWithRedirect).toBeCalledWith(expect.objectContaining({
            appState: {targetUrl: '/targetRoute'}
        }));
    });
});
