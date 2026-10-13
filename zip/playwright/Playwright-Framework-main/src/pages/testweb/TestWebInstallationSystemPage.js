import { BasePage } from '../base/BasePage.js';

export class TestWebInstallationSystemPage extends BasePage {
  constructor(page) {
    super(page);

    this.filterFunctionsHeading = page.getByRole('heading', { name: /filter functions/i });
    this.selectSolutionsHeading = page.getByRole('heading', { name: /select solutions you want to compare/i });
    this.comparisonHeading = page.getByRole('heading', { name: /comparison list/i });
    this.applicationParamsHeading = page.getByRole('heading', { name: /enter your application parameters/i });
    this.applicationsSubHeading = page.getByRole('heading', { name: /applications/i });
    this.systemSelectorText = page.getByText(/system selector & configurator/i);

    this.resetFiltersButton = page.getByRole('button', { name: /reset filters/i });
    this.elementTypePEM = page.getByRole('button', { name: /^PEM$/i });
    this.elementTypeSHEREX = page.getByRole('button', { name: /^SHEREX$/i });
    this.elementTypePROFIL = page.getByRole('button', { name: /^PROFIL$/i });
    this.elementTypeOther = page.getByRole('button', { name: /other fasteners/i });

    this.processMonitoringCheckbox = page.getByRole('checkbox', { name: /process monitoring required/i });
    this.robotIntegrationCheckbox = page.getByRole('checkbox', { name: /robot integration required/i });

    this.forceMinInput = page.getByLabel('Minimum (kN)');
    this.forceMaxInput = page.getByLabel('Maximum (kN)');
    this.forceMinRange = page.getByLabel('Minimum installation force');
    this.forceMaxRange = page.getByLabel('Maximum installation force');
    this.forceResetButton = page.getByRole('button', { name: /^reset$/i });
    this.forceAnyText = page.getByText(/^Any$/).first();

    this.matchingProductsContainer = page.locator('div').filter({ hasText: /matching product/ }).first();
    this.matchingCountNumber = page.locator('span.text-penn-900').first();

    this.filterChipRegion = page.getByText(/region:/i);
    this.filterChipElementTypes = page.getByText(/element types:/i);
    this.filterChipMaxThread = page.getByText(/max thread:/i);
    this.filterChipForce = page.getByText(/force:/i);
    this.compareSelectedChip = page.getByText(/compare selected:/i);

    this.setupNewApplicationButton = page.getByRole('button', { name: /setup new application/i });
    this.useExistingApplicationButton = page.getByRole('button', { name: /use existing application/i });
    this.optionBStatusText = page.getByText(/no application selected/i);

    this.solutionCheckboxA210 = page.getByRole('checkbox', { name: /^A210$/i });
    this.solutionCheckbox824eDrive = page.getByRole('checkbox', { name: /824 eDrive/i });
    this.solutionCheckboxA240CP = page.getByRole('checkbox', { name: /^A240-CP$/i });
    this.solutionCheckboxMDS100 = page.getByRole('checkbox', { name: /MDS A100/i });
    this.solutionCheckboxFullCustom = page.getByRole('checkbox', { name: /full custom solution/i });

    this.addNewApplicationButton = page.getByRole('button', { name: /^add new application$/i });
    this.addExistingApplicationButton = page.getByRole('button', { name: /^add existing application$/i });
    this.clearSelectionButton = page.getByRole('button', { name: 'Clear selection', exact: true });
    this.customizeAssumptionsButton = page.getByRole('button', { name: /customize assumptions/i });
    this.applicationsEmptyState = page.getByText(/no applications yet/i);

    this.comparisonEmptyState = page.getByText(/no solutions selected yet/i);

    this.totalAnnualVolume = page.getByText(/total annual volume/i);
    this.totalFastenersPerYear = page.getByText(/total fasteners \/ year/i);
    this.fastenersPerPart = page.getByText(/fasteners \/ part/i);
    this.elementTypesPerPart = page.getByText(/element types \/ part/i);
    this.partsPerYear = page.getByText(/parts \/ year/i);

    this.userMenuButton = page.locator('button').filter({ hasText: /David Wilson/i }).first();
    this.userName = page.getByText(/David Wilson/i);
    this.userRole = page.getByText(/Engineering/i);
    this.userAvatar = page.locator('.rounded-full.bg-penn-500').first();

    this.requestSupportButton = page.getByRole('button', { name: /request support/i });
    this.compareConfigureButton = page.getByRole('button', { name: /compare.*configure/i });
    this.configureSolutionButton = page.getByRole('button', { name: 'Configure Solution', exact: true });
    this.downloadCostAnalysisButton = page.getByRole('button', { name: /download cost analysis/i });
    this.generateROIReportButton = page.getByRole('button', { name: /generate.*roi report|roi report/i });

    this.categoryHandtools = page.getByText(/^Handtools$/i).first();
    this.categoryStandalone = page.getByText(/^Standalone Machines$/i).first();
    this.categoryRobotic = page.getByText(/^Robotic Integration$/i).first();
    this.categoryInDie = page.getByText(/^InDie$/i).first();
    this.categoryCustom = page.getByText(/^Custom$/i).first();

    this.brandLinkPemnet = page.getByRole('link', { name: /pemnet/i });
    this.brandLinkProfil = page.getByRole('link', { name: /profil-global/i });
    this.brandLinkHaeger = page.getByRole('link', { name: /haeger/i });
    this.brandLinkAutoriv = page.getByRole('link', { name: /autoriv/i });
    this.brandLinkSherex = page.getByRole('link', { name: /sherex/i });

    this.setupNewAppModal = page.getByRole('heading', { name: /new application|^edit:/i });
    this.editAppHeading = page.getByRole('heading', { name: /^edit:/i });
    this.appNameInput = page.locator('#app-name');
    this.appNumberInput = page.locator('#app-number');
    this.appOemInput = page.locator('#app-oem');
    this.appProgramInput = page.locator('#app-program');
    this.appVolumeInput = page.locator('#app-volume');
    this.appBatchSizeInput = page.locator('#app-batch-size');
    this.appMaterialInput = page.locator('#app-material');
    this.saveButton = page.getByRole('button', { name: /^save$/i });
    this.cancelButton = page.getByRole('button', { name: /^cancel$/i });
    this.modalCloseButton = page.getByLabel('Close');
    this.addFastenerButton = page.getByRole('button', { name: /add fastener/i });
    this.fastenerBrandInput = page.locator('#react-select-5-input');
    this.fastenerTypeInput = page.locator('input[placeholder="Start typing (e.g., SS / A4 / CLS ...)"]').last();
    this.fastenerQtyAInput = page.locator('input[name$=".qtyPerPartA"]').last();
    this.fastenerQtyBInput = page.locator('input[name$=".qtyPerPartB"]').last();

    this.resetApplicationButton = page.getByRole('button', { name: /reset application/i });
    this.optionBSelectedText = page.getByText(/^selected:/i);
    this.editAppButton = page.getByRole('button', { name: /^edit$/i });
    this.removeAppButton = page.getByRole('button', { name: /^remove$/i });

    this.useExistingModal = page.getByRole('heading', { name: /my applications/i });
    this.selectAllButton = page.getByRole('button', { name: /select all/i });
    this.refreshButton = page.getByRole('button', { name: /refresh/i });
    this.closeModalButton = page.getByRole('button', { name: /^close$/i }).and(page.locator('button:not([aria-label])'));
    this.okButton = page.getByRole('button', { name: /^ok$/i }).and(page.locator('button:not([aria-label])'));
    this.newAppFromModalButton = page.getByRole('button', { name: /^new application$/i });
    this.existingAppTable = page.locator('table');
    this.existingAppRows = page.locator('table tbody tr');
    this.existingAppRowCheckboxes = page.locator('table tbody tr td input[type="checkbox"]');
  }

