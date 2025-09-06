<script setup lang="ts">
const handleLogin = async (form: { email: string; password: string }) => {
    console.log(form);
};
</script>

<template>
  <LoginForm @login="handleLogin" />
</template>