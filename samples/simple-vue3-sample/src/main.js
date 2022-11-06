import {createApp} from 'vue'
import App from './App.vue'
import {router} from "@/router";
import VueAuth0Plugin from 'vue-auth0-plugin';

let app = createApp(App);
app.use(router);
app.use(VueAuth0Plugin, {
    domain: process.env.VUE_APP_AUTH0_DOMAIN,
    clientId: process.env.VUE_APP_AUTH0_CLIENT_ID,
    authorizationParams: {
        redirect_uri: 'https://192.168.238.206:8080/',
    }
});
app.mount('#app');
