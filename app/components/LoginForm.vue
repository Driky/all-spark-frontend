<script setup>
import { ref } from "vue";
import { z } from "zod";

defineProps({
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["login"]);

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

const form = ref({
  email: "",
  password: "",
});

const handleSubmit = async () => {
  emit("login", form.value);
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4">
    <div
      class="max-w-md w-full mx-auto p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-700/30"
    >
      <h2 class="text-2xl font-bold text-center mb-6 dark:text-white">
        Sign In
      </h2>

      <div class="space-y-6">
        <UForm
          :state="form"
          :schema="schema"
          class="space-y-4"
          @submit="handleSubmit"
        >
          <UFormField label="Email" class="mb-4 block" name="email">
            <UInput
              v-model="form.email"
              placeholder="johndoe@gmail.com"
              class="w-full"
              :disabled="loading"
            />
          </UFormField>

          <UFormField label="Password" class="mb-4 block" name="password">
            <UInput
              v-model="form.password"
              type="password"
              placeholder="********"
              class="w-full"
              :disabled="loading"
            />
          </UFormField>

          <div class="mt-6">
            <UButton
              type="submit"
              color="primary"
              block
              class="w-full py-2"
              :loading="loading"
              :disabled="loading"
            >
              Sign In
            </UButton>
          </div>
        </UForm>

        <!-- Alt Logins -->
        <div class="alt-logins hidden">
          <div class="relative flex items-center py-4">
            <div
              class="flex-grow border-t border-gray-200 dark:border-gray-600"
            />
            <span
              class="flex-shrink mx-4 text-gray-400 dark:text-gray-500 text-sm"
              >or continue with</span
            >
            <div
              class="flex-grow border-t border-gray-200 dark:border-gray-600"
            />
          </div>

          <div class="space-y-3">
            <UButton block class="w-full flex items-center justify-center">
              <template #leading>
                <UIcon name="i-simple-icons-github" class="mr-2" />
              </template>
              Sign in with GitHub
            </UButton>

            <UButton block class="w-full flex items-center justify-center">
              <template #leading>
                <UIcon name="i-heroicons-key" class="mr-2" />
              </template>
              Sign in with Passkey
            </UButton>
          </div>
        </div>

        <div class="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?
          <NuxtLink
            to="/register"
            class="text-primary-600 hover:underline font-medium"
          >
            Register here
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>