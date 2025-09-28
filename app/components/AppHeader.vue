<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const { loggedIn, user } = useUserSession();

const navigateToProfile = () => {
  navigateTo('/protected');
};

const dropdownItems: DropdownMenuItem[][] = [
  [
    {
      label: 'Profile',
      icon: 'i-heroicons-user-circle',
      onSelect: navigateToProfile
    }
  ],
  [
    {
      label: 'Sign out',
      icon: 'i-heroicons-arrow-right-on-rectangle',
      onSelect: () => {
        navigateTo('/logout');
      }
    }
  ]
];
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
              color="neutral"
              size="md"
            >
              Sign In
            </UButton>
            <UButton
              to="/register"
              color="primary"
              size="md"
            >
              Register
            </UButton>
          </template>

          <!-- When logged in -->
          <template v-else>
            <UDropdownMenu :items="dropdownItems" :content="{ align: 'end' }">
              <UAvatar
                :alt="user?.email || 'User'"
                :text="user?.email?.charAt(0)?.toUpperCase() || 'U'"
                size="md"
                class="cursor-pointer hover:ring-2 hover:ring-primary-500 transition-all"
              />
            </UDropdownMenu>
          </template>
        </nav>
      </div>
    </div>
  </header>
</template>