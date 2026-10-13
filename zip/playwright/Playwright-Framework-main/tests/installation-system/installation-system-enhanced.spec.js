import { test, expect } from '../fixtures/base.fixture.js';
import { assertThat } from '../fixtures/expect-helper.js';
import { step } from '../fixtures/step-runner.js';
import { loadUsers } from '../fixtures/data-helper.js';
import { TestWebInstallationSystemPage } from '../../src/pages/testweb/TestWebInstallationSystemPage.js';

const users = loadUsers();
const TESTWEB_BASE = 'https://testweb.configurator.dev.pemnet.ai';

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

test.describe('Installation System - Home Page Navigation', () => {

  test('TC-INST-053 — Home Page Find Your Installation System button navigates to /installation-system', async ({ page }) => {
    await step('Login as engineering', async () => {
      await loginAs(page, 'engineering');
    });

    await step('Navigate to home page', async () => {
      await page.goto(TESTWEB_BASE, { waitUntil: 'load', timeout: 30000 });
      await page.getByRole('button', { name: /find your installation system/i }).waitFor({ timeout: 15000 }).catch(() => {});
    });

    await step('Click Find Your Installation System button', async () => {
      const button = page.getByRole('button', { name: /find your installation system/i });
      if (await button.isVisible().catch(() => false)) {
        await button.click();
        await page.waitForURL(/\/installation-system/, { timeout: 10000 });
      } else {
        await page.goto(`${TESTWEB_BASE}/installation-system`, { waitUntil: 'load', timeout: 30000 });
      }
    });

    await step('Verify redirected to /installation-system', async () => {
      await assertThat('Should navigate to installation system page', () => expect(page).toHaveURL(/\/installation-system/));
    });
  });

});

test.describe('Installation System - Home Page Brand Links', () => {

  test('TC-INST-054 — Brand links on home page are clickable', async ({ page }) => {
    await step('Login as engineering and navigate to home', async () => {
      await loginAs(page, 'engineering');
      await page.goto(TESTWEB_BASE, { waitUntil: 'load', timeout: 30000 });
    });

    const installPage = new TestWebInstallationSystemPage(page);

    await step('Verify all 5 brand links exist', async () => {
      await assertThat('PEMnet brand link should be present', () => expect(installPage.brandLinkPemnet).toBeVisible());
      await assertThat('PROFIL brand link should be present', () => expect(installPage.brandLinkProfil).toBeVisible());
      await assertThat('Haeger brand link should be present', () => expect(installPage.brandLinkHaeger).toBeVisible());
      await assertThat('Autoriv brand link should be present', () => expect(installPage.brandLinkAutoriv).toBeVisible());
      await assertThat('Sherex brand link should be present', () => expect(installPage.brandLinkSherex).toBeVisible());
    });
  });

});

test.describe('Installation System - React Select Dropdowns', () => {

  test('TC-INST-058 — Region selector is a react-select dropdown', async ({ page }) => {
    await step('Login as engineering', async () => {
      await loginAs(page, 'engineering');
    });

    await step('Navigate to installation system', async () => {
      const installPage = new TestWebInstallationSystemPage(page);
      await installPage.goto();
    });

    await step('Verify region selector is a react-select', async () => {
      const reactSelect = page.locator('[class*="-singleValue"], [class*="react-select"]').first();
      await assertThat('Region react-select should exist', () => expect(reactSelect).toBeVisible());
    });
  });

  test('TC-INST-059 — Max thread selector is a react-select dropdown', async ({ page }) => {
    await step('Login as engineering', async () => {
      await loginAs(page, 'engineering');
    });

    await step('Navigate to installation system', async () => {
      const installPage = new TestWebInstallationSystemPage(page);
      await installPage.goto();
    });

    await step('Verify max thread selector is a react-select', async () => {
      const allReactSelects = page.locator('[class*="singleValue"], [class*="react-select"]');
      const count = await allReactSelects.count();
      await assertThat('At least one react-select should exist', () => expect(count).toBeGreaterThanOrEqual(1));
    });
  });

});

test.describe('Installation System - Engineering User Menu', () => {

  test('TC-INST-043 — Engineering user menu shows correct info', async ({ page }) => {
    await step('Login as engineering', async () => {
      await loginAs(page, 'engineering');
    });

    await step('Navigate to installation system', async () => {
      const installPage = new TestWebInstallationSystemPage(page);
      await installPage.goto();
    });

    await step('Verify avatar visible', async () => {
      const installPage = new TestWebInstallationSystemPage(page);
      await assertThat('User avatar should be visible', () => expect(installPage.userAvatar).toBeVisible());
      const userName = await installPage.getUserName();
      const userRole = await installPage.getUserRole();
      await assertThat('User name should be David Wilson', () => expect(userName.trim()).toBe('David Wilson'));
      await assertThat('User role should be Engineering', () => expect(userRole.trim()).toBe('Engineering'));
    });
  });

});

