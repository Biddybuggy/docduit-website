import { AuthOptions, DefaultUser } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { login, googleLogin, refreshToken } from '@/services/auth.service';
import { LoginPayload, GoogleLoginPayload } from '@/types/auth.type';
import { decode } from 'jsonwebtoken';

const trimEnv = (value?: string) => value?.trim();
const maskValue = (value?: string) => {
  if (!value) return '(missing)';
  if (value.length <= 8) return `${value[0]}***${value[value.length - 1]}`;
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
};

const googleClientId = trimEnv(
  process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
);
const googleClientSecret = trimEnv(process.env.GOOGLE_CLIENT_SECRET);

const nextAuthUrl =
  trimEnv(process.env.NEXTAUTH_URL) ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000');

process.env.NEXTAUTH_URL = nextAuthUrl;

declare module 'next-auth' {
  interface User {
    accessToken?: string;
    idToken?: string;
    googleAccessToken?: string;
    googleRefreshToken?: string;
    googleTokenExpiresAt?: number;
    refreshToken?: string;
    expiresAt?: number;
    username?: string;
    email?: string;
    name?: string;
    image?: string;
  }

  interface Session {
    user: {
      accessToken?: string;
      idToken?: string;
      googleAccessToken?: string;
      googleTokenExpiresAt?: number;
      refreshToken?: string;
      expiresAt?: number;
      username?: string;
      email?: string;
      name?: string;
      image?: string;
    } & DefaultUser;

    error?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    idToken?: string;
    googleAccessToken?: string;
    googleRefreshToken?: string;
    googleTokenExpiresAt?: number;
    refreshToken?: string;
    expiresAt?: number;
    username?: string;
    email?: string;
    name?: string;
    image?: string;
    error?: string;
  }
}

const GOOGLE_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';

/** Expiry of a Google ID token, in ms. Falls back to the account's own expiry. */
const googleTokenExpiry = (idToken?: string, expiresAtSeconds?: number) => {
  if (idToken) {
    const decoded = decode(idToken) as { exp?: number } | null;
    if (decoded?.exp) return decoded.exp * 1000;
  }
  if (expiresAtSeconds) return expiresAtSeconds * 1000;
  return Date.now() + 60 * 60 * 1000;
};

/**
 * Firestore reads are authorized by exchanging this Google ID token for a
 * Firebase session, but a Google ID token only lives about an hour while the
 * NextAuth session lasts 24. Without refreshing it here, the exchange starts
 * failing an hour after sign-in and every Firestore read fails until the user
 * signs out and back in.
 */
const refreshGoogleIdToken = async (token: JWT): Promise<JWT> => {
  if (!token.googleRefreshToken || !googleClientId || !googleClientSecret) {
    return { ...token, error: 'GoogleRefreshError' };
  }

  try {
    const response = await fetch(GOOGLE_TOKEN_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: googleClientId,
        client_secret: googleClientSecret,
        refresh_token: token.googleRefreshToken,
        grant_type: 'refresh_token',
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error_description || data.error || 'Refresh failed');
    }

    const refreshed: JWT = {
      ...token,
      idToken: data.id_token ?? token.idToken,
      googleAccessToken: data.access_token ?? token.googleAccessToken,
      // Google only returns a new refresh token when it rotates one.
      googleRefreshToken: data.refresh_token ?? token.googleRefreshToken,
      googleTokenExpiresAt: googleTokenExpiry(
        data.id_token,
        data.expires_in ? Math.floor(Date.now() / 1000) + data.expires_in : undefined,
      ),
    };
    delete refreshed.error;
    return refreshed;
  } catch (error) {
    console.error('Error refreshing Google ID token:', error);
    return { ...token, error: 'GoogleRefreshError' };
  }
};

export const authOptions: AuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  logger: {
    error(code, metadata) {
      if (code === 'OAUTH_CALLBACK_ERROR' || code === 'SIGNIN_OAUTH_ERROR') {
        console.error('[next-auth][error]', code, {
          ...metadata,
          authConfig: {
            nextAuthUrl,
            googleClientId: maskValue(googleClientId),
            googleClientSecretLength: googleClientSecret?.length ?? 0,
          },
        });
        return;
      }
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
    GoogleProvider({
      clientId: googleClientId!,
      clientSecret: googleClientSecret!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
          scope: 'openid email profile',
        },
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        access_token: { label: 'Google Access Token', type: 'text' },
      },
      async authorize(credentials) {
        if (credentials?.username && credentials?.password) {
          try {
            const payload: LoginPayload = {
              username: credentials.username,
              password: credentials.password,
            };
            const response = await login(payload);
            const decoded = decode(response.data.access_token) as {
              exp: number;
              username: string;
            };

            return {
              id: response.data.access_token,
              accessToken: response.data.access_token,
              refreshToken: response.data.refresh_token,
              expiresAt: decoded.exp * 1000,
              username: decoded.username,
            };
          } catch (error) {
            console.error('Error logging in:', error);
            return null;
          }
        }

        if (credentials?.access_token) {
          try {
            const payload: GoogleLoginPayload = {
              access_token: credentials.access_token,
              provider: 'google',
            };
            const response = await googleLogin(payload);
            const decoded = decode(response.data.access_token) as {
              exp: number;
              username: string;
            };

            return {
              id: response.data.access_token,
              accessToken: response.data.access_token,
              refreshToken: response.data.refresh_token,
              expiresAt: decoded.exp * 1000,
              username: decoded.username,
            };
          } catch (error) {
            console.error('Error logging in with Google:', error);
            return null;
          }
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === 'google' && account.access_token) {
        token.idToken = account.id_token;
        token.googleAccessToken = account.access_token;
        // Kept so the ID token can be re-minted once it expires; Google only
        // returns a refresh token on consent, which `prompt: 'consent'` forces.
        token.googleRefreshToken =
          account.refresh_token ?? token.googleRefreshToken;
        token.googleTokenExpiresAt = googleTokenExpiry(
          account.id_token,
          account.expires_at,
        );
        token.email = user?.email ?? token.email;
        token.name = user?.name ?? token.name;
        token.image = user?.image ?? token.image;
        token.username =
          user?.email ?? user?.name ?? token.username ?? token.email;

        delete token.error;
        return token;
      }

      if (user && !account?.provider) {
        return {
          ...token,
          idToken: user.idToken,
          googleAccessToken: user.googleAccessToken,
          googleRefreshToken: user.googleRefreshToken,
          googleTokenExpiresAt: user.googleTokenExpiresAt,
          username: user.username,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      }

      const refreshThreshold = 60 * 1000; // 1 minute before expiration
      const now = Date.now();

      // Keep the Google ID token alive for the whole NextAuth session, not just
      // its own ~1 hour lifetime, otherwise Firestore reads start failing.
      if (
        token.idToken &&
        token.googleTokenExpiresAt &&
        now > token.googleTokenExpiresAt - refreshThreshold
      ) {
        return refreshGoogleIdToken(token);
      }

      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        accessToken: token.accessToken as string,
        idToken: token.idToken as string,
        googleAccessToken: token.googleAccessToken as string,
        googleTokenExpiresAt: token.googleTokenExpiresAt as number,
        refreshToken: token.refreshToken as string,
        expiresAt: token.expiresAt as number,
        username: token.username as string,
        email: token.email as string,
        name: token.name as string,
        image: token.image as string,
      };
      session.error = token.error as string | undefined;
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60,   // refresh session token every hour
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === 'production'
          ? '__Secure-next-auth.session-token'
          : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax' as const, // 'strict' breaks OAuth redirects
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
