import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
    readonly page: Page;
    readonly notificationOkButton: Locator;
    readonly notificationIcon: Locator;
    readonly notificationPopup: Locator;

    constructor(page: Page) {
        this.page = page;
        this.notificationPopup = page.locator('.swal2-popup');
        this.notificationOkButton = page.locator('.swal2-confirm');
        this.notificationIcon = page.locator('.swal2-icon');
    }

    async verifyNotification(expectedText: string, type: 'success' | 'error') {
        await this.notificationPopup.waitFor({ state: 'visible', timeout: 5000 });
        await expect(this.notificationIcon).toContainClass(`swal2-${type}`);
        await expect(this.notificationPopup).toContainText(expectedText);
    }

    async closeNotification() {
        await this.notificationOkButton.click();
    }

    async verifyAndCloseNotification(expectedText: string, type: 'success' | 'error') {
        await this.verifyNotification(expectedText, type);
        await this.closeNotification();
    }
}