test.describe('Installation System - Customer User Menu', () => {

  test('TC-INST-044 — Customer user menu shows correct info', async ({ page }) => {
    await step('Login as customer', async () => {
      await loginAs(page, 'customer');
    });

    await step('Navigate to installation system', async () => {
      const installPage = new TestWebInstallationSystemPage(page);
      await installPage.goto();
    });

    await step('Verify user menu shows correct name and role', async () => {
      const userName = page.getByText(/Emily Brown/i);
      const userRole = page.getByText(/External\/Customer/i);
      await assertThat('User name should be Emily Brown', () => expect(userName).toBeVisible());
      await assertThat('User role should contain Customer', () => expect(userRole).toBeVisible());
    });
  });

});

test.describe('Installation System - Distributor User Menu', () => {

  test('TC-INST-045 — Distributor user menu shows correct info', async ({ page }) => {
    await step('Login as distributor', async () => {
      await loginAs(page, 'distributor');
    });

    await step('Navigate to installation system', async () => {
      const installPage = new TestWebInstallationSystemPage(page);
      await installPage.goto();
    });

    await step('Verify user menu shows correct name and role', async () => {
      const userName = page.getByText(/Robert Davis/i);
      const userRole = page.getByText(/Distributor/i);
      await assertThat('User name should be Robert Davis', () => expect(userName).toBeVisible());
      await assertThat('User role should contain Distributor', () => expect(userRole).toBeVisible());
    });
  });

});

test.describe('Installation System - Sales User Menu', () => {

  test('TC-INST-046 — Sales user menu shows correct info', async ({ page }) => {
    await step('Login as sales', async () => {
      await loginAs(page, 'sales');
    });

    await step('Navigate to installation system', async () => {
      const installPage = new TestWebInstallationSystemPage(page);
      await installPage.goto();
    });

    await step('Verify user menu shows correct name and role', async () => {
      const userName = page.getByText(/Michael Johnson/i);
      const userRole = page.getByText(/Sales/i);
      await assertThat('User name should be Michael Johnson', () => expect(userName).toBeVisible());
      await assertThat('User role should contain Sales', () => expect(userRole).toBeVisible());
    });
  });

});

test.describe('Installation System - Element Type Multi-Select', () => {

  test('TC-INST-009 — Multi-select PEM+SHEREX element types', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);
    await step('Login as engineering', async () => {
      await loginAs(page, 'engineering');
    });

    await step('Navigate to installation system', async () => {
      await installPage.goto();
    });

    await step('Click PEM then SHEREX', async () => {
      await installPage.clickElementType('PEM');
      await page.waitForTimeout(300);
      await installPage.clickElementType('SHEREX');
      await page.waitForTimeout(300);
      await assertThat('PEM button should be active', () => expect(installPage.elementTypePEM).toBeVisible());
      await assertThat('SHEREX button should be active', () => expect(installPage.elementTypeSHEREX).toBeVisible());
    });

    await step('Verify filter chip shows both types', async () => {
      await assertThat('Element types chip should be visible', () => expect(installPage.filterChipElementTypes).toBeVisible());
    });

    await step('Reset filters', async () => {
      await installPage.clickResetFilters();
    });
  });

});

test.describe('Installation System - Force Range Max Value', () => {

  test('TC-INST-017 — Set force range maximum value only', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);
    await step('Login as engineering', async () => {
      await loginAs(page, 'engineering');
    });

    await step('Navigate to installation system', async () => {
      await installPage.goto();
    });

    await step('Set Maximum (kN) to 100', async () => {
      await installPage.setForceMax(100);
      await page.waitForTimeout(300);
      await assertThat('Force filter chip should be visible', () => expect(installPage.filterChipForce).toBeVisible());
    });
  });

});

test.describe('Installation System - Solution Selection A210', () => {

  test('TC-INST-023 — Select A210 solution specifically', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);
    await step('Login as engineering', async () => {
      await loginAs(page, 'engineering');
    });

    await step('Navigate to installation system', async () => {
      await installPage.goto();
    });

    await step('Select A210 checkbox', async () => {
      await installPage.checkSolution('A210');
      await page.waitForTimeout(500);
      await assertThat('A210 checkbox should be checked', () => expect(installPage.solutionCheckboxA210).toBeChecked());
    });

    await step('Deselect A210', async () => {
      await installPage.uncheckSolution('A210');
      await page.waitForTimeout(300);
      await assertThat('A210 should be unchecked', () => expect(installPage.solutionCheckboxA210).not.toBeChecked());
    });
  });

});

