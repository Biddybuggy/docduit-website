import { redirect } from 'next/navigation';
import { dictionaries, getDictionary, Locale } from '../../_utils/dictionaries';
import HeaderComponent from '../../_components/header';
import Link from 'next/link';
import CalcultorPageContent from './_content';

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'id' }];
}

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function CalculatorLayout({
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
      <CalcultorPageContent>{children}</CalcultorPageContent>
    </>
  );
}
