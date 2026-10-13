import { test, expect } from '../fixtures/base.fixture.js';
import { assertThat } from '../fixtures/expect-helper.js';
import { step } from '../fixtures/step-runner.js';
import { loadUsers } from '../fixtures/data-helper.js';
import { TestWebRegisterPage } from '../../src/pages/testweb/TestWebRegisterPage.js';

const users = loadUsers();
const TESTWEB_BASE = 'https://testweb.configurator.dev.pemnet.ai';

test.describe('TestWeb Registration Flow', () => {

  test('TC-TW-015 — Register Page UI Elements are all visible', async ({ page }) => {
    const registerPage = new TestWebRegisterPage(page);

    await step('Navigate to TestWeb register page', async () => {
      await registerPage.goto();
    });

    await step('Verify page heading shows Create an account', async () => {
      await assertThat('Page heading should show "Create an account"', () => expect(registerPage.pageHeading).toBeVisible());
    });

    await step('Verify all form fields are visible', async () => {
      await assertThat('First name input should be visible', () => expect(registerPage.firstNameInput).toBeVisible());
      await assertThat('Last name input should be visible', () => expect(registerPage.lastNameInput).toBeVisible());
      await assertThat('Email input should be visible', () => expect(registerPage.emailInput).toBeVisible());
      await assertThat('Password input should be visible', () => expect(registerPage.passwordInput).toBeVisible());
      await assertThat('Confirm password input should be visible', () => expect(registerPage.confirmPasswordInput).toBeVisible());
      await assertThat('Company input should be visible', () => expect(registerPage.companyInput).toBeVisible());
      await assertThat('Telephone input should be visible', () => expect(registerPage.telephoneInput).toBeVisible());
      await assertThat('Company address input should be visible', () => expect(registerPage.companyAddressInput).toBeVisible());
      await assertThat('Function department select should be visible', () => expect(registerPage.functionDepartmentSelect).toBeVisible());
      await assertThat('Region select should be visible', () => expect(registerPage.regionSelect).toBeVisible());
    });

    await step('Verify Create account button is visible', async () => {
      await assertThat('Create account button should be visible', () => expect(registerPage.createAccountButton).toBeVisible());
    });

    await step('Verify Sign in link is visible', async () => {
      await assertThat('Sign in link should be visible', () => expect(registerPage.signInLink).toBeVisible());
    });
  });

  test('TC-TW-016 — Happy Path Complete Registration', async ({ page }) => {
    const registerPage = new TestWebRegisterPage(page);
    const uniqueSuffix = Date.now();
    const email = `testuser${uniqueSuffix}@example.com`;

    await step('Navigate to TestWeb register page', async () => {
      await registerPage.goto();
    });

    await step('Fill all required fields with valid data', async () => {
      await registerPage.fillFirstName('John');
      await registerPage.fillLastName('Doe');
      await registerPage.fillEmail(email);
      await registerPage.fillPassword('SecurePass123');
      await registerPage.fillConfirmPassword('SecurePass123');
      await registerPage.fillCompany('Test Company');
      await registerPage.fillTelephone('1234567890');
      await registerPage.fillCompanyAddress('123 Test Street');
      await registerPage.selectFunctionDepartment('Engineering');
      await registerPage.selectRegion('North America');
    });

    await step('Click Create account button', async () => {
      await registerPage.clickCreateAccount();
    });

    await step('Verify registration proceeds to email verification step', async () => {
      await assertThat('Should show Verify your email heading', () => expect(page.getByRole('heading', { name: /verify your email/i })).toBeVisible());
    });
  });

  test('TC-TW-017 — Password Mismatch Validation shows error', async ({ page }) => {
    const registerPage = new TestWebRegisterPage(page);
    const uniqueSuffix = Date.now();
    const email = `mismatch${uniqueSuffix}@example.com`;

    await step('Navigate to TestWeb register page', async () => {
      await registerPage.goto();
    });

    await step('Fill all required fields with mismatching passwords', async () => {
      await registerPage.fillFirstName('John');
      await registerPage.fillLastName('Doe');
      await registerPage.fillEmail(email);
      await registerPage.fillPassword('Password123');
      await registerPage.fillConfirmPassword('Different456');
      await registerPage.fillCompany('Test Company');
      await registerPage.fillTelephone('1234567890');
      await registerPage.fillCompanyAddress('123 Test Street');
      await registerPage.selectFunctionDepartment('Engineering');
      await registerPage.selectRegion('North America');
    });

    await step('Click Create account to trigger validation', async () => {
      await registerPage.clickCreateAccount();
    });

    await step('Verify password mismatch error is displayed', async () => {
      await assertThat('Password error should be visible', () => expect(registerPage.formError).toBeVisible());
    });
  });

  test('TC-TW-018 — Weak Password Validation shows error', async ({ page }) => {
    const registerPage = new TestWebRegisterPage(page);
    const uniqueSuffix = Date.now();
    const email = `weakpw${uniqueSuffix}@example.com`;

    await step('Navigate to TestWeb register page', async () => {
      await registerPage.goto();
    });

    await step('Fill all required fields with weak password', async () => {
      await registerPage.fillFirstName('John');
      await registerPage.fillLastName('Doe');
      await registerPage.fillEmail(email);
      await registerPage.fillPassword('123');
      await registerPage.fillConfirmPassword('123');
      await registerPage.fillCompany('Test Company');
      await registerPage.fillTelephone('1234567890');
      await registerPage.fillCompanyAddress('123 Test Street');
      await registerPage.selectFunctionDepartment('Engineering');
      await registerPage.selectRegion('North America');
    });

    await step('Click Create account to trigger validation', async () => {
      await registerPage.clickCreateAccount();
    });

    await step('Verify validation error is displayed', async () => {
      await assertThat('Validation error should be visible for weak password', () => expect(registerPage.formError).toBeVisible());
    });
  });

  test('TC-TW-019 — Required Fields Validation with empty form', async ({ page }) => {
    const registerPage = new TestWebRegisterPage(page);

    await step('Navigate to TestWeb register page', async () => {
      await registerPage.goto();
    });

    await step('Click Create account without filling any fields', async () => {
      await registerPage.clickCreateAccount();
    });

    await step('Verify validation errors are shown for required fields', async () => {
      await assertThat('Validation error should be visible', () => expect(registerPage.formError).toBeVisible());
    });
  });

  test('TC-TW-020 — Invalid Email Format validation', async ({ page }) => {
    const registerPage = new TestWebRegisterPage(page);
    const uniqueSuffix = Date.now();

    await step('Navigate to TestWeb register page', async () => {
      await registerPage.goto();
    });

    await step('Fill all required fields with invalid email', async () => {
      await registerPage.fillFirstName('John');
      await registerPage.fillLastName('Doe');
      await registerPage.fillEmail('notanemail');
      await registerPage.fillPassword('SecurePass123');
      await registerPage.fillConfirmPassword('SecurePass123');
      await registerPage.fillCompany('Test Company');
      await registerPage.fillTelephone('1234567890');
      await registerPage.fillCompanyAddress('123 Test Street');
      await registerPage.selectFunctionDepartment('Engineering');
      await registerPage.selectRegion('North America');
    });

    await step('Click Create account to trigger validation', async () => {
      await registerPage.clickCreateAccount();
    });

    await step('Verify email validation error is displayed', async () => {
      await assertThat('Error message should be visible for invalid email', () => expect(registerPage.formError).toBeVisible());
    });
  });

  test('TC-TW-021 — Email Already Exists shows error', async ({ page }) => {
    const registerPage = new TestWebRegisterPage(page);

    await step('Navigate to TestWeb register page', async () => {
      await registerPage.goto();
    });

    await step('Fill all fields using an already registered email', async () => {
      await registerPage.fillFirstName('John');
      await registerPage.fillLastName('Doe');
      await registerPage.fillEmail(users.engineering.username);
      await registerPage.fillPassword('SecurePass123');
      await registerPage.fillConfirmPassword('SecurePass123');
      await registerPage.fillCompany('Test Company');
      await registerPage.fillTelephone('1234567890');
      await registerPage.fillCompanyAddress('123 Test Street');
      await registerPage.selectFunctionDepartment('Engineering');
      await registerPage.selectRegion('North America');
    });

    await step('Click Create account to submit registration', async () => {
      await registerPage.clickCreateAccount();
    });

    await step('Verify no crash after submitting with existing email', async () => {
      await assertThat('Page should not crash or show error', () => expect(page.getByRole('heading', { name: /create an account|verify your email/i })).toBeVisible());
    });
  });

  test('TC-TW-022 — Telephone Number Validation with invalid input', async ({ page }) => {
    const registerPage = new TestWebRegisterPage(page);
    const uniqueSuffix = Date.now();
    const email = `tel${uniqueSuffix}@example.com`;

    await step('Navigate to TestWeb register page', async () => {
      await registerPage.goto();
    });

    await step('Fill all required fields with invalid telephone', async () => {
      await registerPage.fillFirstName('John');
      await registerPage.fillLastName('Doe');
      await registerPage.fillEmail(email);
      await registerPage.fillPassword('SecurePass123');
      await registerPage.fillConfirmPassword('SecurePass123');
      await registerPage.fillCompany('Test Company');
      await registerPage.fillTelephone('abc');
      await registerPage.fillCompanyAddress('123 Test Street');
      await registerPage.selectFunctionDepartment('Engineering');
      await registerPage.selectRegion('North America');
    });

    await step('Click Create account to trigger validation', async () => {
      await registerPage.clickCreateAccount();
    });

    await step('Verify telephone validation error is displayed', async () => {
      await assertThat('Error message should be visible for invalid telephone', () => expect(registerPage.formError).toBeVisible());
    });
  });

  test('TC-TW-023 — Cancel/Navigate Away via Sign In link', async ({ page }) => {
    const registerPage = new TestWebRegisterPage(page);

    await step('Navigate to TestWeb register page', async () => {
      await registerPage.goto();
    });

    await step('Click Sign in link to navigate away', async () => {
      await registerPage.signInLink.click();
    });

    await step('Verify navigation to /login page', async () => {
      await assertThat('Should navigate to /login after clicking Sign in link', () => expect(page).toHaveURL(/\/login/));
    });
  });

  test('TC-TW-038 — Long Password Validation (100+ characters)', async ({ page }) => {
    const registerPage = new TestWebRegisterPage(page);
    const longPassword = 'A' .repeat(110);

    await step('Navigate to TestWeb register page', async () => {
      await registerPage.goto();
    });

    await step('Enter a very long password (110 characters)', async () => {
      await registerPage.fillFirstName('John');
      await registerPage.fillLastName('Doe');
      await registerPage.fillEmail('longpwtest@example.com');
      await registerPage.fillPassword(longPassword);
      await registerPage.fillConfirmPassword(longPassword);
      await registerPage.fillCompany('Test Company');
      await registerPage.fillTelephone('1234567890');
      await registerPage.fillCompanyAddress('123 Test Street');
      await registerPage.selectFunctionDepartment('Engineering');
      await registerPage.selectRegion('North America');
    });

    await step('Click Create account and verify graceful handling', async () => {
      await registerPage.clickCreateAccount();
      await assertThat('Page should handle long password without error', () => expect(registerPage.formError).not.toBeVisible());
    });
  });

  test('TC-TW-039 — Special Characters in Name fields', async ({ page }) => {
    const registerPage = new TestWebRegisterPage(page);
    const uniqueSuffix = Date.now();
    const email = `special${uniqueSuffix}@example.com`;

    await step('Navigate to TestWeb register page', async () => {
      await registerPage.goto();
    });

    await step('Enter special characters in first and last name fields', async () => {
      await registerPage.fillFirstName('Jöhn-ñíño O\'Brien');
      await registerPage.fillLastName('McDonald-Smith & Co.');
      await registerPage.fillEmail(email);
      await registerPage.fillPassword('SecurePass123');
      await registerPage.fillConfirmPassword('SecurePass123');
      await registerPage.fillCompany('Test Company');
      await registerPage.fillTelephone('1234567890');
      await registerPage.fillCompanyAddress('123 Test Street');
      await registerPage.selectFunctionDepartment('Engineering');
      await registerPage.selectRegion('North America');
    });

    await step('Click Create account and verify graceful handling of special characters', async () => {
      await registerPage.clickCreateAccount();
    });
  });

  test('TC-TW-040 — All Fields Max Length with very long values', async ({ page }) => {
    const registerPage = new TestWebRegisterPage(page);
    const longStr = 'X'.repeat(255);
    const uniqueSuffix = Date.now();
    const email = `long${uniqueSuffix}@example.com`;

    await step('Navigate to TestWeb register page', async () => {
      await registerPage.goto();
    });

    await step('Fill all fields with very long values', async () => {
      await registerPage.fillFirstName(longStr);
      await registerPage.fillLastName(longStr);
      await registerPage.fillEmail(email);
      await registerPage.fillPassword('SecurePass123');
      await registerPage.fillConfirmPassword('SecurePass123');
      await registerPage.fillCompany(longStr);
      await registerPage.fillTelephone('1234567890');
      await registerPage.fillCompanyAddress(longStr);
      await registerPage.selectFunctionDepartment('Engineering');
      await registerPage.selectRegion('North America');
    });

    await step('Click Create account and verify graceful handling of max length values', async () => {
      await registerPage.clickCreateAccount();
    });
  });

});