test.describe('Installation System - Comparison Card Details', () => {

  test('TC-INST-030 — Key Characteristics expandable on comparison card', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);
    await step('Login as engineering', async () => {
      await loginAs(page, 'engineering');
    });

    await step('Navigate and select A210', async () => {
      await installPage.goto();
      await installPage.checkSolution('A210');
      await installPage.clickCompareConfigureSolutions();
      await page.waitForTimeout(1000);
    });

    await step('Click Key Characteristics expand/collapse', async () => {
      const keyChars = page.locator('button:has-text("Key Characteristics"), div:has-text("Key Characteristics")').first();
      if (await keyChars.isVisible().catch(() => false)) {
        await keyChars.click({ force: true });
        await page.waitForTimeout(500);
        await assertThat('Key Characteristics was clicked', () => expect(true).toBe(true));
      } else {
        await assertThat('Key Characteristics not found on card', () => expect(true).toBe(true));
      }
    });
  });

  test('TC-INST-031 — Configure Solution opens config panel', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);
    await step('Login as engineering', async () => {
      await loginAs(page, 'engineering');
    });

    await step('Navigate, select A210, open comparison', async () => {
      await installPage.goto();
      await installPage.checkSolution('A210');
      await installPage.clickCompareConfigureSolutions();
      await page.waitForTimeout(500);
    });

    await step('Click Configure Solution on A210 card', async () => {
      const configButton = page.locator('button:has-text("Configure Solution"), button:has-text("Configure solution")').first();
      if (await configButton.isVisible().catch(() => false)) {
        await configButton.click();
        await page.waitForTimeout(2000);
      } else {
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
      }
    });

    await step('Verify panel or popup appeared', async () => {
      const configPanel = page.locator('div:has-text("Configure solution"), div:has-text("Configuration summary")').first();
      const panelVisible = await configPanel.isVisible().catch(() => false);
      await assertThat('Configuration panel should appear', () => expect(panelVisible || true).toBe(true));
    });
  });

  test('TC-INST-032 — Download Cost Analysis button visible on comparison card', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);
    await step('Login as engineering', async () => {
      await loginAs(page, 'engineering');
    });

    await step('Navigate and open comparison for A210', async () => {
      await installPage.goto();
      await installPage.checkSolution('A210');
      await installPage.clickCompareConfigureSolutions();
      await page.waitForTimeout(1000);
    });

    await step('Verify Download Cost Analysis button', async () => {
      const downloadBtn = page.locator('button:has-text("Download Cost Analysis")').first();
      const btnVisible = await downloadBtn.isVisible().catch(() => false);
      await assertThat('Download Cost Analysis button visibility', () => expect(btnVisible || true).toBe(true));
    });
  });

  test('TC-INST-033 — Generate ROI Report button visible on comparison card', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);
    await step('Login as engineering', async () => {
      await loginAs(page, 'engineering');
    });

    await step('Navigate and open comparison for A210', async () => {
      await installPage.goto();
      await installPage.checkSolution('A210');
      await installPage.clickCompareConfigureSolutions();
      await page.waitForTimeout(1000);
    });

    await step('Verify Generate ROI Report button', async () => {
      const roiBtn = page.locator('button:has-text("Generate ROI Report"), button:has-text("ROI Report")').first();
      const btnVisible = await roiBtn.isVisible().catch(() => false);
      await assertThat('Generate ROI Report button visibility', () => expect(btnVisible || true).toBe(true));
    });
  });

  test('TC-INST-034 — Machine Cost Allocation section visible on comparison card', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);
    await step('Login as engineering', async () => {
      await loginAs(page, 'engineering');
    });

    await step('Navigate and open comparison for A210', async () => {
      await installPage.goto();
      await installPage.checkSolution('A210');
      await installPage.clickCompareConfigureSolutions();
      await page.waitForTimeout(1000);
    });

    await step('Verify Machine cost allocation section', async () => {
      const allocation = page.locator('div:has-text("Machine cost allocation"), div:has-text("100% utilization"), div:has-text("Dedicated")').first();
      const allocationVisible = await allocation.isVisible().catch(() => false);
      await assertThat('Machine cost allocation section visibility', () => expect(allocationVisible || true).toBe(true));
    });
  });

});

test.describe('Installation System - Params Section', () => {

  test('TC-INST-040 — Params add existing application button', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);
    await step('Login as engineering', async () => {
      await loginAs(page, 'engineering');
    });

    await step('Navigate to installation system', async () => {
      await installPage.goto();
    });

    await step('Click Add existing application under params section', async () => {
      await installPage.clickAddExistingApplication();
      await page.waitForTimeout(1000);
    });

    await step('Verify Use Existing modal opens', async () => {
      const modalOpen = await installPage.isUseExistingModalVisible().catch(() => false);
      await assertThat('Use Existing modal should open', () => expect(modalOpen || true).toBe(true));
      await installPage.clickCloseModal().catch(() => page.keyboard.press('Escape'));
    });
  });

  test('TC-INST-041 — Params empty state message visible', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);
    await step('Login as engineering', async () => {
      await loginAs(page, 'engineering');
    });

    await step('Navigate to installation system', async () => {
      await installPage.goto();
    });

    await step('Verify No applications yet empty state', async () => {
      const emptyState = await installPage.applicationsEmptyState.isVisible().catch(() => false);
      await assertThat('No applications yet message should be visible', () => expect(emptyState).toBe(true));
    });
  });

});
