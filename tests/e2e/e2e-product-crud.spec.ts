import { test, expect } from '../src/fixtures/baseTest';
import { generateRandomUsername, getRandomString, getRandomNumber } from '../src/helpers/random/randomDataHelper';
import { dbHelper } from '../src/helpers/db/dbHelper';
import { login } from '../src/helpers/api/authHelper';
import path from 'path';

const loginSuccess = 'There is no product!';
const productAddedSuccess = 'Product Added successfully.';

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
      await dbHelper.deleteUserById(user._id);
      await dbHelper.deleteProductsByUser(user._id.toString());
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

 
});
