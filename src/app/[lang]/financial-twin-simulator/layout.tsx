import { redirect } from 'next/navigation';
import Link from 'next/link';
import HeaderComponent from '../_components/header';
import { dictionaries, getDictionary, Locale } from '../_utils/dictionaries';
import { Toaster } from '@/components/ui/toaster';
import FloatingChat from '../_components/chatbot/floating-chat';

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'id' }];
}

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function FinancialTwinLayout({
  children,
  params,
}: LayoutProps) {
  const { lang } = await params;
  if (!Object.keys(dictionaries).includes(lang)) {
    redirect('/id/');
  }

  const vocabularies = await getDictionary(lang as Locale);

  return (
    <>
      {/* Same chrome as the calculator pages: the full header on mobile, and a
          bare logo on desktop so the two-panel screen can run edge to edge. */}
      <div className='lg:hidden'>
        <HeaderComponent lang={lang as Locale} vocabularies={vocabularies} />
      </div>
      <div className='hidden lg:block'>
        <header className='fixed top-0 left-0 w-full bg-transparent z-50'>
          <nav className='w-full flex px-5 lg:px-24 items-center mt-14'>
            <Link href={`/${lang}`}>
              <p className='text-2xl font-bold font-epilogue'>
                <span className='text-docduit-blue'>Doc</span>
                <span>duit</span>
              </p>
            </Link>
          </nav>
        </header>
      </div>
      <main>{children}</main>
      <Toaster />
      <FloatingChat locale={lang} vocabularies={vocabularies} />
    </>
  );
}