  async goto() {
    await this.page.goto('https://testweb.configurator.dev.pemnet.ai/installation-system', { waitUntil: 'load', timeout: 90000 });
    return this;
  }

  /** Click the "Compare / Configure Solutions" button to open comparison cards */
  async clickCompareConfigureSolutions() {
    await this.compareConfigureButton.click();
    await this.page.waitForTimeout(1000);
    return this;
  }

  /** Click "Configure Solution" on a specific solution card to open the configuration panel */
  async clickConfigureSolution() {
    await this.configureSolutionButton.first().click();
    await this.page.waitForTimeout(1500);
    return this;
  }

  async clickElementType(name) {
    const btn = this.page.getByRole('button', { name: new RegExp(`^${name}$`, 'i') });
    await btn.click();
    return this;
  }

  async checkCapability(name) {
    const cb = this.page.getByRole('checkbox', { name: new RegExp(name, 'i') });
    await cb.check();
    return this;
  }

  async uncheckCapability(name) {
    const cb = this.page.getByRole('checkbox', { name: new RegExp(name, 'i') });
    await cb.uncheck();
    return this;
  }

  async setForceMin(value) {
    await this.forceMinInput.fill(value.toString());
    await this.page.keyboard.press('Tab');
    await this.page.waitForTimeout(500);
    return this;
  }

