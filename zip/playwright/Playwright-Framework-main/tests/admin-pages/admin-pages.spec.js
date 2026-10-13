import { test, expect } from '../fixtures/base.fixture.js';
import { assertThat } from '../fixtures/expect-helper.js';
import { step } from '../fixtures/step-runner.js';
import { loadUsers } from '../fixtures/data-helper.js';
import { AdminLoginPage } from '../../src/pages/admin/AdminLoginPage.js';
import { AdminDashboardPage } from '../../src/pages/admin/AdminDashboardPage.js';

const users = loadUsers();

async function loginAs(page) {
  const loginPage = new AdminLoginPage(page);
  await loginPage.goto();
  await loginPage.login(users.admin.username, users.admin.password);
  await page.waitForURL(/\/users/, { timeout: 20000 });
}

test.describe('Admin Pages', () => {

  test('TC-ADM-023 — SMTP Settings page loads correctly', async ({ page }) => {
    const dashboardPage = new AdminDashboardPage(page);

    await step('Login as admin user', async () => {
      await loginAs(page);
    });

    await step('Navigate to /smtp SMTP settings', async () => {
      await dashboardPage.goToPage('/smtp');
      await page.waitForLoadState('networkidle');
    });

    await step('Verify SMTP page loads', async () => {
      await assertThat('SMTP page heading should be visible', () => expect(dashboardPage.pageHeading).toBeVisible());
    });
  });

  test('TC-ADM-031 — User List Table displays with columns', async ({ page }) => {
    const dashboardPage = new AdminDashboardPage(page);

    await step('Login as admin user', async () => {
      await loginAs(page);
    });

    await step('Navigate to /users page', async () => {
      await dashboardPage.goToPage('/users');
      await page.waitForLoadState('networkidle');
    });

    await step('Verify user table is visible', async () => {
      const userTable = page.locator('table').first();
      await assertThat('User table should be visible on /users page', () => expect(userTable).toBeVisible());
    });
  });

  test('TC-ADM-032 — Roles page shows Add Role button', async ({ page }) => {
    const dashboardPage = new AdminDashboardPage(page);

    await step('Login as admin user', async () => {
      await loginAs(page);
    });

    await step('Navigate to /roles page', async () => {
      await dashboardPage.goToPage('/roles');
      await page.waitForLoadState('networkidle');
    });

    await step('Verify Add Role button is visible', async () => {
      const addRoleButton = page.getByRole('button', { name: /add role/i });
      await assertThat('Add Role button should be visible on /roles page', () => expect(addRoleButton).toBeVisible());
    });
  });

  test('TC-ADM-033 — Applications list page loads', async ({ page }) => {
    const dashboardPage = new AdminDashboardPage(page);

    await step('Login as admin user', async () => {
      await loginAs(page);
    });

    await step('Navigate to /applications page', async () => {
      await dashboardPage.goToPage('/applications');
      await page.waitForLoadState('networkidle');
    });

    await step('Verify applications page loads', async () => {
      await assertThat('Applications page heading should be visible', () => expect(dashboardPage.pageHeading).toBeVisible());
    });
  });

  test('TC-ADM-034 — Tasks list page loads', async ({ page }) => {
    const dashboardPage = new AdminDashboardPage(page);

    await step('Login as admin user', async () => {
      await loginAs(page);
    });

    await step('Navigate to /tasks page', async () => {
      await dashboardPage.goToPage('/tasks');
      await page.waitForLoadState('networkidle');
    });

    await step('Verify tasks list is visible', async () => {
      await assertThat('Tasks page heading should be visible', () => expect(dashboardPage.pageHeading).toBeVisible());
    });
  });

  test('TC-ADM-035 — Analytics dashboard loads with metrics', async ({ page }) => {
    const dashboardPage = new AdminDashboardPage(page);

    await step('Login as admin user', async () => {
      await loginAs(page);
    });

    await step('Navigate to /analytics page', async () => {
      await dashboardPage.goToPage('/analytics');
      await page.waitForLoadState('networkidle');
    });

    await step('Verify analytics page loads', async () => {
      await assertThat('Analytics page should be accessible', () => {
        return dashboardPage.isPageAccessible().then(accessible => expect(accessible).toBe(true));
      });
      await assertThat('Analytics page heading should be visible', () => expect(dashboardPage.pageHeading).toBeVisible());
    });
  });

  test('TC-ADM-041 — Approvals page loads', async ({ page }) => {
    const dashboardPage = new AdminDashboardPage(page);

    await step('Login as admin user', async () => {
      await loginAs(page);
    });

    await step('Navigate to /approvals page', async () => {
      await dashboardPage.goToPage('/approvals');
      await page.waitForLoadState('networkidle');
    });

    await step('Verify approvals page loads', async () => {
      await assertThat('Approvals page heading should be visible', () => expect(dashboardPage.pageHeading).toBeVisible());
    });
  });

  test('TC-ADM-048 — Tasks Raw Dataset page loads', async ({ page }) => {
    const dashboardPage = new AdminDashboardPage(page);

    await step('Login as admin user', async () => {
      await loginAs(page);
    });

    await step('Navigate to /datasets/tasks-raw', async () => {
      await dashboardPage.goToPage('/datasets/tasks-raw');
      await page.waitForLoadState('networkidle');
    });

    await step('Verify tasks raw dataset page loads', async () => {
      await assertThat('Tasks raw dataset page heading should be visible', () => expect(dashboardPage.pageHeading).toBeVisible());
    });
  });

  test('TC-ADM-052 — Register page shows 404', async ({ page }) => {
    const dashboardPage = new AdminDashboardPage(page);

    await step('Login as admin user', async () => {
      await loginAs(page);
    });

    await step('Navigate to /register', async () => {
      await dashboardPage.goToPage('/register');
      await page.waitForLoadState('networkidle');
    });

    await step('Verify 404 page is displayed', async () => {
      const accessible = await dashboardPage.isPageAccessible();
      await assertThat('Register page should not be found and show 404', () => expect(accessible).toBe(false));
    });
  });

});
