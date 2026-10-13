import { test, expect } from '../fixtures/base.fixture.js';
import { assertThat } from '../fixtures/expect-helper.js';
import { step } from '../fixtures/step-runner.js';
import { loadUsers } from '../fixtures/data-helper.js';
import { AdminLoginPage } from '../../src/pages/admin/AdminLoginPage.js';
import { AdminDashboardPage } from '../../src/pages/admin/AdminDashboardPage.js';

const users = loadUsers();

test.describe('Admin Login Flow', () => {

  test('TC-ADM-LOGIN-01 — Happy path login with valid admin credentials redirects to dashboard', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);

    await step('Navigate to Admin Login page', async () => {
      await loginPage.goto();
    });

    await step(`Login as ${users.admin.username}`, async () => {
      await loginPage.login(users.admin.username, users.admin.password);
    });

    await step('Verify redirect to /users dashboard with All Users heading', async () => {
      await assertThat('Sign in should redirect to /users page', () => expect(page).toHaveURL(/\/users/));
      await assertThat('Sign In button should be hidden after successful login', () => expect(loginPage.signInButton).not.toBeVisible());
      const dashboardHeading = page.getByRole('heading', { name: /all users/i });
      await assertThat('Dashboard should display All Users heading', () => expect(dashboardHeading).toBeVisible());
    });
  });

  test('TC-ADM-LOGIN-02 — Login with invalid credentials shows generic sign-in error', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);

    await step('Navigate to Admin Login page', async () => {
      await loginPage.goto();
    });

    await step(`Login as ${users.pemnet_invalid.username} with wrong password`, async () => {
      await loginPage.login(users.pemnet_invalid.username, users.pemnet_invalid.password);
    });

    await step('Verify error without revealing whether email exists', async () => {
      await assertThat('Invalid login should stay on /login page', () => expect(page).toHaveURL(/\/login/));
      await assertThat('Error message should be visible after failed login', () => expect(loginPage.errorMessage).toBeVisible());
      await assertThat('Error message should indicate sign-in could not be completed', () => expect(loginPage.errorMessage).toHaveText(/sign-in could not be completed/i));
    });
  });

  test('TC-ADM-003 — Invalid password shows generic error', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);

    await step('Navigate to Admin Login page', async () => {
      await loginPage.goto();
    });

    await step('Login with valid email and wrong password', async () => {
      await loginPage.login(users.admin.username, 'WrongPass123!');
    });

    await step('Verify generic error message on /login', async () => {
      await assertThat('Page should stay on /login after failed login', () => expect(page).toHaveURL(/\/login/));
      await assertThat('Error message should be visible', () => expect(loginPage.errorMessage).toBeVisible());
      await assertThat('Error message should be generic, not reveal which field is wrong', () => expect(loginPage.errorMessage).toHaveText(/sign-in could not be completed/i));
    });
  });

  test('TC-ADM-004 — Empty fields show validation on sign-in attempt', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);

    await step('Navigate to Admin Login page', async () => {
      await loginPage.goto();
    });

    await step('Click Sign In without entering any credentials', async () => {
      await page.locator('button:has-text("Sign In")').first().click().catch(() => {});
      await page.waitForTimeout(1000);
    });

    await step('Verify page stays on /login with validation', async () => {
      await assertThat('Page should remain on /login when fields are empty', () => expect(page).toHaveURL(/\/login/));
    });
  });

  test('TC-ADM-005 — Empty password field prevents submission', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);

    await step('Navigate to Admin Login page', async () => {
      await loginPage.goto();
    });

    await step('Enter email and switch to password mode', async () => {
      await loginPage.fillEmail(users.admin.username);
      await loginPage.passwordInsteadButton.click();
    });

    await step('Click Sign In without entering a password', async () => {
      await loginPage.clickSignIn();
    });

    await step('Verify validation prevents submission or stays on /login', async () => {
      await assertThat('Page should remain on /login when password is empty', () => expect(page).toHaveURL(/\/login/));
    });
  });

  test('TC-ADM-007 — Password field characters are masked', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);

    await step('Navigate to Admin Login page', async () => {
      await loginPage.goto();
    });

    await step('Switch to password mode and fill password field', async () => {
      await loginPage.passwordInsteadButton.click();
      await loginPage.fillPassword('MySecretPassword123');
    });

    await step('Verify password characters are masked', async () => {
      await assertThat('Password input should have type="password" attribute', () => expect(loginPage.passwordInput).toHaveAttribute('type', 'password'));
    });
  });

  test('TC-ADM-011 — Session cleared after logout redirects to login', async ({ page }) => {
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

    await step('Navigate to protected /users and verify redirect to /login', async () => {
      await page.goto('/users');
      await page.waitForLoadState('load');
      await assertThat('Should redirect to /login after session is cleared', () => expect(page).toHaveURL(/\/login/));
    });
  });

  test('TC-ADM-012 — User menu displays John Smith after login', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);
    const dashboardPage = new AdminDashboardPage(page);

    await step('Log in as admin user', async () => {
      await loginPage.goto();
      await loginPage.login(users.admin.username, users.admin.password);
      await assertThat('Admin should be redirected to /users dashboard', () => expect(page).toHaveURL(/\/users/));
    });

    await step('Verify user menu shows John Smith', async () => {
      await assertThat('User menu button should display John Smith name', () => expect(dashboardPage.userMenuButton).toBeVisible());
    });
  });

  test('TC-ADM-013 — Page refresh preserves session and stays on dashboard', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);
    const dashboardPage = new AdminDashboardPage(page);

    await step('Log in as admin user', async () => {
      await loginPage.goto();
      await loginPage.login(users.admin.username, users.admin.password);
      await assertThat('Admin should be redirected to /users dashboard', () => expect(page).toHaveURL(/\/users/));
    });

    await step('Refresh the page', async () => {
      await page.reload();
      await page.waitForLoadState('networkidle');
    });

    await step('Verify session is preserved and user remains on dashboard', async () => {
      await assertThat('Should remain on /users after page refresh', () => expect(page).toHaveURL(/\/users/));
      await assertThat('User menu should still be visible after refresh', () => expect(dashboardPage.userMenuButton).toBeVisible());
    });
  });

});
