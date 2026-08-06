'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
  /**
   * True when the Google credential can no longer be re-minted, which is the
   * only case a user actually has to sign in again to clear.
   */
  needsReauth: boolean;
};

const FirebaseAuthContext = createContext<FirebaseAuthValue>({
  firebaseUser: null,
  status: 'loading',
  retry: () => {},
  needsReauth: false,
});

export const useFirebaseAuth = () => useContext(FirebaseAuthContext);

export function FirebaseAuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status: sessionStatus, update } = useSession();
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [authResolved, setAuthResolved] = useState(false);
  const [signInFailed, setSignInFailed] = useState(false);
  const [retryToken, setRetryToken] = useState(0);
  // Exchanging the same credential again always fails the same way, so each
  // one is attempted once instead of re-firing whenever `firebaseUser` changes.
  const attemptedCredential = useRef<string | null>(null);
  // Guards the silent self-heal below so a genuinely dead credential settles
  // into an error instead of looping refresh -> fail -> refresh.
  const recoveryAttempted = useRef(false);

  const sessionEmail = session?.user?.email;
  const idToken = session?.user?.idToken;
  const googleAccessToken = session?.user?.googleAccessToken;
  const sessionError = session?.error;

  useEffect(() => {
    if (!firebaseAuth) {
      setAuthResolved(true);
      return;
    }

    return onAuthStateChanged(firebaseAuth, (user) => {
      setFirebaseUser(user);
      setAuthResolved(true);
      if (user) {
        setSignInFailed(false);
        recoveryAttempted.current = false;
      }
    });
  }, []);

  useEffect(() => {
    if (!firebaseAuth) return;

    if (sessionStatus === 'authenticated') {
      const alreadyMatchingUser =
        firebaseUser?.email && sessionEmail && firebaseUser.email === sessionEmail;
      if (alreadyMatchingUser) return;

      if (sessionError === 'GoogleRefreshError') {
        // The Google credential expired and could not be re-minted, so there is
        // nothing worth exchanging until the user signs in again.
        setSignInFailed(true);
        return;
      }

      if (!idToken && !googleAccessToken) {
        // Signed in without a Google credential (credentials provider), so
        // there is nothing to exchange and Firestore stays unavailable.
        setSignInFailed(true);
        return;
      }

      const credentialKey = `${sessionEmail ?? ''}:${idToken ?? googleAccessToken}`;
      if (attemptedCredential.current === credentialKey) return;
      attemptedCredential.current = credentialKey;

      setSignInFailed(false);
      const credential = GoogleAuthProvider.credential(
        idToken ?? undefined,
        googleAccessToken ?? undefined,
      );

      signInWithCredential(firebaseAuth, credential).catch(async (error) => {
        console.error('Firebase sign-in failed:', error);

        // The stored Google credential has most likely just aged out. Pulling a
        // fresh session re-mints it server-side, so heal silently once before
        // making this the user's problem.
        if (!recoveryAttempted.current) {
          recoveryAttempted.current = true;
          attemptedCredential.current = null;
          try {
            await update();
            setRetryToken((value) => value + 1);
            return;
          } catch (refreshError) {
            console.error('Session refresh failed:', refreshError);
          }
        }

        setSignInFailed(true);
      });
      return;
    }

    if (sessionStatus === 'unauthenticated' && firebaseAuth.currentUser) {
      attemptedCredential.current = null;
      firebaseSignOut(firebaseAuth).catch(() => {});
    }
  }, [
    sessionStatus,
    sessionEmail,
    idToken,
    googleAccessToken,
    sessionError,
    firebaseUser,
    retryToken,
  ]);

  /**
   * Replaying the same expired credential can only fail again, so the session
   * is refreshed first to pick up a newly minted Google ID token.
   */
  const retry = useCallback(() => {
    attemptedCredential.current = null;
    setSignInFailed(false);
    void Promise.resolve(update()).finally(() => {
      setRetryToken((token) => token + 1);
    });
  }, [update]);

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

  const needsReauth = sessionError === 'GoogleRefreshError';

  const value = useMemo(
    () => ({ firebaseUser, status, retry, needsReauth }),
    [firebaseUser, status, retry, needsReauth],
  );

  return (
    <FirebaseAuthContext.Provider value={value}>
      {children}
    </FirebaseAuthContext.Provider>
  );
}
