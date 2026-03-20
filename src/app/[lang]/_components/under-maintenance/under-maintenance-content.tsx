import Link from 'next/link';
import { Locale } from '../../_utils/dictionaries';

export default function UnderMaintenanceContent({ lang }: { lang: Locale }) {
  const copy =
    lang === 'id'
      ? {
          title: 'DALAM PEMELIHARAAN',
          description:
            'Fitur login sementara tidak tersedia. Silakan coba lagi nanti.',
          back: 'Kembali ke beranda',
        }
      : {
          title: 'UNDER MAINTENANCE',
          description:
            'Login feature is temporarily unavailable. Please try again later.',
          back: 'Back to home',
        };

  return (
    <div className='min-h-[60vh] flex items-center justify-center px-6 py-16'>
      <div className='max-w-2xl w-full text-center'>
        <h1 className='text-3xl lg:text-4xl font-bold tracking-wide text-docduit-blue mb-4'>
          {copy.title}
        </h1>
        <p className='text-gray-600 dark:text-gray-300 mb-8'>
          {copy.description}
        </p>
        <Link
          href={`/${lang}/`}
          className='inline-flex items-center justify-center rounded-full bg-docduit-blue text-white font-semibold px-6 py-3'
        >
          {copy.back}
        </Link>
      </div>
    </div>
  );
}

