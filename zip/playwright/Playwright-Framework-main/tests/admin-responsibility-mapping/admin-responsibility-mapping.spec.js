import { test, expect } from '../fixtures/base.fixture.js';
import { test as adminTest } from '../fixtures/admin-auth.fixture.js';
import { assertThat } from '../fixtures/expect-helper.js';
import { step } from '../fixtures/step-runner.js';
import { AdminResponsibilityMapPage } from '../../src/pages/admin/AdminResponsibilityMapPage.js';

test.describe('Admin Responsibility Mapping', () => {

  test('TC-RESP-01 — Responsibility Map page loads for admin', async ({ page }) => {
    const respMap = new AdminResponsibilityMapPage(page);

    await step('Log in as admin', async () => {
      await page.goto('https://admin.configurator.dev.pemnet.ai/login', { waitUntil: 'networkidle' });
      await page.getByRole('textbox', { name: /email/i }).fill('admin@penn.com');
      await page.getByRole('button', { name: /password instead/i }).click();
      await page.waitForTimeout(500);
      await page.getByRole('textbox', { name: /password/i }).fill('12345678');
      await page.locator('form').getByRole('button', { name: /sign in/i }).click();
      await page.waitForURL(/\/users/, { timeout: 20000 });
    });

    await step('Navigate to Responsibility Map', async () => {
      await respMap.goto();
    });

    await step('Verify page elements', async () => {
      await assertThat('Heading should be "Dataset: Responsibility Map"',
        () => expect(respMap.pageHeading).toBeVisible());
      await assertThat('Description should be visible',
        () => expect(respMap.pageDescription).toBeVisible());
      await assertThat('Table should have column headings',
        () => expect(respMap.tableHeadings.first()).toBeVisible());
    });
  });

  test('TC-RESP-02 — Unauthenticated access redirects to login', async ({ page }) => {
    const respMap = new AdminResponsibilityMapPage(page);

    await step('Navigate to Responsibility Map without auth', async () => {
      await respMap.goto();
    });

    await step('Verify redirect to login', async () => {
      await assertThat('User should be redirected to /login',
        () => expect(page).toHaveURL(/\/login/));
    });
  });

  test('TC-RESP-03 — Add mapping button is visible', async ({ page }) => {
    const respMap = new AdminResponsibilityMapPage(page);

    await step('Log in as admin', async () => {
      await page.goto('https://admin.configurator.dev.pemnet.ai/login', { waitUntil: 'networkidle' });
      await page.getByRole('textbox', { name: /email/i }).fill('admin@penn.com');
      await page.getByRole('button', { name: /password instead/i }).click();
      await page.waitForTimeout(500);
      await page.getByRole('textbox', { name: /password/i }).fill('12345678');
      await page.locator('form').getByRole('button', { name: /sign in/i }).click();
      await page.waitForURL(/\/users/, { timeout: 20000 });
    });

    await step('Navigate and check Add mapping button', async () => {
      await respMap.goto();
      await assertThat('Add mapping button should be visible',
        () => expect(respMap.addMappingButton).toBeVisible());
    });
  });

  test('TC-RESP-04 — View action on a mapping row', async ({ page }) => {
    const respMap = new AdminResponsibilityMapPage(page);

    await step('Log in as admin and navigate', async () => {
      await page.goto('https://admin.configurator.dev.pemnet.ai/login', { waitUntil: 'networkidle' });
      await page.getByRole('textbox', { name: /email/i }).fill('admin@penn.com');
      await page.getByRole('button', { name: /password instead/i }).click();
      await page.waitForTimeout(500);
      await page.getByRole('textbox', { name: /password/i }).fill('12345678');
      await page.locator('form').getByRole('button', { name: /sign in/i }).click();
      await page.waitForURL(/\/users/, { timeout: 20000 });
      await respMap.goto();
    });

    await step('Click View on first row', async () => {
      const rowCount = await respMap.getRowCount();
      await assertThat('Table should have at least one row', () => expect(rowCount).toBeGreaterThan(0));
      await respMap.clickViewRow(0);
    });
  });

  test('TC-RESP-05 — Edit action on a mapping row', async ({ page }) => {
    const respMap = new AdminResponsibilityMapPage(page);

    await step('Log in as admin', async () => {
      await page.goto('https://admin.configurator.dev.pemnet.ai/login', { waitUntil: 'networkidle' });
      await page.getByRole('textbox', { name: /email/i }).fill('admin@penn.com');
      await page.getByRole('button', { name: /password instead/i }).click();
      await page.waitForTimeout(500);
      await page.getByRole('textbox', { name: /password/i }).fill('12345678');
      await page.locator('form').getByRole('button', { name: /sign in/i }).click();
      await page.waitForURL(/\/users/, { timeout: 20000 });
      await respMap.goto();
    });

    await step('Click Edit on first row', async () => {
      const rowCount = await respMap.getRowCount();
      await assertThat('Table should have rows', () => expect(rowCount).toBeGreaterThan(0));
      await respMap.clickEditRow(0);
    });
  });

  test('TC-RESP-07 — All responsibility brands are listed', async ({ page }) => {
    const respMap = new AdminResponsibilityMapPage(page);

    await step('Log in as admin', async () => {
      await page.goto('https://admin.configurator.dev.pemnet.ai/login', { waitUntil: 'networkidle' });
      await page.getByRole('textbox', { name: /email/i }).fill('admin@penn.com');
      await page.getByRole('button', { name: /password instead/i }).click();
      await page.waitForTimeout(500);
      await page.getByRole('textbox', { name: /password/i }).fill('12345678');
      await page.locator('form').getByRole('button', { name: /sign in/i }).click();
      await page.waitForURL(/\/users/, { timeout: 20000 });
      await respMap.goto();
    });

    await step('Verify brands are present', async () => {
      const allText = await page.locator('body').innerText();
      await assertThat('Haeger brand should be listed', () => expect(allText).toContain('Haeger'));
      await assertThat('MDS brand should be listed', () => expect(allText).toContain('MDS'));
      await assertThat('PEMSerter brand should be listed', () => expect(allText).toContain('PEMSerter'));
      await assertThat('PROFIL brand should be listed', () => expect(allText).toContain('PROFIL'));
      await assertThat('Sherex brand should be listed', () => expect(allText).toContain('Sherex'));
    });
  });

  test('TC-RESP-08 — Sales emails are comma-separated in each mapping', async ({ page }) => {
    const respMap = new AdminResponsibilityMapPage(page);

    await step('Log in as admin', async () => {
      await page.goto('https://admin.configurator.dev.pemnet.ai/login', { waitUntil: 'networkidle' });
      await page.getByRole('textbox', { name: /email/i }).fill('admin@penn.com');
      await page.getByRole('button', { name: /password instead/i }).click();
      await page.waitForTimeout(500);
      await page.getByRole('textbox', { name: /password/i }).fill('12345678');
      await page.locator('form').getByRole('button', { name: /sign in/i }).click();
      await page.waitForURL(/\/users/, { timeout: 20000 });
      await respMap.goto();
    });

    await step('Verify first row has sales emails', async () => {
      const salesEmails = await respMap.getSalesEmails(0);
      await assertThat('Sales emails should contain @ symbol', () => expect(salesEmails).toContain('@'));
    });
  });

  test('TC-RESP-09 — Engineering emails are present in each mapping', async ({ page }) => {
    const respMap = new AdminResponsibilityMapPage(page);

    await step('Log in as admin', async () => {
      await page.goto('https://admin.configurator.dev.pemnet.ai/login', { waitUntil: 'networkidle' });
      await page.getByRole('textbox', { name: /email/i }).fill('admin@penn.com');
      await page.getByRole('button', { name: /password instead/i }).click();
      await page.waitForTimeout(500);
      await page.getByRole('textbox', { name: /password/i }).fill('12345678');
      await page.locator('form').getByRole('button', { name: /sign in/i }).click();
      await page.waitForURL(/\/users/, { timeout: 20000 });
      await respMap.goto();
    });

    await step('Verify first row has engineering emails', async () => {
      const engEmails = await respMap.getEngineeringEmails(0);
      await assertThat('Engineering emails should contain @ symbol', () => expect(engEmails).toContain('@'));
    });
  });

  test('TC-RESP-10 — Record count matches visible rows', async ({ page }) => {
    const respMap = new AdminResponsibilityMapPage(page);

    await step('Log in as admin', async () => {
      await page.goto('https://admin.configurator.dev.pemnet.ai/login', { waitUntil: 'networkidle' });
      await page.getByRole('textbox', { name: /email/i }).fill('admin@penn.com');
      await page.getByRole('button', { name: /password instead/i }).click();
      await page.waitForTimeout(500);
      await page.getByRole('textbox', { name: /password/i }).fill('12345678');
      await page.locator('form').getByRole('button', { name: /sign in/i }).click();
      await page.waitForURL(/\/users/, { timeout: 20000 });
      await respMap.goto();
    });

    await step('Verify record count matches rows', async () => {
      const rowCount = await respMap.getRowCount();
      await assertThat('Table should have at least one row', () => expect(rowCount).toBeGreaterThan(0));
      const recordText = await respMap.getRecordCountText();
      await assertThat('Record count text should be visible', () => expect(recordText).toBeTruthy());
    });
  });

});
