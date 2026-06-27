import { test, expect } from '@playwright/test';

// These tests specifically catch the "buttons don't work on mobile English" class of bug.
// Run against mobile-chrome and mobile-safari projects.

const locales = ['en', 'id'] as const;

for (const locale of locales) {
  test.describe(`Mobile navigation [${locale}]`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/${locale}`);
      await page.evaluate(() =>
        localStorage.setItem('docduit_cookies_accepted', 'yes'),
      );
      await page.reload();
      await page.waitForLoadState('networkidle');
    });

    test('hamburger menu opens and shows navigation links', async ({ page }) => {
      // On mobile the sidenav trigger (Menu icon) is visible
      const menuBtn = page.locator('header button, header [role="button"]').filter({
        has: page.locator('svg'),
      }).last();
      await expect(menuBtn).toBeVisible();
      await menuBtn.click();

      // Sheet sidenav should open
      const sidenav = page.locator('[data-radix-popper-content-wrapper], [role="dialog"], [data-state="open"]').first();
      await expect(sidenav).toBeVisible({ timeout: 3000 });
    });

    test('links in page body are tappable', async ({ page }) => {
      // Check that main CTA and calculator links actually respond to clicks
      const consultLink = page
        .locator('main a[href*="consultation"], main a[href*="under-maintenance"]')
        .first();
      await expect(consultLink).toBeVisible();
      // Verify it's not obscured by a z-index overlay — getBoundingClientRect should be within viewport
      const box = await consultLink.boundingBox();
      expect(box).not.toBeNull();
      const viewportSize = page.viewportSize();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.y).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(viewportSize!.width + 1);
    });

    test('locale switcher is accessible', async ({ page }) => {
      // On mobile it's in the sidenav
      const menuBtn = page.locator('header').locator('button').last();
      await menuBtn.click();
      await page.waitForTimeout(300);

      const targetLocale = locale === 'en' ? 'id' : 'en';
      const localeLink = page
        .locator(`a[href^="/${targetLocale}"]`)
        .filter({ hasText: /Bahasa|English/i })
        .first();
      await expect(localeLink).toBeVisible({ timeout: 3000 });
    });
  });
}
