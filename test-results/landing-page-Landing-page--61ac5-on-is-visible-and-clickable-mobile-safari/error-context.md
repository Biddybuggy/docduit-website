# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: landing-page.spec.ts >> Landing page [en] >> consult CTA button is visible and clickable
- Location: tests/landing-page.spec.ts:24:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('a[href*="consultation"], a[href*="under-maintenance"]').first()
Expected: visible
Received: hidden
Timeout:  5000ms

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('a[href*="consultation"], a[href*="under-maintenance"]').first()
    14 × locator resolved to <a href="/en/consultation" class="text-sm font-medium">Consult</a>
       - unexpected value "hidden"

```

```yaml
- banner:
  - navigation:
    - link "Docduit":
      - /url: /en
    - button:
      - img
- main:
  - paragraph: Financial Advisor
  - paragraph: at Your Fingertips
  - paragraph: Consult with Docduit to improve your financial wellbeing
  - link "Consult":
    - /url: /en/consultation
    - button "Consult":
      - img
      - text: Consult
  - img "Doctor Illustration"
  - img "Personal AI Financial Advisor"
  - paragraph: Personal AI Financial Advisor
  - paragraph: Get solutions tailored to your needs with AI technology.
  - img "Free for Everyone"
  - paragraph: Free for Everyone
  - paragraph: Free consultations, anytime, anywhere.
  - img "Build Investment Habits"
  - paragraph: Build Investment Habits
  - paragraph: Achieve your financial goals with practical investment guides.
  - paragraph: Financial Twin Simulator
  - heading "See how today’s habits could shape your savings, debt, and next financial goal." [level=2]
  - img
  - paragraph: Current habits
  - paragraph: See where your current income, spending, and debt payments may lead.
  - img
  - paragraph: Better habits
  - paragraph: Find out how modest spending changes could improve the outcome.
  - img
  - paragraph: Riskier path
  - paragraph: Stress-test your plan against extra spending and one surprise cost.
  - link "Open simulator":
    - /url: /en/financial-twin-simulator
    - button "Open simulator":
      - text: Open simulator
      - img
  - paragraph: How Docduit
  - paragraph: Can Help You
  - img "Improve Your Financial Health"
  - paragraph: Improve Your Financial Health
  - img "Save Easily"
  - paragraph: Save Easily
  - img "Achieve Your Financial Goals"
  - paragraph: Achieve Your Financial Goals
  - img "Manage Your Expenses Wisely"
  - paragraph: Manage Your Expenses Wisely
  - paragraph: Calculators For Your Financial Goals
  - link "Electronics Electronics":
    - /url: /en/calculator/gadget
    - img "Electronics"
    - paragraph: Electronics
  - link "Marriage Marriage":
    - /url: /en/calculator/marriage
    - img "Marriage"
    - paragraph: Marriage
  - link "Vacation Vacation":
    - /url: /en/calculator/vacation
    - img "Vacation"
    - paragraph: Vacation
  - link "Vehicle Vehicle":
    - /url: /en/calculator/vehicle
    - img "Vehicle"
    - paragraph: Vehicle
  - link "Others Others":
    - /url: /en/calculator/wishlist
    - img "Others"
    - paragraph: Others
  - paragraph: What Do They Say About Docduit?
  - img "Danny Sudarsono"
  - img "quot-0"
  - paragraph: Danny Sudarsono
  - paragraph: Startup Founder
  - paragraph: As a corporate professional who is also building a startup, I feel that Docduit can provide financial advice comparable to top-tier wealth management services. It's quite cool to get AI-based advice from Docduit.
  - img
  - img
  - img
  - img
  - img
  - img "Hasna Luthfiana"
  - img "quot-1"
  - paragraph: Hasna Luthfiana
  - paragraph: UI/UX Designer
  - paragraph: As a new jobber, I feel very helped by the Docduit website! Consulting with AI makes me feel more comfortable talking about my financial conditions. I often felt confused about who to ask when faced with financial problems. But with Docduit, I can get new insights and relevant advice without feeling awkward. As I'm still learning to manage finances at the start of my career, Docduit is truly the right solution.
  - img
  - img
  - img
  - img
  - img
  - img "Azka Adziman"
  - img "quot-2"
  - paragraph: Azka Adziman
  - paragraph: Undergraduate Student at Oxford University
  - paragraph: As a university student, Docduit's financial calculators are certainly very useful. They not only break down the targets you need to achieve each month, but also recommend investment tools that can help you achieve your dreams faster, such as foreign currency and gold. If you want to buy a new gadget or save for a vacation, you should try Docduit!
  - img
  - img
  - img
  - img
  - img
  - paragraph: Featured Articles
  - link "main-blog August 15, 2024 Metro TV News Penting! Menabung untuk Mencapai Kemerdekaan Finansial":
    - /url: https://www.metrotvnews.com/read/kM6CaDz2-penting-menabung-untuk-mencapai-kemerdekaan-finansial
    - img "main-blog"
    - paragraph: August 15, 2024
    - paragraph: Metro TV News
    - paragraph: Penting! Menabung untuk Mencapai Kemerdekaan Finansial
  - 'link "blog-0 December 10, 2024 Kompas Masa Depan Cerah Investasi Emas: Peluang di Era Ketidakpastian"':
    - /url: https://money.kompas.com/read/2024/12/10/114111426/masa-depan-cerah-investasi-emas-peluang-di-era-ketidakpastian?page=all
    - img "blog-0"
    - paragraph: December 10, 2024
    - paragraph: Kompas
    - paragraph: "Masa Depan Cerah Investasi Emas: Peluang di Era Ketidakpastian"
  - link "blog-1 June 6, 2021 CNN Indonesia Generasi 'Sandwich' Bisa Hidup Tenang di Hari Tua":
    - /url: https://www.cnnindonesia.com/ekonomi/20210604191235-297-650569/generasi-sandwich-bisa-hidup-tenang-di-hari-tua
    - img "blog-1"
    - paragraph: June 6, 2021
    - paragraph: CNN Indonesia
    - paragraph: Generasi 'Sandwich' Bisa Hidup Tenang di Hari Tua
  - 'link "blog-2 May 28, 2024 Forbes Financial Planners Plus AI: Why We''re Better Together"':
    - /url: https://www.forbes.com/councils/forbesfinancecouncil/2024/05/28/financial-planners-plus-ai-why-were-better-together/
    - img "blog-2"
    - paragraph: May 28, 2024
    - paragraph: Forbes
    - paragraph: "Financial Planners Plus AI: Why We're Better Together"
