import { BasePage } from '../base/BasePage.js';

export class AdminResponsibilityMapPage extends BasePage {
  constructor(page) {
    super(page);

    this.pageHeading = page.getByRole('heading', { name: /dataset: responsibility map/i });
    this.pageDescription = page.getByText(/record-level editor for mappings/i);
    this.addMappingButton = page.getByRole('button', { name: /add mapping/i });

    this.table = page.locator('table');
    this.tableRows = page.locator('table tbody tr');
    this.tableHeadings = page.locator('table thead th');

    this.viewButton = page.getByRole('button', { name: /^view$/i });
    this.editButton = page.getByRole('button', { name: /^edit$/i });
    this.deleteButton = page.getByRole('button', { name: /^delete$/i });

    this.recordCount = page.getByText(/records?$/i);
  }

  /** Navigate to the responsibility map page */
  async goto() {
    await this.navigate('/datasets/responsibility-map');
    return this;
  }

  /** Click "Add mapping" button */
  async clickAddMapping() {
    await this.addMappingButton.click();
    return this;
  }

  /** Click View on a specific row by index (0-based) */
  async clickViewRow(index = 0) {
    const row = this.tableRows.nth(index);
    await row.getByRole('button', { name: /view/i }).click();
    return this;
  }

  /** Click Edit on a specific row by index (0-based) */
  async clickEditRow(index = 0) {
    const row = this.tableRows.nth(index);
    await row.getByRole('button', { name: /edit/i }).click();
    return this;
  }

  /** Click Delete on a specific row by index (0-based) */
  async clickDeleteRow(index = 0) {
    const row = this.tableRows.nth(index);
    await row.getByRole('button', { name: /delete/i }).click();
    return this;
  }

  /** Get the responsibility name from a specific row */
  async getResponsibilityName(index = 0) {
    const row = this.tableRows.nth(index);
    return row.locator('td').nth(0).textContent();
  }

  /** Get the region from a specific row */
  async getRegion(index = 0) {
    const row = this.tableRows.nth(index);
    return row.locator('td').nth(1).textContent();
  }

  /** Get sales emails from a specific row */
  async getSalesEmails(index = 0) {
    const row = this.tableRows.nth(index);
    const cells = await row.locator('td').all();
    if (cells.length > 2) {
      const text = await cells[2].innerText();
      return text || '';
    }
    const allText = await row.innerText();
    return allText || '';
  }

  /** Get engineering emails from a specific row */
  async getEngineeringEmails(index = 0) {
    const row = this.tableRows.nth(index);
    const cells = await row.locator('td').all();
    if (cells.length > 3) {
      const text = await cells[3].innerText();
      return text || '';
    }
    const allText = await row.innerText();
    return allText || '';
  }

  /** Get the total number of table rows visible */
  async getRowCount() {
    return this.tableRows.count();
  }

  /** Get the record count text (e.g. "15 records") */
  async getRecordCountText() {
    try {
      return await this.recordCount.textContent();
    } catch {
      return '0 records';
    }
  }
}
