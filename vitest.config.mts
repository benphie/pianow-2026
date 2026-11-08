import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('.', import.meta.url)).replace(/\/$/, '') },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    // Blank Supabase settings force the in-memory store, so tests can never reach a real database
    env: {
      JWT_SECRET: 'test-only-secret-that-is-at-least-32-characters',
      NEXT_PUBLIC_SUPABASE_URL: '',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: '',
      SUPABASE_SERVICE_ROLE_KEY: '',
      NEXT_PUBLIC_API_URL: '',
    },
  },
})
