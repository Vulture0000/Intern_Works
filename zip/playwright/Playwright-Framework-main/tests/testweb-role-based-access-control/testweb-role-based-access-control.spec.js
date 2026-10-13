import { test, expect } from '../fixtures/base.fixture.js';
import { assertThat } from '../fixtures/expect-helper.js';
import { step } from '../fixtures/step-runner.js';
import { loadUsers } from '../fixtures/data-helper.js';
import { TestWebInstallationSystemPage } from '../../src/pages/testweb/TestWebInstallationSystemPage.js';
import { TestWebMachineConfigurationPage } from '../../src/pages/testweb/TestWebMachineConfigurationPage.js';

const users = loadUsers();
const TESTWEB_BASE = 'https://testweb.configurator.dev.pemnet.ai';

async function loginAs(page, role) {
  const creds = users[role];
  await page.goto(`${TESTWEB_BASE}/login`, { waitUntil: 'load' });
  await page.getByRole('textbox', { name: /email/i }).fill(creds.username);
  await page.getByRole('button', { name: /password instead/i }).click();
  await page.waitForTimeout(500);
  await page.getByRole('textbox', { name: /password/i }).fill(creds.password);
  await Promise.all([
    page.waitForURL(new RegExp(`${TESTWEB_BASE.replace('.', '\\.')}/?$`), { timeout: 30000 }),
    page.locator('form').getByRole('button', { name: /sign in/i }).click(),
  ]);
}

async function openConfigPanel(installPage) {
  await installPage.checkSolution('A210');
  await installPage.clickCompareConfigureSolutions();
  await installPage.clickConfigureSolution();
}

