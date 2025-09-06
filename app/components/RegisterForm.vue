<script setup>
import { ref } from "vue";
import { z } from "zod";

const form = ref({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const schema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.email("Invalid email"),
    password: z.string().min(14, "Must be at least 14 characters"),
    confirmPassword: z.string().min(14, "Must be at least 14 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const emit = defineEmits(["register"]);

const handleSubmit = async () => {
  emit("register", form.value);
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4">
    <div
      class="max-w-md w-full mx-auto p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-700/30"
    >
      <h2 class="text-2xl font-bold text-center mb-6 dark:text-white">
        Create Account
      </h2>

      <div class="space-y-6">
        <UForm
          :state="form"
          :schema="schema"
          class="space-y-4"
          @submit="handleSubmit"
        >
          <UFormField label="Name" class="mb-4 block" name="name">
            <UInput v-model="form.name" placeholder="John Doe" class="w-full" />
          </UFormField>

          <UFormField label="Email" class="mb-4 block" name="email">
            <UInput
              v-model="form.email"
              class="w-full"
              placeholder="johndoe@gmail.com"
            />
          </UFormField>

          <UFormField label="Password" class="mb-4 block" name="password">
            <UInput
              v-model="form.password"
              type="password"
              class="w-full"
              placeholder="********"
            />
          </UFormField>

          <UFormField
            label="Confirm Password"
            class="mb-4 block"
            name="confirmPassword"
          >
            <UInput
              v-model="form.confirmPassword"
              type="password"
              class="w-full"
              placeholder="********"
            />
          </UFormField>

          <div class="mt-6">
            <UButton type="submit" color="primary" block class="w-full py-2">
              Sign Up
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
              Sign up with GitHub
            </UButton>

            <UButton block class="w-full flex items-center justify-center">
              <template #leading>
                <UIcon name="i-heroicons-key" class="mr-2" />
              </template>
              Sign up with Passkey
            </UButton>
          </div>
        </div>
        <div class="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
          Already have an account?
          <NuxtLink to="/login" class="text-primary-600 hover:underline">
            Log in
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>