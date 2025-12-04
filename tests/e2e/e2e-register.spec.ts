const { test, expect } = require('@playwright/test');

test('Open example.com', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle('Example Domaint');
});
