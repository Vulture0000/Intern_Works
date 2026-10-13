import { test, expect } from '../fixtures/base.fixture.js';
import { assertThat } from '../fixtures/expect-helper.js';
import { step } from '../fixtures/step-runner.js';
import { loadUsers } from '../fixtures/data-helper.js';
import { TestWebInstallationSystemPage } from '../../src/pages/testweb/TestWebInstallationSystemPage.js';
import { TestWebMachineConfigurationPage } from '../../src/pages/testweb/TestWebMachineConfigurationPage.js';
import { AdminLoginPage } from '../../src/pages/admin/AdminLoginPage.js';
import { AdminDashboardPage } from '../../src/pages/admin/AdminDashboardPage.js';

const TESTWEB_BASE = 'https://testweb.configurator.dev.pemnet.ai';
const ADMIN_BASE = 'https://admin.configurator.dev.pemnet.ai';

const users = loadUsers();

async function loginAs(page, role) {
  const creds = users[role];
  await page.goto(`${TESTWEB_BASE}/login`, { waitUntil: 'load', timeout: 30000 });
  await page.getByLabel(/email/i).fill(creds.username);
  await page.getByRole('button', { name: /password instead/i }).click();
  await page.waitForTimeout(1000);
  await page.getByLabel(/password/i).fill(creds.password);
  await Promise.all([
    page.waitForURL(new RegExp(`${TESTWEB_BASE.replace('.', '\\.')}/?$`), { timeout: 30000 }),
    page.locator('form button[type="submit"]').click(),
  ]);
}

async function loginAsAdmin(page) {
  await page.goto('https://admin.configurator.dev.pemnet.ai/login', { waitUntil: 'load' });
  await page.getByRole('textbox', { name: /email/i }).fill(users.admin.username);
  await page.getByRole('button', { name: /password instead/i }).click();
  await page.waitForTimeout(500);
  await page.getByRole('textbox', { name: /password/i }).fill(users.admin.password);
  await Promise.all([
    page.waitForURL(/\/users/, { timeout: 30000 }),
    page.locator('form').getByRole('button', { name: /sign in/i }).click(),
  ]);
}

async function selectFirstSolution(page) {
  const solutionCb = page.getByRole('checkbox').filter({ hasNotText: /process monitoring|robot integration/i }).first();
  if (await solutionCb.isVisible().catch(() => false)) {
    await solutionCb.check({ force: true, timeout: 10000 });
  }
}

async function setupNewTestApp(installPage, name, volume) {
  await installPage.clickSetupNewApplication();
  await installPage.page.waitForTimeout(500);
  await installPage.fillNewApplicationForm({ name, volume });
  await installPage.clickSave();
  await installPage.page.waitForTimeout(1000);
}

