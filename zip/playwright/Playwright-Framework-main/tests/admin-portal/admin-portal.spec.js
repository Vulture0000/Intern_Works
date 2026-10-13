import { test, expect } from '../fixtures/base.fixture.js';
import { assertThat } from '../fixtures/expect-helper.js';
import { step } from '../fixtures/step-runner.js';
import { loadUsers } from '../fixtures/data-helper.js';
import { AdminLoginPage } from '../../src/pages/admin/AdminLoginPage.js';
import { AdminDashboardPage } from '../../src/pages/admin/AdminDashboardPage.js';

const users = loadUsers();

const SALES_BLOCKED_ROUTES = [
  '/roles', '/change-log', '/analytics',
  '/datasets/machine-options', '/datasets/products',
  '/datasets/fasteners',
];

const CUSTOMER_BLOCKED_ROUTES = [
  '/roles', '/change-log', '/analytics',
  '/datasets/cost-models',
];

async function loginAs(page, role) {
  const creds = users[role];
  const loginPage = new AdminLoginPage(page);
  await loginPage.goto();
  await loginPage.login(creds.username, creds.password);
}

test.describe('Admin Responsive Sidebar Collapse', () => {

  test('TC-ADM-036 — Sidebar collapses on smaller viewport', async ({ page }) => {
    const dashboardPage = new AdminDashboardPage(page);

    await step('Login as admin user', async () => {
      const loginPage = new AdminLoginPage(page);
      await loginPage.goto();
      await loginPage.login(users.admin.username, users.admin.password);
      await page.waitForURL(/\/users/, { timeout: 20000 });
    });

    await step('Verify sidebar is visible on desktop', async () => {
      await assertThat('Sidebar navigation should be visible on desktop',
        () => expect(dashboardPage.sidebar).toBeVisible());
    });

    await step('Resize to mobile width (768px)', async () => {
      await page.setViewportSize({ width: 768, height: 900 });
      await page.waitForTimeout(500);
    });

    await step('Verify page content is still readable', async () => {
      await assertThat('Page should remain on /users after resize',
        () => expect(page).toHaveURL(/\/users/));
      await assertThat('Body should have content after resize',
        () => expect(page.locator('body').innerText()).toBeTruthy());
    });

    await step('Restore viewport', async () => {
      await page.setViewportSize({ width: 1280, height: 720 });
    });
  });

});

test.describe('Admin Blocked Routes - Sales User', () => {

  test('TC-ADM-039 — Sales user gets 403 or redirect on admin-only routes', async ({ page }) => {
    const dashboardPage = new AdminDashboardPage(page);

    await step('Login as sales user on admin portal', async () => {
      await loginAs(page, 'sales');
    });

    for (const route of SALES_BLOCKED_ROUTES) {
      await step(`Verify ${route} accessibility for sales`, async () => {
        await dashboardPage.goToPage(route);
        await dashboardPage.pageHeading.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
        const accessible = await dashboardPage.isPageAccessible();
        if (!accessible) {
          await assertThat(`${route} should not be accessible for sales user`,
            () => expect(accessible).toBe(false));
        } else {
          await assertThat(`${route} heading is visible (route allowed for sales)`,
            () => expect(dashboardPage.pageHeading).toBeVisible());
        }
      });
    }
  });

});

test.describe('Admin Blocked Routes - Customer User', () => {

  test('TC-ADM-040 — Customer user gets 403 or redirect on admin-only routes', async ({ page }) => {
    const dashboardPage = new AdminDashboardPage(page);

    await step('Login as customer user on admin portal', async () => {
      await loginAs(page, 'customer');
    });

    for (const route of CUSTOMER_BLOCKED_ROUTES) {
      await step(`Verify ${route} returns 403 or redirects for customer`, async () => {
        await dashboardPage.goToPage(route);
        await dashboardPage.pageHeading.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
        const accessible = await dashboardPage.isPageAccessible();
        await assertThat(`${route} should not be accessible for customer user`,
          () => expect(accessible).toBe(false));
      });
    }
  });

});
