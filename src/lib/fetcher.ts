import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

interface FetcherOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  isMultipart?: boolean;
}

const fetcher = async <T>(
  url: string,
  accessToken?: string,
  options: FetcherOptions = {},
): Promise<T> => {
  const {
    method = 'GET',
    body,
    isMultipart = false,
  } = options;

  let token: string | undefined = accessToken;

  const headers: Record<string, string> = {};
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }

  if (token && token !== '') {
    let session = await getSession();

    if (!session || session.error === 'RefreshAccessTokenError') {
      await signOut({ redirect: false });
      throw new Error('Session invalid');
    }

    const now = Date.now();
    const expiresAt = session.user?.expiresAt ?? 0;
    const timeLeft = expiresAt - now;

    if (timeLeft < 60_000) {
      await fetch('/api/auth/session');
      session = await getSession();
    }

    token = session?.user?.accessToken;

    if (!token) {
      await signOut({ redirect: false });
      throw new Error('Token tidak tersedia');
    }
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await axios({
    method,
    url,
    headers,
    data: body,
  });

  return response.data;
};

export default fetcher;