- region "Notifications (F8)":
  - list
- button "docduit-icon":
  - img "docduit-icon"
- contentinfo:
  - paragraph: © Copyright 2026 | Docduit
  - link "instagram":
    - /url: https://www.instagram.com/docduit.id
    - img "instagram"
  - link "tiktok":
    - /url: https://www.tiktok.com/@docduit.id
    - img "tiktok"
- region "Notifications alt+T"
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const locales = ['en', 'id'] as const;
  4  | 
  5  | for (const locale of locales) {
  6  |   test.describe(`Landing page [${locale}]`, () => {
  7  |     test.beforeEach(async ({ page }) => {
  8  |       // Accept cookies so the consent banner doesn't block clicks
  9  |       await page.context().addCookies([]);
  10 |       await page.goto(`/${locale}`);
  11 |       await page.evaluate(() =>
  12 |         localStorage.setItem('docduit_cookies_accepted', 'yes'),
  13 |       );
  14 |       await page.reload();
  15 |       await page.waitForLoadState('networkidle');
  16 |     });
  17 | 
  18 |     test('page loads and hero section is visible', async ({ page }) => {
  19 |       await expect(page.locator('header')).toBeVisible();
  20 |       // Docduit wordmark appears in the header
  21 |       await expect(page.getByRole('navigation').getByText('Docduit')).toBeVisible();
  22 |     });
  23 | 
  24 |     test('consult CTA button is visible and clickable', async ({ page }) => {
  25 |       // Find the primary CTA button in the hero section
  26 |       const consultBtn = page
  27 |         .locator('a[href*="consultation"], a[href*="under-maintenance"]')
  28 |         .first();
> 29 |       await expect(consultBtn).toBeVisible();
     |                                ^ Error: expect(locator).toBeVisible() failed
  30 |       await consultBtn.click();
  31 |       // Should navigate away from the landing page
  32 |       await expect(page).not.toHaveURL(`/${locale}`);
  33 |     });
  34 | 
  35 |     test('financial twin promo section is visible', async ({ page }) => {
  36 |       const section = page.locator('section').filter({ hasText: 'Financial Twin' }).first();
  37 |       await expect(section).toBeVisible();
  38 |     });
  39 | 
  40 |     test('financial twin CTA navigates correctly', async ({ page }) => {
  41 |       const link = page.locator(`a[href="/${locale}/financial-twin-simulator"]`).first();
  42 |       await expect(link).toBeVisible();
  43 |       await link.click();
  44 |       await expect(page).toHaveURL(`/${locale}/financial-twin-simulator`);
  45 |     });
  46 | 
  47 |     test('calculator section is visible', async ({ page }) => {
  48 |       const calculatorSection = page.locator('#calculators');
  49 |       await calculatorSection.scrollIntoViewIfNeeded();
  50 |       await expect(calculatorSection).toBeVisible();
  51 |     });
  52 | 
  53 |     test('calculator links navigate correctly', async ({ page }) => {
  54 |       const slugs = ['gadget', 'marriage', 'vacation', 'vehicle', 'wishlist'];
  55 |       const calculatorSection = page.locator('#calculators');
  56 |       await calculatorSection.scrollIntoViewIfNeeded();
  57 | 
  58 |       for (const slug of slugs) {
  59 |         const link = page.locator(`a[href="/${locale}/calculator/${slug}"]`);
  60 |         await expect(link).toBeVisible();
  61 |       }
  62 |     });
  63 |   });
  64 | }
  65 | 
```