import { BasePage } from '../base/BasePage.js';

export class TestWebRegisterPage extends BasePage {
  constructor(page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: /create an account/i });
    this.firstNameInput = page.locator('#firstName');
    this.lastNameInput = page.locator('#lastName');
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.confirmPasswordInput = page.locator('#confirmPassword');
    this.companyInput = page.locator('#company');
    this.telephoneInput = page.locator('#telephone');
    this.companyAddressInput = page.locator('#companyAddress');
    this.functionDepartmentSelect = page.locator('#departmentId');
    this.regionSelect = page.locator('#regionCode');
    this.createAccountButton = page.getByRole('button', { name: /create account/i });
    this.signInLink = page.getByRole('link', { name: /sign in/i });
    this.formError = page.locator('p.text-error').first();
  }

  async goto() {
    await this.page.goto('https://testweb.configurator.dev.pemnet.ai/register', { waitUntil: 'load', timeout: 30000 });
    return this;
  }

  async fillFirstName(value) {
    await this.firstNameInput.fill(value);
    return this;
  }

  async fillLastName(value) {
    await this.lastNameInput.fill(value);
    return this;
  }

  async fillEmail(value) {
    await this.emailInput.fill(value);
    return this;
  }

  async fillPassword(value) {
    await this.passwordInput.fill(value);
    return this;
  }

  async fillConfirmPassword(value) {
    await this.confirmPasswordInput.fill(value);
    return this;
  }

  async fillCompany(value) {
    await this.companyInput.fill(value);
    return this;
  }

  async fillTelephone(value) {
    await this.telephoneInput.fill(value);
    return this;
  }

  async fillCompanyAddress(value) {
    await this.companyAddressInput.fill(value);
    return this;
  }

  async selectFunctionDepartment(value) {
    const control = this.functionDepartmentSelect.locator('xpath=..').locator('xpath=..');
    await control.click();
    await this.page.getByRole('option', { name: new RegExp(value, 'i') }).click();
    return this;
  }

  async selectRegion(value) {
    const control = this.regionSelect.locator('xpath=..').locator('xpath=..');
    await control.click();
    await this.page.getByRole('option', { name: new RegExp(value, 'i') }).click();
    return this;
  }

  async clickCreateAccount() {
    await this.createAccountButton.click();
    return this;
  }

  async register(data) {
    if (data.firstName) await this.fillFirstName(data.firstName);
    if (data.lastName) await this.fillLastName(data.lastName);
    if (data.email) await this.fillEmail(data.email);
    if (data.password) await this.fillPassword(data.password);
    if (data.confirmPassword) await this.fillConfirmPassword(data.confirmPassword);
    if (data.company) await this.fillCompany(data.company);
    if (data.telephone) await this.fillTelephone(data.telephone);
    if (data.companyAddress) await this.fillCompanyAddress(data.companyAddress);
    if (data.functionDepartment) await this.selectFunctionDepartment(data.functionDepartment);
    if (data.region) await this.selectRegion(data.region);
    await this.clickCreateAccount();
    return this;
  }
}
