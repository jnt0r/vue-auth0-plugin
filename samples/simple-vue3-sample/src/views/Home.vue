<template>
  <div class="home">
    <button v-on:click="auth.loginWithPopup()" :disabled="auth.authenticated">Login with PopUp</button>
    <button v-on:click="auth.loginWithRedirect()" :disabled="auth.authenticated">Login with Redirect</button>
    <button v-on:click="auth.logout({logoutParams: {returnTo: 'https://192.168.238.206:8080'}})" :disabled="!auth.authenticated">Logout</button>

    <div class="status">
      <span>{{ auth.authenticated ? 'Authenticated' : 'Not authenticated'}}</span>
      <span>{{ auth.loading ? 'Loading' : 'Not loading'}}</span>
      <span>User: {{ auth.user?.name || 'NO_USER' }}</span>
      <span>Error: {{ auth.error || 'NO_ERROR' }}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Home',
  inject: ['auth'],
}
</script>

<style scoped>
.status > span {
  display: block;
}
</style>
