import { Page, Locator } from '@playwright/test';

export class RegisterPage {
  private readonly page: Page;

  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly registerButton: Locator;
  readonly loginLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.confirmPasswordInput = page.locator('input[name="confirm_password"]');
    this.registerButton = page.locator('button:has-text("Register")');
    this.loginLink = page.locator('button:has-text("Login")');
  }

  async fillRegisterForm(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
  }

  async clickRegisterButton() {
    await this.registerButton.click();
  }

  async register(username: string, password: string) {
    await this.fillRegisterForm(username, password);
    await this.clickRegisterButton();
  }
}
