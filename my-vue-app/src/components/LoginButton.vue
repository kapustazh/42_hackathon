<template>
  <a class="login-button" href="http://188.245.198.116:3001/api/auth/42">Login with 42</a>
</template>

<script>
export default {
  name: 'LoginButton'
}
</script>

<style scoped>
.login-button {
  background: #00babc;
  color: #fff;
  padding: 10px 20px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  display: inline-block;
  transition: background 0.3s ease;
}

.login-button:hover {
  background: #009a9c;
}
</style>
