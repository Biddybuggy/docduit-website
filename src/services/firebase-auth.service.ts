'use client';

import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  updateProfile,
  type User,
  type UserCredential,
} from 'firebase/auth';
import { firebaseAuth, googleAuthProvider } from '@/lib/firebase';

/**
 * Every Firebase Auth call the app makes lives here. Firebase is the identity
 * source of truth: the browser signs in against it directly (so a password
 * never touches our own servers), and `FirebaseAuthContext` mints the NextAuth
 * session from the resulting ID token.
 */

export class FirebaseAuthUnavailableError extends Error {
  constructor() {
    super('Firebase Auth is not initialised.');
    this.name = 'FirebaseAuthUnavailableError';
  }
}

const requireAuth = () => {
  if (!firebaseAuth) throw new FirebaseAuthUnavailableError();
  return firebaseAuth;
};

const errorCode = (error: unknown): string =>
  typeof error === 'object' && error !== null && 'code' in error
    ? String((error as { code: unknown }).code)
    : '';

/** Firebase sends its verification and reset emails in this language. */
export const setAuthLanguage = (lang: string) => {
  if (firebaseAuth) firebaseAuth.languageCode = lang === 'id' ? 'id' : 'en';
};

/**
 * In-app browsers (Instagram, Facebook, Line, WeChat) make `window.open` a
 * no-op, so a popup there fails silently. Go straight to redirect instead.
 */
const isInAppBrowser = () =>
  typeof navigator !== 'undefined' &&
  /(FBAN|FBAV|Instagram|Line\/|MicroMessenger)/i.test(navigator.userAgent);

const POPUP_UNSUPPORTED_CODES = new Set([
  'auth/popup-blocked',
  'auth/operation-not-supported-in-this-environment',
  'auth/web-storage-unsupported',
]);

/** The user closed the popup or opened a second one — not worth a toast. */
export const isUserCancelledAuth = (error: unknown) =>
  errorCode(error) === 'auth/popup-closed-by-user' ||
  errorCode(error) === 'auth/cancelled-popup-request';

/**
 * Popup rather than redirect, because our `authDomain` is the default
 * `*.firebaseapp.com` — a third-party origin. Safari's ITP and Chrome's storage
 * partitioning break the redirect flow's state handoff through that origin,
 * while a popup only needs `postMessage` between opener and popup.
 *
 * Resolves to `null` when a redirect was started instead (the page navigates
 * away; `getRedirectResult` picks it up on the way back).
 */
export const signInWithGoogle = async (): Promise<UserCredential | null> => {
  const auth = requireAuth();

  if (isInAppBrowser()) {
    await signInWithRedirect(auth, googleAuthProvider);
    return null;
  }

  try {
    return await signInWithPopup(auth, googleAuthProvider);
  } catch (error) {
    if (POPUP_UNSUPPORTED_CODES.has(errorCode(error))) {
      await signInWithRedirect(auth, googleAuthProvider);
      return null;
    }
    throw error;
  }
};

export const signInWithEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(requireAuth(), email, password);

export const signUpWithEmail = async (
  email: string,
  password: string,
  fullname: string,
): Promise<UserCredential> => {
  const credential = await createUserWithEmailAndPassword(
    requireAuth(),
    email,
    password,
  );
  if (fullname) {
    await updateProfile(credential.user, { displayName: fullname });
  }
  await sendEmailVerification(credential.user);
  return credential;
};

export const resendVerificationEmail = (user: User) =>
  sendEmailVerification(user);

export const requestPasswordReset = (email: string) =>
  sendPasswordResetEmail(requireAuth(), email);

export const signOutFirebase = async () => {
  if (!firebaseAuth) return;
  await signOut(firebaseAuth).catch(() => {});
};

type ErrorContext = 'signin' | 'signup' | 'reset' | 'google';

/**
 * Maps Firebase error codes onto localised copy.
 *
 * Two constraints shape this. Email enumeration protection (on by default for
 * recent Firebase projects) collapses `user-not-found` and `wrong-password`
 * into `invalid-credential`, so sign-in copy must never reveal whether an
 * address exists. And it makes `fetchSignInMethodsForEmail` useless, so on a
 * collision we cannot say *which* provider the existing account uses — only
 * that one exists.
 */
export const mapFirebaseAuthError = (
  error: unknown,
  context: ErrorContext,
  errors: Record<string, string>,
): string => {
  switch (errorCode(error)) {
    case 'auth/email-already-in-use':
      return errors.emailInUse;
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return errors.invalidCredential;
    case 'auth/invalid-email':
      return errors.invalidEmail;
    case 'auth/weak-password':
      return errors.weakPassword;
    case 'auth/too-many-requests':
      return errors.tooManyRequests;
    case 'auth/user-disabled':
      return errors.userDisabled;
    case 'auth/network-request-failed':
      return errors.network;
    case 'auth/account-exists-with-different-credential':
      return errors.accountExistsDifferentCredential;
    default:
      return context === 'signup' ? errors.signUpFailed : errors.generic;
  }
};
