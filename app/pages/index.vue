<script setup lang="ts">
const { loggedIn } = useUserSession();

const features = [
  {
    icon: 'i-heroicons-shield-check',
    title: 'Secure Authentication',
    description: 'Built-in authentication with session management and protected routes'
  },
  {
    icon: 'i-heroicons-bolt',
    title: 'Lightning Fast',
    description: 'Powered by Nuxt 4 and Vue 3 for optimal performance'
  },
  {
    icon: 'i-heroicons-paint-brush',
    title: 'Modern UI',
    description: 'Beautiful components with Nuxt UI and Tailwind CSS'
  },
  {
    icon: 'i-heroicons-code-bracket',
    title: 'Developer Friendly',
    description: 'Type-safe with TypeScript and validated with Zod'
  }
];
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <AppHeader />
    
    <!-- Hero Section -->
    <section class="relative overflow-hidden">
      <div class="container mx-auto px-4 py-24">
        <div class="text-center max-w-4xl mx-auto">
          <h1 class="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to <span class="text-primary-500">All Spark</span>
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300 mb-8">
            A modern authentication-enabled application built with Nuxt 4
          </p>
          
          <div class="flex gap-4 justify-center">
            <template v-if="!loggedIn">
              <UButton
                to="/register"
                size="xl"
                color="primary"
              >
                Get Started
                <template #trailing>
                  <UIcon name="i-heroicons-arrow-right" />
                </template>
              </UButton>
              <UButton
                to="/login"
                size="xl"
                variant="outline"
              >
                Sign In
              </UButton>
            </template>
            <template v-else>
              <UButton
                to="/protected"
                size="xl"
                color="primary"
              >
                Go to Dashboard
                <template #trailing>
                  <UIcon name="i-heroicons-arrow-right" />
                </template>
              </UButton>
            </template>
          </div>
        </div>
      </div>
      
      <!-- Background decoration -->
      <div class="absolute inset-0 -z-10 overflow-hidden">
        <div class="absolute -top-1/2 -right-1/2 w-96 h-96 bg-primary-200 dark:bg-primary-900 rounded-full blur-3xl opacity-20"></div>
        <div class="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-primary-300 dark:bg-primary-800 rounded-full blur-3xl opacity-20"></div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-white dark:bg-gray-800">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Built with Modern Technologies
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <UCard
            v-for="feature in features"
            :key="feature.title"
            class="hover:shadow-lg transition-shadow"
          >
            <div class="text-center">
              <div class="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-primary-100 dark:bg-primary-900">
                <UIcon :name="feature.icon" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 class="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                {{ feature.title }}
              </h3>
              <p class="text-gray-600 dark:text-gray-300 text-sm">
                {{ feature.description }}
              </p>
            </div>
          </UCard>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gray-50 dark:bg-gray-900">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Ready to get started?
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Join us today and experience the power of modern web development
        </p>
        <template v-if="!loggedIn">
          <UButton
            to="/register"
            size="xl"
            color="primary"
          >
            Create Free Account
          </UButton>
        </template>
        <template v-else>
          <p class="text-lg text-gray-600 dark:text-gray-300">
            You're already signed in! Explore your dashboard.
          </p>
        </template>
      </div>
    </section>
  </div>
</template>