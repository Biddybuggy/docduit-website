import type { Metadata } from 'next';
import './styles/fonts.css';
import './styles/globals.css';
import SWRConfigProvider from './providers';
import { Toaster } from 'sonner';
import SessionProviders from './session-provider';
import { ChatProvider } from '@/context/ChatContext';
import { CookieConsent } from '@/components/shared/cookie-consent';
import { ConditionalAnalytics } from '@/components/shared/conditional-analytics';
import { OnboardingModal } from './[lang]/_components/onboarding/onboarding-modal';

export const metadata: Metadata = {
  title: 'Docduit',
  description: 'Solusi Keuangan di Ujung Jari',
  icons: '/docduit.svg',
  openGraph: {
    title: 'Docduit',
    description: 'Solusi Keuangan di Ujung Jari',
    images: '/doctor-image.jpg',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const googleTagID = process.env.NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID || '';

  return (
    <html lang='en'>
      <body className='antialiased'>
        <SessionProviders>
          <SWRConfigProvider>
            <ChatProvider>
              {children}
              <Toaster richColors position='bottom-right' />
              <CookieConsent />
              <OnboardingModal />
            </ChatProvider>
          </SWRConfigProvider>
        </SessionProviders>
      </body>
      {googleTagID ? <ConditionalAnalytics gaId={googleTagID} /> : null}
    </html>
  );
}
