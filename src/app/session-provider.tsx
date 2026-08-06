'use client';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { FirebaseAuthProvider } from '@/context/FirebaseAuthContext';

/**
 * The session is refetched periodically so the `jwt` callback gets a chance to
 * re-mint the Google ID token before its ~1 hour expiry. Without this, a tab
 * left open past that point holds a stale credential and every Firestore read
 * fails until the user signs out and back in.
 */
const SESSION_REFETCH_SECONDS = 10 * 60;

export default function SessionProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider
      refetchInterval={SESSION_REFETCH_SECONDS}
      refetchOnWindowFocus
    >
      <FirebaseAuthProvider>{children}</FirebaseAuthProvider>
    </SessionProvider>
  );
}
