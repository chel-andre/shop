import { test } from '../src/fixtures/baseTest';
import { generateRandomUsername, getRandomString } from '../src/helpers/random/randomDataHelper';
import { dbHelper } from '../src/helpers/db/dbHelper';

const loginSuccess = 'There is no product!';
const invalidCredentials = 'Username or password is incorrect!';

test.describe.parallel('Login Flow', () => {
  let username: string;
  let password: string;

  test.beforeEach(async () => {
    username = generateRandomUsername();
    password = getRandomString();
    await dbHelper.createUser(username, password);
  });

  test.afterEach(async () => {
    if (username) {
      await dbHelper.deleteUserByUsername(username);
    }
  });

  test('Positive scenario - successful login', async ({ app }) => {
    await app.goToLogin();
    await app.login.login(username, password);
    await app.base.verifyAndCloseNotification(loginSuccess, 'error');
  });

  test('Negative scenario - invalid login', async ({ app }) => {
    await app.goToLogin();
    await app.login.login(username, password + 'wrong');
    await app.base.verifyAndCloseNotification(invalidCredentials, 'error');
  });
});
