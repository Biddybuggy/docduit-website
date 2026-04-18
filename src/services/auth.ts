import { AuthOptions, DefaultUser } from 'next-auth';
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
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

process.env.NEXTAUTH_URL = nextAuthUrl;

declare module 'next-auth' {
  interface User {
    accessToken?: string;
    idToken?: string;
    googleAccessToken?: string;
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
    refreshToken?: string;
    expiresAt?: number;
    username?: string;
    email?: string;
    name?: string;
    image?: string;
    error?: string;
  }
}

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
        try {
          const payload: GoogleLoginPayload = {
            access_token: account.access_token,
            provider: 'google',
          };
          const response = await googleLogin(payload);
          const decoded = decode(response.data.access_token) as {
            exp: number;
            username: string;
          };
          token.accessToken = response.data.access_token;
          token.idToken = account.id_token;
          token.googleAccessToken = account.access_token;
          token.refreshToken = response.data.refresh_token;
          token.expiresAt = decoded.exp * 1000;
          token.username = decoded.username || user?.email || user?.name || token.username;
          token.email = user?.email;
          token.name = user?.name;
          token.image = user?.image;
        } catch (error) {
          console.error('Error logging in with Google backend:', error);
          return {
            ...token,
            error: 'GoogleLoginError',
          };
        }
      }

      if (user && !account?.provider) {
        return {
          ...token,
          accessToken: user.accessToken,
          idToken: user.idToken,
          googleAccessToken: user.googleAccessToken,
          refreshToken: user.refreshToken,
          expiresAt: user.expiresAt,
          username: user.username,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      }

      const refreshThreshold = 60 * 1000; // 1 minute before expiration
      const now = Date.now();

      if (token.expiresAt && now > token.expiresAt - refreshThreshold) {
        try {
          const response = await refreshToken(token.refreshToken as string);
          const decoded = decode(response.data.access_token) as {
            exp: number;
            username: string;
          };

          return {
            ...token,
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token,
            expiresAt: decoded.exp * 1000,
            username: decoded.username,
            idToken: token.idToken,
            googleAccessToken: token.googleAccessToken,
            email: token.email,
            name: token.name,
            image: token.image,
          };
        } catch (error) {
          console.error('Error refreshing token:', error);
          return {
            ...token,
            error: 'RefreshAccessTokenError',
          };
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token.error === 'RefreshAccessTokenError' || token.error === 'GoogleLoginError') {
        return {
          ...session,
          user: {},
          expires: new Date(0).toISOString(),
        };
      }
      session.user = {
        ...session.user,
        accessToken: token.accessToken as string,
        idToken: token.idToken as string,
        googleAccessToken: token.googleAccessToken as string,
        refreshToken: token.refreshToken as string,
        expiresAt: token.expiresAt as number,
        username: token.username as string,
        email: token.email as string,
        name: token.name as string,
        image: token.image as string,
      };
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