  async setForceMax(value) {
    await this.forceMaxInput.fill(value.toString());
    await this.page.keyboard.press('Tab');
    await this.page.waitForTimeout(500);
    return this;
  }

  async clickResetFilters() {
    await this.resetFiltersButton.click();
    return this;
  }

  async clickResetApplication() {
    await this.resetApplicationButton.click();
    return this;
  }

  async clickForceReset() {
    await this.forceResetButton.click();
    return this;
  }

  async checkSolution(name) {
    const cb = this.page.getByRole('checkbox', { name: new RegExp(name, 'i') });
    await cb.check({ timeout: 15000 });
    return this;
  }

  async uncheckSolution(name) {
    const cb = this.page.getByRole('checkbox', { name: new RegExp(name, 'i') });
    await cb.uncheck({ timeout: 15000 });
    return this;
  }

  async getMatchingProductCount() {
    await this.page.waitForFunction(() => {
      const spans = document.querySelectorAll('span');
      for (const span of spans) {
        if (span.textContent.includes('matching product')) {
          const prev = span.previousElementSibling;
          return prev && prev.textContent && prev.textContent.trim() !== '0';
        }
      }
      return false;
    }, { timeout: 15000 }).catch(() => {});

    const matchSpan = this.page.locator('span').filter({ hasText: 'matching product(s)' }).first();
    const exists = await matchSpan.count();
    if (!exists) return 0;

    const info = await matchSpan.evaluate(el => {
      const prev = el.previousElementSibling;
      return { prevText: prev ? prev.textContent : null };
    });

    const count = parseInt(info.prevText?.trim(), 10);
    return isNaN(count) ? 0 : count;
  }

