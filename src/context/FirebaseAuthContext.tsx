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
import { useSession, signIn, signOut as nextAuthSignOut } from 'next-auth/react';
import {
  getRedirectResult,
  onIdTokenChanged,
  reload,
  type User,
} from 'firebase/auth';
import { firebaseAuth } from '@/lib/firebase';

/**
 * Firebase Auth is the identity source of truth for every sign-in method, and
 * this provider is the bridge that keeps the NextAuth server session in step
 * with it.
 *
 * The browser signs in against Firebase directly (Google popup or
 * email/password), then this hands the resulting ID token to the `firebase`
 * NextAuth provider, which verifies it and issues the session cookie that
 * server components read. Firestore, meanwhile, is authorized by the Firebase
 * user itself.
 *
 * Consumers need to tell "still connecting" and "could not connect" apart from
 * "no data", otherwise a failed bridge silently renders as an empty list.
 */
export type FirebaseAuthStatus =
  | 'loading'
  | 'signed-in'
  | 'signed-out'
  | 'error';

type FirebaseAuthValue = {
  firebaseUser: User | null;
  status: FirebaseAuthStatus;
  /** Re-attempts the bridge after a failure. */
  retry: () => void;
  /** True when signing in again is the only way out. */
  needsReauth: boolean;
  /** Whether the signed-in user has confirmed their email address. */
  emailVerified: boolean;
  /** True once the Firebase user and the NextAuth session agree. */
  sessionReady: boolean;
  /**
   * Pulls the verification flag off Firebase and pushes it into the session.
   * Resolves to the current value.
   */
  refreshVerification: () => Promise<boolean>;
  /** Firebase error code from a completed redirect sign-in, if it failed. */
  redirectErrorCode: string | null;
};

const FirebaseAuthContext = createContext<FirebaseAuthValue>({
  firebaseUser: null,
  status: 'loading',
  retry: () => {},
  needsReauth: false,
  emailVerified: false,
  sessionReady: false,
  refreshVerification: async () => false,
  redirectErrorCode: null,
});

export const useFirebaseAuth = () => useContext(FirebaseAuthContext);

/** Stop retrying after this many consecutive failures and let the user decide. */
const MAX_BRIDGE_FAILURES = 2;

