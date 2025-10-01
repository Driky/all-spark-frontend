<script setup lang="ts">
import { ref, onUnmounted, watch, onMounted } from "vue";
import { registerFormSchema } from '#shared/schemas/auth';

const props = defineProps<{
  loading?: boolean;
  showEmailVerification?: boolean;
  registeredEmail?: string;
}>();

const form = ref({
  email: "",
  password: "",
  confirmPassword: "",
});

// Use the shared form schema
const schema = registerFormSchema;

const emit = defineEmits<{
  register: [form: { email: string; password: string; confirmPassword: string }]
}>();

const handleSubmit = async () => {
  emit("register", form.value);
};

// Resend verification email logic
const { resendVerificationEmail } = useAuth();
const countdown = ref(60);
const canResend = ref(false);
const isResending = ref(false);
const isMounted = ref(false);
let countdownInterval: ReturnType<typeof setInterval> | null = null;

const startCountdown = () => {
  countdown.value = 60;
  canResend.value = false;

  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  countdownInterval = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      canResend.value = true;
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    }
  }, 1000);
};

const handleResendVerification = async () => {
  if (!canResend.value || !props.registeredEmail || isResending.value) {
    return;
  }

  isResending.value = true;
  const result = await resendVerificationEmail(props.registeredEmail);
  isResending.value = false;

  if (result.success) {
    startCountdown();
  }
};

// Set mounted state
onMounted(() => {
  isMounted.value = true;
  // Start countdown if verification is already showing
  if (props.showEmailVerification) {
    startCountdown();
  }
});

// Start countdown when email verification is shown (after mount)
watch(() => props.showEmailVerification, (newValue) => {
  if (newValue && isMounted.value) {
    startCountdown();
  }
});

// Cleanup interval on component unmount
onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4">
    <div
      class="max-w-md w-full mx-auto p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-700/30"
    >
      <!-- Email Verification Success Message -->
      <ClientOnly>
        <FadeSlideTransition>
          <div v-if="showEmailVerification" key="verification" class="text-center py-8">
            <div class="mb-6">
              <UIcon
                name="i-heroicons-envelope"
                class="w-16 h-16 text-primary-500 mx-auto mb-4"
              />
              <h2 class="text-2xl font-bold mb-2 dark:text-white">
                Check Your Email
              </h2>
              <p class="text-gray-600 dark:text-gray-400 mb-4">
                We've sent a verification email to:
              </p>
              <p class="font-medium text-gray-900 dark:text-white mb-6">
                {{ registeredEmail }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Please click the link in the email to verify your account.
              </p>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Didn't receive an email? Check your spam folder or
              <UButton
                variant="link"
                size="sm"
                class="ml-1"
                :disabled="!canResend || isResending"
                :loading="isResending"
                @click="handleResendVerification"
              >
                {{ canResend ? 'resend verification email' : `resend in ${countdown}s` }}
              </UButton>
            </p>
          </div>

          <!-- Registration Form -->
          <div v-else key="form">
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
              <UFormField label="Email" class="mb-4 block" name="email">
                <UInput
                  v-model="form.email"
                  class="w-full"
                  placeholder="johndoe@gmail.com"
                  :disabled="loading"
                />
              </UFormField>

              <UFormField label="Password" class="mb-4 block" name="password">
                <UInput
                  v-model="form.password"
                  type="password"
                  class="w-full"
                  placeholder="********"
                  :disabled="loading"
                />
                <template #hint>
                  <span class="text-xs text-gray-500">
                    Min 12 characters, including uppercase, digit, and symbol
                  </span>
                </template>
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
        </FadeSlideTransition>
      </ClientOnly>
    </div>
  </div>
</template>

