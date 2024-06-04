<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    const token = localStorage.getItem('token');
    if (token) {
      // Optionally, you can perform an API request to validate the token
      this.$axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }
};
</script>