  async getCompareSelectedCount() {
    const text = await this.compareSelectedChip.textContent();
    const match = text.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async clickSetupNewApplication() {
    await this.setupNewApplicationButton.click();
    await this.page.locator('[role="dialog"]').waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    return this;
  }

  async clickUseExistingApplication() {
    await this.useExistingApplicationButton.click();
    return this;
  }

  async clickAddNewApplication() {
    await this.addNewApplicationButton.click();
    return this;
  }

  async clickAddExistingApplication() {
    await this.addExistingApplicationButton.click();
    return this;
  }

  async getUserName() {
    return this.userName.textContent();
  }

  async getUserRole() {
    return this.userRole.textContent();
  }

  /** Fill the Setup New Application form with provided values */
  async fillNewApplicationForm(data) {
    if (data.name) await this.appNameInput.fill(data.name);
    if (data.appNumber) await this.appNumberInput.fill(data.appNumber);
    if (data.oem) await this.appOemInput.fill(data.oem);
    if (data.program) await this.appProgramInput.fill(data.program);
    if (data.volume !== undefined) await this.appVolumeInput.fill(data.volume.toString());
    if (data.batchSize !== undefined) await this.appBatchSizeInput.fill(data.batchSize.toString());
    if (data.material) await this.appMaterialInput.fill(data.material);
    return this;
  }

  /** Click Save in the new application modal */
  async clickSave() {
    await this.saveButton.click();
    return this;
  }

  /** Click Cancel in the modal */
  async clickCancel() {
    await this.cancelButton.click();
    return this;
  }

  /** Click Clear selection to remove all apps from params section */
  async clickClearSelection() {
    await this.clearSelectionButton.click();
    return this;
  }

  /** Close the modal via × button */
  async clickModalClose() {
    await this.modalCloseButton.click();
    return this;
  }

  /** Add a fastener entry in the new application form */
  async addFastener(fastener) {
    if (fastener.brand) {
      await this.fastenerBrandInput.fill(fastener.brand);
      await this.fastenerBrandInput.press('Enter');
    }
    if (fastener.type) {
      await this.fastenerTypeInput.fill(fastener.type);
      await this.page.waitForTimeout(500);
      const option = this.page.locator('[role="option"], [class*="option"], [class*="suggestion"], [class*="dropdown"]').first();
      if (await option.isVisible().catch(() => false)) {
        await option.click();
      }
    }
    if (fastener.qtyA !== undefined) await this.fastenerQtyAInput.fill(fastener.qtyA.toString());
    if (fastener.qtyB !== undefined) await this.fastenerQtyBInput.fill(fastener.qtyB.toString());
    await this.addFastenerButton.click();
    return this;
  }

  /** Complete the full Setup New Application flow: fill form and save */
  async setupNewApplication(data) {
    await this.clickSetupNewApplication();
    await this.page.waitForTimeout(500);
    await this.fillNewApplicationForm(data);
    await this.clickSave();
    try {
      await this.removeAppButton.first().waitFor({ state: 'visible', timeout: 10000 });
    } catch {
      // App card may not appear if validation prevented save; that's ok
    }
    return this;
  }

  /** Click Reset Application to deselect current app without deleting it */
  async clickResetApplication() {
    await this.resetApplicationButton.click();
    return this;
  }

  /** Click Edit on the current app card */
  async clickEditApp() {
    await this.editAppButton.click();
    return this;
  }

  /** Click Remove on the current app card */
  async clickRemoveApp() {
    await this.removeAppButton.click();
    return this;
  }

  /** Check if the new application modal is open */
  async isNewApplicationModalVisible() {
    return this.appNameInput.isVisible();
  }

  /** Check if the use existing modal is open */
  async isUseExistingModalVisible() {
    return this.useExistingModal.isVisible();
  }

  /** Click Select all in the Use Existing modal */
  async clickSelectAll() {
    await this.selectAllButton.click();
    return this;
  }

  /** Click Refresh in the Use Existing modal */
  async clickRefresh() {
    await this.refreshButton.click();
    return this;
  }

  /** Click Close (text button) in the Use Existing modal */
  async clickCloseModal() {
    await this.closeModalButton.click();
    return this;
  }

  /** Click OK in the Use Existing modal */
  async clickOk() {
    await this.okButton.click();
    return this;
  }

  /** Click New application button within the Use Existing modal */
  async clickNewAppFromModal() {
    await this.newAppFromModalButton.click();
    return this;
  }

  /** Check an application row by index (0-based) in the existing apps table */
  async selectExistingAppByIndex(index = 0) {
    const checkbox = this.existingAppRowCheckboxes.nth(index);
    await checkbox.check();
    return this;
  }

  /** Click Edit on an existing app row by index */
  async clickEditExistingAppRow(index = 0) {
    const row = this.existingAppRows.nth(index);
    await row.getByRole('button', { name: /^edit$/i }).click();
    return this;
  }

  /** Click Delete on an existing app row by index */
  async clickDeleteExistingAppRow(index = 0) {
    const row = this.existingAppRows.nth(index);
    await row.getByRole('button', { name: /^delete$/i }).click();
    return this;
  }

  /** Get the application card's displayed name */
  async getAppCardName() {
    const card = this.page.locator('div').filter({ has: this.removeAppButton }).first();
    return (await card.textContent()).split('App No.')[0].trim();
  }

  /** Get the number of application cards visible */
  async getAppCardCount() {
    return await this.removeAppButton.count();
  }

  /** Get the text of the Option B selected status (e.g., "Selected: My App") */
  async getSelectedAppText() {
    if (await this.optionBSelectedText.isVisible().catch(() => false)) {
      return this.optionBSelectedText.textContent();
    }
    return null;
  }

  /** Get the total annual volume displayed value */
  async getTotalAnnualVolumeValue() {
    const label = this.page.getByText(/^total annual volume$/i);
    const parent = label.locator('..');
    const valueText = parent.locator('p').nth(1);
    return valueText.textContent();
  }

  /** Check if no application is selected */
  async isNoApplicationSelected() {
    return this.optionBStatusText.isVisible().catch(() => false);
  }

  /** Get the applications count text (e.g., "Applications (2)") */
  async getApplicationsHeadingText() {
    return this.applicationsSubHeading.textContent();
  }

  /** Get all text content from the first app card */
  async getAppCardText() {
    const card = this.page.locator('div').filter({ has: this.removeAppButton }).first();
    return card.textContent();
  }
}
