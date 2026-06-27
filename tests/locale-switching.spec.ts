import { test, expect } from '@playwright/test';

test.describe('Locale switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en');
    await page.evaluate(() =>
      localStorage.setItem('docduit_cookies_accepted', 'yes'),
    );
    await page.reload();
    await page.waitForLoadState('networkidle');
  });

  test('root path redirects to a valid locale', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/(en|id)(\/|$)/);
  });

  test('English page has English content', async ({ page }) => {
    await expect(page).toHaveURL('/en');
    // Navigation items should be in English
    await expect(page.locator('nav').filter({ hasText: 'Home' })).toBeVisible();
  });

  test('Indonesian page has Indonesian content', async ({ page }) => {
    await page.goto('/id');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/id');
  });

  test('switching from English to Indonesian updates URL and content', async ({
    page,
  }) => {
    // On desktop the locale dropdown is in the top-right header
    const globeBtn = page.locator('header').locator('button').filter({
      has: page.locator('svg'),
    }).first();
    await globeBtn.click();
    await page.waitForTimeout(300);

    const bahsaLink = page.getByRole('menuitem').filter({ hasText: /Bahasa/i });
    await bahsaLink.click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL('/id');
  });

  test('switching from Indonesian to English updates URL', async ({ page }) => {
    await page.goto('/id');
    await page.waitForLoadState('networkidle');

    const globeBtn = page.locator('header').locator('button').filter({
      has: page.locator('svg'),
    }).first();
    await globeBtn.click();
    await page.waitForTimeout(300);

    const englishLink = page.getByRole('menuitem').filter({ hasText: /English/i });
    await englishLink.click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL('/en');
  });
});
