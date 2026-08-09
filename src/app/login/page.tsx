import { Suspense } from 'react';
import { getDictionary, type Locale } from '../[lang]/_utils/dictionaries';
import LoginContent from './login-content';

interface LoginPageProps {
  // This route sits outside the `[lang]` segment, so callers pass the locale
  // explicitly; `id` is the site default.
  searchParams: Promise<{ lang?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { lang } = await searchParams;
  const vocabularies = await getDictionary((lang === 'en' ? 'en' : 'id') as Locale);

  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center bg-gray-50'>
          <div>Loading...</div>
        </div>
      }
    >
      <LoginContent vocabularies={vocabularies} />
    </Suspense>
  );
}
