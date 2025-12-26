import { test } from '../src/fixtures/baseTest';
import { generateRandomUsername, getRandomString } from '../src/helpers/random/randomDataHelper';
import { dbHelper } from '../src/helpers/db/dbHelper';

/* ----------------------------------------------------------
 * CONSTANTS
 * -------------------------------------------------------- */
// Notification messages for registration tests
const MESSAGES = {
  registerSuccess: 'Registered Successfully.',
  userExists: (username: string) => `UserName ${username} Already Exist!`,
};

/* ----------------------------------------------------------
 * TESTS
 * -------------------------------------------------------- */

test.describe.parallel('Register Flow', () => {
  let username: string;
  let password: string;

  // Cleanup: delete the user created for the test
  test.afterEach(async () => {
    if (username) {
      await dbHelper.deleteUserByUsername(username);
    }
  });

  /* ----------------------------------------------------------
   * Positive scenario: successful registration
   * -------------------------------------------------------- */
  test('Positive scenario — successful registration', async ({ app }) => {
    // Generate random credentials for a unique user
    username = generateRandomUsername();
    password = getRandomString();

    // Navigate to registration page and register user
    await app.goToRegister();
    await app.register.register(username, password);

    // Verify the success notification appears
    await app.base.verifyAndCloseNotification(MESSAGES.registerSuccess, 'success');
  });

  /* ----------------------------------------------------------
   * Negative scenario: user already exists
   * -------------------------------------------------------- */
  test('Negative scenario — user already exists', async ({ app }) => {
    // Generate random credentials
    username = generateRandomUsername();
    password = getRandomString();

    // Insert the user directly in DB to simulate existing user
    await dbHelper.createUser(username, password);

    // Try to register the same user through UI
    await app.goToRegister();
    await app.register.register(username, password);

    // Verify the error notification appears
    await app.base.verifyAndCloseNotification(MESSAGES.userExists(username), 'error');
  });
});
