import { test } from '../src/fixtures/baseTest';
import {
  generateRandomUsername,
  getRandomString,
  getRandomNumber
} from '../src/helpers/random/randomDataHelper';

import { dbHelper } from '../src/helpers/db/dbHelper';
import { login } from '../src/helpers/api/authHelper';
import path from 'path';

const filePath = path.resolve(__dirname, '../assets/example.png');

/* ----------------------------------------------------------
 * HELPERS
 * -------------------------------------------------------- */
function generateProduct(overrides: any = {}) {
  return {
    name: `Product_${getRandomString()}`,
    desc: `Desc_${getRandomString()}`,
    price: getRandomNumber(500),
    discount: getRandomNumber(50),
    ...overrides
  };
}

/* ----------------------------------------------------------
 * TESTS
 * -------------------------------------------------------- */

test.describe.parallel('Product Search & Pagination', () => {
  let username: string;
  let password: string;
  let user: any;

  test.beforeEach(async ({ app, request, page }) => {
    // Create a unique user for each test
    username = generateRandomUsername();
    password = getRandomString();
    user = await dbHelper.createUser(username, password);

    // Login using API helper
    await login(request, page, username, password);

    // Navigate to dashboard
    await page.goto('/dashboard');
  });

  test.afterEach(async () => {
    // Cleanup database after each test
    if (user?._id) {
      await dbHelper.deleteProductsByUser(user._id.toString());
      await dbHelper.deleteUserById(user._id);
    }
  });

  /* ----------------------------------------------------------
   * TEST: Search & Pagination
   * -------------------------------------------------------- */
  test('Search results + Pagination', async ({ page, app }) => {
    const products: any[] = [];

    // Create 10 products directly in the database
    for (let i = 1; i <= 10; i++) {
      const p = generateProduct({
        user_id: user._id,
        image: 'example.png',
        name: `Item_${i}_${getRandomString()}`
      });

      await dbHelper.createProduct(p);
      products.push(p);
    }

    // Page 1 should contain 5 items
    const rowsCountPage1 = await app.main.getRowsCount();
    await test.expect(rowsCountPage1).toBe(5);

    // Go to next page (page 2)
    await app.main.paginationNext.click();

    // Page 2 should also contain 5 items
    const rowsCountPage2 = await app.main.getRowsCount();
    await test.expect(rowsCountPage2).toBe(5);

    // Choose a product from page 2 and search for it
    const target = products[7];

    await app.main.searchInput.fill(target.name);
    await page.keyboard.press('Enter');

    // Expect only the searched product to be shown
    await app.main.verifyProductRow(target);
    await test.expect(await app.main.getRowsCount()).toBe(1);
  });
});
