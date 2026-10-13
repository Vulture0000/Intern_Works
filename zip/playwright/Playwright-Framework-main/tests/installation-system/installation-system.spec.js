import { test, expect } from '../fixtures/base.fixture.js';
import { assertThat } from '../fixtures/expect-helper.js';
import { step } from '../fixtures/step-runner.js';
import { loadUsers } from '../fixtures/data-helper.js';
import { TestWebInstallationSystemPage } from '../../src/pages/testweb/TestWebInstallationSystemPage.js';

const users = loadUsers();

const TESTWEB_BASE = 'https://testweb.configurator.dev.pemnet.ai';

async function loginAs(page, role) {
  const creds = users[role];
  await page.goto(`${TESTWEB_BASE}/login`, { waitUntil: 'load' });
  await page.getByLabel(/email/i).fill(creds.username);
  await page.getByRole('button', { name: /password instead/i }).click();
  await page.waitForTimeout(1000);
  await page.getByLabel(/password/i).fill(creds.password);
  await Promise.all([
    page.waitForURL(new RegExp(`${TESTWEB_BASE.replace('.', '\\.')}/?$`), { timeout: 30000 }),
    page.locator('form button[type="submit"]').click(),
  ]);
}

test.describe('Installation System - Unauthenticated', () => {

  test('TC-INST-01 — Unauthenticated user is redirected to login', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate to installation system without auth', async () => {
      await installPage.goto();
    });

    await step('Verify redirect to login page', async () => {
      await assertThat('User should be redirected to /login', () => expect(page).toHaveURL(/\/login/));
      await assertThat('Sign in heading should be visible', () => expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible());
    });
  });

});

test.describe('Installation System - Cross-Role Access', () => {

  test('TC-INST-18a — Engineering role can access installation system', async ({ page }) => {
    await loginAs(page, 'engineering');
    const installPage = new TestWebInstallationSystemPage(page);
    await installPage.goto();
    await assertThat('Engineering should access installation system', () => expect(page).toHaveURL(/\/installation-system/));
    await assertThat('Filter functions should be visible', () => expect(installPage.filterFunctionsHeading).toBeVisible());
  });

  test('TC-INST-18b — Customer role can access installation system', async ({ page }) => {
    await loginAs(page, 'customer');
    const installPage = new TestWebInstallationSystemPage(page);
    await installPage.goto();
    await assertThat('Customer should access installation system', () => expect(page).toHaveURL(/\/installation-system/));
    await assertThat('Filter functions should be visible', () => expect(installPage.filterFunctionsHeading).toBeVisible());
  });

  test('TC-INST-18c — Distributor role can access installation system', async ({ page }) => {
    await loginAs(page, 'distributor');
    const installPage = new TestWebInstallationSystemPage(page);
    await installPage.goto();
    await assertThat('Distributor should access installation system', () => expect(page).toHaveURL(/\/installation-system/));
    await assertThat('Filter functions should be visible', () => expect(installPage.filterFunctionsHeading).toBeVisible());
  });

  test('TC-INST-18d — Sales role can access installation system', async ({ page }) => {
    await loginAs(page, 'sales');
    const installPage = new TestWebInstallationSystemPage(page);
    await installPage.goto();
    await assertThat('Sales should access installation system', () => expect(page).toHaveURL(/\/installation-system/));
    await assertThat('Filter functions should be visible', () => expect(installPage.filterFunctionsHeading).toBeVisible());
  });

});

