import { Locale } from '../_utils/dictionaries';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ lang: string }>;
}

const content = {
  en: {
    title: 'Privacy Policy',
    effective: 'Effective Date: 1 July 2025',
    intro:
      'Docduit ("we", "our", "us") is committed to protecting your personal data in accordance with Indonesian Law No. 27 of 2022 on Personal Data Protection (UU PDP) and applicable regulations. This Privacy Policy explains how we collect, use, store, and protect your data.',
    sections: [
      {
        heading: '1. Data We Collect',
        body: 'We may collect: (a) Account data — name, email address, and profile photo obtained via Google OAuth when you sign in. (b) Financial data — salary, instalments, savings goals, and other financial figures you voluntarily enter during the AI consultation or financial simulator. (c) Usage data — pages visited, session duration, and interaction logs collected via Google Analytics (only with your consent). (d) Device data — IP address and browser type for security and rate-limiting purposes.',
      },
      {
        heading: '2. How We Use Your Data',
        body: 'We use your data to: authenticate you and maintain your session; provide AI-powered financial consultation and simulation; improve the quality of our services; comply with legal obligations; and detect and prevent fraud or abuse.',
      },
      {
        heading: '3. Data Retention',
        body: 'Session data is retained for 24 hours. Financial data entered in the consultation or simulator is processed in real time and is not persisted to a database by default. Account data is retained while your account remains active. You may request deletion at any time (see Section 6).',
      },
      {
        heading: '4. Third Parties We Share Data With',
        body: 'We share data only as necessary: Google (OAuth authentication, Analytics — subject to your cookie consent); AI backend service (Cloudflare Workers or proprietary server) which receives your anonymised financial questions to generate responses; Vercel (hosting and infrastructure). We do not sell your personal data.',
      },
      {
        heading: '5. Cookies and Analytics',
        body: 'We use Google Analytics cookies only after you provide explicit consent via the cookie banner. You may withdraw consent at any time by clearing your browser storage or clicking "Decline" in a fresh session. Essential session cookies (used for authentication) are always active.',
      },
      {
        heading: '6. Your Rights Under UU PDP',
        body: 'You have the right to: access your personal data; correct inaccurate data; request deletion of your data; data portability; and object to processing. To exercise these rights, email us at privacy@docduit.com. We will respond within 14 business days.',
      },
      {
        heading: '7. Data Security',
        body: 'We implement technical and organisational measures including HTTPS, HttpOnly session cookies, input sanitisation, rate limiting, and server-side validation to protect your data.',
      },
      {
        heading: '8. Changes to This Policy',
        body: 'We may update this policy periodically. Material changes will be announced via a notice on the website. Continued use after the notice period constitutes acceptance.',
      },
      {
        heading: '9. Contact',
        body: 'For privacy-related inquiries: privacy@docduit.com',
      },
    ],
  },
  id: {
    title: 'Kebijakan Privasi',
    effective: 'Tanggal Berlaku: 1 Juli 2025',
    intro:
      'Docduit ("kami") berkomitmen melindungi data pribadi Anda sesuai dengan Undang-Undang No. 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP) dan peraturan yang berlaku. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi data Anda.',
    sections: [
      {
        heading: '1. Data yang Kami Kumpulkan',
        body: 'Kami dapat mengumpulkan: (a) Data akun — nama, alamat email, dan foto profil yang diperoleh melalui Google OAuth saat Anda masuk. (b) Data keuangan — gaji, cicilan, tujuan tabungan, dan angka keuangan lain yang Anda masukkan secara sukarela selama konsultasi AI atau simulator keuangan. (c) Data penggunaan — halaman yang dikunjungi, durasi sesi, dan log interaksi yang dikumpulkan melalui Google Analytics (hanya dengan persetujuan Anda). (d) Data perangkat — alamat IP dan jenis browser untuk tujuan keamanan dan pembatasan laju.',
      },
      {
        heading: '2. Cara Kami Menggunakan Data Anda',
        body: 'Kami menggunakan data Anda untuk: mengautentikasi Anda dan mempertahankan sesi Anda; memberikan konsultasi dan simulasi keuangan berbasis AI; meningkatkan kualitas layanan kami; mematuhi kewajiban hukum; serta mendeteksi dan mencegah penipuan atau penyalahgunaan.',
      },
      {
        heading: '3. Retensi Data',
        body: 'Data sesi disimpan selama 24 jam. Data keuangan yang dimasukkan dalam konsultasi atau simulator diproses secara real-time dan secara default tidak disimpan ke basis data. Data akun disimpan selama akun Anda aktif. Anda dapat meminta penghapusan kapan saja (lihat Bagian 6).',
      },
      {
        heading: '4. Pihak Ketiga yang Menerima Data',
        body: 'Kami hanya berbagi data seperlunya: Google (autentikasi OAuth, Analytics — tunduk pada persetujuan cookie Anda); layanan backend AI (Cloudflare Workers atau server kami) yang menerima pertanyaan keuangan Anda yang dianonimkan untuk menghasilkan respons; Vercel (hosting dan infrastruktur). Kami tidak menjual data pribadi Anda.',
      },
      {
        heading: '5. Cookie dan Analitik',
        body: 'Kami menggunakan cookie Google Analytics hanya setelah Anda memberikan persetujuan eksplisit melalui banner cookie. Anda dapat menarik persetujuan kapan saja dengan membersihkan penyimpanan browser atau mengklik "Tolak" saat sesi baru. Cookie sesi esensial (digunakan untuk autentikasi) selalu aktif.',
      },
      {
        heading: '6. Hak Anda Berdasarkan UU PDP',
        body: 'Anda berhak untuk: mengakses data pribadi Anda; mengoreksi data yang tidak akurat; meminta penghapusan data Anda; portabilitas data; dan keberatan atas pemrosesan. Untuk menggunakan hak-hak ini, kirim email ke privacy@docduit.com. Kami akan merespons dalam 14 hari kerja.',
      },
      {
        heading: '7. Keamanan Data',
        body: 'Kami menerapkan langkah teknis dan organisasi termasuk HTTPS, cookie sesi HttpOnly, sanitasi input, pembatasan laju, dan validasi sisi server untuk melindungi data Anda.',
      },
      {
        heading: '8. Perubahan Kebijakan',
        body: 'Kami dapat memperbarui kebijakan ini secara berkala. Perubahan material akan diumumkan melalui pemberitahuan di situs web. Penggunaan berkelanjutan setelah periode pemberitahuan dianggap sebagai persetujuan.',
      },
      {
        heading: '9. Kontak',
        body: 'Untuk pertanyaan terkait privasi: privacy@docduit.com',
      },
    ],
  },
};

