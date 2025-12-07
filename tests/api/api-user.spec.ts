import { test, expect } from '../src/fixtures/baseTest';
import { generateRandomUsername, getRandomString } from '../src/helpers/random/randomDataHelper';
import { dbHelper } from '../src/helpers/db/dbHelper';
import bcrypt from 'bcryptjs';

/* ----------------------------------------------------------
 * HELPER: hash password same as server
 * -------------------------------------------------------- */
export const getPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
};

/* ----------------------------------------------------------
 * CONSTANTS
 * -------------------------------------------------------- */
const MESSAGES = {
  registerSuccess: 'Registered Successfully.',
  userExists: (username: string) => `UserName ${username} Already Exist!`,
  loginSuccess: 'Login Successfully.',
  invalidCredentials: 'Username or password is incorrect!'
};

/* ----------------------------------------------------------
 * API TESTS
 * -------------------------------------------------------- */
test.describe.parallel('API Register + Login Flow', () => {
  let username: string;
  let password: string;

  // Clean up user after each test
  test.afterEach(async () => {
    if (username) {
      await dbHelper.deleteUserByUsername(username);
    }
  });

  // ---------------------------
  // Positive scenario: Register + Login
  // ---------------------------
  test('Positive scenario — successful registration and login', async ({ request }) => {
    username = generateRandomUsername();
    password = getRandomString();

    // Register user with plain password
    const registerRes = await request.post(`${process.env.BASE_API_URL}/register`, {
      data: { username, password },
      headers: { 'Content-Type': 'application/json' }
    });

    const registerBody = await registerRes.json();
    expect(registerRes.status()).toBe(200);
    expect(registerBody.status).toBe(true);
    expect(registerBody.title).toBe(MESSAGES.registerSuccess);

    // Login user with hashed password
    const hashedPassword = getPassword(password);
    const loginRes = await request.post(`${process.env.BASE_API_URL}/login`, {
      data: { username, password: hashedPassword },
      headers: { 'Content-Type': 'application/json' }
    });

    const loginBody = await loginRes.json();
    expect(loginRes.status()).toBe(200);
    expect(loginBody.status).toBe(true);
    expect(loginBody.message).toBe(MESSAGES.loginSuccess);
    expect(loginBody.token).toBeDefined();
  });

  // ---------------------------
  // Negative scenario: Register existing user
  // ---------------------------
  test('Negative scenario — user already exists', async ({ request }) => {
    username = generateRandomUsername();
    password = getRandomString();

    await dbHelper.createUser(username, password);

    const res = await request.post(`${process.env.BASE_API_URL}/register`, {
      data: { username, password },
      headers: { 'Content-Type': 'application/json' }
    });

    const body = await res.json();
    expect(res.status()).toBe(400);
    expect(body.status).toBe(false);
    expect(body.errorMessage).toBe(MESSAGES.userExists(username));
  });

  // ---------------------------
  // Negative scenario: Invalid login
  // ---------------------------
  test('Negative scenario — login with invalid password', async ({ request }) => {
    username = generateRandomUsername();
    password = getRandomString();

    await dbHelper.createUser(username, password);

    const hashedWrongPassword = getPassword(password + 'wrong');
    const res = await request.post(`${process.env.BASE_API_URL}/login`, {
      data: { username, password: hashedWrongPassword },
      headers: { 'Content-Type': 'application/json' }
    });

    const body = await res.json();
    expect(res.status()).toBe(400);
    expect(body.status).toBe(false);
    expect(body.errorMessage).toBe(MESSAGES.invalidCredentials);
  });
});
