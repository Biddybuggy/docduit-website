import { AuthOptions, DefaultUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { login, googleLogin, refreshToken } from '@/services/auth.service';
import { LoginPayload, GoogleLoginPayload } from '@/types/auth.type';
import { decode } from 'jsonwebtoken';
import { signOut } from 'next-auth/react';

declare module 'next-auth' {
  interface User {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    username?: string;
  }

  interface Session {
    user: {
      accessToken?: string;
      refreshToken?: string;
      expiresAt?: number;
      username?: string;
    } & DefaultUser;

    error?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    username?: string;
    error?: string;
  }
}

export const authOptions: AuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
      if (account?.provider === 'google') {
        try {
          const payload: GoogleLoginPayload = {
            access_token: account.id_token!,
            provider: 'google',
          };
          const response = await googleLogin(payload);
          const decoded = decode(response.data.access_token) as {
            exp: number;
            username: string;
          };

          token.accessToken = response.data.access_token;
          token.refreshToken = response.data.refresh_token;
          token.expiresAt = decoded.exp * 1000;
          token.username = decoded.username;
        } catch (error) {
          console.error('Google login error:', error);
          throw new Error('Google login failed');
        }
      }

      if (user && !account?.provider) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          expiresAt: user.expiresAt,
          username: user.username,
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
          };
        } catch (error) {
          console.error('Error refreshing token:', error);
          await signOut({ redirect: false });
          return {
            ...token,
            error: 'RefreshAccessTokenError',
          };
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token.error === 'RefreshAccessTokenError') {
        return {
          ...session,
          user: {}, 
          expires: new Date(0).toISOString(), 
        };
      }
      session.user = {
        ...session.user,
        accessToken: token.accessToken as string,
        refreshToken: token.refreshToken as string,
        expiresAt: token.expiresAt as number,
        username: token.username as string,
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
