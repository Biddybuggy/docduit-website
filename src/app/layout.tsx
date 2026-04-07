import type { Metadata } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import './styles/fonts.css';
import './styles/globals.css';
import SWRConfigProvider from './providers';
import { Toaster } from 'sonner';
import SessionProviders from './session-provider';
import { ChatProvider } from '@/context/ChatContext';

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
  const isDevelopment = process.env.NEXT_PUBLIC_ENV === 'development';

  return (
    <html lang='en'>
      <body className='antialiased'>
        <SessionProviders>
          <SWRConfigProvider>
            <ChatProvider>
              {children}
              <Toaster richColors position='bottom-right' />
            </ChatProvider>
          </SWRConfigProvider>
        </SessionProviders>
      </body>
      {googleTagID ? (
        <GoogleAnalytics gaId={googleTagID} debugMode={isDevelopment} />
      ) : null}
    </html>
  );
}
