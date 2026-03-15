import { Page } from '@playwright/test';
import { NotificationPopup } from '../pageObjects/NotificationPopup';
import { MainPage } from '../pageObjects/MainPage';
import { LoginPage } from '../pageObjects/LoginPage';
import { RegisterPage } from '../pageObjects/RegisterPage';
import { CreateEditProductModal } from '../pageObjects/CreateEditProductModal';

export class App {
  notification: NotificationPopup;
  main: MainPage;
  login: LoginPage;
  register: RegisterPage;
  productModal: CreateEditProductModal;
  private page: Page;

  constructor(page: Page) {
    this.page = page;
    this.notification = new NotificationPopup(page);
    this.main = new MainPage(page);
    this.login = new LoginPage(page);
    this.register = new RegisterPage(page);
    this.productModal = new CreateEditProductModal(page);
  }

  async goToLogin() {
    await this.page.goto('/');
  }

  async goToRegister() {
    await this.page.goto('/register');
  }
}
