import { test, expect } from '../src/fixtures/baseTest';
import { generateRandomUsername, getRandomString } from '../src/helpers/random/randomDataHelper';
import { deleteUserByUsername  } from '../src/helpers/db/dbHelper';

const registerSuccess = 'Registered Successfully.';
const userExists = (username: string) => `UserName ${username} Already Exist!`;

test.describe('Register Flow', () => {
  let username: string;

  test.afterEach(async () => {
    if (username) {
      await deleteUserByUsername(username);
    }
  });

  test('Positive then Negative scenario', async ({ app }) => {
    username = generateRandomUsername();
    const password = getRandomString();

    await app.goToRegister();
    await app.register.register(username, password);
    await app.base.verifyAndCloseNotification(registerSuccess, 'success');

    await app.login.clickRegister();
    await app.register.register(username, password);
    await app.base.verifyAndCloseNotification(userExists(username), 'error');
  });
});
