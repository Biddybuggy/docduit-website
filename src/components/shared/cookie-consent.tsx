'use client';

import { useEffect, useState } from 'react';

export const COOKIE_CONSENT_KEY = 'docduit_cookies_accepted';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!stored) setVisible(true);
  }, []);

  if (!visible) return null;

  const accept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'yes');
    setVisible(false);
    window.location.reload();
  };

  const decline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'no');
    setVisible(false);
  };

  return (
    <div className='fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white px-4 py-4 shadow-lg sm:px-6'>
      <div className='mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <p className='text-sm text-gray-600'>
          Kami menggunakan cookie analitik (Google Analytics) untuk memahami
          cara pengguna berinteraksi dengan situs ini. Data tidak dijual ke pihak
          ketiga.{' '}
          <a
            href='/id/privacy-policy'
            className='font-medium text-slate-800 underline hover:text-slate-600'
          >
            Kebijakan Privasi
          </a>
        </p>
        <div className='flex shrink-0 gap-2'>
          <button
            onClick={decline}
            className='rounded-md border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50'
          >
            Tolak
          </button>
          <button
            onClick={accept}
            className='rounded-md bg-slate-800 px-4 py-1.5 text-sm font-medium text-white hover:bg-slate-700'
          >
            Terima
          </button>
        </div>
      </div>
    </div>
  );
}
