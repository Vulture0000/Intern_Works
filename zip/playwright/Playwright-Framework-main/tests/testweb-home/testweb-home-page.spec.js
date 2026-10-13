import { test, expect } from '../fixtures/base.fixture.js';
import { assertThat } from '../fixtures/expect-helper.js';
import { step } from '../fixtures/step-runner.js';
import { loadUsers } from '../fixtures/data-helper.js';
import { TestWebHomePage } from '../../src/pages/testweb/TestWebHomePage.js';

const users = loadUsers();
const TESTWEB_BASE = 'https://testweb.configurator.dev.pemnet.ai';

test.describe('TestWeb Home Page', () => {

  test('TC-TW-032 — Brand Links are visible and have correct href attributes', async ({ page }) => {
    const homePage = new TestWebHomePage(page);

    await step('Navigate to TestWeb home page', async () => {
      await homePage.goto();
    });

    await step('Verify PEMNet brand link exists and is clickable', async () => {
      await assertThat('PEMNet brand link should be visible', () => expect(homePage.brandLinkPemnet).toBeVisible());
      const href = await homePage.brandLinkPemnet.getAttribute('href');
      await assertThat('PEMNet link should have an href', () => expect(href).toBeTruthy());
    });

    await step('Verify Profil-Global brand link exists and is clickable', async () => {
      await assertThat('Profil-Global brand link should be visible', () => expect(homePage.brandLinkProfil).toBeVisible());
      const href = await homePage.brandLinkProfil.getAttribute('href');
      await assertThat('Profil-Global link should have an href', () => expect(href).toBeTruthy());
    });

    await step('Verify Haeger brand link exists and is clickable', async () => {
      await assertThat('Haeger brand link should be visible', () => expect(homePage.brandLinkHaeger).toBeVisible());
      const href = await homePage.brandLinkHaeger.getAttribute('href');
      await assertThat('Haeger link should have an href', () => expect(href).toBeTruthy());
    });

    await step('Verify Autoriv brand link exists and is clickable', async () => {
      await assertThat('Autoriv brand link should be visible', () => expect(homePage.brandLinkAutoriv).toBeVisible());
      const href = await homePage.brandLinkAutoriv.getAttribute('href');
      await assertThat('Autoriv link should have an href', () => expect(href).toBeTruthy());
    });

    await step('Verify Sherex brand link exists and is clickable', async () => {
      await assertThat('Sherex brand link should be visible', () => expect(homePage.brandLinkSherex).toBeVisible());
      const href = await homePage.brandLinkSherex.getAttribute('href');
      await assertThat('Sherex link should have an href', () => expect(href).toBeTruthy());
    });
  });

});