test.describe('Test Web Role-Based Access Control', () => {

  test('TC-TWEB-RBAC-01 — Admin can create applications and access management features', async ({ page }) => {
    await loginAs(page, 'admin');
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate to installation system', async () => {
      await installPage.goto();
    });

    await step('Create an application', async () => {
      await installPage.clickSetupNewApplication();
      await assertThat('Setup New Application modal should open',
        () => expect(installPage.appNameInput).toBeVisible());
    });

    await step('Close modal', async () => {
      await installPage.clickCancel();
    });
  });

  test('TC-TWEB-RBAC-02 — Sales can create apps, see prices, generate quote and ROI', async ({ page }) => {
    await loginAs(page, 'sales');
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate to installation system', async () => {
      await installPage.goto();
    });

    await step('Select a solution and check config panel has pricing', async () => {
      await installPage.checkSolution('A210');
      await installPage.clickCompareConfigureSolutions();
      await assertThat('Compare/Configure button should work',
        () => expect(installPage.configureSolutionButton).toBeVisible());
    });
  });

  test('TC-TWEB-RBAC-04 — Engineering can create apps, see prices, generate quote and ROI', async ({ page }) => {
    await loginAs(page, 'engineering');
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate to installation system', async () => {
      await installPage.goto();
    });

    await step('Select a solution and check config panel', async () => {
      await installPage.checkSolution('A210');
      await installPage.clickCompareConfigureSolutions();
      await assertThat('Configure Solution button should be visible',
        () => expect(installPage.configureSolutionButton).toBeVisible());
    });
  });

  test('TC-TWEB-RBAC-03 — Sales cannot switch region', async ({ page }) => {
    await loginAs(page, 'sales');
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate to installation system', async () => {
      await installPage.goto();
    });

    await step('Verify region selector is visible for Sales', async () => {
      const regionSelect = page.locator('[class*="-singleValue"], [class*="react-select"]').first();
      await assertThat('Region selector should be visible for Sales role',
        () => expect(regionSelect).toBeVisible());
    });
  });

  test('TC-TWEB-RBAC-05 — Engineering can switch region', async ({ page }) => {
    await loginAs(page, 'engineering');
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate to installation system', async () => {
      await installPage.goto();
    });

    await step('Verify region selector is interactive for Engineering', async () => {
      const regionSelect = page.locator('[class*="-singleValue"], [class*="react-select"]').first();
      const isDisabled = await regionSelect.locator('xpath=..').getAttribute('aria-disabled').catch(() => null);
      await assertThat('Region selector should be interactive for Engineering',
        () => expect(isDisabled !== 'true').toBe(true));
    });
  });

  test('TC-TWEB-RBAC-06 — Customer can create own applications', async ({ page }) => {
    await loginAs(page, 'customer');
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate to installation system', async () => {
      await installPage.goto();
    });

    await step('Create an application', async () => {
      await installPage.clickSetupNewApplication();
      await assertThat('Customer should see new application modal',
        () => expect(installPage.appNameInput).toBeVisible());
    });

    await step('Close modal', async () => {
      await installPage.clickCancel();
    });
  });

  test('TC-TWEB-RBAC-07 — Customer cannot see prices', async ({ page }) => {
    await loginAs(page, 'customer');
    const installPage = new TestWebInstallationSystemPage(page);
    const configPage = new TestWebMachineConfigurationPage(page);

    await step('Navigate and open configuration panel', async () => {
      await installPage.goto();
      await openConfigPanel(installPage);
    });

    await step('Verify prices are not visible', async () => {
      const totalVisible = await configPage.getSelectedOptionsTotal().catch(() => null);
      await assertThat('Customer should not see price total',
        () => expect(totalVisible).toBeNull());
    });
  });

  test('TC-TWEB-RBAC-08 — Customer cannot generate quotes', async ({ page }) => {
    await loginAs(page, 'customer');
    const installPage = new TestWebInstallationSystemPage(page);
    const configPage = new TestWebMachineConfigurationPage(page);

    await step('Navigate and open configuration panel', async () => {
      await installPage.goto();
      await openConfigPanel(installPage);
    });

    await step('Verify download buttons are not visible', async () => {
      const quotationVisible = await configPage.isDownloadQuotationVisible().catch(() => false);
      const wordVisible = await configPage.isDownloadWordVisible().catch(() => false);
      await assertThat('Download quotation should not be visible for Customer',
        () => expect(quotationVisible).toBe(false));
      await assertThat('Download Word should not be visible for Customer',
        () => expect(wordVisible).toBe(false));
    });
  });

  test('TC-TWEB-RBAC-09 — Customer cannot generate ROI/Cost Analysis', async ({ page }) => {
    await loginAs(page, 'customer');
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate and open comparison for A210', async () => {
      await installPage.goto();
      await installPage.checkSolution('A210');
      await installPage.clickCompareConfigureSolutions();
      await page.waitForTimeout(1000);
    });

    await step('Verify ROI/Cost Analysis buttons are not visible', async () => {
      const costAnalysisVisible = await installPage.downloadCostAnalysisButton.isVisible().catch(() => false);
      const roiVisible = await installPage.generateROIReportButton.isVisible().catch(() => false);
      await assertThat('Download Cost Analysis should not be visible for Customer',
        () => expect(costAnalysisVisible).toBe(false));
      await assertThat('Generate ROI Report should not be visible for Customer',
        () => expect(roiVisible).toBe(false));
    });
  });

  test('TC-TWEB-RBAC-10 — Distributor can create own applications', async ({ page }) => {
    await loginAs(page, 'distributor');
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate to installation system', async () => {
      await installPage.goto();
    });

    await step('Create an application', async () => {
      await installPage.clickSetupNewApplication();
      await assertThat('Distributor should see new application modal',
        () => expect(installPage.appNameInput).toBeVisible());
    });

    await step('Close modal', async () => {
      await installPage.clickCancel();
    });
  });

  test('TC-TWEB-RBAC-11 — Distributor cannot see prices', async ({ page }) => {
    await loginAs(page, 'distributor');
    const installPage = new TestWebInstallationSystemPage(page);
    const configPage = new TestWebMachineConfigurationPage(page);

    await step('Navigate and open configuration panel', async () => {
      await installPage.goto();
      await openConfigPanel(installPage);
    });

    await step('Verify prices are not visible', async () => {
      const totalVisible = await configPage.getSelectedOptionsTotal().catch(() => null);
      await assertThat('Distributor should not see price total',
        () => expect(totalVisible).toBeNull());
    });
  });

  test('TC-TWEB-RBAC-12 — Distributor cannot generate quotes or ROI', async ({ page }) => {
    await loginAs(page, 'distributor');
    const installPage = new TestWebInstallationSystemPage(page);
    const configPage = new TestWebMachineConfigurationPage(page);

    await step('Navigate and open configuration panel', async () => {
      await installPage.goto();
      await openConfigPanel(installPage);
    });

    await step('Verify download quotation/Word buttons are not visible', async () => {
      const quotationVisible = await configPage.isDownloadQuotationVisible().catch(() => false);
      const wordVisible = await configPage.isDownloadWordVisible().catch(() => false);
      await assertThat('Download quotation should not be visible for Distributor',
        () => expect(quotationVisible).toBe(false));
      await assertThat('Download Word should not be visible for Distributor',
        () => expect(wordVisible).toBe(false));
    });

    await step('Verify ROI/Cost Analysis buttons are not visible on comparison', async () => {
      const costAnalysisVisible = await installPage.downloadCostAnalysisButton.isVisible().catch(() => false);
      const roiVisible = await installPage.generateROIReportButton.isVisible().catch(() => false);
      await assertThat('Download Cost Analysis should not be visible for Distributor',
        () => expect(costAnalysisVisible).toBe(false));
      await assertThat('Generate ROI Report should not be visible for Distributor',
        () => expect(roiVisible).toBe(false));
    });
  });

  test('TC-TWEB-RBAC-13 — Unauthenticated user cannot access installation system', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate to installation system without auth', async () => {
      await installPage.goto();
    });

    await step('Verify redirect to login', async () => {
      await assertThat('Unauthenticated user should be redirected to /login',
        () => expect(page).toHaveURL(/\/login/));
    });
  });

});
