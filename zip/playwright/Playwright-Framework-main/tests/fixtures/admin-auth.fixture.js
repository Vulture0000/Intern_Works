import { test as base, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const users = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../test-data/users.json'), 'utf-8')
);

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.goto('https://admin.configurator.dev.pemnet.ai/login', { waitUntil: 'load' });
    await page.getByRole('textbox', { name: /email address/i }).fill(users.admin.username);
    await page.getByRole('button', { name: /sign in with a password instead/i }).click();
    await page.waitForTimeout(500);
    await page.getByRole('textbox', { name: /password/i }).fill(users.admin.password);
    await Promise.all([
      page.waitForURL('**/users', { timeout: 30000 }),
      page.getByRole('button', { name: /^sign in$/i }).or(page.locator('button:has-text("Sign In")')).first().click(),
    ]);

    await use(page);
  },
});

export { expect };
