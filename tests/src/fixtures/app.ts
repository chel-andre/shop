import { Page } from '@playwright/test';
import { BasePage } from '../pageObjects/BasePage';
import { MainPage } from '../pageObjects/MainPage';
import { LoginPage } from '../pageObjects/LoginPage';
import { RegisterPage } from '../pageObjects/RegisterPage';

export class App {
    base: BasePage;
    main: MainPage;
    login: LoginPage;
    register: RegisterPage;

    constructor(page: Page) {
        this.base = new BasePage(page);
        this.main = new MainPage(page);
        this.login = new LoginPage(page);
        this.register = new RegisterPage(page);
    }
}