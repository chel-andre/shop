import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
    readonly page: Page;
    readonly notificationText: Locator;
    readonly notificationOkButton: Locator;
    readonly notificationIcon: Locator;

    constructor(page: Page) {
        this.page = page;
        this.notificationText = page.locator('.swal2-title');
        this.notificationOkButton = page.locator('.swal2-confirm');
        this.notificationIcon = page.locator('.swal2-icon');
    }

    async verifyNotification(expectedText: string, type: 'success' | 'error') {
        await expect(this.notificationText).toHaveText(expectedText);
        await expect(this.notificationIcon).toHaveClass(new RegExp(`swal2-${type}`));
    }

    async closeNotification() {
        await this.notificationOkButton.click();
    }

    async verifyAndCloseNotification(expectedText: string, type: 'success' | 'error') {
        await this.verifyNotification(expectedText, type);
        await this.closeNotification();
    }
}
