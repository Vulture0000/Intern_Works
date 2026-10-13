import { BasePage } from '../base/BasePage.js';

export class TestWebHomePage extends BasePage {
  constructor(page) {
    super(page);
    this.pageHeading = page.locator('h1');
    this.installationSystemButton = page.getByRole('button', { name: /find your installation system/i });
    this.signInButton = page.getByRole('button', { name: /sign in/i }).first();
    this.registerButton = page.getByRole('button', { name: /register/i });
    this.userMenuButton = page.locator('button').filter({ hasText: /David Wilson|Michael Johnson|Emily Brown|Robert Davis/i }).first();
    this.signOutMenuItem = page.getByRole('button', { name: /sign out/i });
    this.brandLinkPemnet = page.getByRole('link', { name: /pemnet/i });
    this.brandLinkProfil = page.getByRole('link', { name: /profil-global/i });
    this.brandLinkHaeger = page.getByRole('link', { name: /haeger/i });
    this.brandLinkAutoriv = page.getByRole('link', { name: /autoriv/i });
    this.brandLinkSherex = page.getByRole('link', { name: /sherex/i });
  }

  async goto() {
    await this.page.goto('https://testweb.configurator.dev.pemnet.ai/', { waitUntil: 'load', timeout: 30000 });
    return this;
  }

  async goToInstallationSystem() {
    await this.installationSystemButton.click();
    return this;
  }

  async getHeadingText() {
    return this.pageHeading.textContent();
  }

  async clickSignIn() {
    await this.signInButton.click();
    return this;
  }

  async clickRegister() {
    await this.registerButton.click();
    return this;
  }

  async signOut() {
    await this.userMenuButton.click();
    await this.signOutMenuItem.click();
    return this;
  }
}
