<script setup lang="ts">
const { loggedIn, user } = useUserSession();

const navigateToProfile = () => {
  navigateTo('/protected');
};
</script>

<template>
  <header class="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo/Brand -->
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center space-x-2">
            <UIcon name="i-heroicons-sparkles" class="w-8 h-8 text-primary-500" />
            <span class="text-xl font-bold text-gray-900 dark:text-white">All Spark</span>
          </NuxtLink>
        </div>

        <!-- Navigation -->
        <nav class="flex items-center space-x-4">
          <!-- When not logged in -->
          <template v-if="!loggedIn">
            <UButton
              to="/login"
              variant="ghost"
              color="gray"
              size="md"
            >
              Sign In
            </UButton>
            <UButton
              to="/register"
              color="primary"
              size="md"
            >
              Get Started
            </UButton>
          </template>

          <!-- When logged in -->
          <template v-else>
            <UDropdown :items="[[
              {
                label: 'Profile',
                icon: 'i-heroicons-user-circle',
                click: navigateToProfile
              }
            ], [
              {
                label: 'Sign out',
                icon: 'i-heroicons-arrow-right-on-rectangle',
                click: () => {
                  const { clear } = useUserSession();
                  clear();
                  navigateTo('/login');
                }
              }
            ]]">
              <UAvatar
                :alt="user?.name || 'User'"
                :text="user?.name?.charAt(0) || 'U'"
                size="md"
                class="cursor-pointer hover:ring-2 hover:ring-primary-500 transition-all"
              />
            </UDropdown>
          </template>
        </nav>
      </div>
    </div>
  </header>
</template>