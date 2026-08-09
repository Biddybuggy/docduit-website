import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';

/**
 * Verifies Firebase Auth ID tokens server-side so a NextAuth session can be
 * minted from one. Server-only — never import this from a `'use client'` file.
 *
 * Firebase signs ID tokens with rotating Google keys published as a JWKS, so
 * verification needs nothing but the public project id — no service account.
 * That is why this uses `jose` rather than `firebase-admin`: the only
 * capability we would gain is a token-revocation check, and it would cost a
 * secret that grants full admin over the project.
 */

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

const JWKS_URL =
  'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';

// Module-level so the fetched keys are reused across warm invocations; the set
// also handles Google's key rotation and its own re-fetch cooldown internally.
const jwks = createRemoteJWKSet(new URL(JWKS_URL));

/** Clock skew allowance between Google, Vercel, and a developer's laptop. */
const CLOCK_TOLERANCE_SECONDS = 5;

export class FirebaseIdTokenError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'FirebaseIdTokenError';
  }
}

export type FirebaseSignInProvider = 'google.com' | 'password' | (string & {});

export type VerifiedFirebaseUser = {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  name: string | null;
  picture: string | null;
  provider: FirebaseSignInProvider;
};

type FirebaseClaims = JWTPayload & {
  email?: unknown;
  email_verified?: unknown;
  name?: unknown;
  picture?: unknown;
  user_id?: unknown;
  auth_time?: unknown;
  firebase?: { sign_in_provider?: unknown };
};

const asString = (value: unknown): string | null =>
  typeof value === 'string' && value.length > 0 ? value : null;

/**
 * Resolves to the claims Firebase vouches for, or throws. Everything the caller
 * gets back is signature-verified — there is deliberately no way to pass an
 * email or uid alongside the token, so nothing here is client-controlled.
 */
export async function verifyFirebaseIdToken(
  idToken: string,
): Promise<VerifiedFirebaseUser> {
  if (!PROJECT_ID) {
    throw new FirebaseIdTokenError(
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID is not set, so ID tokens cannot be verified.',
    );
  }

  let payload: FirebaseClaims;
  try {
    // `exp`, `iat` and `nbf` are enforced by jwtVerify. `algorithms` is passed
    // explicitly so a token can never select its own verification algorithm.
    ({ payload } = await jwtVerify(idToken, jwks, {
      algorithms: ['RS256'],
      issuer: `https://securetoken.google.com/${PROJECT_ID}`,
      audience: PROJECT_ID,
      clockTolerance: CLOCK_TOLERANCE_SECONDS,
    }));
  } catch (error) {
    throw new FirebaseIdTokenError('Firebase ID token failed verification.', {
      cause: error,
    });
  }

  // Firebase requires a non-empty `sub`; jose does not check this itself.
  const uid = asString(payload.sub);
  if (!uid) {
    throw new FirebaseIdTokenError('Firebase ID token has no subject.');
  }

  const userId = asString(payload.user_id);
  if (userId && userId !== uid) {
    throw new FirebaseIdTokenError('Firebase ID token subject mismatch.');
  }

  const authTime = payload.auth_time;
  if (typeof authTime !== 'number') {
    throw new FirebaseIdTokenError('Firebase ID token has no auth_time.');
  }
  if (authTime > Date.now() / 1000 + CLOCK_TOLERANCE_SECONDS) {
    throw new FirebaseIdTokenError('Firebase ID token was issued in the future.');
  }

  return {
    uid,
    email: asString(payload.email),
    emailVerified: payload.email_verified === true,
    name: asString(payload.name),
    picture: asString(payload.picture),
    provider: asString(payload.firebase?.sign_in_provider) ?? 'unknown',
  };
}
