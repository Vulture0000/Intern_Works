import { test, expect } from './fixtures/base.fixture.js';
import { loadUsers } from './fixtures/data-helper.js';
import { TestWebInstallationSystemPage } from '../src/pages/testweb/TestWebInstallationSystemPage.js';

const users = loadUsers();
const TESTWEB_BASE = 'https://testweb.configurator.dev.pemnet.ai';

test('debug matching count', async ({ page }) => {
  const creds = users.engineering;
  await page.goto(`${TESTWEB_BASE}/login`, { waitUntil: 'networkidle' });
  await page.getByLabel(/email/i).fill(creds.username);
  await page.getByRole('button', { name: /password instead/i }).click();
  await page.waitForTimeout(1000);
  await page.getByLabel(/password/i).fill(creds.password);
  await page.locator('form button[type="submit"]').click();
  await page.waitForURL(/testweb/, { timeout: 20000 });

  const installPage = new TestWebInstallationSystemPage(page);
  await installPage.goto();
  await page.waitForTimeout(3000);

  // Debug various approaches
  const gbt = page.getByText(/matching product/);
  console.log('getByText count:', await gbt.count());

  const ht = page.locator('div').filter({ hasText: /matching product/ });
  console.log('hasText div count:', await ht.count());

  if (await ht.count() > 0) {
    const txt = await ht.first().textContent();
    console.log('hasText textContent:', JSON.stringify(txt));
    console.log('regex match:', txt.match(/(\d+)\s*matching/));
  }

  const gbt2 = page.getByText('matching product(s)');
  console.log('getByText exact count:', await gbt2.count());

  // Try body
  const bodyText = await page.locator('body').innerText();
  const match = bodyText.match(/(\d+)\s*matching/);
  console.log('body match:', match);

  console.log('---END---');
  expect(true).toBe(true);
});
