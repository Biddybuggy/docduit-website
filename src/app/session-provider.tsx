'use client';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { FirebaseAuthProvider } from '@/context/FirebaseAuthContext';

export default function SessionProviders({ children }: { children: ReactNode }) {
  // No polling interval: nothing in the session expires early any more, and
  // `FirebaseAuthProvider` pushes the one claim that does change (email
  // verification) as soon as Firebase reports it.
  return (
    <SessionProvider refetchOnWindowFocus>
      <FirebaseAuthProvider>{children}</FirebaseAuthProvider>
    </SessionProvider>
  );
}
