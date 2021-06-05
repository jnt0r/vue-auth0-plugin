# vue-auth0-plugin

<a href="https://www.npmjs.com/package/vue-auth0-plugin"><img src="https://badgen.net/npm/v/vue-auth0-plugin" alt="Version"></a>
<a href="https://www.npmjs.com/package/vue-auth0-plugin"><img src="https://badgen.net/npm/dt/vue-auth0-plugin" alt="Downloads"></a>
<a href="https://www.npmjs.com/package/vue-auth0-plugin"><img src="https://badgen.net/npm/license/vue-auth0-plugin" alt="License"></a>
<a href="https://vuejs.org/"><img src="https://badgen.net/badge/Vue/3.x/green" alt="Vue.js 3.x compatible"></a>

Simple auth0 wrapper for Vue.js based on the [Auth0 Single Page App SDK](https://auth0.com/docs/libraries/auth0-single-page-app-sdk).

## Installation

```
npm install --save vue-auth0-plugin
```

## Usage

Register the plugin in your main.ts

```
app.use(VueAuth0Plugin, {
  domain: 'YOUR_AUTH0_DOMAIN',
  client_id: 'YOUR_CLIENT_ID'
});
```

Then you can use the plugin with `$auth`. For example:

```
const isAuthenticated = $auth.isAuthenticated;
const loading = $auth.loading;
const user = $auth.user;

if (!$auth.isAuthenticated) {
    $auth.loginWithRedirect();
}
```
