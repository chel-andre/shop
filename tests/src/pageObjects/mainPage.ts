import { Page, Locator } from '@playwright/test';

export class MainPage {
    private readonly page: Page;

    readonly headerTitle: Locator;
    readonly addProductButton: Locator;
    readonly logoutButton: Locator;

    readonly searchInput: Locator;
    readonly printButton: Locator;

    readonly tableRows: Locator;
    readonly editButtons: Locator;
    readonly deleteButtons: Locator;

    readonly paginationPrev: Locator;
    readonly paginationNext: Locator;
    readonly paginationPages: Locator;

    constructor(page: Page) {
        this.page = page;

        this.headerTitle = page.locator('h2:has-text("Dashboard")');
        this.addProductButton = page.locator('button:has-text("Add Product")');
        this.logoutButton = page.locator('button:has-text("Log Out")');

        this.searchInput = page.locator('input[name="search"]');
        this.printButton = page.locator('button:has-text("Print product details")');

        this.tableRows = page.locator('table tbody tr');
        this.editButtons = page.locator('button:has-text("Edit")');
        this.deleteButtons = page.locator('button:has-text("Delete")');

        this.paginationPrev = page.locator('button[aria-label="Go to previous page"]');
        this.paginationNext = page.locator('button[aria-label="Go to next page"]');
        this.paginationPages = page.locator('button[aria-label^="page"]');
    }

    async clickAddProduct() {
        await this.addProductButton.click();
    }

    async clickLogout() {
        await this.logoutButton.click();
    }

    async searchProduct(name: string) {
        await this.searchInput.fill(name);
    }

    async clickPrint() {
        await this.printButton.click();
    }

    async clickEditByRow(rowIndex: number) {
        await this.editButtons.nth(rowIndex).click();
    }

    async clickDeleteByRow(rowIndex: number) {
        await this.deleteButtons.nth(rowIndex).click();
    }

    async getRowsCount(): Promise<number> {
        return await this.tableRows.count();
    }

    async goToPage(index: number) {
        await this.paginationPages.nth(index).click();
    }
}
