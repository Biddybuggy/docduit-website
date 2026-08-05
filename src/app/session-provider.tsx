'use client';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { FirebaseAuthProvider } from '@/context/FirebaseAuthContext';

export default function SessionProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <FirebaseAuthProvider>{children}</FirebaseAuthProvider>
    </SessionProvider>
  );
}
