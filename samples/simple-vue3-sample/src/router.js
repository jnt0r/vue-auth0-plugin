import {createRouter, createWebHashHistory} from "vue-router";
import Home from "@/views/Home";
import { AuthenticationGuard } from "vue-auth0-plugin";

export let router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: Home,
        },
        {
            path: '/secure',
            component: () => import(/* webpackChunkName: "secure" */ './views/Secure.vue'),
            beforeEnter: [AuthenticationGuard],
        }
    ]
});
