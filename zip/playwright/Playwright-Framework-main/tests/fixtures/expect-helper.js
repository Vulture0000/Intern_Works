import { expect as playwrightExpect } from '@playwright/test';

/**
 * Wraps a Playwright assertion with a human-readable prefix message.
 * When the assertion fails, the report shows:
 *
 *   ─── Sign in should redirect to /users ───
 *   Expected: URL to match /\/users/
 *   Received: https://admin.configurator.dev.pemnet.ai/login
 *
 * Usage:
 *   await assertThat("Sign in should redirect to /users", () => expect(page).toHaveURL(/\/users/));
 */
export async function assertThat(description, assertionFn) {
  try {
    await assertionFn();
  } catch (error) {
    const wrapped = new Error(`─── ${description} ───\n${error.message}`);
    wrapped.stack = error.stack;
    throw wrapped;
  }
}

export { playwrightExpect as expect };
