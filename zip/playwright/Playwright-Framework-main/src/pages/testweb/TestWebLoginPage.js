import { BasePage } from '../base/BasePage.js';

export class TestWebLoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.emailInput = page.getByRole('textbox', { name: /email/i });
    this.passwordInput = page.getByRole('textbox', { name: /password/i });
    this.signInButton = page.locator('form').getByRole('button', { name: /sign in/i });
    this.passwordInsteadButton = page.getByRole('button', { name: /sign in with a password instead/i });
    this.sendCodeButton = page.getByRole('button', { name: /send code/i });
    this.errorMessage = page.getByRole('alert');
  }

  /** Navigate to the test web login page */
  async goto() {
    await this.page.goto('https://testweb.configurator.dev.pemnet.ai/login', { waitUntil: 'load', timeout: 30000 });
    return this;
  }

  /** Fill the email field */
  async fillEmail(value) {
    await this.emailInput.fill(value);
    return this;
  }

  /** Fill the password field */
  async fillPassword(value) {
    await this.passwordInput.fill(value);
    return this;
  }

  /** Click Sign In */
  async clickSignIn() {
    await this.signInButton.click();
    return this;
  }

  /** Complete login flow: fill credentials and sign in */
  async login(email, password) {
    await this.fillEmail(email);
    await this.passwordInsteadButton.click();
    await this.fillPassword(password);
    await this.clickSignIn();
    return this;
  }

  /** Get the error message text after a failed login attempt */
  async getErrorText() {
    return this.errorMessage.textContent();
  }
}
