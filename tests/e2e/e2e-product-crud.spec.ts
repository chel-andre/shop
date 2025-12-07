import { test, expect } from '../src/fixtures/baseTest';
import {
  generateRandomUsername,
  getRandomString,
  getRandomNumber
} from '../src/helpers/random/randomDataHelper';

import { dbHelper } from '../src/helpers/db/dbHelper';
import { login } from '../src/helpers/api/authHelper';
import path from 'path';

const loginSuccess = 'There is no product!';
const productAddedSuccess = 'Product Added successfully.';
const productUpdatedSuccess = 'Product updated.';
const productDeletedSuccess = 'There is no product!';

test.describe.parallel('Product CRUD', () => {
  let username: string;
  let password: string;
  let user: any;

  test.beforeEach(async ({ app, request, page }) => {
    username = generateRandomUsername();
    password = getRandomString();

    user = await dbHelper.createUser(username, password);

    await login(request, page, username, password);
    await page.goto('/dashboard');
  });

  test.afterEach(async () => {
    if (user?._id) {
      await dbHelper.deleteProductsByUser(user._id.toString());
      await dbHelper.deleteUserById(user._id);
    }
  });

  test('Create Product', async ({ app }) => {
    const productData = {
      name: `Product ${getRandomString()}`,
      desc: `Description ${getRandomString()}`,
      price: getRandomNumber(500),
      discount: getRandomNumber(50),
      filePath: path.resolve(__dirname, '../assets/example.png')
    };

    await app.base.verifyAndCloseNotification(loginSuccess, 'error');
    await app.main.clickAddProduct();
    await app.productModal.fillForm(productData);
    await app.base.verifyAndCloseNotification(productAddedSuccess, 'success');
    await app.main.verifyProductRow(productData);
  });

  test('Edit Product', async ({ app }) => {
    const originalProduct = {
      name: `Product ${getRandomString()}`,
      desc: `Description ${getRandomString()}`,
      price: getRandomNumber(500),
      discount: getRandomNumber(50),
      user_id: user._id,
      image: 'example.png'
    };

    await dbHelper.createProduct(originalProduct);

    const newProductData = {
      name: `Updated ${getRandomString()}`,
      desc: `Updated ${getRandomString()}`,
      price: getRandomNumber(500),
      discount: getRandomNumber(50),
      filePath: path.resolve(__dirname, '../assets/example.png')
    };

    await app.main.clickEditByRow(0);
    await app.productModal.fillForm(newProductData);
    await app.base.verifyAndCloseNotification(productUpdatedSuccess, 'success');
    await app.main.verifyProductRow(newProductData);
    await app.main.verifyProductIsDeleted(originalProduct.name);
  });

  test('Delete Product', async ({ app }) => {
    const productData = {
      name: `Product ${getRandomString()}`,
      desc: `Description ${getRandomString()}`,
      price: getRandomNumber(500),
      discount: getRandomNumber(50),
      user_id: user._id,
      image: 'example.png'
    };

    const createdProduct = await dbHelper.createProduct(productData);
    await app.main.clickDeleteByRow(0);
    await app.base.verifyAndCloseNotification(productDeletedSuccess, 'error');
    await app.main.verifyProductIsDeleted(createdProduct.name);
  });

});
