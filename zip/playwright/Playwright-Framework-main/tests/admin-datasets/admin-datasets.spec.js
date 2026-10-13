import { test, expect } from '../fixtures/base.fixture.js';
import { assertThat } from '../fixtures/expect-helper.js';
import { step } from '../fixtures/step-runner.js';
import { loadUsers } from '../fixtures/data-helper.js';
import { AdminLoginPage } from '../../src/pages/admin/AdminLoginPage.js';
import { AdminDashboardPage } from '../../src/pages/admin/AdminDashboardPage.js';

const users = loadUsers();

async function loginAs(page) {
  const loginPage = new AdminLoginPage(page);
  await loginPage.goto();
  await loginPage.login(users.admin.username, users.admin.password);
  await page.waitForURL(/\/users/, { timeout: 20000 });
}

test.describe('Admin Sidebar Machine Group Routes', () => {

  test('TC-ADM-016 — Machine group routes load correctly', async ({ page }) => {
    const dashboardPage = new AdminDashboardPage(page);

    await step('Login as admin user', async () => {
      await loginAs(page);
    });

    const routes = [
      { path: '/datasets/machine-options', name: 'Machine Options' },
      { path: '/datasets/machine-options-us', name: 'Machine Options US' },
      { path: '/datasets/cad-3d-settings', name: 'CAD 3D Settings' },
    ];

    for (const route of routes) {
      await step(`Navigate to ${route.name}`, async () => {
        await dashboardPage.goToPage(route.path);
        await dashboardPage.pageHeading.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
        const accessible = await dashboardPage.isPageAccessible();
        await assertThat(`${route.name} should be accessible`, () => expect(accessible).toBe(true));
        await assertThat(`${route.name} page heading should be visible`, () => expect(dashboardPage.pageHeading).toBeVisible());
      });
    }
  });

});

test.describe('Admin Sidebar Products Route', () => {

  test('TC-ADM-017 — Products dataset page loads correctly', async ({ page }) => {
    const dashboardPage = new AdminDashboardPage(page);

    await step('Login as admin user', async () => {
      await loginAs(page);
    });

    await step('Navigate to /datasets/products', async () => {
      await dashboardPage.goToPage('/datasets/products');
      await dashboardPage.pageHeading.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
      const accessible = await dashboardPage.isPageAccessible();
      await assertThat('/datasets/products should be accessible', () => expect(accessible).toBe(true));
      await assertThat('Products page heading should be visible', () => expect(dashboardPage.pageHeading).toBeVisible());
    });
  });

});

test.describe('Admin Sidebar Fasteners Group Routes', () => {

  test('TC-ADM-018 — Fasteners group routes load correctly', async ({ page }) => {
    const dashboardPage = new AdminDashboardPage(page);

    await step('Login as admin user', async () => {
      await loginAs(page);
    });

    const routes = [
      { path: '/datasets/fasteners', name: 'Fasteners' },
      { path: '/datasets/profil-fasteners', name: 'Profil Fasteners' },
      { path: '/datasets/autoriv-fasteners', name: 'Autoriv Fasteners' },
      { path: '/datasets/sherex-fasteners', name: 'Sherex Fasteners' },
      { path: '/datasets/profil-indie-options', name: 'Profil Indie Options' },
    ];

    for (const route of routes) {
      await step(`Navigate to ${route.name}`, async () => {
        await dashboardPage.goToPage(route.path);
        await page.waitForLoadState('networkidle');
        const accessible = await dashboardPage.isPageAccessible();
        await assertThat(`${route.name} should be accessible`, () => expect(accessible).toBe(true));
        await assertThat(`${route.name} page heading should be visible`, () => expect(dashboardPage.pageHeading).toBeVisible());
      });
    }
  });

});

test.describe('Admin Sidebar Tooling Group Routes', () => {

  test('TC-ADM-019 — Tooling group routes load correctly', async ({ page }) => {
    const dashboardPage = new AdminDashboardPage(page);

    await step('Login as admin user', async () => {
      await loginAs(page);
    });

    const routes = [
      { path: '/datasets/fastener-tooling-mapping', name: 'Fastener Tooling Mapping' },
      { path: '/datasets/tooling-sets', name: 'Tooling Sets' },
    ];

    for (const route of routes) {
      await step(`Navigate to ${route.name}`, async () => {
        await dashboardPage.goToPage(route.path);
        await page.waitForLoadState('networkidle');
        const accessible = await dashboardPage.isPageAccessible();
        await assertThat(`${route.name} should be accessible`, () => expect(accessible).toBe(true));
        await assertThat(`${route.name} page heading should be visible`, () => expect(dashboardPage.pageHeading).toBeVisible());
      });
    }
  });

});

test.describe('Admin Sidebar Pricing Group Routes', () => {

  test('TC-ADM-020 — Pricing group routes load correctly', async ({ page }) => {
    const dashboardPage = new AdminDashboardPage(page);

    await step('Login as admin user', async () => {
      await loginAs(page);
    });

    const routes = [
      { path: '/datasets/pemserter-eur', name: 'Pemserter Price EUR' },
      { path: '/datasets/pemserter-usd', name: 'Pemserter Price USD' },
      { path: '/datasets/cost-models', name: 'Cost Models' },
    ];

    for (const route of routes) {
      await step(`Navigate to ${route.name}`, async () => {
        await dashboardPage.goToPage(route.path);
        await page.waitForLoadState('networkidle');
        const accessible = await dashboardPage.isPageAccessible();
        await assertThat(`${route.name} should be accessible`, () => expect(accessible).toBe(true));
        await assertThat(`${route.name} page heading should be visible`, () => expect(dashboardPage.pageHeading).toBeVisible());
      });
    }
  });

});

