'use client';

import { useEffect, useState } from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';
import { COOKIE_CONSENT_KEY } from './cookie-consent';

export function ConditionalAnalytics({ gaId }: { gaId: string }) {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    setConsented(localStorage.getItem(COOKIE_CONSENT_KEY) === 'yes');

    const handleAccepted = () => setConsented(true);
    window.addEventListener('cookie-consent-accepted', handleAccepted);
    return () => window.removeEventListener('cookie-consent-accepted', handleAccepted);
  }, []);

  if (!consented) return null;
  return <GoogleAnalytics gaId={gaId} />;
}