export function FirebaseAuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status: sessionStatus, update } = useSession();
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  // Tracked separately from `firebaseUser`: Firebase mutates the same User
  // instance in place, so a flag change on it would not re-render on its own.
  const [emailVerified, setEmailVerified] = useState(false);
  const [authResolved, setAuthResolved] = useState(false);
  const [bridgeFailed, setBridgeFailed] = useState(false);
  const [redirectErrorCode, setRedirectErrorCode] = useState<string | null>(null);
  const [retryToken, setRetryToken] = useState(0);

  // Only one bridge attempt may be in flight; React 18 StrictMode invokes
  // effects twice in development, and both would otherwise mint a session.
  const mintingRef = useRef(false);
  const lastPostedRef = useRef<string | null>(null);
  const failuresRef = useRef(0);
  // One session update per distinct verification value, so a token that keeps
  // disagreeing with the session cannot spin.
  const syncedVerifiedRef = useRef<boolean | null>(null);

  const sessionUid = session?.user?.uid;
  const sessionEmailVerified = session?.user?.emailVerified === true;

  useEffect(() => {
    if (!firebaseAuth) {
      setAuthResolved(true);
      return;
    }

    // Not used to sign in — `onIdTokenChanged` covers that — but this is the
    // only place a failed redirect sign-in surfaces its error.
    getRedirectResult(firebaseAuth).catch((error) => {
      console.error('Google redirect sign-in failed:', error);
      setRedirectErrorCode(error?.code ?? 'auth/internal-error');
    });

    // `onIdTokenChanged` rather than `onAuthStateChanged`: it is a superset that
    // also fires on the roughly hourly silent token refresh, which is how a
    // verification confirmed in another tab eventually reaches this one.
    return onIdTokenChanged(firebaseAuth, (user) => {
      setFirebaseUser(user);
      setEmailVerified(user?.emailVerified ?? false);
      setAuthResolved(true);
      if (user) {
        failuresRef.current = 0;
        setBridgeFailed(false);
      }
    });
  }, []);

  useEffect(() => {
    if (!firebaseAuth) return;
    if (!authResolved || sessionStatus === 'loading') return;

    // Firebase is signed out, so any leftover NextAuth cookie is stale.
    if (!firebaseUser) {
      if (sessionStatus === 'authenticated') {
        void nextAuthSignOut({ redirect: false });
      }
      return;
    }

    const needsMint =
      sessionStatus === 'unauthenticated' || sessionUid !== firebaseUser.uid;
    const needsUpdate = !needsMint && sessionEmailVerified !== emailVerified;

    if (!needsMint && !needsUpdate) return;
    if (mintingRef.current) return;
    if (failuresRef.current >= MAX_BRIDGE_FAILURES) {
      setBridgeFailed(true);
      return;
    }
    if (needsUpdate) {
      if (syncedVerifiedRef.current === emailVerified) return;
      syncedVerifiedRef.current = emailVerified;
    }

    mintingRef.current = true;
    firebaseUser
      .getIdToken(needsUpdate)
      .then(async (idToken) => {
        if (!needsMint && lastPostedRef.current === idToken) return;
        lastPostedRef.current = idToken;

        if (needsMint) {
          const result = await signIn('firebase', { idToken, redirect: false });
          if (!result?.ok) throw new Error(result?.error ?? 'Session mint failed');
        } else {
          await update({ idToken });
        }

        failuresRef.current = 0;
        setBridgeFailed(false);
      })
      .catch((error) => {
        failuresRef.current += 1;
        console.error('Firebase session bridge failed:', error);
      })
      .finally(() => {
        mintingRef.current = false;
      });
  }, [
    authResolved,
    sessionStatus,
    sessionUid,
    sessionEmailVerified,
    firebaseUser,
    emailVerified,
    retryToken,
    update,
  ]);

  const retry = useCallback(() => {
    failuresRef.current = 0;
    lastPostedRef.current = null;
    syncedVerifiedRef.current = null;
    setBridgeFailed(false);
    setRetryToken((token) => token + 1);
  }, []);

  /**
   * `reload` refreshes the local user record, but the cached ID token still
   * carries the old `email_verified` claim — the forced refresh is what
   * actually mints a token the server will accept as verified.
   */
  const refreshVerification = useCallback(async () => {
    const user = firebaseAuth?.currentUser;
    if (!user) return false;

    await reload(user);
    const idToken = await user.getIdToken(true);
    setEmailVerified(user.emailVerified);

    if (user.emailVerified) {
      syncedVerifiedRef.current = true;
      lastPostedRef.current = idToken;
      await update({ idToken });
    }
    return user.emailVerified;
  }, [update]);

  const sessionReady =
    sessionStatus === 'authenticated' &&
    Boolean(firebaseUser) &&
    sessionUid === firebaseUser?.uid;

  const status: FirebaseAuthStatus = useMemo(() => {
    if (bridgeFailed) return 'error';
    if (!authResolved || sessionStatus === 'loading') return 'loading';
    if (!firebaseUser) return 'signed-out';
    // Signed in to Firebase but the session has not caught up yet.
    return sessionReady ? 'signed-in' : 'loading';
  }, [bridgeFailed, authResolved, sessionStatus, firebaseUser, sessionReady]);

  // With a live Firebase user a retry can still succeed; only a missing one
  // genuinely requires signing in again.
  const needsReauth = bridgeFailed && !firebaseUser;

  const value = useMemo(
    () => ({
      firebaseUser,
      status,
      retry,
      needsReauth,
      emailVerified,
      sessionReady,
      refreshVerification,
      redirectErrorCode,
    }),
    [
      firebaseUser,
      status,
      retry,
      needsReauth,
      emailVerified,
      sessionReady,
      refreshVerification,
      redirectErrorCode,
    ],
  );

  return (
    <FirebaseAuthContext.Provider value={value}>
      {children}
    </FirebaseAuthContext.Provider>
  );
}
