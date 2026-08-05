'use client';

import { useEffect, useState } from 'react';

// Hosts that serve real production traffic. The banner hides only on these;
// every other host (the dev alias, Vercel preview URLs, localhost) shows it.
// Add a custom production domain here when one is set up.
const PRODUCTION_HOSTS = ['docduit.vercel.app'];

/**
 * A small non-production "DEV" badge. The decision is made at runtime from the
 * hostname rather than a build-time env var on purpose: a dev deployment that is
 * "Promoted to Production" in Vercel keeps its original (preview) build, so a
 * build-time flag would wrongly read "DEV" on the prod domain. Hostname
 * detection stays correct no matter which build is promoted.
 */
export function EnvBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const host = window.location.hostname;
    setShow(!PRODUCTION_HOSTS.includes(host));
  }, []);

  if (!show) return null;

  return (
    <div
      aria-hidden
      className='pointer-events-none fixed bottom-3 left-3 z-[60] select-none rounded-full border border-black/10 bg-docduit-lightyellow px-3 py-1 text-xs font-bold uppercase tracking-wide text-black shadow-md'
    >
      Dev
    </div>
  );
}
