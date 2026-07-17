import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:1105',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // Dedicated port so the tests never reuse the regular dev server on 1101,
    // whose env (and therefore API base URL) is outside our control.
    command: 'npx astro dev --host 127.0.0.1 --port 1105',
    url: 'http://127.0.0.1:1105',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000, // first run does Vite dep optimization
    env: {
      // Pin the API base to the same-origin /api prefix so the mock routes
      // are deterministic regardless of local .env.development contents.
      VITE_API_BASE_URL_DEV: '/api',
    },
  },
});
