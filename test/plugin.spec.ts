import { createApp } from 'vue';
import Auth0VuePlugin from "../src/plugin";

describe('Auth0VuePlugin', () => {
    it('should be vue plugin', () => {
        expect(Auth0VuePlugin).toMatchObject({
            install: expect.any(Function),
        });
    });

    it('should be installable', () => {
        const app = createApp({ render: () => null });
        app.use(Auth0VuePlugin, {});
    });

});
