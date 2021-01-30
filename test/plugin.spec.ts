import {instance, mock, when} from "ts-mockito";
import {Auth0Client, User} from "@auth0/auth0-spa-js";
import Plugin from '../src/plugin';

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
});