export default async function PrivacyPolicyPage({ params }: PageProps) {
  const { lang } = await params;
  const safeLang = lang === 'en' ? 'en' : 'id';
  const t = content[safeLang as Locale] ?? content.id;

  return (
    <main className='mx-auto max-w-3xl px-4 py-12 sm:px-6'>
      <div className='mb-6'>
        <Link
          href={`/${safeLang}`}
          className='text-sm text-slate-500 hover:text-slate-700'
        >
          ← {safeLang === 'en' ? 'Back to Home' : 'Kembali ke Beranda'}
        </Link>
      </div>

      <h1 className='mb-1 text-3xl font-bold text-slate-900'>{t.title}</h1>
      <p className='mb-6 text-sm text-slate-500'>{t.effective}</p>
      <p className='mb-8 text-slate-700'>{t.intro}</p>

      <div className='space-y-6'>
        {t.sections.map((section) => (
          <section key={section.heading}>
            <h2 className='mb-2 text-lg font-semibold text-slate-800'>
              {section.heading}
            </h2>
            <p className='leading-relaxed text-slate-600'>{section.body}</p>
          </section>
        ))}
      </div>

      <div className='mt-10 border-t pt-6'>
        <p className='text-xs text-slate-400'>
          {safeLang === 'en'
            ? 'This policy applies to docduit.com and all its subdomains.'
            : 'Kebijakan ini berlaku untuk docduit.com dan semua subdomainnya.'}
        </p>
      </div>
    </main>
  );
}
