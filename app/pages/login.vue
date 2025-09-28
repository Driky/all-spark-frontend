<script setup lang="ts">
import type { LoginRequest } from '#shared/schemas/auth'

const { login } = useAuth()
const loading = ref(false)
const error = ref<string | null>(null)

const handleLogin = async (form: LoginRequest) => {
  loading.value = true
  error.value = null

  try {
    await login(form)

    // Redirect to protected page
    await navigateTo('/protected')
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <UAlert
      v-if="error"
      color="error"
      icon="i-heroicons-exclamation-triangle"
      class="mb-4 max-w-md mx-auto"
      :title="error"
    />
    <LoginForm @login="handleLogin" :loading="loading" />
  </div>
</template>