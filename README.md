# Vue-Auth0-Plugin

<a href="https://www.npmjs.com/package/vue-auth0-plugin"><img src="https://badgen.net/npm/v/vue-auth0-plugin" alt="Version"></a>
<a href="https://www.npmjs.com/package/vue-auth0-plugin"><img src="https://badgen.net/npm/dt/vue-auth0-plugin" alt="Downloads"></a>
<a href="https://www.npmjs.com/package/vue-auth0-plugin"><img src="https://badgen.net/npm/license/vue-auth0-plugin" alt="License"></a>
<a href="https://vuejs.org/"><img src="https://badgen.net/badge/Vue/3.x/green" alt="Vue.js 3.x compatible"></a>

Simple Auth0 wrapper for Vue.js based on the [Auth0 Single Page App SDK](https://auth0.com/docs/libraries/auth0-single-page-app-sdk)

:warning: Currently, only compatible with Vue 3. Support for Vue 2 is planned.

## Prerequisites

You need a Auth0 tenant and a configured Auth0 application. For information about how to create these, take a look [here](https://auth0.com/docs/get-started)

## Installation

```bash
npm install --save vue-auth0-plugin
```

## Usage

Register the plugin in your main.ts

```js
import { createApp } from 'vue';
import VueAuth0Plugin from 'vue-auth0-plugin';
import App from './App.vue';

const app = createApp(App);
app.use(VueAuth0Plugin, {
  domain: 'YOUR_AUTH0_DOMAIN',
  client_id: 'YOUR_CLIENT_ID',
  // ... other optional options ...
});
app.mount('#app');
```

Then Auth0 is accessible and controllable by the `$auth` property. For example:

```js
const authenticated = $auth.authenticated;
const loading = $auth.loading;
const user = $auth.user;

if (!$auth.authenticated) {
    $auth.loginWithRedirect();
}
```

Or in a component

```html
<template>
  <div class="about">
    <h1>You are logged in as {{$auth.user.name}} ({{ $auth.user.nickname }})</h1>
    <img :src="$auth.user.picture" alt="Profile picture"/>

    <button v-on:click="$auth.logout()">Logout</button>
  </div>
</template>
```

If you want to use the state of authentication when you do not have access to the Vue instance, you can use the exported AuthenticationState.

```js
import { AuthenticationState } from 'vue-auth0-plugin';

if (!AuthenticationState.authenticated) {
    // do something here
}
```

## AuthenticationGuard

The plugin implements a Vue Router NavigationGuard to secure routes with Auth0. The example below shows how to use this AuthenticationGuard.

```js
import { AuthenticationGuard } from 'vue-auth0-plugin';

let routes = [
    ...
    {
        path: '/private',
        name: 'PrivateRoute',
        component: () => import(/* webpackChunkName: "private" */ '../views/Private.vue'),
        beforeEnter: AuthenticationGuard,
    },
];

const router = createRouter({
  history: createWebHistory(YOUR_BASE_URL),
  routes,
});
```

## Changelog
Changelog can be seen at [Github Releases](https://github.com/jnt0r/vue-auth0-plugin/releases).

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

If you have questions or want to provide a good idea for improvements, please open an issue.

## License
[MIT](https://choosealicense.com/licenses/mit/)
