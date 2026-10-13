import { test } from '@playwright/test';

const SEPARATOR = '─'.repeat(60);

/**
 * Wraps test.step() with console logging, timing, and structured output.
 * Every step name is printed before execution and its result + duration after.
 *
 * Usage:
 *   import { step } from '../fixtures/step-runner.js';
 *   await step('Navigate to login page', async () => {
 *     await loginPage.goto();
 *   });
 */
export async function step(name, callback) {
  const start = Date.now();
  const timestamp = new Date().toLocaleTimeString();

  console.log(`\n  ${SEPARATOR}`);
  console.log(`  ▶ [${timestamp}] ${name}`);

  try {
    await test.step(name, callback);
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    console.log(`  ✅ ${name} (${elapsed}s)`);
  } catch (error) {
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    console.log(`  ❌ ${name} (${elapsed}s) — FAILED`);
    throw error;
  }
}
