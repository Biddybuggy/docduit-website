'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { signIn } from 'next-auth/react';

const ERROR_HELP: Record<string, string> = {
  Configuration:
    'Server auth configuration is invalid. Check Vercel env vars such as NEXTAUTH_URL, NEXTAUTH_SECRET, NEXT_PUBLIC_GOOGLE_CLIENT_ID, and GOOGLE_CLIENT_SECRET.',
  OAuthSignin:
    'Google sign-in could not be started. This usually means the Google OAuth client settings or callback domain configuration are wrong.',
  OAuthCallback:
    'Google returned to the app, but the callback could not be completed. This is commonly caused by cookie/state issues or a domain mismatch between the login start URL and callback URL.',
  Callback:
    'The OAuth callback handler failed. This often points to Vercel environment variables, token exchange issues, or a server-side auth error during callback processing.',
  AccessDenied:
    'Access was denied during sign-in.',
  Default:
    'A general authentication error occurred.',
};

function LoginPageContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  useEffect(() => {
    if (status === 'authenticated') {
      router.push(callbackUrl);
    } else if (status === 'unauthenticated' && !error) {
      // Only auto sign-in if there's no error
      signIn('google', { callbackUrl });
    }
  }, [status, router, callbackUrl, error]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    const helpText =
      ERROR_HELP[error] ||
      `Authentication returned the error code "${error}". Check the Vercel function logs for the matching NextAuth error entry.`;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-xl px-6">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Login Failed</h1>
          <p className="text-gray-600 mb-2">{helpText}</p>
          <p className="text-sm text-gray-500 mb-6">
            Error code: <span className="font-mono">{error}</span>
          </p>
          <button
            onClick={() => signIn('google', { callbackUrl })}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return null; // Will redirect
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div>Loading...</div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}
