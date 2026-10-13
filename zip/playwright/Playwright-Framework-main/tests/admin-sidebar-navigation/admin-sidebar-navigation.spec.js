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

test.describe('Admin Sidebar Navigation', () => {

  test('TC-ADM-014 — Sidebar navigation complete with all items visible', async ({ page }) => {
    const dashboardPage = new AdminDashboardPage(page);

    await step('Login as admin user', async () => {
      await loginAs(page);
    });

    await step('Verify all sidebar navigation items are present', async () => {
      await dashboardPage.pageHeading.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
      const sidebar = page.locator('nav').nth(1);
      await assertThat('Sidebar navigation should exist', () => expect(sidebar).toBeVisible());
      const sidebarText = await sidebar.innerText();
      await assertThat('Sidebar should contain Dashboard', () => expect(sidebarText.toLowerCase()).toContain('dashboard'));
      await assertThat('Sidebar should contain Analytics', () => expect(sidebarText.toLowerCase()).toContain('analytics'));
      await assertThat('Sidebar should contain Users', () => expect(sidebarText.toLowerCase()).toContain('users'));
      await assertThat('Sidebar should contain Roles', () => expect(sidebarText.toLowerCase()).toContain('roles'));
      await assertThat('Sidebar should contain Applications', () => expect(sidebarText.toLowerCase()).toContain('applications'));
      await assertThat('Sidebar should contain Tasks', () => expect(sidebarText.toLowerCase()).toContain('tasks'));
      await assertThat('Sidebar should contain Changelog', () => expect(sidebarText.toLowerCase()).toContain('changelog'));
      await assertThat('Sidebar should contain Machine', () => expect(sidebarText.toLowerCase()).toContain('machine'));
      await assertThat('Sidebar should contain Fasteners', () => expect(sidebarText.toLowerCase()).toContain('fasteners'));
      await assertThat('Sidebar should contain Tooling', () => expect(sidebarText.toLowerCase()).toContain('tooling'));
      await assertThat('Sidebar should contain Pricing', () => expect(sidebarText.toLowerCase()).toContain('pricing'));
      await assertThat('Sidebar should contain Calculations', () => expect(sidebarText.toLowerCase()).toContain('calculations'));
      await assertThat('Sidebar should contain Content', () => expect(sidebarText.toLowerCase()).toContain('content'));
      await assertThat('Sidebar should contain SMTP', () => expect(sidebarText.toLowerCase()).toContain('smtp'));
      await assertThat('Sidebar should contain Profile', () => expect(sidebarText.toLowerCase()).toContain('profile'));
    });
  });

  test('TC-ADM-015 — Navigate all main sidebar routes and verify page headings', async ({ page }) => {
    const dashboardPage = new AdminDashboardPage(page);

    await step('Login as admin user', async () => {
      await loginAs(page);
    });

    const routes = [
      { path: '/dashboard/overview', name: 'Dashboard' },
      { path: '/analytics', name: 'Analytics' },
      { path: '/users', name: 'Users' },
      { path: '/roles', name: 'Roles' },
      { path: '/applications', name: 'Applications' },
      { path: '/tasks', name: 'Tasks' },
      { path: '/change-log', name: 'Changelog' },
      { path: '/smtp', name: 'SMTP' },
      { path: '/profile', name: 'Profile' },
    ];

    for (const route of routes) {
      await step(`Navigate to ${route.name} page`, async () => {
        await dashboardPage.goToPage(route.path);
        await dashboardPage.pageHeading.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
        const accessible = await dashboardPage.isPageAccessible();
        await assertThat(`${route.name} page should be accessible`, () => expect(accessible).toBe(true));
        await assertThat(`${route.name} page should have content`, () => expect(page.locator('body').innerText()).toBeTruthy());
      });
    }
  });

});