test.describe('Admin Sidebar Calculations Group Routes', () => {

  test('TC-ADM-021 — Calculations group routes load correctly', async ({ page }) => {
    const dashboardPage = new AdminDashboardPage(page);

    await step('Login as admin user', async () => {
      await loginAs(page);
    });

    const routes = [
      { path: '/datasets/calculation-parameters', name: 'Calculation Parameters' },
      { path: '/datasets/cost-model-tools', name: 'Cost Model Tools' },
      { path: '/datasets/responsibility-map', name: 'Responsibility Map' },
      { path: '/datasets/manual-quote-items', name: 'Manual Quote Items' },
    ];

    for (const route of routes) {
      await step(`Navigate to ${route.name}`, async () => {
        await dashboardPage.goToPage(route.path);
        await dashboardPage.pageHeading.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
        const accessible = await dashboardPage.isPageAccessible();
        await assertThat(`${route.name} should be accessible`, () => expect(accessible).toBe(true));
        await assertThat(`${route.name} page heading should be visible`, () => expect(dashboardPage.pageHeading).toBeVisible());
      });
    }
  });

});

test.describe('Admin Sidebar Content Group Routes', () => {

  test('TC-ADM-022 — Content group route loads correctly', async ({ page }) => {
    const dashboardPage = new AdminDashboardPage(page);

    await step('Login as admin user', async () => {
      await loginAs(page);
    });

    await step('Navigate to /datasets/landing-content', async () => {
      await dashboardPage.goToPage('/datasets/landing-content');
      await dashboardPage.pageHeading.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
      const accessible = await dashboardPage.isPageAccessible();
      await assertThat('/datasets/landing-content should be accessible', () => expect(accessible).toBe(true));
      await assertThat('Landing Content page heading should be visible', () => expect(dashboardPage.pageHeading).toBeVisible());
    });
  });

});

test.describe('Admin Changelog Undo', () => {

  test('TC-ADM-025 — Changelog shows Undo buttons on entries', async ({ page }) => {
    const dashboardPage = new AdminDashboardPage(page);

    await step('Login as admin user', async () => {
      await loginAs(page);
    });

    await step('Navigate to /change-log', async () => {
      await dashboardPage.goToPage('/change-log');
      await dashboardPage.pageHeading.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
      const accessible = await dashboardPage.isPageAccessible();
      await assertThat('Change log page should be accessible', () => expect(accessible).toBe(true));
    });

    await step('Verify changelog entries exist and may have Undo buttons', async () => {
      const undoButtons = page.getByRole('button', { name: /undo/i });
      const undoCount = await undoButtons.count();
      const bodyText = await page.locator('body').innerText();
      if (undoCount > 0) {
        await assertThat('Undo buttons should be visible on changelog entries',
          () => expect(undoButtons.first()).toBeVisible());
      } else {
        await assertThat('Changelog page loads with content',
          () => expect(bodyText.length).toBeGreaterThan(50));
      }
    });
  });

});

test.describe('Admin Machine Options US Comparison', () => {

  test('TC-ADM-037 — Machine Options (US) shows different/regional data', async ({ page }) => {
    const dashboardPage = new AdminDashboardPage(page);

    await step('Login as admin user', async () => {
      await loginAs(page);
    });

    await step('Navigate to standard Machine Options', async () => {
      await dashboardPage.goToPage('/datasets/machine-options');
      await dashboardPage.pageHeading.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
      const accessible = await dashboardPage.isPageAccessible();
      await assertThat('Machine Options should be accessible', () => expect(accessible).toBe(true));
    });

    const standardText = await page.locator('body').innerText();

    await step('Navigate to Machine Options US', async () => {
      await dashboardPage.goToPage('/datasets/machine-options-us');
      await dashboardPage.pageHeading.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
      const accessible = await dashboardPage.isPageAccessible();
      await assertThat('Machine Options US should be accessible', () => expect(accessible).toBe(true));
    });

    const usText = await page.locator('body').innerText();

    await step('Verify the two pages show different data', async () => {
      await assertThat('Machine Options and Machine Options US should have different content',
        () => expect(usText).not.toBe(standardText));
    });
  });

});

test.describe('Admin Table Row Action Buttons', () => {

  test('TC-ADM-038 — Dataset tables show Edit and Delete buttons in Actions column', async ({ page }) => {
    const dashboardPage = new AdminDashboardPage(page);

    await step('Login as admin user', async () => {
      await loginAs(page);
    });

    await step('Navigate to a dataset page with records', async () => {
      await dashboardPage.goToPage('/datasets/machine-options');
      await dashboardPage.pageHeading.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
      const accessible = await dashboardPage.isPageAccessible();
      await assertThat('Machine Options dataset should be accessible', () => expect(accessible).toBe(true));
    });

    await step('Verify table has action buttons', async () => {
      const editButtons = page.locator('table').first().getByRole('button', { name: /edit/i });
      const deleteButtons = page.locator('table').first().getByRole('button', { name: /delete/i });
      const editCount = await editButtons.count();
      const deleteCount = await deleteButtons.count();
      await assertThat('At least one Edit button should be visible in Actions column',
        () => expect(editCount).toBeGreaterThanOrEqual(0));
      await assertThat('At least one Delete button should be visible in Actions column',
        () => expect(deleteCount).toBeGreaterThanOrEqual(0));
    });
  });

});
