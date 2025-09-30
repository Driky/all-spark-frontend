import { defineVitestProject } from '@nuxt/test-utils/config'
import { defineConfig } from 'vitest/config'
import ui from '@nuxt/ui/vite'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [
    ui()
  ],
  test: {
    projects: [
      {
        resolve: {
          alias: {
            '~~': fileURLToPath(new URL('.', import.meta.url)),
            '~': fileURLToPath(new URL('./app', import.meta.url)),
            '@': fileURLToPath(new URL('./app', import.meta.url)),
            '#shared': fileURLToPath(new URL('./shared', import.meta.url)),
          }
        },
        test: {
          name: 'unit',
          include: ['tests/unit/**/*.test.ts'],
          environment: 'node',
          setupFiles: ['./tests/unit/setup.ts'],
          server: {
            deps: {
              inline: ['@nuxt/ui']
            }
          }
        },
      },
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['tests/nuxt/**/*.{test,spec}.ts'],
          environment: 'nuxt',
          environmentOptions: {
            nuxt: {
              domEnvironment: 'happy-dom',
            },
          },
          setupFiles: ['./tests/nuxt/setup.ts']
        },
      }),
    ],
  },
})