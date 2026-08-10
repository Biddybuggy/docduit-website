import { AuthOptions, DefaultUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { firebaseIdTokenSchema } from '@/lib/security/schemas/firebase-auth';
import { verifyFirebaseIdToken } from '@/lib/server/firebase-id-token';

const trimEnv = (value?: string) => value?.trim();

const nextAuthUrl =
  trimEnv(process.env.NEXTAUTH_URL) ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000');

process.env.NEXTAUTH_URL = nextAuthUrl;

declare module 'next-auth' {
  interface User {
    uid?: string;
    /**
     * Named `isEmailVerified` rather than `emailVerified` because `AdapterUser`
     * extends this interface and declares `emailVerified: Date | null`.
     * It surfaces as `emailVerified: boolean` on the JWT and the session.
     */
    isEmailVerified?: boolean;
    provider?: string;
    /** Legacy backend fields. Always undefined for Firebase-backed sessions. */
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    username?: string;
  }

  interface Session {
    user: {
      uid?: string;
      emailVerified?: boolean;
      provider?: string;
      username?: string;
      email?: string;
      name?: string;
      image?: string;
      /** Legacy backend fields. Always undefined for Firebase-backed sessions. */
      accessToken?: string;
      refreshToken?: string;
      expiresAt?: number;
    } & DefaultUser;

    error?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    uid?: string;
    emailVerified?: boolean;
    provider?: string;
    username?: string;
    email?: string;
    name?: string;
    image?: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    error?: string;
  }
}

export const authOptions: AuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  logger: {
    error(code, metadata) {
      console.error('[next-auth][error]', code, metadata);
    },
    warn(code) {
      console.warn('[next-auth][warn]', code);
    },
    debug(code, metadata) {
      if (process.env.NODE_ENV === 'development') {
        console.debug('[next-auth][debug]', code, metadata);
      }
    },
  },
  providers: [
    /**
     * Firebase Auth is the identity source of truth for every sign-in method
     * (Google and email/password alike). The browser signs in with the Firebase
     * SDK, then hands the resulting ID token here so a server session can be
     * minted from claims we have verified ourselves.
     *
     * The token is the *only* input: uid, email and verification status all
     * come out of the signature-checked payload, so none of it is spoofable.
     */
    CredentialsProvider({
      id: 'firebase',
      name: 'Firebase',
      credentials: {
        idToken: { label: 'Firebase ID token', type: 'text' },
      },
      async authorize(credentials) {
        const parsed = firebaseIdTokenSchema.safeParse(credentials);
        if (!parsed.success) return null;

        try {
          const verified = await verifyFirebaseIdToken(parsed.data.idToken);
          return {
            id: verified.uid,
            uid: verified.uid,
            email: verified.email ?? undefined,
            name: verified.name ?? undefined,
            image: verified.picture ?? undefined,
            isEmailVerified: verified.emailVerified,
            provider: verified.provider,
          };
        } catch (error) {
          console.error('Firebase ID token rejected:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Sign-in: seed the token from the verified claims.
      if (user) {
        return {
          ...token,
          uid: user.uid,
          email: user.email ?? undefined,
          name: user.name ?? undefined,
          image: user.image ?? undefined,
          emailVerified: user.isEmailVerified === true,
          provider: user.provider,
          username: user.email ?? user.name ?? undefined,
        };
      }

      /**
       * Nothing in this token expires, so unlike the old Google flow there is
       * no refresh to do here. The one claim that genuinely changes mid-session
       * is `emailVerified`, when the user clicks the link in their inbox. The
       * client re-posts a freshly minted ID token to pick that up.
       */
      if (trigger === 'update' && typeof session?.idToken === 'string') {
        try {
          const verified = await verifyFirebaseIdToken(session.idToken);
          // Without this guard, anyone holding a valid Firebase token for *any*
          // account could rewrite this session's identity via POST /api/auth/session.
          if (verified.uid !== token.uid) return token;

          return {
            ...token,
            email: verified.email ?? undefined,
            name: verified.name ?? undefined,
            image: verified.picture ?? undefined,
            emailVerified: verified.emailVerified,
            username: verified.email ?? verified.name ?? undefined,
          };
        } catch (error) {
          console.error('Session update rejected:', error);
          return token;
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        uid: token.uid,
        email: token.email,
        name: token.name,
        image: token.image,
        emailVerified: token.emailVerified === true,
        provider: token.provider,
        // Still read by the legacy profile lookups in `useAuth` and
        // `authentication-section`; keeping it populated avoids collateral there.
        username: token.username,
      };
      session.error = token.error;
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60, // refresh session token every hour
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === 'production'
          ? '__Secure-next-auth.session-token'
          : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax' as const,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
