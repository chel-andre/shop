import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  globalSetup: require.resolve('./src/helpers/db/globalSetup'),
  globalTeardown: require.resolve('./src/helpers/db/globalTeardown'),
  testMatch: 'tests/**/*.spec.ts',
  use: {
    headless: false,
    viewport: { width: 1920, height: 1080 },
    ignoreHTTPSErrors: true,
    baseURL: 'http://localhost:3000/',
    screenshot: 'only-on-failure',
    actionTimeout: 60000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  timeout: 120000,
});