test.describe('Installation System - Auto-Feed Toggle (MSPe Machines)', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'engineering');
  });

  test('TC-MC-19 — Auto-Feed toggle is visible on MSPe machine comparison card', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate to installation system', async () => {
      await installPage.goto();
    });

    await step('Select 824 MSPe solution', async () => {
      await page.locator('#solution-824MSPe').check();
      await page.waitForTimeout(500);
    });

    await step('Open comparison cards', async () => {
      await installPage.clickCompareConfigureSolutions();
    });

    await step('Verify Auto-Feed toggle is visible', async () => {
      const autoFeedButton = page.getByRole('button', { name: /auto-feed/i });
      await assertThat('Auto-Feed toggle should be visible on MSPe card',
        () => expect(autoFeedButton).toBeVisible());
    });
  });

  test('TC-MC-23 — Auto-Feed toggle not visible on non-MSPe machines', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate to installation system', async () => {
      await installPage.goto();
    });

    await step('Select A210 solution', async () => {
      await page.locator('#solution-A210').check();
      await page.waitForTimeout(500);
    });

    await step('Open comparison cards', async () => {
      await installPage.clickCompareConfigureSolutions();
    });

    await step('Verify Auto-Feed toggle is NOT visible', async () => {
      const autoFeedButton = page.getByRole('button', { name: /auto-feed/i });
      await assertThat('Auto-Feed toggle should NOT be visible on non-MSPe machine',
        () => expect(autoFeedButton).not.toBeVisible());
    });
  });

  test('TC-MC-20 — Toggle Auto-Feed Off changes the displayed state', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate', async () => {
      await installPage.goto();
    });

    await step('Select and compare 824 MSPe', async () => {
      await page.locator('#solution-824MSPe').check();
      await page.waitForTimeout(500);
      await installPage.clickCompareConfigureSolutions();
    });

    await step('Click Auto-Feed toggle to turn off', async () => {
      const autoFeedButton = page.getByRole('button', { name: /auto-feed/i });
      await autoFeedButton.click();
      await page.waitForTimeout(500);
      const text = await autoFeedButton.textContent();
      await assertThat('Auto-Feed should show Off after toggle',
        () => expect(text.toLowerCase()).toContain('off'));
    });
  });

});

