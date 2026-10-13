import { BasePage } from '../base/BasePage.js';

export class AdminLoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.emailInput = page.getByRole('textbox', { name: /email address/i });
    this.passwordInput = page.getByRole('textbox', { name: /password/i });
    this.signInButton = page.getByRole('button', { name: /^sign in$/i }).or(page.locator('button:has-text("Sign In")')).first();
    this.passwordInsteadButton = page.getByRole('button', { name: /sign in with a password instead/i });
    this.sendCodeButton = page.getByRole('button', { name: /send code/i });
    this.errorMessage = page.getByRole('alert');
    this.heading = page.getByRole('heading', { name: /sign in/i });
  }

  /** Navigate to the admin login page */
  async goto() {
    await this.navigate('/login');
    return this;
  }

  /** Fill the email address field */
  async fillEmail(value) {
    await this.emailInput.fill(value);
    return this;
  }

  /** Fill the password field */
  async fillPassword(value) {
    await this.passwordInput.fill(value);
    return this;
  }

  /** Click the Sign In button */
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

  /** Get the error message text displayed after a failed login attempt */
  async getErrorText() {
    return this.errorMessage.textContent();
  }

  /** Check if the error message is visible */
  async isErrorVisible() {
    return this.errorMessage.isVisible();
  }
}
