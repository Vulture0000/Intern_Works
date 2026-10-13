import { BasePage } from '../base/BasePage.js';

export class AdminDashboardPage extends BasePage {
  constructor(page) {
    super(page);
    this.pageHeading = page.locator('h1, h2, .page-title, [class*="heading"]').first();
    this.userMenuButton = page.getByRole('button', { name: /john smith/i });
    this.signOutButton = page.getByRole('button', { name: /sign out/i });
    this.confirmSignOutButton = page.getByRole('button', { name: /^sign out$/i });
    this.sidebar = page.locator('aside, [role="complementary"]').locator('nav');
    this.sidebarGroups = page.locator('nav button:has(svg.lucide-chevron-down)');
    this.dashboardLink = page.locator('nav a:has-text("Dashboard"), [href*="dashboard"]').first();
    this.analyticsLink = page.getByRole('link', { name: /analytics/i });
    this.usersLink = page.getByRole('link', { name: /^users$/i });
    this.rolesLink = page.getByRole('link', { name: /roles/i });
    this.applicationsLink = page.getByRole('link', { name: /applications/i });
    this.tasksLink = page.getByRole('link', { name: /tasks/i });
    this.changelogLink = page.getByRole('link', { name: /change log/i });
    this.smtpLink = page.getByRole('link', { name: /smtp/i });
    this.profileLink = page.getByRole('link', { name: /profile/i });
    this.machineGroup = page.getByRole('button', { name: /machine/i });
    this.productsGroup = page.getByRole('button', { name: /products/i });
    this.fastenersLink = page.getByRole('link', { name: /fasteners/i });
    this.toolingGroup = page.getByRole('button', { name: /tooling/i });
    this.pricingGroup = page.getByRole('button', { name: /pricing/i });
    this.calculationsGroup = page.getByRole('button', { name: /calculations/i });
    this.contentGroup = page.getByRole('button', { name: /content/i });
    this.machineOptionsLink = page.locator('nav a').filter({ hasText: /^Machine Options$/i });
    this.machineOptionsUsLink = page.locator('nav a').filter({ hasText: /Machine Options US/i });
    this.cad3dSettingsLink = page.locator('nav a').filter({ hasText: /CAD 3D Settings/i });
    this.productsLink = page.locator('nav a').filter({ hasText: /^Products$/i });
    this.fastenersLink = page.locator('nav a').filter({ hasText: /Fasteners$/i });
    this.profilFastenersLink = page.locator('nav a').filter({ hasText: /Profil Fasteners/i });
    this.autorivFastenersLink = page.locator('nav a').filter({ hasText: /Autoriv Fasteners/i });
    this.sherexFastenersLink = page.locator('nav a').filter({ hasText: /Sherex Fasteners/i });
    this.profilIndieOptionsLink = page.locator('nav a').filter({ hasText: /Profil Indie Options/i });
    this.toolingSetsLink = page.locator('nav a').filter({ hasText: /Tooling Sets/i });
    this.pemserterEurLink = page.locator('nav a').filter({ hasText: /Pemserter Price EUR/i });
    this.pemserterUsdLink = page.locator('nav a').filter({ hasText: /Pemserter Price USD/i });
    this.costModelsLink = page.locator('nav a').filter({ hasText: /Cost Models/i });
    this.landingContentLink = page.locator('nav a').filter({ hasText: /Landing Content/i });
    this.smtpNavLink = page.locator('nav a').filter({ hasText: /^SMTP$/i });
    this.profileNavLink = page.locator('nav a').filter({ hasText: /^Profile$/i });
  }

  /** Navigate to a specific admin route via URL */
  async goToPage(path) {
    await this.navigate(path);
    return this;
  }

  /** Get the main h1 heading text */
  async getHeadingText() {
    return this.pageHeading.textContent();
  }

  /** Check if the current page loaded without access errors or redirect to login */
  async isPageAccessible() {
    const currentUrl = this.page.url();
    if (currentUrl.includes('/login')) return false;
    if (currentUrl.includes('/signin')) return false;
    const body = await this.page.locator('body').innerText();
    const hasError = body.includes('403') || body.includes('Access Denied') || body.includes('not found') || body.includes('Page Not Found');
    return !hasError && body.length > 50;
  }

  /** Open the user menu dropdown */
  async openUserMenu() {
    await this.userMenuButton.click();
    return this;
  }

  /** Sign out of the admin portal */
  async signOut() {
    await this.openUserMenu();
    await this.signOutButton.click();
    await this.page.getByRole('dialog').waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    await this.confirmSignOutButton.click();
    await this.page.waitForURL(/\/login/, { timeout: 15000 }).catch(() => {});
    return this;
  }
}
