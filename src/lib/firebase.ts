import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const isFirebaseConfigValid = (config: Record<string, string | undefined>) =>
  Object.values(config).every((value) => typeof value === 'string' && value.length > 0);

let firebaseApp;

if (typeof window !== 'undefined' && isFirebaseConfigValid(firebaseConfig)) {
  try {
    firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  } catch (error) {
    console.error('Firebase initialization failed:', error);
  }
} else if (typeof window !== 'undefined') {
  console.warn('Firebase is not initialized because configuration is missing or invalid.');
}

export const firebaseAuth =
  typeof window !== 'undefined' && firebaseApp ? getAuth(firebaseApp) : undefined;

export const firebaseFirestore =
  typeof window !== 'undefined' && firebaseApp ? getFirestore(firebaseApp) : undefined;

export const googleAuthProvider = new GoogleAuthProvider();
