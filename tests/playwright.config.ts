import { defineConfig, devices } from '@playwright/test';
import path from 'path';

export default defineConfig({
  // Where Playwright will look for test files
  testMatch: 'tests/**/*.spec.ts',

  // Maximum time for each test
  timeout: 60000,

  // Run tests in parallel across files
  fullyParallel: true,

  // Retry failed tests once (useful for flaky tests)
  retries: 1,

  // Global setup/teardown scripts (e.g., DB setup/cleanup)
  globalSetup: require.resolve('./src/helpers/db/globalSetup'),
  globalTeardown: require.resolve('./src/helpers/db/globalTeardown'),

  // Shared test options
  use: {
    headless: true, // run tests with browser UI visible
    viewport: { width: 1920, height: 1080 },
    ignoreHTTPSErrors: true, // ignore SSL certificate errors
    baseURL: process.env.BASE_UI_URL, // base URL for relative page.goto calls
    actionTimeout: 60000, // maximum time for any action
    screenshot: 'only-on-failure', // capture screenshot only on failure
    video: 'retain-on-failure', // record video only on failure
    trace: 'on-first-retry', // capture trace for debugging flaky tests
  },

  // Browser projects (multi-browser testing)
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],

  // Reporters for test results
  reporter: [
    ['list'], // console output
    ['html', { outputFolder: 'playwright-report', open: 'never' }], // HTML report
    ['junit', { outputFile: path.join('results', 'junit.xml') }], // JUnit report for CI
  ],

  // Directory for storing test artifacts: screenshots, videos, logs
  outputDir: 'test-results',
});
