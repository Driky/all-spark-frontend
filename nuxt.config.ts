import tailwindcss from "@tailwindcss/vite";
import checker from 'vite-plugin-checker';


// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  components: [
    { path: '~/components/ui', pathPrefix: false },
  ],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    session: {
      password: process.env.NUXT_SESSION_PASSWORD || ''
    },
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:4000'
    }
  },
  css: ['~/assets/css/main.css'],
  typescript: {
    typeCheck: true
  },
  eslint: {
    checker: true // <---
  },
  vite: {
    plugins:
      [
        checker({
          typescript: true,
          vueTsc: true,
        }),
        tailwindcss(),
      ],
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils/module',
    '@nuxt/ui',
    // '@nuxt/content',
    'nuxt-auth-utils'
  ]
})