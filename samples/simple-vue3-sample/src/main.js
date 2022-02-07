import {createApp} from 'vue'
import App from './App.vue'
import {router} from "@/router";
import VueAuth0Plugin from 'vue-auth0-plugin';

let app = createApp(App);
app.use(router);
app.use(VueAuth0Plugin, {
    domain: process.env.VUE_APP_AUTH0_DOMAIN,
    client_id: process.env.VUE_APP_AUTH0_CLIENT_ID,
    redirect_uri: 'https://192.168.178.106:8080',
});
app.mount('#app');
