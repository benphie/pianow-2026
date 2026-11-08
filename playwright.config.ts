import { defineConfig, devices } from '@playwright/test'

const PORT = 3100

// Runs against the production build, so run `npm run build` first
export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'node server.js',
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: false,
    timeout: 60_000,
    env: {
      PORT: String(PORT),
      HOSTNAME: '127.0.0.1',
      JWT_SECRET: 'e2e-only-secret-that-is-at-least-32-characters',
      // Without this key the server can't write to a real database
      SUPABASE_SERVICE_ROLE_KEY: '',
    },
  },
})
