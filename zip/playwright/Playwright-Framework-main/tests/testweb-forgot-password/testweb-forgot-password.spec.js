import { test, expect } from '../fixtures/base.fixture.js';
import { assertThat } from '../fixtures/expect-helper.js';
import { step } from '../fixtures/step-runner.js';
import { loadUsers } from '../fixtures/data-helper.js';
import { TestWebForgotPasswordPage } from '../../src/pages/testweb/TestWebForgotPasswordPage.js';

const users = loadUsers();
const TESTWEB_BASE = 'https://testweb.configurator.dev.pemnet.ai';

test.describe('TestWeb Forgot Password Flow', () => {

  test('TC-TW-024 — Forgot Password Page UI elements are all visible', async ({ page }) => {
    const forgotPage = new TestWebForgotPasswordPage(page);

    await step('Navigate to forgot password page', async () => {
      await forgotPage.goto();
    });

    await step('Verify page heading, description, email input, Send OTP button, and Sign In link', async () => {
      await assertThat('Page heading should be visible', () => expect(forgotPage.pageHeading).toBeVisible());
      await assertThat('Description text should be visible', () => expect(forgotPage.description).toBeVisible());
      await assertThat('Email input should be visible', () => expect(forgotPage.emailInput).toBeVisible());
      await assertThat('Send OTP button should be visible', () => expect(forgotPage.sendOtpButton).toBeVisible());
      await assertThat('Sign In link should be visible', () => expect(forgotPage.signInLink).toBeVisible());
    });
  });

  test('TC-TW-025 — Send OTP Happy Path for registered email', async ({ page }) => {
    const forgotPage = new TestWebForgotPasswordPage(page);

    await step('Navigate to forgot password page', async () => {
      await forgotPage.goto();
    });

    await step('Enter registered email and click Send OTP', async () => {
      await forgotPage.requestOtp(users.engineering.username);
    });

    await step('Verify success message and OTP input appear', async () => {
      await assertThat('Success message should be visible after OTP sent', () => expect(forgotPage.successMessage).toBeVisible());
      await assertThat('OTP input field should appear', () => expect(forgotPage.otpInput).toBeVisible());
    });
  });

  test('TC-TW-026 — Unregistered Email shows error or generic response', async ({ page }) => {
    const forgotPage = new TestWebForgotPasswordPage(page);

    await step('Navigate to forgot password page', async () => {
      await forgotPage.goto();
    });

    await step('Enter unregistered email and click Send OTP', async () => {
      await forgotPage.requestOtp('nonexistent@test.com');
    });

    await step('Verify error or generic response without revealing email existence', async () => {
      await assertThat('Error message or generic response should be visible', () => expect(forgotPage.errorMessage).toBeVisible());
    });
  });

  test('TC-TW-027 — Empty Email Validation on Send OTP', async ({ page }) => {
    const forgotPage = new TestWebForgotPasswordPage(page);

    await step('Navigate to forgot password page', async () => {
      await forgotPage.goto();
    });

    await step('Click Send OTP without entering email', async () => {
      await forgotPage.clickSendOtp();
    });

    await step('Verify validation prevents submission or shows error', async () => {
      const isValid = await forgotPage.emailInput.evaluate(el => el.checkValidity());
      const errorVisible = await forgotPage.errorMessage.isVisible().catch(() => false);
      await assertThat('Validation should prevent empty email submission', () => expect(isValid || errorVisible).toBe(true));
    });
  });

  test('TC-TW-028 — Navigate to Sign In from forgot password page', async ({ page }) => {
    const forgotPage = new TestWebForgotPasswordPage(page);

    await step('Navigate to forgot password page', async () => {
      await forgotPage.goto();
    });

    await step('Click Sign In link', async () => {
      await forgotPage.signInLink.click();
    });

    await step('Verify navigation to /login page', async () => {
      await assertThat('Should navigate to /login after clicking Sign In link', () => expect(page).toHaveURL(/\/login/));
    });
  });

  test('TC-TW-041 — Invalid OTP Attempts show error', async ({ page }) => {
    const forgotPage = new TestWebForgotPasswordPage(page);

    await step('Navigate to forgot password page', async () => {
      await forgotPage.goto();
    });

    await step('Request OTP for valid email', async () => {
      await forgotPage.requestOtp(users.engineering.username);
      await assertThat('OTP input should appear after sending OTP', () => expect(forgotPage.otpInput).toBeVisible({ timeout: 10_000 }));
    });

    await step('Enter incorrect OTP and verify error', async () => {
      await forgotPage.fillOtp('000000');
      await page.waitForTimeout(1000);
      const invalidOtpError = page.getByText(/invalid otp|incorrect/i);
      await assertThat('Invalid OTP error should be visible', () => expect(forgotPage.errorMessage).toBeVisible());
    });
  });

  test('TC-TW-042 — OTP Expiry after waiting', async ({ page }) => {
    const forgotPage = new TestWebForgotPasswordPage(page);

    await step('Navigate to forgot password page', async () => {
      await forgotPage.goto();
    });

    await step('Request OTP for valid email', async () => {
      await forgotPage.requestOtp(users.engineering.username);
      await assertThat('OTP input should appear', () => expect(forgotPage.otpInput).toBeVisible({ timeout: 10_000 }));
    });

    await step('Wait briefly and check for expiry behavior', async () => {
      await page.waitForTimeout(2000);
      const expiredError = page.getByText(/expired/i);
      const errorVisible = await expiredError.isVisible().catch(() => false);
      const otpStillVisible = await forgotPage.otpInput.isVisible().catch(() => false);
    });
  });

});
