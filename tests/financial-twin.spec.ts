import { test, expect } from '@playwright/test';

// Financial Twin growth-loop flows that work without authentication.
// Authenticated save/check-in paths need a real Google OAuth session and are
// covered manually (see the feature handoff notes).

const locales = ['en', 'id'] as const;

const runButtonName = { en: 'Run Simulation', id: 'Jalankan Simulasi' };
const editInputsName = { en: 'Edit inputs', id: 'Ubah input' };

for (const locale of locales) {
  test.describe(`Financial Twin [${locale}]`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/${locale}/financial-twin-simulator`);
      await page.evaluate(() =>
        localStorage.setItem('docduit_cookies_accepted', 'yes'),
      );
      await page.waitForLoadState('networkidle');
    });

    test('page loads with the input form', async ({ page }) => {
      await expect(page).toHaveURL(`/${locale}/financial-twin-simulator`);
      await expect(
        page.getByRole('button', { name: runButtonName[locale] }),
      ).toBeVisible();
      // No saved-plan or check-in UI for signed-out visitors
      await expect(page.getByTestId('twin-plan-card')).toHaveCount(0);
      await expect(page.getByTestId('twin-checkin-card')).toHaveCount(0);
    });

    test('running the simulation shows results, save-plan CTA, and consultation CTA', async ({
      page,
    }) => {
      await page.getByRole('button', { name: runButtonName[locale] }).click();

      const saveCta = page.getByTestId('twin-save-plan-cta');
      await expect(saveCta).toBeVisible({ timeout: 15_000 });

      // The existing consultation CTA must keep working alongside the new one
      const consultLink = page.locator(
        `main a[href="/${locale}/consultation"]`,
      );
      await expect(consultLink.first()).toBeVisible();
    });

    test('save-plan click while signed out stores the pending intent', async ({
      page,
    }) => {
      // Stub the NextAuth roundtrip: with an empty JSON response, signIn falls
      // back to navigating to the callbackUrl (this same page) instead of
      // Google. The intent must already be in sessionStorage by then.
      await page.route('**/api/auth/**', (route) =>
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: '{}',
        }),
      );

      await page.getByRole('button', { name: runButtonName[locale] }).click();
      const saveCta = page.getByTestId('twin-save-plan-cta');
      await expect(saveCta).toBeVisible({ timeout: 15_000 });
      await saveCta.click();

      // The page may navigate (back to itself) mid-poll; retry through it.
      let rawIntent: string | null = null;
      await expect
        .poll(async () => {
          try {
            rawIntent = await page.evaluate(() =>
              window.sessionStorage.getItem('docduit-twin-save-intent'),
            );
          } catch {
            rawIntent = null;
          }
          return rawIntent;
        })
        .not.toBeNull();

      const intent = JSON.parse(rawIntent ?? '{}');
      expect(intent.input?.monthlyIncome).toBeGreaterThan(0);
    });

    test('mobile flow: inputs step, results step, back to inputs', async ({
      page,
      isMobile,
    }) => {
      test.skip(!isMobile, 'mobile-only step flow');

      const runButton = page.getByRole('button', {
        name: runButtonName[locale],
      });
      await expect(runButton).toBeVisible();
      await runButton.click();

      // Results step: form hidden, results + save CTA + edit button visible
      const editButton = page.getByRole('button', {
        name: editInputsName[locale],
      });
      await expect(editButton).toBeVisible({ timeout: 15_000 });
      await expect(runButton).toBeHidden();
      await expect(page.getByTestId('twin-save-plan-cta')).toBeVisible();

      // Back to the inputs step
      await editButton.click();
      await expect(runButton).toBeVisible();
    });
  });
}
