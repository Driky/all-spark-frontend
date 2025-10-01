<script setup lang="ts">
import type { RegisterFormInput } from '#shared/schemas/auth'

const { register } = useAuth()
const loading = ref(false)
const error = ref<string | null>(null)
const fieldErrors = ref<Record<string, string>>({})
const showEmailVerification = ref(false)
const registeredEmail = ref<string>('')

const handleRegister = async (form: RegisterFormInput) => {
  loading.value = true
  error.value = null
  fieldErrors.value = {}

  const result = await register(form)

  if (result.success) {
    // Show email verification message
    registeredEmail.value = result.data.email
    showEmailVerification.value = true
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
      v-if="error && !showEmailVerification"
      color="error"
      icon="i-heroicons-exclamation-triangle"
      class="mb-4 max-w-md mx-auto"
      :title="error"
    />
    <RegisterForm
      :loading="loading"
      :show-email-verification="showEmailVerification"
      :registered-email="registeredEmail"
      @register="handleRegister"
    />
  </div>
</template>