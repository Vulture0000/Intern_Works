import { test, expect } from '../fixtures/base.fixture.js';
import { assertThat } from '../fixtures/expect-helper.js';
import { step } from '../fixtures/step-runner.js';
import { loadUsers } from '../fixtures/data-helper.js';
import { TestWebHomePage } from '../../src/pages/testweb/TestWebHomePage.js';

const users = loadUsers();
const TESTWEB_BASE = 'https://testweb.configurator.dev.pemnet.ai';

test.describe('TestWeb Login Flow', () => {

  test('TC-TW-001 — Login Page UI Elements are all visible', async ({ page }) => {
    const homePage = new TestWebHomePage(page);

    await step('Navigate to TestWeb home page', async () => {
      await homePage.goto();
    });

    await step('Verify brand links are visible in navigation', async () => {
      await assertThat('PEMNet brand link should be visible', () => expect(homePage.brandLinkPemnet).toBeVisible());
      await assertThat('Profil-Global brand link should be visible', () => expect(homePage.brandLinkProfil).toBeVisible());
      await assertThat('Haeger brand link should be visible', () => expect(homePage.brandLinkHaeger).toBeVisible());
      await assertThat('Autoriv brand link should be visible', () => expect(homePage.brandLinkAutoriv).toBeVisible());
      await assertThat('Sherex brand link should be visible', () => expect(homePage.brandLinkSherex).toBeVisible());
    });

    await step('Verify Find Your Installation System button is visible', async () => {
      await assertThat('Find Your Installation System button should be visible', () => expect(homePage.installationSystemButton).toBeVisible());
    });

    await step('Verify Sign In button is visible', async () => {
      await assertThat('Sign In button should be visible', () => expect(homePage.signInButton).toBeVisible());
    });

    await step('Verify Register button is visible', async () => {
      await assertThat('Register button should be visible', () => expect(homePage.registerButton).toBeVisible());
    });

    await step('Click Sign In to navigate to login page', async () => {
      await homePage.clickSignIn();
      await page.waitForURL(/\/login/, { timeout: 10000 });
    });

    await step('Verify email input field is visible', async () => {
      await assertThat('Email input should be visible', () => expect(page.getByLabel(/email/i)).toBeVisible());
    });

    await step('Verify Send Code button is visible', async () => {
      await assertThat('Send Code button should be visible', () => expect(page.getByRole('button', { name: /send code/i })).toBeVisible());
    });

    await step('Verify password instead link is visible', async () => {
      await assertThat('Password instead button should be visible', () => expect(page.getByRole('button', { name: /password instead/i })).toBeVisible());
    });
  });

  test('TC-TW-002 — Happy Path Password Flow (Engineering)', async ({ page }) => {
    const creds = users.engineering;

    await step('Navigate to TestWeb login page', async () => {
      await page.goto(`${TESTWEB_BASE}/login`, { waitUntil: 'load' });
    });

    await step('Click Sign in with a password instead', async () => {
      await page.getByRole('button', { name: /password instead/i }).click();
      await page.waitForTimeout(500);
    });

    await step(`Enter email: ${creds.username}`, async () => {
      await page.getByLabel(/email/i).fill(creds.username);
    });

    await step('Enter valid password', async () => {
      await page.getByLabel(/password/i).fill(creds.password);
    });

    await step('Click Sign In', async () => {
      await Promise.all([
        page.waitForURL(new RegExp(`${TESTWEB_BASE.replace('.', '\\.')}/?$`), { timeout: 30000 }),
        page.locator('form button[type="submit"]').click(),
      ]);
    });

    await step('Verify user menu shows David Wilson with Engineering role', async () => {
      await assertThat('User menu should show David Wilson name', () => expect(page.getByText(/David Wilson/i)).toBeVisible());
      await assertThat('Engineering role should be displayed', () => expect(page.getByText(/engineering/i)).toBeVisible());
    });
  });

  test('TC-TW-003 — Happy Path Password Flow (Sales)', async ({ page }) => {
    const creds = users.sales;

    await step('Navigate to TestWeb login page', async () => {
      await page.goto(`${TESTWEB_BASE}/login`, { waitUntil: 'load' });
    });

    await step('Click Sign in with a password instead', async () => {
      await page.getByRole('button', { name: /password instead/i }).click();
      await page.waitForTimeout(500);
    });

    await step(`Enter email: ${creds.username}`, async () => {
      await page.getByLabel(/email/i).fill(creds.username);
    });

    await step('Enter valid password', async () => {
      await page.getByLabel(/password/i).fill(creds.password);
    });

    await step('Click Sign In', async () => {
      await Promise.all([
        page.waitForURL(new RegExp(`${TESTWEB_BASE.replace('.', '\\.')}/?$`), { timeout: 30000 }),
        page.locator('form button[type="submit"]').click(),
      ]);
    });

    await step('Verify user menu shows Michael Johnson with Sales role', async () => {
      await assertThat('User menu should show Michael Johnson name', () => expect(page.getByText(/Michael Johnson/i)).toBeVisible());
      await assertThat('Sales role should be displayed', () => expect(page.getByText(/sales/i)).toBeVisible());
    });
  });

  test('TC-TW-004 — Happy Path Password Flow (Customer)', async ({ page }) => {
    const creds = users.customer;

    await step('Navigate to TestWeb login page', async () => {
      await page.goto(`${TESTWEB_BASE}/login`, { waitUntil: 'load' });
    });

    await step('Click Sign in with a password instead', async () => {
      await page.getByRole('button', { name: /password instead/i }).click();
      await page.waitForTimeout(500);
    });

    await step(`Enter email: ${creds.username}`, async () => {
      await page.getByLabel(/email/i).fill(creds.username);
    });

    await step('Enter valid password', async () => {
      await page.getByLabel(/password/i).fill(creds.password);
    });

    await step('Click Sign In', async () => {
      await Promise.all([
        page.waitForURL(new RegExp(`${TESTWEB_BASE.replace('.', '\\.')}/?$`), { timeout: 30000 }),
        page.locator('form button[type="submit"]').click(),
      ]);
    });

    await step('Verify user menu shows Emily Brown with External/Customer role', async () => {
      await assertThat('User menu should show Emily Brown name', () => expect(page.getByText(/Emily Brown/i)).toBeVisible());
      await assertThat('External/Customer role should be displayed', () => expect(page.getByText(/external|customer/i)).toBeVisible());
    });
  });

  test('TC-TW-005 — Happy Path Password Flow (Distributor)', async ({ page }) => {
    const creds = users.distributor;

    await step('Navigate to TestWeb login page', async () => {
      await page.goto(`${TESTWEB_BASE}/login`, { waitUntil: 'load' });
    });

    await step('Click Sign in with a password instead', async () => {
      await page.getByRole('button', { name: /password instead/i }).click();
      await page.waitForTimeout(500);
    });

    await step(`Enter email: ${creds.username}`, async () => {
      await page.getByLabel(/email/i).fill(creds.username);
    });

    await step('Enter valid password', async () => {
      await page.getByLabel(/password/i).fill(creds.password);
    });

    await step('Click Sign In', async () => {
      await Promise.all([
        page.waitForURL(new RegExp(`${TESTWEB_BASE.replace('.', '\\.')}/?$`), { timeout: 30000 }),
        page.locator('form button[type="submit"]').click(),
      ]);
    });

    await step('Verify user menu shows Robert Davis with Distributor/Partner role', async () => {
      await assertThat('User menu should show Robert Davis name', () => expect(page.getByText(/Robert Davis/i)).toBeVisible());
      await assertThat('Distributor/Partner role should be displayed', () => expect(page.getByText(/distributor|partner/i)).toBeVisible());
    });
  });

  test('TC-TW-006 — Magic Link Flow UI shows Send Code button when email entered', async ({ page }) => {
    await step('Navigate to TestWeb login page', async () => {
      await page.goto(`${TESTWEB_BASE}/login`, { waitUntil: 'load' });
    });

    await step('Verify email input is visible', async () => {
      await assertThat('Email input should be visible', () => expect(page.getByLabel(/email/i)).toBeVisible());
    });

    await step('Verify Send code button is visible', async () => {
      await assertThat('Send code button should be visible', () => expect(page.getByRole('button', { name: /send code/i })).toBeVisible());
    });

    await step('Verify password field is NOT visible initially', async () => {
      await assertThat('Password field should not be visible in magic link mode', () => expect(page.getByLabel(/password/i)).not.toBeVisible());
    });
  });

  test('TC-TW-007 — Magic Link Send Code flow', async ({ page }) => {
    const creds = users.engineering;

    await step('Navigate to TestWeb login page', async () => {
      await page.goto(`${TESTWEB_BASE}/login`, { waitUntil: 'load' });
    });

    await step('Enter engineering@penn.com in email input', async () => {
      await page.getByLabel(/email/i).fill(creds.username);
    });

    await step('Click Send code button', async () => {
      await page.getByRole('button', { name: /send code/i }).click();
    });

    await step('Verify OTP digit inputs appear', async () => {
      await assertThat('First OTP digit input should appear', () => expect(page.getByRole('textbox', { name: /one-time code digit 1/i })).toBeVisible());
    });

    await step('Verify success message shown', async () => {
      await assertThat('Success message should be visible', () => expect(page.getByText(/we sent an 8-digit code/i)).toBeVisible());
    });
  });

  test('TC-TW-008 — Invalid Credentials shows error and stays on login page', async ({ page }) => {
    await step('Navigate to TestWeb login page', async () => {
      await page.goto(`${TESTWEB_BASE}/login`, { waitUntil: 'load' });
    });

    await step('Click Sign in with a password instead', async () => {
      await page.getByRole('button', { name: /password instead/i }).click();
      await page.waitForTimeout(500);
    });

    await step('Enter email: bad@server.com', async () => {
      await page.getByLabel(/email/i).fill('bad@server.com');
    });

    await step('Enter wrong password', async () => {
      await page.getByLabel(/password/i).fill('wrongpassword');
    });

    await step('Click Sign In', async () => {
      await page.locator('form button[type="submit"]').click();
    });

    await step('Verify generic error message displayed without revealing which field is wrong', async () => {
      await assertThat('Error message should be visible', () => expect(page.getByRole('alert')).toBeVisible());
      await assertThat('Page should remain on /login', () => expect(page).toHaveURL(/\/login/));
    });
  });

  test('TC-TW-009 — Empty Email Validation on login', async ({ page }) => {
    await step('Navigate to TestWeb login page', async () => {
      await page.goto(`${TESTWEB_BASE}/login`, { waitUntil: 'load' });
    });

    await step('Click Send code without entering email', async () => {
      await page.getByRole('button', { name: /send code/i }).click();
      await page.waitForTimeout(1000);
    });

    await step('Verify page remains on /login with no crash', async () => {
      await assertThat('Page should remain on /login', () => expect(page).toHaveURL(/\/login/));
      await assertThat('Email field should stay empty', () => expect(page.getByLabel(/email/i)).toHaveValue(''));
    });
  });

  test('TC-TW-010 — Empty Password Validation on login', async ({ page }) => {
    await step('Navigate to TestWeb login page', async () => {
      await page.goto(`${TESTWEB_BASE}/login`, { waitUntil: 'load' });
    });

    await step('Enter email', async () => {
      await page.getByLabel(/email/i).fill(users.engineering.username);
    });

    await step('Click Sign in with a password instead', async () => {
      await page.getByRole('button', { name: /password instead/i }).click();
      await page.waitForTimeout(500);
    });

    await step('Click Sign In without entering password', async () => {
      await page.locator('form button[type="submit"]').click();
      await page.waitForTimeout(1000);
    });

    await step('Verify page remains on /login with form not submitted', async () => {
      await assertThat('Page should remain on /login', () => expect(page).toHaveURL(/\/login/));
    });
  });

  test('TC-TW-011 — Case-Insensitive Email login succeeds with UPPERCASE email', async ({ page }) => {
    const creds = users.engineering;

    await step('Navigate to TestWeb login page', async () => {
      await page.goto(`${TESTWEB_BASE}/login`, { waitUntil: 'load' });
    });

    await step('Click Sign in with a password instead', async () => {
      await page.getByRole('button', { name: /password instead/i }).click();
      await page.waitForTimeout(500);
    });

    await step('Enter email: ENGINEERING@PENN.COM (uppercase)', async () => {
      await page.getByLabel(/email/i).fill(creds.username.toUpperCase());
    });

    await step('Enter valid password', async () => {
      await page.getByLabel(/password/i).fill(creds.password);
    });

    await step('Click Sign In', async () => {
      await Promise.all([
        page.waitForURL(new RegExp(`${TESTWEB_BASE.replace('.', '\\.')}/?$`), { timeout: 30000 }),
        page.locator('form button[type="submit"]').click(),
      ]);
    });

    await step('Verify login succeeds and user is redirected to home', async () => {
      await assertThat('Should be redirected to home page', () => expect(page).toHaveURL(new RegExp(`${TESTWEB_BASE.replace('.', '\\.')}/?$`)));
    });
  });

  test('TC-TW-012 — Password Field is Masked', async ({ page }) => {
    await step('Navigate to TestWeb login page', async () => {
      await page.goto(`${TESTWEB_BASE}/login`, { waitUntil: 'load' });
    });

    await step('Click Sign in with a password instead', async () => {
      await page.getByRole('button', { name: /password instead/i }).click();
      await page.waitForTimeout(500);
    });

    await step('Verify password field has type password', async () => {
      const passwordInput = page.getByLabel(/password/i);
      await assertThat('Password field should be visible', () => expect(passwordInput).toBeVisible());
      await assertThat('Password characters should be masked', () => expect(passwordInput).toHaveAttribute('type', 'password'));
    });
  });

  test('TC-TW-013 — Navigate to Register page from login', async ({ page }) => {
    const homePage = new TestWebHomePage(page);

    await step('Navigate to TestWeb home page', async () => {
      await homePage.goto();
    });

    await step('Click the Register link/button', async () => {
      await homePage.clickRegister();
    });

    await step('Verify navigated to /register', async () => {
      await assertThat('Should navigate to /register page', () => expect(page).toHaveURL(/\/register/));
    });
  });

  test('TC-TW-014 — Navigate to Forgot Password page', async ({ page }) => {
    await step('Navigate to forgot password page', async () => {
      await page.goto(`${TESTWEB_BASE}/forget-password`, { waitUntil: 'load' });
    });

    await step('Verify forgot password page loads with heading', async () => {
      await assertThat('Forgot password heading should be visible', () => expect(page.getByRole('heading', { name: /forgot password/i })).toBeVisible());
    });

    await step('Verify email input is visible', async () => {
      await assertThat('Email input should be visible', () => expect(page.getByLabel(/email/i)).toBeVisible());
    });

    await step('Verify Send OTP button is visible', async () => {
      await assertThat('Send OTP button should be visible', () => expect(page.getByRole('button', { name: /send otp/i })).toBeVisible());
    });
  });

  test('TC-TW-029 — Home Page UI Elements visible (Unauthenticated)', async ({ page }) => {
    const homePage = new TestWebHomePage(page);

    await step('Navigate to TestWeb home page (logged out)', async () => {
      await homePage.goto();
    });

    await step('Verify brand links are visible', async () => {
      await assertThat('PEMNet brand link should be visible', () => expect(homePage.brandLinkPemnet).toBeVisible());
      await assertThat('Profil-Global brand link should be visible', () => expect(homePage.brandLinkProfil).toBeVisible());
      await assertThat('Haeger brand link should be visible', () => expect(homePage.brandLinkHaeger).toBeVisible());
      await assertThat('Autoriv brand link should be visible', () => expect(homePage.brandLinkAutoriv).toBeVisible());
      await assertThat('Sherex brand link should be visible', () => expect(homePage.brandLinkSherex).toBeVisible());
    });

    await step('Verify Sign In and Register buttons are visible', async () => {
      await assertThat('Sign In button should be visible', () => expect(homePage.signInButton).toBeVisible());
      await assertThat('Register button should be visible', () => expect(homePage.registerButton).toBeVisible());
    });
  });

  test('TC-TW-030 — Home Page UI (Authenticated) shows user menu', async ({ page }) => {
    const homePage = new TestWebHomePage(page);
    const creds = users.engineering;

    await step('Login as engineering@penn.com', async () => {
      await page.goto(`${TESTWEB_BASE}/login`, { waitUntil: 'load' });
      await page.getByRole('button', { name: /password instead/i }).click();
      await page.waitForTimeout(500);
      await page.getByLabel(/email/i).fill(creds.username);
      await page.getByLabel(/password/i).fill(creds.password);
      await Promise.all([
        page.waitForURL(new RegExp(`${TESTWEB_BASE.replace('.', '\\.')}/?$`), { timeout: 30000 }),
        page.locator('form button[type="submit"]').click(),
      ]);
    });

    await step('Verify user menu is visible instead of Sign In/Register buttons', async () => {
      await assertThat('User menu should be visible after login', () => expect(homePage.userMenuButton).toBeVisible());
      await assertThat('Sign In button should not be visible after login', () => expect(homePage.signInButton).not.toBeVisible());
    });
  });

  test('TC-TW-031 — Navigate to Installation System from authenticated home page', async ({ page }) => {
    const homePage = new TestWebHomePage(page);
    const creds = users.engineering;

    await step('Login as engineering@penn.com', async () => {
      await page.goto(`${TESTWEB_BASE}/login`, { waitUntil: 'load' });
      await page.getByRole('button', { name: /password instead/i }).click();
      await page.waitForTimeout(500);
      await page.getByLabel(/email/i).fill(creds.username);
      await page.getByLabel(/password/i).fill(creds.password);
      await Promise.all([
        page.waitForURL(new RegExp(`${TESTWEB_BASE.replace('.', '\\.')}/?$`), { timeout: 30000 }),
        page.locator('form button[type="submit"]').click(),
      ]);
    });

    await step('Click Find Your Installation System button', async () => {
      await homePage.goToInstallationSystem();
    });

    await step('Verify navigation to /installation-system page', async () => {
      await assertThat('Should navigate to /installation-system', () => expect(page).toHaveURL(/\/installation-system/));
    });
  });

  test('TC-TW-033 — Logout Via User Menu redirects to login', async ({ page }) => {
    const homePage = new TestWebHomePage(page);
    const creds = users.engineering;

    await step('Login as engineering@penn.com', async () => {
      await page.goto(`${TESTWEB_BASE}/login`, { waitUntil: 'load' });
      await page.getByRole('button', { name: /password instead/i }).click();
      await page.waitForTimeout(500);
      await page.getByLabel(/email/i).fill(creds.username);
      await page.getByLabel(/password/i).fill(creds.password);
      await Promise.all([
        page.waitForURL(new RegExp(`${TESTWEB_BASE.replace('.', '\\.')}/?$`), { timeout: 30000 }),
        page.locator('form button[type="submit"]').click(),
      ]);
    });

    await step('Click user menu and click Sign Out', async () => {
      await homePage.signOut();
    });

    await step('Verify redirect to /login page after logout', async () => {
      await assertThat('Should be redirected to /login after logout', () => expect(page).toHaveURL(/\/login/));
      await assertThat('User should be logged out', () => expect(homePage.signInButton).toBeVisible());
    });
  });

  test('TC-TW-034 — Protected Route Without Auth redirects to login', async ({ page }) => {
    await step('Navigate to /installation-system without auth', async () => {
      await page.goto(`${TESTWEB_BASE}/installation-system`, { waitUntil: 'load' });
    });

    await step('Verify redirect to login page', async () => {
      await assertThat('Should redirect to login page', () => expect(page).toHaveURL(/\/login/));
      await assertThat('Email input should be visible on login page', () => expect(page.getByLabel(/email/i)).toBeVisible());
    });
  });

  test('TC-TW-035 — Expired Session redirects to login on protected page access', async ({ page }) => {
    const homePage = new TestWebHomePage(page);
    const creds = users.engineering;

    await step('Login as engineering@penn.com', async () => {
      await homePage.goto();
      await page.getByRole('button', { name: /password instead/i }).click();
      await page.waitForTimeout(500);
      await page.getByLabel(/email/i).fill(creds.username);
      await page.getByLabel(/password/i).fill(creds.password);
      await Promise.all([
        page.waitForURL(new RegExp(`${TESTWEB_BASE.replace('.', '\\.')}/?$`), { timeout: 30000 }),
        page.locator('form button[type="submit"]').click(),
      ]);
    });

    await step('Clear cookies and localStorage to simulate expired session', async () => {
      await page.context().clearCookies();
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
    });

    await step('Navigate to protected route', async () => {
      await page.goto(`${TESTWEB_BASE}/installation-system`, { waitUntil: 'load' });
    });

    await step('Verify redirect to login page', async () => {
      await assertThat('Should redirect to login after expired session', () => expect(page).toHaveURL(/\/login/));
    });
  });

  test('TC-TW-036 — Login Persists Across Tabs', async ({ page, context }) => {
    const homePage = new TestWebHomePage(page);
    const creds = users.engineering;

    await step('Login as engineering@penn.com in tab 1', async () => {
      await homePage.goto();
      await page.getByRole('button', { name: /password instead/i }).click();
      await page.waitForTimeout(500);
      await page.getByLabel(/email/i).fill(creds.username);
      await page.getByLabel(/password/i).fill(creds.password);
      await Promise.all([
        page.waitForURL(new RegExp(`${TESTWEB_BASE.replace('.', '\\.')}/?$`), { timeout: 30000 }),
        page.locator('form button[type="submit"]').click(),
      ]);
    });

    await step('Open new tab and navigate to /', async () => {
      const newPage = await context.newPage();
      await newPage.goto(`${TESTWEB_BASE}/`, { waitUntil: 'load' });
      const newHomePage = new TestWebHomePage(newPage);
      await assertThat('New tab should already be authenticated', () => expect(newHomePage.userMenuButton).toBeVisible());
      await newPage.close();
    });
  });

  test('TC-TW-037 — Page Refresh Preserves Session', async ({ page }) => {
    const homePage = new TestWebHomePage(page);
    const creds = users.engineering;

    await step('Login as engineering@penn.com', async () => {
      await homePage.goto();
      await page.getByRole('button', { name: /password instead/i }).click();
      await page.waitForTimeout(500);
      await page.getByLabel(/email/i).fill(creds.username);
      await page.getByLabel(/password/i).fill(creds.password);
      await Promise.all([
        page.waitForURL(new RegExp(`${TESTWEB_BASE.replace('.', '\\.')}/?$`), { timeout: 30000 }),
        page.locator('form button[type="submit"]').click(),
      ]);
    });

    await step('Refresh the page', async () => {
      await page.reload({ waitUntil: 'load' });
    });

    await step('Verify user menu still visible after refresh', async () => {
      await assertThat('User menu should persist after refresh', () => expect(homePage.userMenuButton).toBeVisible());
    });
  });

  test('TC-TW-043 — Password Instead Button Toggle shows password field', async ({ page }) => {
    const homePage = new TestWebHomePage(page);

    await step('Navigate to TestWeb home page', async () => {
      await homePage.goto();
    });

    await step('Enter email in the email input', async () => {
      await page.getByLabel(/email/i).fill(users.engineering.username);
    });

    await step('Click Sign in with a password instead link', async () => {
      await page.getByRole('button', { name: /password instead/i }).click();
      await page.waitForTimeout(500);
    });

    await step('Verify password field appears and email stays filled', async () => {
      await assertThat('Password field should become visible', () => expect(page.getByLabel(/password/i)).toBeVisible());
      await assertThat('Email should stay filled', () => expect(page.getByLabel(/email/i)).toHaveValue(users.engineering.username));
    });
  });

  test('TC-TW-044 — Email Input has autocomplete attribute', async ({ page }) => {
    const homePage = new TestWebHomePage(page);

    await step('Navigate to TestWeb home page', async () => {
      await homePage.goto();
    });

    await step('Inspect the email input element', async () => {
      const emailInput = page.getByLabel(/email/i);
      await assertThat('Email input should have autocomplete attribute set to email', () => expect(emailInput).toHaveAttribute('autocomplete', 'email'));
    });
  });

});
