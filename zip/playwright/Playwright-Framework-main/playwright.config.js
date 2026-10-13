import { defineConfig, devices } from '@playwright/test';
import { cpus } from 'os';
import 'dotenv/config';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: process.env.CI ? 1 : Math.min(8, cpus().length),

  reporter: [
    ['html', { outputFolder: 'reports/playwright-report', open: 'never' }],
    ['json', { outputFile: 'reports/last-run.json' }],
    ['allure-playwright', { outputFolder: 'allure-results' }],
    ['list'],
  ],

  use: {
    baseURL: process.env.BASE_URL || 'https://admin.configurator.dev.pemnet.ai',
    headless: true,
    screenshot: 'only-on-failure',
    video:      'on',
    trace:      'on-first-retry',
    actionTimeout:     10_000,
    navigationTimeout: 15_000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
