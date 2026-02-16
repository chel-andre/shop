import { test } from '../src/fixtures/baseTest';
import {
  generateRandomUsername,
  getRandomString,
  getRandomNumber,
  generateProduct,
} from '../src/helpers/random/randomDataHelper';

import { dbHelper } from '../src/helpers/db/dbHelper';
import { login } from '../src/helpers/api/authHelper';
import path from 'path';

/* ----------------------------------------------------------
 * CONSTANTS
 * -------------------------------------------------------- */
// Notification messages used across CRUD tests
const MESSAGES = {
  loginEmpty: 'There is no product!',
  added: 'Product Added successfully.',
  updated: 'Product updated.',
  deleted: 'There is no product!',
};

// Path to example image for product creation and update
const filePath = path.resolve(__dirname, '../assets/example.png');

/* ----------------------------------------------------------
 * HELPERS
 * -------------------------------------------------------- */

// Generates random updated product data for edit test
function generateUpdatedProduct() {
  return {
    name: `Updated ${getRandomString()}`,
    desc: `Updated ${getRandomString()}`,
    price: getRandomNumber(500),
    discount: getRandomNumber(50),
    filePath,
  };
}

/* ----------------------------------------------------------
 * TESTS
 * -------------------------------------------------------- */

test.describe.parallel('Product CRUD', () => {
  let username: string;
  let password: string;
  let user: any;

  test.beforeEach(async ({ app, request, page }) => {
    // Create unique user for test
    username = generateRandomUsername();
    password = getRandomString();

    // Insert user into DB and perform UI login
    user = await dbHelper.createUser(username, password);
    await login(request, username, password, page);

    // Go to dashboard where product grid is displayed
    await page.goto('/dashboard');
  });

  test.afterEach(async () => {
    // Cleanup: remove created products and user
    if (user?._id) {
      await dbHelper.deleteProductsByUser(user._id);
      await dbHelper.deleteUserById(user._id);
    }
  });

  /* ----------------------------------------------------------
   * CREATE PRODUCT
   * -------------------------------------------------------- */
  test('Create Product', async ({ app }) => {
    // Prepare product payload with image path
    const productData = generateProduct({ filePath });

    // First notification appears because list is empty
    await app.base.verifyAndCloseNotification(MESSAGES.loginEmpty, 'error');

    // Open modal and create product
    await app.main.clickAddProduct();
    await app.productModal.fillForm(productData);

    // Verify creation notification
    await app.base.verifyAndCloseNotification(MESSAGES.added, 'success');

    // Validate product row in table
    await app.main.verifyProductRow(productData);
  });

  /* ----------------------------------------------------------
   * EDIT PRODUCT
   * -------------------------------------------------------- */
  test('Edit Product', async ({ app }) => {
    // Insert initial product directly in DB
    const original = generateProduct({
      user_id: user._id,
      image: 'example.png',
    });
    await dbHelper.createProduct(original);

    // Prepare updated product values
    const updated = generateUpdatedProduct();

    // Open edit modal for the first row and submit updated data
    await app.main.clickEditByRow(0);
    await app.productModal.fillForm(updated);

    // Verify update message
    await app.base.verifyAndCloseNotification(MESSAGES.updated, 'success');

    // Ensure row now shows updated product
    await app.main.verifyProductRow(updated);

    // Ensure original product data no longer present
    await app.main.verifyProductIsDeleted(original.name);
  });

  /* ----------------------------------------------------------
   * DELETE PRODUCT
   * -------------------------------------------------------- */
  test('Delete Product', async ({ app }) => {
    // Insert initial product directly in DB
    const productData = generateProduct({
      user_id: user._id,
      image: 'example.png',
    });
    const created = await dbHelper.createProduct(productData);

    // Delete product via UI
    await app.main.clickDeleteByRow(0);

    // Verify notification after deletion
    await app.base.verifyAndCloseNotification(MESSAGES.deleted, 'error');

    // Ensure deleted product no longer exists in list
    await app.main.verifyProductIsDeleted(created.name);
  });
});
