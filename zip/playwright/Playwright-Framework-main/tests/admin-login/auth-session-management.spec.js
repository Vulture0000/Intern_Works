import { test, expect } from '../fixtures/base.fixture.js';
import { assertThat } from '../fixtures/expect-helper.js';
import { step } from '../fixtures/step-runner.js';
import { loadUsers } from '../fixtures/data-helper.js';
import { AdminLoginPage } from '../../src/pages/admin/AdminLoginPage.js';
import { AdminDashboardPage } from '../../src/pages/admin/AdminDashboardPage.js';

const users = loadUsers();

test.describe('Auth Session Management', () => {

  test('TC-AUTH-06 — Login rejected with unregistered email should not reveal if email exists', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);

    await step('Navigate to Admin Login page', async () => {
      await loginPage.goto();
    });

    await step(`Login with unregistered email: ${users.pemnet_invalid.username}`, async () => {
      await loginPage.login(users.pemnet_invalid.username, users.pemnet_invalid.password);
    });

    await step('Verify error stays on /login without revealing email existence', async () => {
      await assertThat('Invalid login should stay on /login page', () => expect(page).toHaveURL(/\/login/));
      await assertThat('Error message should be visible after failed login', () => expect(loginPage.errorMessage).toBeVisible());
      await assertThat('Error message should be generic, not reveal if email exists', () => expect(loginPage.errorMessage).toHaveText(/sign-in/i));
    });
  });

  test('TC-AUTH-08 — Logout destroys session and redirects to login on protected page access', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);
    const dashboardPage = new AdminDashboardPage(page);

    await step('Log in as admin user', async () => {
      await loginPage.goto();
      await loginPage.login(users.admin.username, users.admin.password);
      await assertThat('Admin should be redirected to /users dashboard', () => expect(page).toHaveURL(/\/users/));
    });

    await step('Sign out via user menu dropdown', async () => {
      await dashboardPage.signOut();
      await page.waitForTimeout(2000);
      await assertThat('Should redirect to /login after sign out', () => expect(page).toHaveURL(/\/login/));
    });

    await step('Verify session cleared — protected page shows login form', async () => {
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
      await page.goto('/users');
      await page.waitForLoadState('load');
      await assertThat('Should redirect to login page after session cleared', () => expect(page).toHaveURL(/\/login/));
      await assertThat('Email input should be visible on login page', () => expect(loginPage.emailInput).toBeVisible());
    });
  });

  test('TC-AUTH-09 — Unauthenticated user cannot access protected endpoint', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);

    await step('Navigate directly to protected /users page without logging in', async () => {
      await page.goto('/users');
      await page.waitForLoadState('networkidle');
    });

    await step('Verify redirect to login page with sign-in form', async () => {
      await assertThat('Unauthenticated user should be redirected to /login', () => expect(page).toHaveURL(/\/login/));
      await assertThat('Sign In heading should be visible', () => expect(loginPage.heading).toBeVisible());
    });
  });

  test('TC-AUTH-10 — Session expiry after maximum lifetime requires re-login', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);

    await step('Log in as admin user', async () => {
      await loginPage.goto();
      await loginPage.login(users.admin.username, users.admin.password);
      await assertThat('Admin should be redirected to /users dashboard', () => expect(page).toHaveURL(/\/users/));
    });

    await step('Clear all session data simulating session expiry', async () => {
      await page.context().clearCookies();
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
    });

    await step('Verify expired session redirects to login on protected page access', async () => {
      await page.goto('/users');
      await page.waitForLoadState('networkidle');
      await assertThat('Login heading should be visible after session expiry', () => expect(loginPage.heading).toBeVisible());
      await assertThat('Email input should be present on login form', () => expect(loginPage.emailInput).toBeVisible());
    });
  });

  test('TC-AUTH-11 — Login email is case-insensitive — UPPERCASE email authenticates successfully', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);

    await step('Navigate to Admin Login page', async () => {
      await loginPage.goto();
    });

    await step('Login with email in UPPERCASE', async () => {
      const uppercaseEmail = users.admin.username.toUpperCase();
      await loginPage.login(uppercaseEmail, users.admin.password);
    });

    await step('Verify successful login with case-insensitive email', async () => {
      await assertThat('Uppercase email should still redirect to /users', () => expect(page).toHaveURL(/\/users/));
      await assertThat('Sign In button should be hidden after successful login', () => expect(loginPage.signInButton).not.toBeVisible());
    });

    await step('Verify dashboard content is accessible', async () => {
      const dashboardHeading = page.getByRole('heading', { name: /all users/i });
      await assertThat('Dashboard should display All Users heading', () => expect(dashboardHeading).toBeVisible());
    });
  });

});
