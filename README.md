# vue-auth0-plugin

Simple auth0 wrapper for Vue.js based on the [Auth0 Single Page App SDK](Auth0 Single Page App SDK).

## Installation

```
npm install --save vue-auth0-plugin
```

## Usage

Register the plugin in your main.ts

```
app.use(Auth0VuePlugin, {
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
