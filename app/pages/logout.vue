<script setup lang="ts">
const { logout, forceLocalLogout } = useAuth()

const loading = ref(true)
const error = ref<string | null>(null)

const performLogout = async () => {
  loading.value = true
  error.value = null

  const result = await logout()

  if (result.success) {
    await navigateTo('/login')
  } else {
    loading.value = false
    error.value = result.errors?.general || 'Logout failed'
  }
}

const handleRetry = async () => {
  await performLogout()
}

const handleForceLogout = async () => {
  loading.value = true
  error.value = null

  const result = await forceLocalLogout()

  if (result.success) {
    await navigateTo('/login')
  } else {
    // Force logout should always succeed, but handle edge case
    await navigateTo('/login')
  }
}

// Start logout process on mount
onMounted(() => {
  performLogout()
})

definePageMeta({
  auth: false
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full mx-auto p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-700/30">

      <!-- Loading State -->
      <FadeSlideTransition>
        <div v-if="loading" key="loading" class="text-center py-8">
          <div class="mb-6">
            <UIcon
              name="i-heroicons-arrow-path"
              class="w-16 h-16 text-primary-500 mx-auto mb-4 animate-spin"
              data-testid="logout-spinner"
            />
            <h2 class="text-2xl font-bold mb-2 dark:text-white">
              Signing out...
            </h2>
            <p class="text-gray-600 dark:text-gray-400">
              Please wait while we sign you out securely.
            </p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" key="error" class="text-center py-8" data-testid="logout-error">
          <div class="mb-6">
            <UIcon
              name="i-heroicons-exclamation-triangle"
              class="w-16 h-16 text-red-500 mx-auto mb-4"
            />
            <h2 class="text-2xl font-bold mb-2 dark:text-white">
              Sign Out Failed
            </h2>
            <p class="text-red-600 dark:text-red-400 mb-6">
              {{ error }}
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-3">
            <UButton
              color="primary"
              block
              data-testid="retry-button"
              @click="handleRetry"
            >
              Try Again
            </UButton>

            <UButton
              color="neutral"
              variant="outline"
              block
              data-testid="force-logout-button"
              @click="handleForceLogout"
            >
              Force Local Sign Out
            </UButton>
          </div>

          <div class="mt-6 text-sm text-gray-500 dark:text-gray-400">
            <p>
              If you continue to have issues, you can force a local sign out which will clear your session data locally.
            </p>
          </div>
        </div>
      </FadeSlideTransition>
    </div>
  </div>
</template>