<script setup>
const { user, clear } = useUserSession();
definePageMeta({
  middleware: ["auth"],
});

function logout() {
  clear();
  navigateTo("/login");
}
const date = useState('date', () => new Date().toISOString());
</script>

<template>
  <UCard class="max-w-md mx-auto mt-8">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-4">
        <UAvatar
          src=""
          alt="User avatar"
          size="lg"
          :text="user.name?.charAt(0)"
        />
        <div>
          <h2 class="text-xl font-semibold dark:text-white">{{ user.name }}</h2>
          <p class="text-gray-500 dark:text-gray-400">{{ user.email }}</p>
        </div>
      </div>
      <UButton
        color="red"
        variant="soft"
        icon="i-heroicons-arrow-right-on-rectangle"
        @click="logout"
      >
        Logout
      </UButton>
    </div>

    <div class="border-t dark:border-gray-700 pt-4">
      <h3 class="text-lg font-medium mb-2 dark:text-gray-200">
        Account Details
      </h3>
      <div class="space-y-2">
        <div class="flex justify-between">
          <span class="text-gray-500 dark:text-gray-400">Member since</span>
          <span class="dark:text-gray-200">{{date}}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500 dark:text-gray-400">Account type</span>
          <UBadge color="primary" variant="soft">Standard</UBadge>
        </div>
      </div>
    </div>
  </UCard>
</template>