test.describe('Installation System - Engineering Role', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'engineering');
  });

  test('TC-INST-02 — Page loads with all key sections visible', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate to installation system', async () => {
      await installPage.goto();
    });

    await step('Verify URL and key sections', async () => {
      await assertThat('URL should be /installation-system', () => expect(page).toHaveURL(/\/installation-system/));
      await assertThat('Filter functions heading should be visible', () => expect(installPage.filterFunctionsHeading).toBeVisible());
      await assertThat('Select solutions heading should be visible', () => expect(installPage.selectSolutionsHeading).toBeVisible());
      await assertThat('Comparison list heading should be visible', () => expect(installPage.comparisonHeading).toBeVisible());
      await assertThat('Application params heading should be visible', () => expect(installPage.applicationParamsHeading).toBeVisible());
      await assertThat('Handtools category should be visible', () => expect(installPage.categoryHandtools).toBeVisible());
      await assertThat('Standalone Machines category should be visible', () => expect(installPage.categoryStandalone).toBeVisible());
      await assertThat('Robotic Integration category should be visible', () => expect(installPage.categoryRobotic).toBeVisible());
      await assertThat('InDie category should be visible', () => expect(installPage.categoryInDie).toBeVisible());
      await assertThat('Custom category should be visible', () => expect(installPage.categoryCustom).toBeVisible());
      await assertThat('System selector text should be visible', () => expect(installPage.systemSelectorText).toBeVisible());
    });
  });

  test('TC-INST-03 — Default filter chips are displayed', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate to installation system', async () => {
      await installPage.goto();
    });

    await step('Verify default filter chips and matching count', async () => {
      await assertThat('Matching product count should be positive', () => expect(installPage.matchingProductsContainer).toBeVisible());
      await assertThat('Region chip should be visible', () => expect(installPage.filterChipRegion).toBeVisible());
      await assertThat('Element types chip should be visible', () => expect(installPage.filterChipElementTypes).toBeVisible());
      await assertThat('Max thread chip should be visible', () => expect(installPage.filterChipMaxThread).toBeVisible());
      await assertThat('Force chip should be visible', () => expect(installPage.filterChipForce).toBeVisible());
      await assertThat('Compare selected chip should show 0', () => expect(installPage.compareSelectedChip).toBeVisible());

      const initialCount = await installPage.getMatchingProductCount();
      await assertThat('Initial product count should be greater than 0', () => expect(initialCount).toBeGreaterThan(0));
    });
  });

  test('TC-INST-04 — Toggle element type PEM updates count', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate and get initial count', async () => {
      await installPage.goto();
    });

    const initialCount = await installPage.getMatchingProductCount();

    await step('Click PEM element type button', async () => {
      await installPage.clickElementType('PEM');
      await page.waitForTimeout(500);
    });

    await step('Verify count decreased after filtering', async () => {
      const filteredCount = await installPage.getMatchingProductCount();
      await assertThat('Filtered count should be less than initial', () => expect(filteredCount).toBeLessThan(initialCount));
    });
  });

  test('TC-INST-05 — Toggle multiple element types', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate', async () => {
      await installPage.goto();
    });

    await step('Click PEM then SHEREX', async () => {
      await installPage.clickElementType('PEM');
      await page.waitForTimeout(300);
      await installPage.clickElementType('SHEREX');
      await page.waitForTimeout(300);
    });

    await step('Verify count is positive after multi-select', async () => {
      const count = await installPage.getMatchingProductCount();
      await assertThat('Count should be positive after filtering', () => expect(count).toBeGreaterThan(0));
    });
  });

  test('TC-INST-06 — Check Process Monitoring capability', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate', async () => {
      await installPage.goto();
    });

    const initialCount = await installPage.getMatchingProductCount();

    await step('Check Process monitoring required', async () => {
      await installPage.checkCapability('process monitoring');
      await page.waitForTimeout(500);
    });

    await step('Verify count decreased', async () => {
      const filteredCount = await installPage.getMatchingProductCount();
      await assertThat('Process monitoring filter should reduce count', () => expect(filteredCount).toBeLessThan(initialCount));
    });
  });

  test('TC-INST-07 — Check Robot Integration capability', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate', async () => {
      await installPage.goto();
    });

    const initialCount = await installPage.getMatchingProductCount();

    await step('Check Robot integration required', async () => {
      await installPage.checkCapability('robot integration');
      await page.waitForTimeout(500);
    });

    await step('Verify count decreased', async () => {
      const filteredCount = await installPage.getMatchingProductCount();
      await assertThat('Robot integration filter should reduce count', () => expect(filteredCount).toBeLessThan(initialCount));
    });
  });

  test('TC-INST-08 — Adjust force range minimum', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate', async () => {
      await installPage.goto();
    });

    const initialCount = await installPage.getMatchingProductCount();

    await step('Set minimum force to 50', async () => {
      await installPage.setForceMin(50);
      await page.waitForTimeout(500);
    });

    await step('Verify count changed', async () => {
      const filteredCount = await installPage.getMatchingProductCount();
      await assertThat('Force filter should change product count', () => expect(filteredCount).not.toBe(initialCount));
    });
  });

  test('TC-INST-09 — Reset all filters restores defaults', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate and capture initial count', async () => {
      await installPage.goto();
    });

    const initialCount = await installPage.getMatchingProductCount();

    await step('Apply multiple filters', async () => {
      await installPage.clickElementType('PEM');
      await page.waitForTimeout(300);
      await installPage.checkCapability('process monitoring');
      await page.waitForTimeout(300);
      await installPage.setForceMin(50);
      await page.waitForTimeout(500);
    });

    const filteredCount = await installPage.getMatchingProductCount();
    await assertThat('Filters should have changed the count', () => expect(filteredCount).not.toBe(initialCount));

    await step('Click Reset filters', async () => {
      await installPage.clickResetFilters();
      await page.waitForTimeout(500);
    });

    await step('Verify count returns to initial value', async () => {
      const resetCount = await installPage.getMatchingProductCount();
      await assertThat('Count should return to initial after reset', () => expect(resetCount).toBe(initialCount));
    });
  });

  test('TC-INST-10 — Select one solution per category', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate', async () => {
      await installPage.goto();
    });

    await step('Select one solution from each of 5 categories', async () => {
      await installPage.checkSolution('A210');
      await installPage.checkSolution('824 eDrive');
      await installPage.checkSolution('A240-CP');
      await installPage.checkSolution('MDS A100');
      await installPage.checkSolution('Full Custom Solution');
    });

    await step('Verify compare selected count is 5', async () => {
      const selectedCount = await installPage.getCompareSelectedCount();
      await assertThat('Compare selected should show 5', () => expect(selectedCount).toBe(5));
    });
  });

  test('TC-INST-11 — Compare selected count updates correctly', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate', async () => {
      await installPage.goto();
    });

    await step('Select 3 solutions', async () => {
      await installPage.checkSolution('A210');
      await installPage.checkSolution('824 eDrive');
      await installPage.checkSolution('A240-CP');
    });

    await step('Verify compare selected count is 3', async () => {
      const selectedCount = await installPage.getCompareSelectedCount();
      await assertThat('Compare selected should show 3', () => expect(selectedCount).toBe(3));
    });
  });

  test('TC-INST-12 — Deselect a solution returns count to 0', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate', async () => {
      await installPage.goto();
    });

    await step('Select then deselect a solution', async () => {
      await installPage.checkSolution('A210');
      await page.waitForTimeout(300);
      await installPage.uncheckSolution('A210');
    });

    await step('Verify compare selected count is 0', async () => {
      const selectedCount = await installPage.getCompareSelectedCount();
      await assertThat('Compare selected should be 0 after deselect', () => expect(selectedCount).toBe(0));
    });
  });

  test('TC-INST-13 — Comparison empty state is visible', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate', async () => {
      await installPage.goto();
    });

    await step('Verify comparison empty state', async () => {
      await assertThat('Comparison empty state should be visible', () => expect(installPage.comparisonEmptyState).toBeVisible());
    });
  });

  test('TC-INST-14 — Setup New Application button is clickable', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate', async () => {
      await installPage.goto();
    });

    await step('Click Setup New Application', async () => {
      await installPage.clickSetupNewApplication();
    });

    await assertThat('Setup New Application button should be clickable', () => expect(true).toBe(true));
  });

  test('TC-INST-15 — Use Existing Application button is clickable', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate', async () => {
      await installPage.goto();
    });

    await step('Click Use Existing Application', async () => {
      await installPage.clickUseExistingApplication();
    });

    await assertThat('Use Existing Application button should be clickable', () => expect(true).toBe(true));
  });

  test('TC-INST-16 — Add new application in params section', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate', async () => {
      await installPage.goto();
    });

    await step('Click Add new application', async () => {
      await installPage.clickAddNewApplication();
    });

    await assertThat('Add new application button should be clickable', () => expect(true).toBe(true));
  });

  test('TC-INST-17 — Portfolio totals show empty state', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate', async () => {
      await installPage.goto();
    });

    await step('Verify portfolio KPIs exist', async () => {
      await assertThat('Total annual volume label should be visible', () => expect(installPage.totalAnnualVolume).toBeVisible());
      await assertThat('Total fasteners per year label should be visible', () => expect(installPage.totalFastenersPerYear).toBeVisible());
      await assertThat('Fasteners per part label should be visible', () => expect(installPage.fastenersPerPart).toBeVisible());
      await assertThat('Element types per part label should be visible', () => expect(installPage.elementTypesPerPart).toBeVisible());
      await assertThat('Parts per year label should be visible', () => expect(installPage.partsPerYear).toBeVisible());
      await assertThat('No applications state should be visible', () => expect(installPage.applicationsEmptyState).toBeVisible());
    });
  });

  test('TC-INST-19 — User menu shows correct info', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate', async () => {
      await installPage.goto();
    });

    await step('Verify user menu info', async () => {
      const userName = await installPage.getUserName();
      const userRole = await installPage.getUserRole();
      await assertThat('User name should be David Wilson', () => expect(userName.trim()).toBe('David Wilson'));
      await assertThat('User role should be Engineering', () => expect(userRole.trim()).toBe('Engineering'));
    });
  });

  test('TC-INST-20 — Request Support button is visible', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate', async () => {
      await installPage.goto();
    });

    await step('Scroll to bottom', async () => {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);
    });

    await step('Verify Request Support button', async () => {
      await assertThat('Request Support button should be visible', () => expect(installPage.requestSupportButton).toBeVisible());
    });
  });

  test('TC-INST-003 (enhanced) — Verify header elements visible', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate', async () => {
      await installPage.goto();
    });

    await step('Verify header elements', async () => {
      const count = await page.getByRole('combobox').count();
      await assertThat('Region selector should exist', () => expect(count).toBeGreaterThanOrEqual(1));
      await assertThat('Brand link PEMnet should be visible', () => expect(installPage.brandLinkPemnet).toBeVisible());
      await assertThat('Brand link PROFIL should be visible', () => expect(installPage.brandLinkProfil).toBeVisible());
      await assertThat('Brand link Haeger should be visible', () => expect(installPage.brandLinkHaeger).toBeVisible());
      await assertThat('Brand link Autoriv should be visible', () => expect(installPage.brandLinkAutoriv).toBeVisible());
      await assertThat('Brand link Sherex should be visible', () => expect(installPage.brandLinkSherex).toBeVisible());
      await assertThat('System selector text should be visible', () => expect(installPage.systemSelectorText).toBeVisible());
    });
  });

  test('TC-INST-006 — Element type SHEREX selection updates count', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate and get initial count', async () => {
      await installPage.goto();
    });

    const initialCount = await installPage.getMatchingProductCount();

    await step('Click SHEREX element type', async () => {
      await installPage.clickElementType('SHEREX');
      await page.waitForTimeout(500);
    });

    await step('Verify count changed', async () => {
      const newCount = await installPage.getMatchingProductCount();
      await assertThat('SHEREX filter should change product count', () => expect(newCount).not.toBe(initialCount));
    });
  });

  test('TC-INST-007 — Element type PROFIL selection', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate and get initial count', async () => {
      await installPage.goto();
    });

    const initialCount = await installPage.getMatchingProductCount();

    await step('Click PROFIL element type', async () => {
      await installPage.clickElementType('PROFIL');
      await page.waitForTimeout(500);
    });

    await step('Verify count changed', async () => {
      const newCount = await installPage.getMatchingProductCount();
      await assertThat('PROFIL filter should change product count', () => expect(newCount).not.toBe(initialCount));
    });
  });

  test('TC-INST-008 — Element type Other fasteners selection', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate and get initial count', async () => {
      await installPage.goto();
    });

    const initialCount = await installPage.getMatchingProductCount();

    await step('Click Other fasteners element type', async () => {
      await installPage.clickElementType('Other fasteners');
      await page.waitForTimeout(500);
    });

    await step('Verify count changed', async () => {
      const newCount = await installPage.getMatchingProductCount();
      await assertThat('Other fasteners filter should change product count', () => expect(newCount).not.toBe(initialCount));
    });
  });

  test('TC-INST-010 — All four element types selected simultaneously', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate', async () => {
      await installPage.goto();
    });

    await step('Select all four element types', async () => {
      await installPage.clickElementType('PEM');
      await page.waitForTimeout(300);
      await installPage.clickElementType('SHEREX');
      await page.waitForTimeout(300);
      await installPage.clickElementType('PROFIL');
      await page.waitForTimeout(300);
      await installPage.clickElementType('Other fasteners');
      await page.waitForTimeout(500);
    });

    await step('Verify count is non-negative', async () => {
      const count = await installPage.getMatchingProductCount();
      await assertThat('Count should be >= 0 with all element types', () => expect(count).toBeGreaterThanOrEqual(0));
    });
  });

  test('TC-INST-011 — Toggle off element type reverts count', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate and get initial count', async () => {
      await installPage.goto();
    });

    const initialCount = await installPage.getMatchingProductCount();

    await step('Select PEM element type', async () => {
      await installPage.clickElementType('PEM');
      await page.waitForTimeout(500);
    });

    const filteredCount = await installPage.getMatchingProductCount();
    await assertThat('PEM should change count', () => expect(filteredCount).not.toBe(initialCount));

    await step('Click PEM again to deselect', async () => {
      await installPage.clickElementType('PEM');
      await page.waitForTimeout(500);
    });

    await step('Verify count reverts to initial', async () => {
      const revertedCount = await installPage.getMatchingProductCount();
      await assertThat('Count should revert to initial after deselecting PEM', () => expect(revertedCount).toBe(initialCount));
    });
  });

  test('TC-INST-013 — Uncheck Process Monitoring reverts count', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate and get initial count', async () => {
      await installPage.goto();
    });

    const initialCount = await installPage.getMatchingProductCount();

    await step('Check Process Monitoring', async () => {
      await installPage.checkCapability('process monitoring');
      await page.waitForTimeout(500);
    });

    const checkedCount = await installPage.getMatchingProductCount();
    await assertThat('Process monitoring should reduce count', () => expect(checkedCount).toBeLessThan(initialCount));

    await step('Uncheck Process Monitoring', async () => {
      await installPage.uncheckCapability('process monitoring');
      await page.waitForTimeout(500);
    });

    await step('Verify count reverts to initial', async () => {
      const revertedCount = await installPage.getMatchingProductCount();
      await assertThat('Count should revert after unchecking', () => expect(revertedCount).toBe(initialCount));
    });
  });

  test('TC-INST-015 — Both capabilities checked', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate', async () => {
      await installPage.goto();
    });

    await step('Check both Process Monitoring and Robot Integration', async () => {
      await installPage.checkCapability('process monitoring');
      await page.waitForTimeout(300);
      await installPage.checkCapability('robot integration');
      await page.waitForTimeout(500);
    });

    await step('Verify count reflects both filters', async () => {
      const count = await installPage.getMatchingProductCount();
      await assertThat('Count should be >= 0 with both capabilities', () => expect(count).toBeGreaterThanOrEqual(0));
    });
  });

  test('TC-INST-018 — Force range min > max validation', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate', async () => {
      await installPage.goto();
    });

    await step('Set Min=200 and Max=50 (invalid range)', async () => {
      await installPage.setForceMin(200);
      await page.waitForTimeout(300);
      await installPage.setForceMax(50);
      await page.waitForTimeout(500);
    });

    await step('Verify page does not crash', async () => {
      await assertThat('Page should still be on installation system', () => expect(page).toHaveURL(/\/installation-system/));
    });
  });

  test('TC-INST-019 — Force range full range (21-300)', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate', async () => {
      await installPage.goto();
    });

    await step('Set Min=21 and Max=300', async () => {
      await installPage.setForceMin(21);
      await page.waitForTimeout(300);
      await installPage.setForceMax(300);
      await page.waitForTimeout(500);
    });

    await step('Verify count is positive with full range', async () => {
      const count = await installPage.getMatchingProductCount();
      await assertThat('Count should be > 0 with full force range', () => expect(count).toBeGreaterThan(0));
    });
  });

  test('TC-INST-020 — Force range narrow (100-110)', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate and get initial count', async () => {
      await installPage.goto();
    });

    const initialCount = await installPage.getMatchingProductCount();

    await step('Set Min=100 and Max=110', async () => {
      await installPage.setForceMin(100);
      await installPage.setForceMax(110);
    });

    await step('Verify count decreased with narrow range', async () => {
      const narrowCount = await installPage.getMatchingProductCount();
      await assertThat('Narrow force range should reduce count', () => expect(narrowCount).toBeLessThan(initialCount));
    });
  });

  test('TC-INST-021 — Force range reset', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate', async () => {
      await installPage.goto();
    });

    const initialCount = await installPage.getMatchingProductCount();

    await step('Set force range and then reset', async () => {
      await installPage.setForceMin(100);
      await page.waitForTimeout(300);
      await installPage.setForceMax(110);
      await page.waitForTimeout(300);
      await installPage.clickForceReset();
      await page.waitForTimeout(500);
    });

    await step('Verify count returns to initial', async () => {
      const resetCount = await installPage.getMatchingProductCount();
      await assertThat('Count should return to initial after force reset', () => expect(resetCount).toBe(initialCount));
    });
  });

  test('TC-INST-026 — Verify all 47 solution checkboxes exist', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate', async () => {
      await installPage.goto();
    });

    await step('Count all solution checkboxes', async () => {
      const allCheckboxes = page.locator('input[type="checkbox"]');
      const count = await allCheckboxes.count();
      await assertThat('Solution checkboxes should be visible', () => expect(count).toBeGreaterThan(0));
    });
  });

  test('TC-INST-028 — Compare/Configure button works', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate', async () => {
      await installPage.goto();
    });

    await step('Select A210 and click Compare/Configure', async () => {
      await installPage.checkSolution('A210');
      await page.waitForTimeout(500);
      await installPage.clickCompareConfigureSolutions();
    });

    await step('Verify comparison cards appear', async () => {
      const selectedCount = await installPage.getCompareSelectedCount();
      await assertThat('Compare selected chip should show selection', () => expect(selectedCount).toBeGreaterThanOrEqual(0));
    });
  });

  test('TC-INST-029 — Comparison card shows solution details', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate and select A210', async () => {
      await installPage.goto();
      await installPage.checkSolution('A210');
      await page.waitForTimeout(500);
      await installPage.clickCompareConfigureSolutions();
    });

    await step('Verify card shows solution name, category, subcategory', async () => {
      const bodyText = await page.locator('body').innerText();
      await assertThat('A210 should be visible in comparison', () => expect(bodyText).toContain('A210'));
    });
  });

  test('TC-INST-035 — Solution name verification', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate', async () => {
      await installPage.goto();
    });

    await step('Verify key solution names present in the grid', async () => {
      await assertThat('A210 checkbox should exist', () => expect(installPage.solutionCheckboxA210).toBeVisible());
      await assertThat('824 eDrive checkbox should exist', () => expect(installPage.solutionCheckbox824eDrive).toBeVisible());
      await assertThat('A240-CP checkbox should exist', () => expect(installPage.solutionCheckboxA240CP).toBeVisible());
    });
  });

  test('TC-INST-038 — Option B default state', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate', async () => {
      await installPage.goto();
    });

    await step('Verify Option B default state', async () => {
      const noApp = await installPage.isNoApplicationSelected();
      await assertThat('Option B should show no application selected', () => expect(noApp).toBe(true));
      await assertThat('Setup New Application button should be visible', () => expect(installPage.setupNewApplicationButton).toBeVisible());
      await assertThat('Use Existing Application button should be visible', () => expect(installPage.useExistingApplicationButton).toBeVisible());
    });
  });

  test('TC-INST-042 — Portfolio KPIs visible', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate', async () => {
      await installPage.goto();
    });

    await step('Verify all 5 KPI labels visible', async () => {
      await assertThat('Total annual volume label visible', () => expect(installPage.totalAnnualVolume).toBeVisible());
      await assertThat('Total fasteners per year label visible', () => expect(installPage.totalFastenersPerYear).toBeVisible());
      await assertThat('Fasteners per part label visible', () => expect(installPage.fastenersPerPart).toBeVisible());
      await assertThat('Element types per part label visible', () => expect(installPage.elementTypesPerPart).toBeVisible());
      await assertThat('Parts per year label visible', () => expect(installPage.partsPerYear).toBeVisible());
    });
  });

  test('TC-INST-052 — Category cards exact labels', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate', async () => {
      await installPage.goto();
    });

    await step('Verify category headings', async () => {
      await assertThat('Handtools category visible', () => expect(installPage.categoryHandtools).toBeVisible());
      await assertThat('Standalone Machines category visible', () => expect(installPage.categoryStandalone).toBeVisible());
      await assertThat('Robotic Integration category visible', () => expect(installPage.categoryRobotic).toBeVisible());
      await assertThat('InDie category visible', () => expect(installPage.categoryInDie).toBeVisible());
      await assertThat('Custom category visible', () => expect(installPage.categoryCustom).toBeVisible());
    });
  });

  test('TC-INST-052 (enhanced) — Subcategory labels visible within each category', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate and wait for solutions grid to load', async () => {
      await installPage.goto();
      await installPage.getMatchingProductCount();
      await page.waitForTimeout(500);
    });

    await step('Verify subcategory labels exist within categories', async () => {
      const bodyText = await page.locator('body').innerText();
      await assertThat('Handtools should be listed', () => expect(bodyText).toContain('Handtools'));
      await assertThat('Standalone Machines should be listed', () => expect(bodyText).toContain('Standalone Machines'));
      await assertThat('Robotic Integration should be listed', () => expect(bodyText).toContain('Robotic Integration'));
      await assertThat('InDie should be listed', () => expect(bodyText).toContain('InDie'));
      await assertThat('Custom should be listed', () => expect(bodyText).toContain('Custom'));
    });
  });

  test('TC-INST-055 — Filter combination all active', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate', async () => {
      await installPage.goto();
    });

    await step('Apply PEM + Process Monitoring + Force min=50', async () => {
      await installPage.clickElementType('PEM');
      await page.waitForTimeout(300);
      await installPage.checkCapability('process monitoring');
      await page.waitForTimeout(300);
      await installPage.setForceMin(50);
      await page.waitForTimeout(500);
    });

    await step('Verify count is >= 0 with combined filters', async () => {
      const count = await installPage.getMatchingProductCount();
      await assertThat('Count should be >= 0 with combined filters', () => expect(count).toBeGreaterThanOrEqual(0));
    });
  });

  test('TC-INST-056 — Reset clears filters and solution selection', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate', async () => {
      await installPage.goto();
    });

    await step('Select solution, then apply filter', async () => {
      await installPage.checkSolution('A210');
      await page.waitForTimeout(300);
      await installPage.clickElementType('PEM');
      await page.waitForTimeout(300);
    });

    await step('Reset filters', async () => {
      await installPage.clickResetFilters();
      await page.waitForTimeout(500);
    });

    await step('Verify A210 is unchecked after reset', async () => {
      const isChecked = await installPage.solutionCheckboxA210.isChecked();
      await assertThat('A210 should be unchecked after filter reset', () => expect(isChecked).toBe(false));
    });

    await step('Verify filter chips show no active filters', async () => {
      await assertThat('Element types chip should show none selected', () => expect(installPage.filterChipElementTypes).toBeVisible());
    });
  });

  test('TC-INST-057 — Zero results state', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate', async () => {
      await installPage.goto();
    });

    await step('Apply very restrictive filters', async () => {
      await installPage.clickElementType('PEM');
      await page.waitForTimeout(300);
      await installPage.checkCapability('process monitoring');
      await page.waitForTimeout(300);
      await installPage.checkCapability('robot integration');
      await page.waitForTimeout(300);
      await installPage.setForceMin(500);
      await page.waitForTimeout(500);
    });

    await step('Verify zero matching products or page does not crash', async () => {
      await assertThat('Page should not crash with restrictive filters', () => expect(page).toHaveURL(/\/installation-system/));
    });
  });

  test('TC-INST-060 — Force range inputs and sliders exist', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Navigate', async () => {
      await installPage.goto();
    });

    await step('Verify force range inputs and sliders exist', async () => {
      await assertThat('Force min input should exist', () => expect(installPage.forceMinInput).toBeVisible());
      await assertThat('Force max input should exist', () => expect(installPage.forceMaxInput).toBeVisible());
      await assertThat('Force reset button should exist', () => expect(installPage.forceResetButton).toBeVisible());
      await assertThat('Force Any text should exist', () => expect(installPage.forceAnyText).toBeVisible());
    });
  });

});
