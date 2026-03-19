'use client';

import { sendGAEvent } from '@next/third-parties/google';

export function safeSendGAEvent(
  eventName: string,
  action: string,
  params?: Record<string, unknown>,
) {
  try {
    if (typeof window === 'undefined') return;
    const gtag = (window as any).gtag;
    if (typeof gtag !== 'function') return;
    if (!action) return;
    sendGAEvent(eventName as any, action as any, params as any);
  } catch {
    // ignore analytics failures
  }
}

