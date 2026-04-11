'use client';
import { SessionProvider, useSession } from 'next-auth/react';
import { ReactNode, useEffect } from 'react';
import { firebaseAuth } from '@/lib/firebase';
import {
  GoogleAuthProvider,
  signInWithCredential,
  signOut as firebaseSignOut,
} from 'firebase/auth';

function FirebaseAuthSync({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!firebaseAuth) return;

    if (status === 'authenticated' && session?.user?.accessToken) {
      if (!firebaseAuth.currentUser) {
        const credential = GoogleAuthProvider.credential(
          session.user.idToken ?? undefined,
          session.user.accessToken ?? undefined,
        );

        signInWithCredential(firebaseAuth, credential).catch((error) => {
          console.error('Firebase sign-in failed:', error);
        });
      }
      return;
    }

    if (status === 'unauthenticated' && firebaseAuth.currentUser) {
      firebaseSignOut(firebaseAuth).catch(() => {});
    }
  }, [status, session]);

  return <>{children}</>;
}

export default function SessionProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <FirebaseAuthSync>{children}</FirebaseAuthSync>
    </SessionProvider>
  );
}
