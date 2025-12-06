import { Page, Locator } from '@playwright/test';

export class CreateEditProductModal {
    private readonly page: Page;

    readonly nameInput: Locator;
    readonly descInput: Locator;
    readonly priceInput: Locator;
    readonly discountInput: Locator;
    readonly uploadInput: Locator;
    readonly cancelButton: Locator;
    readonly submitButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.nameInput = page.locator('input[name="name"]');
        this.descInput = page.locator('input[name="desc"]');
        this.priceInput = page.locator('input[name="price"]');
        this.discountInput = page.locator('input[name="discount"]');
        this.uploadInput = page.locator('input[type="file"]');
        this.cancelButton = page.locator('button:has-text("Cancel")');
        this.submitButton = page.locator('button:has-text("Add Product"), button:has-text("Edit Product")');
    }

    async fillForm(data: { name: string; desc: string; price: number; discount: number; filePath?: string }) {
        await this.nameInput.fill(data.name);
        await this.descInput.fill(data.desc);
        await this.priceInput.fill(String(data.price));
        await this.discountInput.fill(String(data.discount));
        if (data.filePath) {
            await this.uploadInput.setInputFiles(data.filePath);
        }
    }

    async submit() {
        await this.submitButton.click();
    }

    async cancel() {
        await this.cancelButton.click();
    }
}
