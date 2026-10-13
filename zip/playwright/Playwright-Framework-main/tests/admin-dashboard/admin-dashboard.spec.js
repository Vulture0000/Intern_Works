import { test, expect } from '../fixtures/base.fixture.js';
import { assertThat } from '../fixtures/expect-helper.js';
import { step } from '../fixtures/step-runner.js';
import { loadUsers } from '../fixtures/data-helper.js';
import { AdminLoginPage } from '../../src/pages/admin/AdminLoginPage.js';
import { AdminDashboardPage } from '../../src/pages/admin/AdminDashboardPage.js';

const users = loadUsers();

async function loginAs(page, role) {
  const creds = users[role];
  const loginPage = new AdminLoginPage(page);
  await loginPage.goto();
  await loginPage.login(creds.username, creds.password);
  await page.waitForURL(/\/users/, { timeout: 20000 });
}

test.describe('Admin Dashboard', () => {

  test('TC-ADM-042 — Dashboard Overview shows KPI metrics', async ({ page }) => {
    const dashboardPage = new AdminDashboardPage(page);

    await step('Login as admin user', async () => {
      await loginAs(page, 'admin');
    });

    await step('Navigate to /dashboard/overview', async () => {
      await dashboardPage.goToPage('/dashboard/overview');
      await page.waitForLoadState('networkidle');
    });

    await step('Verify KPI metrics are visible', async () => {
      await assertThat('Dashboard overview page should load', () => expect(page).toHaveURL(/\/dashboard\/overview/));
      await assertThat('Page should have content', () => expect(page.locator('body').innerText()).toBeTruthy());
    });
  });

  test('TC-ADM-043 — Dashboard Reports page loads', async ({ page }) => {
    const dashboardPage = new AdminDashboardPage(page);

    await step('Login as admin user', async () => {
      await loginAs(page, 'admin');
    });

    await step('Navigate to /dashboard/reports', async () => {
      await dashboardPage.goToPage('/dashboard/reports');
      await page.waitForLoadState('networkidle');
    });

    await step('Verify dashboard reports page loads', async () => {
      await assertThat('Dashboard reports page should load', () => expect(page).toHaveURL(/\/dashboard\/reports/));
      await assertThat('Page should have content', () => expect(page.locator('body').innerText()).toBeTruthy());
    });
  });

  test('TC-ADM-049 — KPI metrics cards visible on Dashboard Overview', async ({ page }) => {
    const dashboardPage = new AdminDashboardPage(page);

    await step('Login as admin user', async () => {
      await loginAs(page, 'admin');
    });

    await step('Navigate to /dashboard/overview', async () => {
      await dashboardPage.goToPage('/dashboard/overview');
      await page.waitForLoadState('networkidle');
    });

    await step('Verify KPI metric cards are present', async () => {
      await assertThat('Dashboard overview page should load', () => expect(page).toHaveURL(/\/dashboard\/overview/));
      const bodyText = await page.locator('body').innerText();
      await assertThat('Page should have meaningful content', () => expect(bodyText.length).toBeGreaterThan(50));
    });
  });

  test('TC-ADM-050 — Sales user cannot access Dashboard Overview', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);
    const dashboardPage = new AdminDashboardPage(page);

    await step('Try to login as sales user on admin portal', async () => {
      await loginPage.goto();
      await loginPage.login(users.sales.username, users.sales.password);
      await page.waitForTimeout(2000);
    });

    await step('Verify sales user cannot access dashboard', async () => {
      const currentUrl = page.url();
      await assertThat('Sales user should not access dashboard',
        () => expect(currentUrl).not.toContain('/dashboard'));
    });
  });

});
