<script setup lang="ts">
import type { RegisterFormInput } from '#shared/schemas/auth'

const { register } = useAuth()
const loading = ref(false)
const error = ref<string | null>(null)
const showEmailVerification = ref(false)
const registeredEmail = ref<string>('')

const handleRegister = async (form: RegisterFormInput) => {
  loading.value = true
  error.value = null

  try {
    const response = await register(form)

    // Show email verification message
    if (response.success) {
      registeredEmail.value = response.email
      showEmailVerification.value = true
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <UAlert
      v-if="error && !showEmailVerification"
      color="error"
      icon="i-heroicons-exclamation-triangle"
      class="mb-4 max-w-md mx-auto"
      :title="error"
    />
    <RegisterForm
      @register="handleRegister"
      :loading="loading"
      :show-email-verification="showEmailVerification"
      :registered-email="registeredEmail"
    />
  </div>
</template>