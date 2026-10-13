import { BasePage } from '../base/BasePage.js';

export class TestWebForgotPasswordPage extends BasePage {
  constructor(page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: /forgot password/i });
    this.emailInput = page.locator('#email');
    this.sendOtpButton = page.getByRole('button', { name: /send otp/i });
    this.otpInput = page.locator('#otp');
    this.signInLink = page.getByRole('link', { name: /sign in/i });
    this.successMessage = page.getByText(/otp sent/i);
    this.errorMessage = page.getByRole('alert');
    this.description = page.getByText(/enter your registered email/i);
  }

  async goto() {
    await this.page.goto('https://testweb.configurator.dev.pemnet.ai/forget-password', { waitUntil: 'load', timeout: 30000 });
    return this;
  }

  async fillEmail(value) {
    await this.emailInput.fill(value);
    return this;
  }

  async clickSendOtp() {
    await this.sendOtpButton.click();
    return this;
  }

  async fillOtp(value) {
    await this.otpInput.fill(value);
    return this;
  }

  async requestOtp(email) {
    await this.fillEmail(email);
    await this.clickSendOtp();
    return this;
  }
}
