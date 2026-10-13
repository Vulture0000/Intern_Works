import { BasePage } from '../base/BasePage.js';

export class AdminSmtpPage extends BasePage {
  constructor(page) {
    super(page);

    this.pageHeading = page.getByRole('heading', { name: /^smtp$/i });
    this.pageDescription = page.getByText(/configure task notification emails/i);

    this.reloadButton = page.getByRole('button', { name: /reload/i });
    this.sendTestButton = page.getByRole('button', { name: /send test/i });
    this.saveButton = page.getByRole('button', { name: /^save$/i });

    this.fromEmailInput = page.getByRole('textbox', { name: /from email/i });
    this.fromNameInput = page.getByRole('textbox', { name: /from name/i });
    this.testRecipientInput = page.getByRole('textbox', { name: /test recipient/i });

    this.enabledCheckbox = page.getByRole('checkbox', { name: /enabled/i });
    this.relayUrlInput = page.getByRole('textbox', { name: /relay url/i });
    this.relayRegionInput = page.getByRole('textbox', { name: /relay region/i });
  }

  /** Navigate to the SMTP settings page */
  async goto() {
    await this.navigate('/smtp');
    return this;
  }

  /** Fill the From Email field */
  async fillFromEmail(value) {
    await this.fromEmailInput.fill(value);
    return this;
  }

  /** Fill the From Name field */
  async fillFromName(value) {
    await this.fromNameInput.fill(value);
    return this;
  }

  /** Fill the Test Recipient field */
  async fillTestRecipient(value) {
    await this.testRecipientInput.fill(value);
    return this;
  }

  /** Click Reload */
  async clickReload() {
    await this.reloadButton.click();
    return this;
  }

  /** Click Send Test */
  async clickSendTest() {
    await this.sendTestButton.click();
    return this;
  }

  /** Click Save */
  async clickSave() {
    await this.saveButton.click();
    return this;
  }
}
