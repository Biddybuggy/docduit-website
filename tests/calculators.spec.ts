import { test, expect } from '@playwright/test';

const calculators = ['gadget', 'marriage', 'vacation', 'vehicle', 'wishlist'];

for (const slug of calculators) {
  test.describe(`Calculator: ${slug}`, () => {
    test('page loads for English locale', async ({ page }) => {
      await page.goto(`/en/calculator/${slug}`);
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(`/en/calculator/${slug}`);
      // Page should render without redirecting away
      await expect(page.locator('main')).toBeVisible();
    });

    test('page loads for Indonesian locale', async ({ page }) => {
      await page.goto(`/id/calculator/${slug}`);
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(`/id/calculator/${slug}`);
      await expect(page.locator('main')).toBeVisible();
    });
  });
}

test('invalid calculator slug does not crash', async ({ page }) => {
  const response = await page.goto('/en/calculator/nonexistent');
  // Should return 404 or redirect, not a 500
  expect(response?.status()).not.toBe(500);
});
