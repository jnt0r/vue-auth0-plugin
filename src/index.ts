import {App} from 'vue';
import createAuth0Client, {Auth0ClientOptions,} from "@auth0/auth0-spa-js";
import Plugin from "./plugin";

declare type Options = { callbackRedirect: (appState: any) => void } & Auth0ClientOptions;

export default {
    install(app: App, options: Options): void {
        app.config.globalProperties.$auth = Plugin.properties;

        createAuth0Client(options).then(value => Plugin.initialize(value, options.callbackRedirect));
    }
}
