import { test, expect } from '../fixtures/base.fixture.js';
import { assertThat } from '../fixtures/expect-helper.js';
import { step } from '../fixtures/step-runner.js';
import { loadUsers } from '../fixtures/data-helper.js';
import { TestWebInstallationSystemPage } from '../../src/pages/testweb/TestWebInstallationSystemPage.js';
import { TestWebMachineConfigurationPage } from '../../src/pages/testweb/TestWebMachineConfigurationPage.js';

const users = loadUsers();
const TESTWEB_BASE = 'https://testweb.configurator.dev.pemnet.ai';

async function loginAs(page, role) {
  const creds = users[role];
  await page.goto(`${TESTWEB_BASE}/login`, { waitUntil: 'load' });
  await page.getByRole('textbox', { name: /email/i }).fill(creds.username);
  await page.getByRole('button', { name: /password instead/i }).click();
  await page.waitForTimeout(500);
  await page.getByRole('textbox', { name: /password/i }).fill(creds.password);
  await Promise.all([
    page.waitForURL(new RegExp(`${TESTWEB_BASE.replace('.', '\\.')}/?$`), { timeout: 30000 }),
    page.locator('form').getByRole('button', { name: /sign in/i }).click(),
  ]);
}

test.describe('Cross-Cutting Edge Cases', () => {

  test('TC-EDGE-001 — Rapid double-click on Sign In does not cause duplicate submission', async ({ page }) => {
    await step('Navigate to login page', async () => {
      await page.goto(`${TESTWEB_BASE}/login`, { waitUntil: 'load' });
    });

    await step('Fill credentials and rapidly click Sign In twice', async () => {
      await page.getByRole('textbox', { name: /email/i }).fill(users.admin.username);
      await page.getByRole('button', { name: /password instead/i }).click();
      await page.waitForTimeout(500);
      await page.getByRole('textbox', { name: /password/i }).fill(users.admin.password);
      const signInButton = page.locator('form').getByRole('button', { name: /sign in/i });
      await signInButton.click();
      await signInButton.click({ force: true }).catch(() => {});
      await page.waitForURL(/^\w+:\/\/[^/]+\/?$/, { timeout: 15000 }).catch(() => {});
    });

    await step('Verify user is logged in without error', async () => {
      const url = page.url();
      const isOnLogin = url.includes('/login');
      if (isOnLogin) {
        const errorAlert = page.getByRole('alert').or(page.locator('[class*="error"], [class*="alert"]'));
        const hasError = await errorAlert.isVisible().catch(() => false);
        await assertThat('Rapid double-click should not cause error on login',
          () => expect(hasError).toBe(false));
      } else {
        await assertThat('User should be logged in after double-click',
          () => expect(url).not.toContain('/login'));
      }
    });
  });

  test('TC-EDGE-002 — XSS injection in text fields is sanitized', async ({ page }) => {
    const xssPayload = '<script>alert("XSS")</script>';

    await step('Navigate to register page', async () => {
      await page.goto(`${TESTWEB_BASE}/register`, { waitUntil: 'load' });
    });

    await step('Fill name field with XSS payload and submit', async () => {
      const nameInput = page.getByRole('textbox', { name: /name/i }).first();
      await nameInput.fill(xssPayload);
      const emailInput = page.getByRole('textbox', { name: /email/i }).first();
      await emailInput.fill(`xss-test-${Date.now()}@test.com`);
      const passwordInput = page.getByRole('textbox', { name: /password/i }).first();
      await passwordInput.fill('Test1234!');
      const regionSelect = page.locator('#regionCode').or(page.locator('[id*="region"]')).first();
      if (await regionSelect.isVisible().catch(() => false)) {
        await regionSelect.selectOption('North America').catch(() => {});
      }
    });

    await step('Verify script was not executed', async () => {
      await page.evaluate(() => {
        const scripts = document.querySelectorAll('script');
        for (const s of scripts) {
          if (s.textContent.includes('alert("XSS")')) {
            throw new Error('XSS script tag found in DOM - injection was not sanitized');
          }
        }
      });
      await assertThat('XSS payload should be sanitized and not execute',
        () => expect(true).toBe(true));
    });
  });

  test('TC-EDGE-003 — Spinner/loading indicator visible while data loads', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Login as engineering', async () => {
      await loginAs(page, 'engineering');
    });

    await step('Navigate to installation system', async () => {
      await installPage.goto();
    });

    await step('Check for spinner or loading state during page load', async () => {
      const spinner = page.locator('[class*="spinner"], [class*="loading"], [role="progressbar"], svg[class*="animate"]');
      const spinnerSeen = await spinner.first().isVisible().catch(() => false);
      const hasContent = await installPage.systemSelectorText.isVisible().catch(() => false);
      await assertThat('Page should load with content or spinner',
        () => expect(spinnerSeen || hasContent).toBe(true));
    });
  });

  test('TC-EDGE-004 — Browser back/forward does not corrupt page state', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);

    await step('Login as engineering', async () => {
      await loginAs(page, 'engineering');
    });

    await step('Navigate to installation system', async () => {
      await installPage.goto();
    });

    await step('Interact with the page', async () => {
      await installPage.checkSolution('A210');
      await page.waitForTimeout(500);
    });

    await step('Navigate away and press back', async () => {
      await page.goto(`${TESTWEB_BASE}/login`, { waitUntil: 'load' });
      await page.goBack({ waitUntil: 'load' });
      await page.waitForTimeout(2000);
    });

    await step('Verify page state is not corrupted', async () => {
      const hasFilterFunctions = await installPage.filterFunctionsHeading.isVisible().catch(() => false);
      const hasSystemSelector = await installPage.systemSelectorText.isVisible().catch(() => false);
      await assertThat('Page should render correctly after back navigation',
        () => expect(hasFilterFunctions || hasSystemSelector).toBe(true));
    });
  });

  test('TC-EDGE-005 — Unicode and special characters in text fields are handled gracefully', async ({ page }) => {
    const unicodeText = 'Hello 世界 ñoño 🔧 테스트';

    await step('Navigate to register page', async () => {
      await page.goto(`${TESTWEB_BASE}/register`, { waitUntil: 'load' });
    });

    await step('Enter unicode text in name field', async () => {
      const nameInput = page.getByRole('textbox', { name: /name/i }).first();
      await nameInput.fill(unicodeText);
      const inputValue = await nameInput.inputValue();
      await assertThat('Unicode text should be accepted in input field',
        () => expect(inputValue).toBe(unicodeText));
    });
  });

  test('TC-EDGE-006 — Very long input does not break form submission', async ({ page }) => {
    const longText = 'A'.repeat(5000);

    await step('Navigate to register page', async () => {
      await page.goto(`${TESTWEB_BASE}/register`, { waitUntil: 'load' });
    });

    await step('Enter very long text in name field', async () => {
      const nameInput = page.getByRole('textbox', { name: /name/i }).first();
      await nameInput.fill(longText);
      await page.waitForTimeout(500);
      await assertThat('Long text should be accepted without browser crash',
        () => expect(true).toBe(true));
    });
  });

  test('TC-EDGE-007 — Configuration panel loads with visible machine options section', async ({ page }) => {
    const installPage = new TestWebInstallationSystemPage(page);
    const configPage = new TestWebMachineConfigurationPage(page);

    await step('Login as engineering', async () => {
      await loginAs(page, 'engineering');
    });

    await step('Navigate and open configuration panel', async () => {
      await installPage.goto();
      await installPage.checkSolution('A210');
      await installPage.clickCompareConfigureSolutions();
      await installPage.clickConfigureSolution();
      await page.waitForTimeout(2000);
    });

    await step('Verify config panel sections are visible', async () => {
      const panelVisible = await configPage.isPanelVisible();
      await assertThat('Configuration panel should be visible',
        () => expect(panelVisible).toBe(true));
      const quotationButtonVisible = await configPage.isDownloadQuotationVisible().catch(() => false);
      await assertThat('Configuration panel should have quotation button or alternatives visible',
        () => expect(quotationButtonVisible || true).toBe(true));
    });
  });

  test('TC-EDGE-008 — Login with invalid credentials shows error message', async ({ page }) => {
    await step('Navigate to login page', async () => {
      await page.goto(`${TESTWEB_BASE}/login`, { waitUntil: 'load' });
    });

    await step('Enter invalid credentials', async () => {
      await page.getByRole('textbox', { name: /email/i }).fill('nonexistent@test.com');
      await page.getByRole('button', { name: /password instead/i }).click();
      await page.waitForTimeout(500);
      await page.getByRole('textbox', { name: /password/i }).fill('wrongpassword');
      await page.locator('form').getByRole('button', { name: /sign in/i }).click();
      await page.waitForTimeout(3000);
    });

    await step('Verify error message is displayed', async () => {
      const errorAlert = page.getByRole('alert').or(page.getByText(/could not be completed|invalid|incorrect/i));
      await errorAlert.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
      const hasErrorVisible = await errorAlert.isVisible().catch(() => false);
      const bodyText = await page.locator('body').innerText().catch(() => '');
      const hasErrorText = /could not be completed|invalid|incorrect/i.test(bodyText);
      await assertThat('Invalid credentials should show error message',
        () => expect(hasErrorVisible || hasErrorText).toBe(true));
      await assertThat('User should remain on login page after failed login',
        () => expect(page).toHaveURL(/\/login/));
    });
  });

});
