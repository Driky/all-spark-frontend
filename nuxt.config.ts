import tailwindcss from "@tailwindcss/vite";
import checker from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths'


// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
        tsconfigPaths()
      ],
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@nuxt/content',
    'nuxt-auth-utils'
  ]
})