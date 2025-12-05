const { test, expect } = require('@playwright/test');

test('Open example.com', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page).toHaveTitle('Example Domaint');
});
