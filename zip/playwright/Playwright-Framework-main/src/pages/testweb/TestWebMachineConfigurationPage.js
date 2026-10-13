import { BasePage } from '../base/BasePage.js';

export class TestWebMachineConfigurationPage extends BasePage {
  constructor(page) {
    super(page);

    this.panelHeading = page.locator('div.text-xs:has-text("Configure solution")').first();
    this.panelCloseButton = page.getByRole('button', { name: 'Close' });
    this.filtersHeading = page.locator('div.text-xs.font-semibold:has-text("Filters")').first();
    this.fastenerGroupSelect = page.locator('label:has-text("Fastener group") + select');
    this.feederTracksSelect = page.locator('label:has-text("Feeder tracks") + select');
    this.forceRangeSelect = page.locator('label:has-text("Force") + select');
    this.filteredInfoText = page.getByText('Filtered by product, fastener group, feeder tracks, and force').first();

    this.machineOptionsHeading = page.getByText('Available machine options');
    this.machineSectionHeading = page.locator('div.text-xs.font-semibold.tracking-wide.uppercase:has-text("Machine")').first();
    this.optionsSectionHeading = page.locator('div.text-xs.font-semibold.tracking-wide.uppercase:has-text("Options")').first();
    this.customToolingSectionHeading = page.locator('div.text-sm.font-semibold:has-text("Custom Tooling")').first();
    this.customToolingCard = page.locator('section:has-text("Custom Tooling")').first();

    this.configSummaryHeading = page.getByText('Configuration summary');
    this.selectedOptionsTotal = page.getByText('Selected options total');
    this.downloadQuotationButton = page.getByRole('button', { name: 'Download quotation', exact: true });
    this.downloadWordButton = page.getByRole('button', { name: 'Download Word', exact: true });
    this.addManualLineItemButton = page.getByRole('button', { name: 'Add manual line item', exact: true });
    this.requestQuotationButton = page.getByRole('button', { name: 'Request Quotation / Support', exact: true });
  }

  /** Check if the configuration panel is open */
  async isPanelVisible() {
    return this.panelHeading.isVisible();
  }

  /** Close the configuration panel */
  async closePanel() {
    await this.panelCloseButton.click();
    return this;
  }

  /** Get the panel heading text */
  async getPanelHeadingText() {
    return this.panelHeading.textContent();
  }

  /** Select a fastener group filter option by value */
  async selectFastenerGroup(option) {
    await this.fastenerGroupSelect.selectOption(option);
    return this;
  }

  /** Select a feeder tracks filter option by value */
  async selectFeederTracks(option) {
    await this.feederTracksSelect.selectOption(option);
    return this;
  }

  /** Get the count of machine option cards visible in the Machine section */
  async getMachineOptionCount() {
    const cards = this.page.locator('label').filter({ has: this.page.locator('div:has-text("Product:")') });
    return cards.count();
  }

  /** Check if an option card is visible by its name text */
  async isMachineOptionVisible(optionName) {
    return this.page.locator('div.text-sm.font-semibold:has-text("' + optionName + '")').first().isVisible();
  }

  /** Get the selected options total price text */
  async getSelectedOptionsTotal() {
    if (await this.selectedOptionsTotal.isVisible().catch(() => false)) {
      return this.selectedOptionsTotal.textContent();
    }
    return null;
  }

  /** Check if the download quotation button is visible */
  async isDownloadQuotationVisible() {
    return this.downloadQuotationButton.isVisible();
  }

  /** Check if the download Word button is visible */
  async isDownloadWordVisible() {
    return this.downloadWordButton.isVisible();
  }

  /** Check if add manual line item is visible */
  async isAddManualLineItemVisible() {
    return this.addManualLineItemButton.isVisible();
  }

  /** Check if request quotation button is visible */
  async isRequestQuotationVisible() {
    return this.requestQuotationButton.isVisible();
  }

  /** Check if custom tooling section is visible */
  async isCustomToolingVisible() {
    return this.customToolingCard.isVisible();
  }
}
