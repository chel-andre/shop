import { test, expect, APIRequestContext } from '@playwright/test';
import bcrypt from 'bcryptjs';
import { dbHelper } from '../src/helpers/db/dbHelper';
import { generateRandomUsername, getRandomString, getRandomNumber } from '../src/helpers/random/randomDataHelper';
import fs from 'fs';
import path from 'path';

/* ----------------------------------------------------------
 * HELPERS
 * -------------------------------------------------------- */

// Hash the password to match DB login requirement
export const getPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

// Login with hashed password and return token
async function login(request: APIRequestContext, username: string, password: string) {
  const response = await request.post(`${process.env.BASE_API_URL}/login`, {
    data: { username, password: getPassword(password) },
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok()) {
    const body = await response.text();
    throw new Error(`Login failed: ${response.status()} - ${body}`);
  }

  const body = await response.json();
  return body.token;
}

// Generate product payload
function generateProduct(overrides: any = {}) {
  return {
    name: `Product_${getRandomString()}`,
    desc: `Desc_${getRandomString()}`,
    price: getRandomNumber(500),
    discount: getRandomNumber(50),
    ...overrides,
  };
}

/* ----------------------------------------------------------
 * TESTS
 * -------------------------------------------------------- */

test.describe.parallel('API Product CRUD + Search + Pagination', () => {
  let username: string;
  let password: string;
  let token: string;
  let user: any;
  const filePath = path.resolve(__dirname, '../assets/example.png');

  test.beforeEach(async ({ request }) => {
    // Create user in DB with plain password
    username = generateRandomUsername();
    password = getRandomString();
    user = await dbHelper.createUser(username, password); // plain password

    // Login using hashed password
    token = await login(request, username, password);
  });

  test.afterEach(async () => {
    // Clean up products and user
    if (user?._id) {
      await dbHelper.deleteProductsByUser(user._id.toString());
      await dbHelper.deleteUserById(user._id);
    }
  });

test('Create product with file upload', async ({ request }) => {
  const response = await request.post(`${process.env.BASE_API_URL}/add-product`, {
    multipart: {
      name: 'TestProduct',
      desc: 'Test description',
      price: '100',
      discount: '10',
      file: fs.createReadStream(filePath),
    },
    headers: {
      token,
    },
  });

  const respBody = await response.json();
  expect(response.status()).toBe(200);
  expect(respBody.status).toBe(true);
  expect(respBody.title).toBe('Product Added successfully.');
});

  test('Get product', async ({ request }) => {
    const productData = generateProduct({ user_id: user._id });
    await dbHelper.createProduct(productData);

    const response = await request.get(`${process.env.BASE_API_URL}/get-product?page=1`, {
      headers: { token },
    });

    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.status).toBe(true);
    expect(body.products.length).toBeGreaterThan(0);
    expect(body.products[0].name).toBe(productData.name);
  });

  test('Delete product', async ({ request }) => {
    const productData = generateProduct({ user_id: user._id });
    const created = await dbHelper.createProduct(productData);

    const response = await request.post(`${process.env.BASE_API_URL}/delete-product`, {
      data: { id: created._id },
      headers: { token, 'Content-Type': 'application/json' },
    });

    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.status).toBe(true);
    expect(body.title).toBe('Product deleted.');
  });
});
