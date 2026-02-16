import { APIRequestContext, Page } from '@playwright/test';
import bcrypt from 'bcryptjs';

// Hash the password to match DB login requirement
export const getPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
};

export async function login(
  request: APIRequestContext,
  username: string,
  password: string,
  page?: Page,
) {
  const response = await request.post(`${process.env.BASE_API_URL}/login`, {
    data: { username, password: getPassword(password) },
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok()) {
    const errorBody = await response.text();
    throw new Error(`Login failed: ${response.status()} - ${errorBody}`);
  }

  const body = await response.json();
  const token = body.token;

  if (page) {
    await page.goto(process.env.BASE_UI_URL!);
    await page.evaluate((t) => localStorage.setItem('token', t), token);
  }

  return token;
}
