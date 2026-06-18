'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense, useState } from 'react';
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
  google:
    'Google sign-in could not be completed. Please try signing in again.',
  Default:
    'A general authentication error occurred.',
};

function LoginPageContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    await signIn('google', { callbackUrl });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div>Loading...</div>
      </div>
    );
  }

  const helpText = error ? ERROR_HELP[error] || ERROR_HELP.Default : '';

  return (
    <div className="min-h-screen bg-[#f7faf9] px-5 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-md items-center justify-center">
        <div className="w-full rounded-lg border border-[#dfe7ea] bg-white p-8 text-center shadow-sm">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-docduit-blue">
            Docduit
          </p>
          <h1 className="text-2xl font-bold text-[#16243d]">
            Sign in to continue
          </h1>
          <p className="mt-3 text-sm text-[#607086]">
            This feature is available for signed-in users. Sign in with Google
            and we will bring you back here.
          </p>

          {helpText && (
            <p className="mt-5 rounded-md border border-docduit-red/20 bg-docduit-red/10 px-3 py-2 text-sm text-docduit-red">
              {helpText}
            </p>
          )}

          <button
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
            className="mt-6 w-full rounded-full bg-docduit-blue px-4 py-3 text-sm font-semibold text-white transition hover:bg-docduit-blue/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSigningIn ? 'Signing in...' : 'Sign in with Google'}
          </button>
        </div>
      </div>
    </div>
  );
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
