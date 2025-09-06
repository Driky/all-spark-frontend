<script setup lang="ts">
const handleRegister = async (form: {
  name: string;
  email: string;
  password: string;
}) => {
  console.log(form);
};
</script>

<template>
  <RegisterForm @register="handleRegister" />
</template>