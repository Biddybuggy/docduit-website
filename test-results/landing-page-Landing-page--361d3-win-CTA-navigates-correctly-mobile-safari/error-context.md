# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: landing-page.spec.ts >> Landing page [id] >> financial twin CTA navigates correctly
- Location: tests/landing-page.spec.ts:40:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('a[href="/id/financial-twin-simulator"]').first()
Expected: visible
Received: hidden
Timeout:  5000ms

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('a[href="/id/financial-twin-simulator"]').first()
    14 × locator resolved to <a class="text-sm font-medium" href="/id/financial-twin-simulator">Financial Twin</a>
       - unexpected value "hidden"

```

```yaml
- banner:
  - navigation:
    - link "Docduit":
      - /url: /id
    - button:
      - img
- main:
  - paragraph: Solusi Keuangan
  - paragraph: di Ujung Jari
  - paragraph: Konsultasi dengan Dokter Urusan Duit (Docduit) berbasis AI untuk mewujudkan kesehatan finansial dengan mudah
  - link "Konsultasi":
    - /url: /id/consultation
    - button "Konsultasi":
      - img
      - text: Konsultasi
  - img "Doctor Illustration"
  - img "Konsultasi Keuangan Pribadi dengan AI"
  - paragraph: Konsultasi Keuangan Pribadi dengan AI
  - paragraph: Dapatkan solusi keuangan sesuai kebutuhanmu dengan teknologi AI.
  - img "Gratis untuk Semua"
  - paragraph: Gratis untuk Semua
  - paragraph: Konsultasi tanpa biaya, kapan saja, dan di mana saja.
  - img "Bangun Kebiasaan Investasi"
  - paragraph: Bangun Kebiasaan Investasi
  - paragraph: Wujudkan tujuan finansialmu dengan panduan investasi praktis.
  - paragraph: Financial Twin Simulator
  - heading "Bandingkan jalur uangmu sekarang dengan kebiasaan yang lebih baik dan pilihan yang lebih berisiko sebelum mengambil keputusan." [level=2]
  - img
  - paragraph: Saat Ini
  - paragraph: Lihat arah kebiasaan keuanganmu saat ini.
  - img
  - paragraph: Lebih Baik
  - paragraph: Temukan perubahan yang bisa mendekatkanmu ke tujuan.
  - img
  - paragraph: Berisiko
  - paragraph: Pahami dampak pilihan berisiko pada rencanamu.
  - link "Coba simulator":
    - /url: /id/financial-twin-simulator
    - button "Coba simulator":
      - text: Coba simulator
      - img
  - paragraph: Bagaimana Docduit
  - paragraph: Dapat Membantu Anda?
  - img "Capai Kesehatan Finansialmu"
  - paragraph: Capai Kesehatan Finansialmu
  - img "Bantu Menabung dengan Mudah"
  - paragraph: Bantu Menabung dengan Mudah
  - img "Wujudkan Impian Finansialmu"
  - paragraph: Wujudkan Impian Finansialmu
  - img "Atur Pengeluaran dengan Bijak"
  - paragraph: Atur Pengeluaran dengan Bijak
  - paragraph: Kalkulator Tujuan Finansialmu
  - link "Beli Gadget Beli Gadget":
    - /url: /id/calculator/gadget
    - img "Beli Gadget"
    - paragraph: Beli Gadget
  - link "Menikah Menikah":
    - /url: /id/calculator/marriage
    - img "Menikah"
    - paragraph: Menikah
  - link "Liburan Liburan":
    - /url: /id/calculator/vacation
    - img "Liburan"
    - paragraph: Liburan
  - link "Beli Motor Beli Motor":
    - /url: /id/calculator/vehicle
    - img "Beli Motor"
    - paragraph: Beli Motor
  - link "Lainnya Lainnya":
    - /url: /id/calculator/wishlist
    - img "Lainnya"
    - paragraph: Lainnya
  - paragraph: Apa Kata Mereka Tentang Docduit?
  - img "Danny Sudarsono"
  - img "quot-0"
  - paragraph: Danny Sudarsono
  - paragraph: Startup Founder
  - paragraph: Sebagai corporate professional yang juga lagi membangun startup, saya merasa Docduit dapat memberikan nasihat finansial yang senada dengan layanan wealth management kelas atas. It's quite cool bisa mendapatkan advisory dari Docduit yang berbasis AI.
  - img
  - img
  - img
  - img
  - img
  - img "Hasna Luthfiana"
  - img "quot-1"
  - paragraph: Hasna Luthfiana
  - paragraph: UI/UX Designer
  - paragraph: Sebagai seorang new jobber, saya merasa sangat terbantu dengan aplikasi Docduit! Konsultasi yang dilakukan menggunakan AI membuat saya merasa lebih nyaman dan fleksibel dalam bercerita soal kondisi finansial saya. Dulu saya sering bingung harus bertanya ke siapa saat menghadapi masalah keuangan, tapi dengan Docduit saya bisa mendapatkan insight baru dan saran yang relevan tanpa rasa canggung. Bagi saya yang masih belajar mengatur keuangan di awal karier, Docduit benar-benar jadi solusi yang pas.
  - img
  - img
  - img
  - img
  - img
  - img "Azka Adziman"
  - img "quot-2"
  - paragraph: Azka Adziman
  - paragraph: Mahasiswa S1 di Oxford University
  - paragraph: Sebagai seorang mahasiswa, kalkulator tujuan keuangan Docduit tentu sangat berguna. Kalkulator ini tidak hanya menguraikan target yang harus Anda capai setiap bulan, tetapi juga merekomendasikan alat investasi yang dapat membantu Anda mewujudkan impian lebih cepat, seperti mata uang asing dan emas. Jika Anda ingin membeli gadget baru atau menabung untuk liburan, Anda harus mencoba Docduit!
  - img
  - img
  - img
  - img
  - img
  - paragraph: Artikel Pilihan
  - link "main-blog 15 Agustus 2024 Metro TV News Penting! Menabung untuk Mencapai Kemerdekaan Finansial":
    - /url: https://www.metrotvnews.com/read/kM6CaDz2-penting-menabung-untuk-mencapai-kemerdekaan-finansial
    - img "main-blog"
    - paragraph: 15 Agustus 2024
    - paragraph: Metro TV News
    - paragraph: Penting! Menabung untuk Mencapai Kemerdekaan Finansial
  - 'link "blog-0 10 Desember 2024 Kompas Masa Depan Cerah Investasi Emas: Peluang di Era Ketidakpastian"':
    - /url: https://money.kompas.com/read/2024/12/10/114111426/masa-depan-cerah-investasi-emas-peluang-di-era-ketidakpastian?page=all
    - img "blog-0"
    - paragraph: 10 Desember 2024
    - paragraph: Kompas
    - paragraph: "Masa Depan Cerah Investasi Emas: Peluang di Era Ketidakpastian"
  - link "blog-1 6 Juni 2021 CNN Indonesia Generasi 'Sandwich' Bisa Hidup Tenang di Hari Tua":
    - /url: https://www.cnnindonesia.com/ekonomi/20210604191235-297-650569/generasi-sandwich-bisa-hidup-tenang-di-hari-tua
    - img "blog-1"
    - paragraph: 6 Juni 2021
    - paragraph: CNN Indonesia
    - paragraph: Generasi 'Sandwich' Bisa Hidup Tenang di Hari Tua
  - 'link "blog-2 28 Mei 2024 Forbes Financial Planners Plus AI: Why We''re Better Together"':
    - /url: https://www.forbes.com/councils/forbesfinancecouncil/2024/05/28/financial-planners-plus-ai-why-were-better-together/
    - img "blog-2"
    - paragraph: 28 Mei 2024
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
  29 |       await expect(consultBtn).toBeVisible();
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
> 42 |       await expect(link).toBeVisible();
     |                          ^ Error: expect(locator).toBeVisible() failed
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