<script setup lang="ts">
import type { LoginRequest } from '#shared/schemas/auth'

const { login } = useAuth()
const loading = ref(false)
const error = ref<string | null>(null)
const fieldErrors = ref<Record<string, string>>({})

const handleLogin = async (form: LoginRequest) => {
  loading.value = true
  error.value = null
  fieldErrors.value = {}

  const result = await login(form)

  if (result.success) {
    // Redirect to protected page
    await navigateTo('/protected')
  } else {
    // Handle validation and API errors
    fieldErrors.value = result.errors
    // Show general error if it exists
    if (result.errors.general) {
      error.value = result.errors.general
    }
  }

  loading.value = false
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
    <LoginForm :loading="loading" @login="handleLogin" />
  </div>
</template>