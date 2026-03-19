import { redirect } from 'next/navigation';
import FooterComponent from '../_components/footer';
import HeaderComponent from '../_components/header';
import { dictionaries, getDictionary, Locale } from '../_utils/dictionaries';
import { Toaster } from '@/components/ui/toaster';
import FloatingChatComponent from '../_components/chatbot/floating-chat-component';
import FloatingChat from '../_components/chatbot/floating-chat';

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
      <HeaderComponent lang={lang as Locale} vocabularies={vocabularies} />
      <main className='pt-16'>{children}</main>
      <Toaster />
      <FloatingChat locale={lang} vocabularies={vocabularies} />
      <FooterComponent />
    </>
  );
}
