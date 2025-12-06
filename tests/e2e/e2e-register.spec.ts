import { test } from '../src/fixtures/baseTest';
import { generateRandomUsername, getRandomString } from '../src/helpers/random/randomDataHelper';
import { createUser, deleteUserByUsername } from '../src/helpers/db/dbHelper';

const registerSuccess = 'Registered Successfully.';
const userExists = (username: string) => `UserName ${username} Already Exist!`;

test.describe.parallel('Register Flow', () => {
  let username: string;
  let password: string;

  test.afterEach(async () => {
    if (username) {
      await deleteUserByUsername(username);
    }
  });

  test('Positive scenario - successful registration', async ({ app }) => {
    username = generateRandomUsername();
    password = getRandomString();

    await app.goToRegister();
    await app.register.register(username, password);
    await app.base.verifyAndCloseNotification(registerSuccess, 'success');
  });

  test('Negative scenario - user already exists', async ({ app }) => {
    username = generateRandomUsername();
    password = getRandomString();

    await createUser(username, password);

    await app.goToRegister();
    await app.register.register(username, password);
    await app.base.verifyAndCloseNotification(userExists(username), 'error');
  });
});
