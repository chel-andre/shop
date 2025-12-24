import { test } from '../src/fixtures/baseTest';
import {
  generateRandomUsername,
  getRandomString
} from '../src/helpers/random/randomDataHelper';
import { dbHelper } from '../src/helpers/db/dbHelper';

/* ----------------------------------------------------------
 * CONSTANTS
 * -------------------------------------------------------- */
// Notification messages for login tests
const MESSAGES = {
  loginSuccess: 'There is no product!9999',
  invalidCredentials: 'Username or password is incorrect!'
};

/* ----------------------------------------------------------
 * TESTS
 * -------------------------------------------------------- */

test.describe.parallel('Login Flow', () => {
  let username: string;
  let password: string;

  // Before each test: generate random credentials and create a user in DB
  test.beforeEach(async () => {
    username = generateRandomUsername();
    password = getRandomString();

    await dbHelper.createUser(username, password);
  });

  // After each test: clean up the user from DB
  test.afterEach(async () => {
    await dbHelper.deleteUserByUsername(username);
  });

  /* ----------------------------------------------------------
   * Positive scenario: user can log in successfully
   * -------------------------------------------------------- */
  test('Positive scenario — successful login', async ({ app }) => {
    // Navigate to login page
    await app.goToLogin();

    // Perform login with valid credentials
    await app.login.login(username, password);

    // Verify that the login success notification appears
    await app.base.verifyAndCloseNotification(MESSAGES.loginSuccess, 'error');
  });

  /* ----------------------------------------------------------
   * Negative scenario: login fails with invalid credentials
   * -------------------------------------------------------- */
  test('Negative scenario — invalid login', async ({ app }) => {
    // Navigate to login page
    await app.goToLogin();

    // Attempt login with incorrect password
    await app.login.login(username, password + 'wrong');

    // Verify that the error notification appears
    await app.base.verifyAndCloseNotification(MESSAGES.invalidCredentials, 'error');
  });
});
