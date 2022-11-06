<template>
  <div class="about">
    <h1>You are logged in as {{ auth.user.name }} ({{ auth.user.nickname }})</h1>
    <img :src="auth.user.picture" alt="Profile picture"/>
    <br />

    <button v-on:click="auth.logout({logoutParams: {returnTo: 'https://192.168.238.206:8080'}})">Logout</button>
  </div>
</template>

<script>
export default {
  name: 'About',
  inject: ['auth'],
}
</script>
