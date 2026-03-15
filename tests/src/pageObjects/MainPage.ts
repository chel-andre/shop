import { Page, Locator, expect } from '@playwright/test';

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

  async searchProduct(name: string) {
    await this.searchInput.fill(name);
    await this.page.keyboard.press('Enter');
  }

  async clickEditByRow(rowIndex: number) {
    await this.editButtons.nth(rowIndex).click();
  }

  async clickDeleteByRow(rowIndex: number) {
    await this.deleteButtons.nth(rowIndex).click();
  }

  async getRowsCount(): Promise<number> {
    await this.tableRows.first().waitFor();
    return await this.tableRows.count();
  }

  async goToPage(index: number) {
    await this.paginationPages.nth(index).click();
  }

  async getRowByName(name: string): Promise<Locator> {
    return this.page.locator(`table tbody tr:has(td:text("${name}"))`);
  }

  async verifyProductRow(product: { name: string; desc: string; price: number; discount: number }) {
    const row = await this.getRowByName(product.name);
    await expect(row).toHaveCount(1);

    const cells = row.locator('td');
    await expect(cells.nth(0)).toHaveText(product.name);

    const img = cells.nth(1).locator('img');
    await expect(img).toHaveCount(1);
    await expect(img).toHaveAttribute('src', /.+/);

    await expect(cells.nth(2)).toHaveText(product.desc);
    await expect(cells.nth(3)).toHaveText(String(product.price));
    await expect(cells.nth(4)).toHaveText(String(product.discount));
  }

  async verifyProductIsDeleted(productName: string) {
    await expect(this.page.locator(`tr:has-text("${productName}")`)).toHaveCount(0);
  }
}
