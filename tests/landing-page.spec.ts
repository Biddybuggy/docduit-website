import { test, expect } from '@playwright/test';

const locales = ['en', 'id'] as const;

for (const locale of locales) {
  test.describe(`Landing page [${locale}]`, () => {
    test.beforeEach(async ({ page }) => {
      // Accept cookies so the consent banner doesn't block clicks
      await page.context().addCookies([]);
      await page.goto(`/${locale}`);
      await page.evaluate(() =>
        localStorage.setItem('docduit_cookies_accepted', 'yes'),
      );
      await page.reload();
      await page.waitForLoadState('networkidle');
    });

    test('page loads and hero section is visible', async ({ page }) => {
      await expect(page.locator('header')).toBeVisible();
      // Docduit wordmark appears in the header
      await expect(page.getByRole('navigation').getByText('Docduit')).toBeVisible();
    });

    test('consult CTA button is visible and clickable', async ({ page }) => {
      // Find the primary CTA button in the hero section
      const consultBtn = page
        .locator('a[href*="consultation"], a[href*="under-maintenance"]')
        .first();
      await expect(consultBtn).toBeVisible();
      await consultBtn.click();
      // Should navigate away from the landing page
      await expect(page).not.toHaveURL(`/${locale}`);
    });

    test('financial twin promo section is visible', async ({ page }) => {
      const section = page.locator('section').filter({ hasText: 'Financial Twin' }).first();
      await expect(section).toBeVisible();
    });

    test('financial twin CTA navigates correctly', async ({ page }) => {
      const link = page.locator(`a[href="/${locale}/financial-twin-simulator"]`).first();
      await expect(link).toBeVisible();
      await link.click();
      await expect(page).toHaveURL(`/${locale}/financial-twin-simulator`);
    });

    test('calculator section is visible', async ({ page }) => {
      const calculatorSection = page.locator('#calculators');
      await calculatorSection.scrollIntoViewIfNeeded();
      await expect(calculatorSection).toBeVisible();
    });

    test('calculator links navigate correctly', async ({ page }) => {
      const slugs = ['gadget', 'marriage', 'vacation', 'vehicle', 'wishlist'];
      const calculatorSection = page.locator('#calculators');
      await calculatorSection.scrollIntoViewIfNeeded();

      for (const slug of slugs) {
        const link = page.locator(`a[href="/${locale}/calculator/${slug}"]`);
        await expect(link).toBeVisible();
      }
    });
  });
}
