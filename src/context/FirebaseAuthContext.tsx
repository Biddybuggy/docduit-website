'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useSession } from 'next-auth/react';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';
import { firebaseAuth } from '@/lib/firebase';

/**
 * Firestore reads are authorized by the *Firebase* user, which is a separate
 * session from NextAuth: it is minted by exchanging the Google credential kept
 * in the NextAuth JWT. That exchange can fail (a Google ID token expires after
 * about an hour, so a still-valid NextAuth cookie can carry a stale one), and
 * when it does, every Firestore read fails. Consumers need to distinguish
 * "still connecting" and "could not connect" from "no data", otherwise a failed
 * exchange silently renders as an empty list.
 */
export type FirebaseAuthStatus =
  | 'loading'
  | 'signed-in'
  | 'signed-out'
  | 'error';

type FirebaseAuthValue = {
  firebaseUser: User | null;
  status: FirebaseAuthStatus;
  /** Re-attempts the credential exchange after a failure. */
  retry: () => void;
};

const FirebaseAuthContext = createContext<FirebaseAuthValue>({
  firebaseUser: null,
  status: 'loading',
  retry: () => {},
});

export const useFirebaseAuth = () => useContext(FirebaseAuthContext);

export function FirebaseAuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status: sessionStatus } = useSession();
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [authResolved, setAuthResolved] = useState(false);
  const [signInFailed, setSignInFailed] = useState(false);
  const [retryToken, setRetryToken] = useState(0);

  const sessionEmail = session?.user?.email;
  const idToken = session?.user?.idToken;
  const googleAccessToken = session?.user?.googleAccessToken;

  useEffect(() => {
    if (!firebaseAuth) {
      setAuthResolved(true);
      return;
    }

    return onAuthStateChanged(firebaseAuth, (user) => {
      setFirebaseUser(user);
      setAuthResolved(true);
      if (user) setSignInFailed(false);
    });
  }, []);

  useEffect(() => {
    if (!firebaseAuth) return;

    if (sessionStatus === 'authenticated') {
      const alreadyMatchingUser =
        firebaseUser?.email && sessionEmail && firebaseUser.email === sessionEmail;
      if (alreadyMatchingUser) return;

      if (!idToken && !googleAccessToken) {
        // Signed in without a Google credential (credentials provider), so
        // there is nothing to exchange and Firestore stays unavailable.
        setSignInFailed(true);
        return;
      }

      setSignInFailed(false);
      const credential = GoogleAuthProvider.credential(
        idToken ?? undefined,
        googleAccessToken ?? undefined,
      );

      signInWithCredential(firebaseAuth, credential).catch((error) => {
        console.error('Firebase sign-in failed:', error);
        setSignInFailed(true);
      });
      return;
    }

    if (sessionStatus === 'unauthenticated' && firebaseAuth.currentUser) {
      firebaseSignOut(firebaseAuth).catch(() => {});
    }
  }, [
    sessionStatus,
    sessionEmail,
    idToken,
    googleAccessToken,
    firebaseUser,
    retryToken,
  ]);

  const retry = useCallback(() => {
    setSignInFailed(false);
    setRetryToken((token) => token + 1);
  }, []);

  const status: FirebaseAuthStatus = useMemo(() => {
    if (firebaseUser) return 'signed-in';
    if (!authResolved || sessionStatus === 'loading') return 'loading';
    if (sessionStatus === 'authenticated') {
      // Authenticated with NextAuth but no Firebase user yet: either the
      // exchange is still in flight (loading) or it failed (error).
      return signInFailed ? 'error' : 'loading';
    }
    return 'signed-out';
  }, [firebaseUser, authResolved, sessionStatus, signInFailed]);

  const value = useMemo(
    () => ({ firebaseUser, status, retry }),
    [firebaseUser, status, retry],
  );

  return (
    <FirebaseAuthContext.Provider value={value}>
      {children}
    </FirebaseAuthContext.Provider>
  );
}
