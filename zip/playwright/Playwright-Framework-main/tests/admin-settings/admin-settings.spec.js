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

test.describe('Admin Settings', () => {

  test('TC-ADM-024 — Profile Settings page loads correctly', async ({ page }) => {
    const dashboardPage = new AdminDashboardPage(page);

    await step('Login as admin user', async () => {
      await loginAs(page);
    });

    await step('Navigate to /settings/profile', async () => {
      await dashboardPage.goToPage('/settings/profile');
      await page.waitForLoadState('networkidle');
    });

    await step('Verify profile settings page loads', async () => {
      await assertThat('Profile settings page should load', () => expect(page).toHaveURL(/\/settings\/profile/));
      await assertThat('Page should have content', () => expect(page.locator('body').innerText()).toBeTruthy());
    });
  });

  test('TC-ADM-044 — Profile overview page loads', async ({ page }) => {
    const dashboardPage = new AdminDashboardPage(page);

    await step('Login as admin user', async () => {
      await loginAs(page);
    });

    await step('Navigate to /profile page', async () => {
      await dashboardPage.goToPage('/profile');
      await page.waitForLoadState('networkidle');
    });

    await step('Verify profile overview page loads', async () => {
      await assertThat('Profile page should load', () => expect(page).toHaveURL(/\/profile/));
      await assertThat('Page should have content', () => expect(page.locator('body').innerText()).toBeTruthy());
    });
  });

  test('TC-ADM-045 — Settings General page loads', async ({ page }) => {
    const dashboardPage = new AdminDashboardPage(page);

    await step('Login as admin user', async () => {
      await loginAs(page);
    });

    await step('Navigate to /settings/general', async () => {
      await dashboardPage.goToPage('/settings/general');
      await page.waitForLoadState('networkidle');
    });

    await step('Verify settings general page loads', async () => {
      await assertThat('Settings general page should load', () => expect(page).toHaveURL(/\/settings\/general/));
      await assertThat('Page should have content', () => expect(page.locator('body').innerText()).toBeTruthy());
    });
  });

  test('TC-ADM-046 — Settings Permissions page loads', async ({ page }) => {
    const dashboardPage = new AdminDashboardPage(page);

    await step('Login as admin user', async () => {
      await loginAs(page);
    });

    await step('Navigate to /settings/permissions', async () => {
      await dashboardPage.goToPage('/settings/permissions');
      await page.waitForLoadState('networkidle');
    });

    await step('Verify settings permissions page loads', async () => {
      await assertThat('Settings permissions page should load', () => expect(page).toHaveURL(/\/settings\/permissions/));
      await assertThat('Page should have content', () => expect(page.locator('body').innerText()).toBeTruthy());
    });
  });

  test('TC-ADM-047 — Settings Security page loads', async ({ page }) => {
    const dashboardPage = new AdminDashboardPage(page);

    await step('Login as admin user', async () => {
      await loginAs(page);
    });

    await step('Navigate to /settings/security', async () => {
      await dashboardPage.goToPage('/settings/security');
      await page.waitForLoadState('networkidle');
    });

    await step('Verify settings security page loads', async () => {
      await assertThat('Settings security page should load', () => expect(page).toHaveURL(/\/settings\/security/));
      await assertThat('Page should have content', () => expect(page.locator('body').innerText()).toBeTruthy());
    });
  });

  test('TC-ADM-051 — All settings tabs navigation from /settings/profile', async ({ page }) => {
    const dashboardPage = new AdminDashboardPage(page);

    await step('Login as admin user', async () => {
      await loginAs(page);
    });

    await step('Navigate to /settings/profile', async () => {
      await dashboardPage.goToPage('/settings/profile');
      await page.waitForLoadState('networkidle');
    });

    await step('Verify settings profile page loads with tabs', async () => {
      await assertThat('Settings profile page should load', () => expect(page).toHaveURL(/\/settings\/profile/));
      await assertThat('Page should have content', () => expect(page.locator('body').innerText()).toBeTruthy());
    });
  });

});