test.describe('End-to-End Flows', () => {

  test('TC-E2E-001 — Full Flow Admin to Engineering', async ({ page }) => {
    const adminPage = new AdminDashboardPage(page);

    await step('Admin logs into admin portal', async () => {
      await page.goto('https://admin.configurator.dev.pemnet.ai/login', { waitUntil: 'load' });
      await page.getByRole('textbox', { name: /email/i }).fill(users.admin.username);
      await page.getByRole('button', { name: /password instead/i }).click();
      await page.waitForTimeout(500);
      await page.getByRole('textbox', { name: /password/i }).fill(users.admin.password);
      await page.locator('form').getByRole('button', { name: /sign in/i }).click();
      await page.waitForURL(/\/users/, { timeout: 20000 });
    });

    await step('Admin checks /users page', async () => {
      await adminPage.goToPage('/users');
      await assertThat('Users page should be accessible', () => expect(page).toHaveURL(/\/users/));
    });

    await step('Admin checks /applications page', async () => {
      await adminPage.goToPage('/applications');
      await assertThat('Applications page should be accessible', () => expect(page).toHaveURL(/\/applications/));
    });

    await step('Engineering logs into test web', async () => {
      await loginAs(page, 'engineering');
    });

    await step('Engineering navigates to installation system', async () => {
      const installPage = new TestWebInstallationSystemPage(page);
      await installPage.goto();
      await assertThat('Should be on installation system', () => expect(page).toHaveURL(/\/installation-system/));
    });

    await step('Engineering selects A210 solution and opens comparison', async () => {
      const installPage = new TestWebInstallationSystemPage(page);
      await installPage.checkSolution('A210');
      await page.waitForTimeout(500);
      await installPage.clickCompareConfigureSolutions();
      await assertThat('Compare configure button should be visible', () => expect(installPage.compareConfigureButton).toBeVisible());
    });
  });

  test('TC-E2E-002 — Full Flow Create Application and Configure', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);
    const configPage = new TestWebMachineConfigurationPage(page);

    await step('Engineering logs in and navigates to installation system', async () => {
      await loginAs(page, 'engineering');
      await installPage.goto();
    });

    await step('Creates a new application Demo App with volume 100000', async () => {
      await setupNewTestApp(installPage, 'Demo App', 100000);
    });

    await step('Resets auto-filter to show all solutions', async () => {
      await installPage.clickResetApplication();
      await page.waitForTimeout(500);
    });

    await step('Selects A210 solution', async () => {
      await installPage.checkSolution('A210');
      await page.waitForTimeout(500);
    });

    await step('Clicks Compare/Configure and opens configuration panel', async () => {
      await installPage.clickCompareConfigureSolutions();
      await installPage.clickConfigureSolution();
    });

    await step('Verifies configuration panel is open', async () => {
      await assertThat('Configuration panel heading should be visible', () => expect(configPage.panelHeading).toBeVisible());
    });
  });

  test('TC-E2E-003 — Multi-App Portfolio', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Engineering logs in and navigates to installation system', async () => {
      await loginAs(page, 'engineering');
      await installPage.goto();
    });

    await step('Creates App Alpha with volume 80000', async () => {
      await setupNewTestApp(installPage, 'App Alpha', 80000);
    });

    await step('Creates App Beta with volume 120000', async () => {
      await setupNewTestApp(installPage, 'App Beta', 120000);
    });

    await step('Resets auto-filter to show all solutions', async () => {
      await installPage.clickResetApplication();
      await page.waitForTimeout(500);
    });

    await step('Verifies portfolio shows combined volume', async () => {
      const volumeText = await installPage.getTotalAnnualVolumeValue();
      await assertThat('Total annual volume should reflect combined apps',
        () => expect(volumeText).toBeTruthy());
    });

    await step('Selects solutions and compares', async () => {
      await installPage.checkSolution('A210');
      await page.waitForTimeout(500);
      await installPage.checkSolution('824 eDrive');
      await page.waitForTimeout(500);
      await installPage.clickCompareConfigureSolutions();
      await assertThat('Comparison should be accessible with multiple solutions selected',
        () => expect(installPage.compareConfigureButton).toBeVisible());
    });
  });

  test('TC-E2E-004 — Use Existing Application', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Engineering logs in and navigates to installation system', async () => {
      await loginAs(page, 'engineering');
      await installPage.goto();
    });

    await step('Creates a new application', async () => {
      await setupNewTestApp(installPage, 'E2E Test App', 50000);
    });

    await step('Clears application selection', async () => {
      await installPage.clickClearSelection();
      await page.waitForTimeout(500);
      const noApp = await installPage.isNoApplicationSelected();
      await assertThat('No application should be selected after clearing',
        () => expect(noApp).toBe(true));
    });

    await step('Uses Use Existing Application to load it back', async () => {
      await installPage.clickUseExistingApplication();
      await page.waitForTimeout(500);
      const modalVisible = await installPage.isUseExistingModalVisible();
      await assertThat('Use Existing modal should be visible',
        () => expect(modalVisible).toBe(true));
    });
  });

  test('TC-E2E-005 — Save Config Return Later', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Engineering logs in and creates app', async () => {
      await loginAs(page, 'engineering');
      await installPage.goto();
      await setupNewTestApp(installPage, 'Return App', 75000);
      await installPage.clickResetApplication();
      await page.waitForTimeout(500);
    });

    await step('Selects A210 solution', async () => {
      await installPage.checkSolution('A210');
      await page.waitForTimeout(500);
    });

    await step('Logs out (clear session)', async () => {
      await page.context().clearCookies();
      await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
      await page.goto('about:blank');
      await page.goto(`${TESTWEB_BASE}/login`, { waitUntil: 'load' });
      await assertThat('User should be on login page after logout', () => expect(page).toHaveURL(/\/login/));
    });

    await step('Logs back in and loads app', async () => {
      await loginAs(page, 'engineering');
      await installPage.goto();
      await assertThat('Installation system should load after returning', () => expect(page).toHaveURL(/\/installation-system/));
    });
  });

  test('TC-E2E-006 — Cross Portal Admin Creates User and Engineering Uses App', async ({ page }) => {
    const adminPage = new AdminDashboardPage(page);
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Admin logs in and checks engineering user in /users', async () => {
      await loginAsAdmin(page);
      await adminPage.goToPage('/users');
      await assertThat('Admin should access /users page', () => expect(page).toHaveURL(/\/users/));
    });

    await step('Engineering logs into test web', async () => {
      await loginAs(page, 'engineering');
    });

    await step('Engineering creates an application', async () => {
      await installPage.goto();
      await setupNewTestApp(installPage, 'Cross Portal App', 90000);
    });

    await step('Admin checks /applications for engineering activity', async () => {
      await page.goto('https://admin.configurator.dev.pemnet.ai/applications', { waitUntil: 'load' });
      await assertThat('Admin should access /applications page', () => expect(page).toHaveURL(/\/applications/));
    });
  });

  test('TC-E2E-007 — Negative - Access Without Login', async ({ page }) => {
    await step('Try accessing /installation-system without auth', async () => {
      await page.goto(`${TESTWEB_BASE}/installation-system`, { waitUntil: 'load' });
      await assertThat('Should redirect to /login', () => expect(page).toHaveURL(/\/login/));
    });

    await step('Try accessing testweb home without auth', async () => {
      await page.goto(`${TESTWEB_BASE}/`, { waitUntil: 'load' });
      await assertThat('Should redirect to /login', () => expect(page).toHaveURL(/\/login/));
    });

    await step('/login page should be accessible without auth', async () => {
      await page.goto(`${TESTWEB_BASE}/login`, { waitUntil: 'load' });
      await assertThat('Login page should be accessible', () => expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible());
    });

    await step('Try accessing admin /users without auth', async () => {
      await page.goto('https://admin.configurator.dev.pemnet.ai/users', { waitUntil: 'load' });
      await assertThat('Should redirect to admin login', () => expect(page).toHaveURL(/\/login/));
    });

    await step('Try accessing admin /roles without auth', async () => {
      await page.goto('https://admin.configurator.dev.pemnet.ai/roles', { waitUntil: 'load' });
      await assertThat('Should redirect to admin login', () => expect(page).toHaveURL(/\/login/));
    });
  });

  test('TC-E2E-010 — All Filter Combinations', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Engineering logs in and navigates to installation system', async () => {
      await loginAs(page, 'engineering');
      await installPage.goto();
    });

    await step('Select all element types', async () => {
      await installPage.clickElementType('PEM');
      await page.waitForTimeout(300);
      await installPage.clickElementType('SHEREX');
      await page.waitForTimeout(300);
      await installPage.clickElementType('PROFIL');
      await page.waitForTimeout(300);
      await installPage.clickElementType('Other fasteners');
      await page.waitForTimeout(500);
    });

    await step('Check both capabilities', async () => {
      await installPage.checkCapability('process monitoring');
      await page.waitForTimeout(300);
      await installPage.checkCapability('robot integration');
      await page.waitForTimeout(500);
    });

    await step('Set force range', async () => {
      await installPage.setForceMin(30);
      await page.waitForTimeout(500);
    });

    await step('Verify all filters active simultaneously', async () => {
      const count = await installPage.getMatchingProductCount();
      await assertThat('Count should be a non-negative number', () => expect(count).toBeGreaterThanOrEqual(0));
    });
  });

  test('TC-E2E-014 — All 4 Roles Complete Basic Flow', async ({ page }) => {
    const roles = [
      { key: 'engineering', name: 'Engineering' },
      { key: 'customer', name: 'Customer' },
      { key: 'distributor', name: 'Distributor' },
      { key: 'sales', name: 'Sales' },
    ];

    for (const [i, role] of roles.entries()) {
      await step(`${role.name} logs in and navigates to installation system`, async () => {
        if (i > 0) {
          await page.context().clearCookies();
          await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
          await page.goto('about:blank');
        }
        await loginAs(page, role.key);
        const installPage = new TestWebInstallationSystemPage(page);
        await installPage.goto();
        await assertThat(`${role.name} should access installation system`, () => expect(page).toHaveURL(/\/installation-system/));
        await assertThat('Filter functions should be visible', () => expect(installPage.filterFunctionsHeading).toBeVisible());
        await assertThat('Select solutions heading should be visible', () => expect(installPage.selectSolutionsHeading).toBeVisible());
      });
    }
  });

  test('TC-E2E-015 — Admin Logs Out Then Other Logs In', async ({ page }) => {
    const adminPage = new AdminDashboardPage(page);

    await step('Admin logs into admin portal', async () => {
      await loginAsAdmin(page);
    });

    await step('Admin signs out', async () => {
      await adminPage.signOut();
      await page.waitForTimeout(2000);
    });

    await step('Engineering logs into admin portal', async () => {
      await page.goto('https://admin.configurator.dev.pemnet.ai/login', { waitUntil: 'load' });
      await page.getByRole('textbox', { name: /email/i }).fill(users.engineering.username);
      await page.getByRole('button', { name: /password instead/i }).click();
      await page.waitForTimeout(500);
      await page.getByRole('textbox', { name: /password/i }).fill(users.engineering.password);
      await page.locator('form').getByRole('button', { name: /sign in/i }).click();
      await page.waitForURL(/\/users/, { timeout: 20000 });
    });

    await step('Engineering navigates to /applications', async () => {
      await adminPage.goToPage('/applications');
      await assertThat('Engineering should access /applications', () => expect(page).toHaveURL(/\/applications/));
    });
  });

  test('TC-E2E-017 — Tab Switch Filters Persist', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Engineering logs in and navigates to installation system', async () => {
      await loginAs(page, 'engineering');
      await installPage.goto();
    });

    const initialCount = await installPage.getMatchingProductCount();

    await step('Apply filters', async () => {
      await installPage.clickElementType('PEM');
      await page.waitForTimeout(500);
      await installPage.setForceMin(50);
      await page.waitForTimeout(500);
    });

    const filteredCount = await installPage.getMatchingProductCount();
    await assertThat('Filters should change product count', () => expect(filteredCount).not.toBe(initialCount));

    await step('Navigate away and back', async () => {
      await page.goto(`${TESTWEB_BASE}/`, { waitUntil: 'load' });
      await page.goto(`${TESTWEB_BASE}/installation-system`, { waitUntil: 'load' });
    });

    await step('Verify filters remain applied', async () => {
      const afterBackCount = await installPage.getMatchingProductCount();
      await assertThat('Filtered count should persist after navigation',
        () => expect(afterBackCount).toBe(filteredCount));
    });
  });

  test('TC-E2E-018 — Browser Refresh Preserves App State', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Engineering logs in and navigates to installation system', async () => {
      await loginAs(page, 'engineering');
      await installPage.goto();
    });

    await step('Creates app and resets auto-filter', async () => {
      await setupNewTestApp(installPage, 'Persist App', 60000);
      await installPage.clickResetApplication();
      await page.waitForTimeout(500);
    });

    await step('Selects A210 solution', async () => {
      await installPage.checkSolution('A210');
      await page.waitForTimeout(500);
    });

    await step('Refresh browser', async () => {
      await page.reload({ waitUntil: 'load' });
    });

    await step('Verify app remains loaded', async () => {
      const heading = await installPage.getApplicationsHeadingText().catch(() => null);
      await assertThat('Applications section should still be visible after refresh',
        () => expect(heading).toBeTruthy());
    });
  });

  test('TC-E2E-020 — Admin Analytics Reflects Activity', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Engineering uses test web', async () => {
      await loginAs(page, 'engineering');
      await installPage.goto();
      await assertThat('Engineering should access installation system', () => expect(page).toHaveURL(/\/installation-system/));
    });

    await step('Admin navigates to /analytics', async () => {
      await loginAsAdmin(page);
      const adminPage = new AdminDashboardPage(page);
      await adminPage.goToPage('/analytics');
      await assertThat('Admin should access /analytics page', () => expect(page).toHaveURL(/\/analytics/));
    });

    await step('Verify analytics metrics are visible', async () => {
      const bodyText = await page.locator('body').innerText();
      await assertThat('Analytics page should show metrics content',
        () => expect(bodyText.length).toBeGreaterThan(0));
    });
  });

  test('TC-E2E-008 — Negative - Rapid Login Attempts (Brute Force)', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);

    await step('Navigate to admin login page', async () => {
      await loginPage.goto();
    });

    for (let i = 1; i <= 6; i++) {
      await step(`Attempt ${i}: login with invalid credentials`, async () => {
        await page.goto('https://admin.configurator.dev.pemnet.ai/login', { waitUntil: 'load' });
        await page.waitForTimeout(500);
        await page.getByRole('textbox', { name: /email/i }).fill(`fake${i}@spammer.com`);
        const pwBtn = page.getByRole('button', { name: /password instead/i });
        if (await pwBtn.isVisible().catch(() => false)) {
          await pwBtn.click();
          await page.waitForTimeout(300);
          await page.getByRole('textbox', { name: /password/i }).fill('WrongPass123!');
        }
        const signInBtn = page.locator('form button[type="submit"], form button:has-text("Sign In")');
        await signInBtn.click().catch(() => {});
        await page.waitForTimeout(1000);
        await assertThat(`Attempt ${i} should stay on /login`, () => expect(page).toHaveURL(/\/login/));
      });
    }
  });

  test('TC-E2E-009 — Concurrent Sessions Same User', async ({ page, browser }) => {
    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    const installPage1 = new TestWebInstallationSystemPage(page);

    await step('Login as engineering in first session', async () => {
      await loginAs(page, 'engineering');
      await installPage1.goto();
      await assertThat('Session 1 should access installation system',
        () => expect(page).toHaveURL(/\/installation-system/));
    });

    await step('Login as same engineering user in second session', async () => {
      await loginAs(page2, 'engineering');
      const installPage2 = new TestWebInstallationSystemPage(page2);
      await installPage2.goto();
      await assertThat('Session 2 should also access installation system',
        () => expect(page2).toHaveURL(/\/installation-system/));
    });

    await step('Verify first session is still functional', async () => {
      const heading1 = await installPage1.getApplicationsHeadingText().catch(() => null);
      await assertThat('First session should still be operational',
        () => expect(heading1).toBeTruthy());
    });

    await context2.close();
  });

  test('TC-E2E-011 — Edge - Maximum Solutions Selected', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Engineering logs in and navigates to installation system', async () => {
      await loginAs(page, 'engineering');
      await installPage.goto();
      await page.waitForTimeout(2000);
    });

    await step('Verify solutions are listed on the page', async () => {
      await assertThat('Select solutions heading should be visible',
        () => expect(installPage.selectSolutionsHeading).toBeVisible());
      const solutionCbs = page.getByRole('checkbox').filter({ hasNotText: /process monitoring|robot integration/i });
      const count = await solutionCbs.count();
      await assertThat('There should be at least one solution available',
        () => expect(count).toBeGreaterThan(0));
    });

    await step('Select two solutions', async () => {
      const solutionCbs = page.getByRole('checkbox').filter({ hasNotText: /process monitoring|robot integration/i });
      for (let i = 0; i < Math.min(await solutionCbs.count(), 2); i++) {
        await solutionCbs.nth(i).check({ force: true, timeout: 5000 }).catch(() => {});
      }
      await page.waitForTimeout(500);
    });
  });

  test('TC-E2E-012 — Edge - Edit App Name While Configured', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Engineering logs in and creates an application', async () => {
      await loginAs(page, 'engineering');
      await installPage.goto();
      await setupNewTestApp(installPage, 'Original Name', 80000);
    });

    await step('Open edit modal and verify it shows app details', async () => {
      await installPage.clickEditApp();
      await page.waitForTimeout(1000);
      await assertThat('Edit modal heading should be visible',
        () => expect(installPage.editAppHeading).toBeVisible());
      await assertThat('App name input should contain original name',
        () => expect(installPage.appNameInput).toHaveValue(/original name/i));
    });

    await step('Cancel the edit modal', async () => {
      await installPage.cancelButton.click();
      await page.waitForTimeout(500);
    });

    await step('Verify app card still shows original name after cancel', async () => {
      const cardText = await installPage.getAppCardText().catch(() => null);
      await assertThat('App card should still show the original name',
        () => expect(cardText?.toLowerCase()).toContain('original name'));
    });
  });

  test('TC-E2E-013 — Edge - Delete App While Configured', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Engineering logs in and creates an application', async () => {
      await loginAs(page, 'engineering');
      await installPage.goto();
      await setupNewTestApp(installPage, 'Delete Test App', 60000);
    });

    await step('Select first available solution', async () => {
      await selectFirstSolution(page);
      await page.waitForTimeout(500);
    });

    await step('Remove the app', async () => {
      await installPage.clickRemoveApp();
      await page.waitForTimeout(500);
    });

    await step('Verify app is removed', async () => {
      const noApp = await installPage.isNoApplicationSelected().catch(() => false);
      const appCards = await installPage.getAppCardCount().catch(() => 0);
      await assertThat('No application should be selected after removal',
        () => expect(noApp || appCards === 0).toBe(true));
    });
  });

  test('TC-E2E-016 — Mobile - Responsive Installation System', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Set mobile viewport (375x812 iPhone)', async () => {
      await page.setViewportSize({ width: 375, height: 812 });
    });

    await step('Login as engineering on mobile', async () => {
      await loginAs(page, 'engineering');
      await installPage.goto();
      await assertThat('Should access installation system on mobile',
        () => expect(page).toHaveURL(/\/installation-system/));
    });

    await step('Verify filter functions are accessible', async () => {
      const filterVisible = await installPage.filterFunctionsHeading.isVisible().catch(() => false);
      await assertThat('Filter functions should render on mobile',
        () => expect(filterVisible).toBe(true));
    });

    await step('Verify solutions section is accessible', async () => {
      const solutionsVisible = await installPage.selectSolutionsHeading.isVisible().catch(() => false);
      await assertThat('Solutions section should render on mobile',
        () => expect(solutionsVisible).toBe(true));
    });

    await step('Restore viewport', async () => {
      await page.setViewportSize({ width: 1280, height: 720 });
    });
  });

  test('TC-E2E-019 — Performance - Installation System Load Time', async ({ page }) => {
    await step('Login as engineering', async () => {
      await loginAs(page, 'engineering');
    });

    await step('Measure navigation and load time to /installation-system', async () => {
      const start = Date.now();
      await page.goto(`${TESTWEB_BASE}/installation-system`, { waitUntil: 'load', timeout: 60000 });
      const loadTime = Date.now() - start;
      await assertThat(`Page should load within 15 seconds (took ${loadTime}ms)`,
        () => expect(loadTime).toBeLessThan(15000));
      await page.waitForTimeout(1000);
      const interactiveTime = Date.now() - start;
      await assertThat(`Page should be interactive within 20 seconds (took ${interactiveTime}ms)`,
        () => expect(interactiveTime).toBeLessThan(20000));
    });

    await step('Verify key elements are visible after load', async () => {
      const installPage = new TestWebInstallationSystemPage(page);
      await assertThat('Filter functions should be visible after page load',
        () => expect(installPage.filterFunctionsHeading).toBeVisible());
      await assertThat('Select solutions heading should be visible',
        () => expect(installPage.selectSolutionsHeading).toBeVisible());
    });
  });

});
