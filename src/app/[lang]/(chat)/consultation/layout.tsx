import { redirect } from 'next/navigation';
import HeaderChatComponent from './_components/header-chat';
import { dictionaries, getDictionary, Locale } from '../../_utils/dictionaries';
import { Toaster } from '@/components/ui/toaster';

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'id' }];
}

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function LocalizedLayout({
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
      <Toaster />
      <HeaderChatComponent lang={lang as Locale} vocabularies={vocabularies} />
      <main className='pt-[80px]'>{children}</main>
    </>
  );
}
