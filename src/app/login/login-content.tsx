'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import AuthForm, { type AuthFormView } from '../[lang]/_components/auth/auth-form';

/**
 * Only credentials errors are reachable now that Firebase Auth is the identity
 * source of truth — the OAuth callback codes belonged to the old NextAuth
 * Google provider and can no longer be produced.
 */
const ERROR_HELP: Record<string, string> = {
  Configuration:
    'Server auth configuration is invalid. Check the NEXTAUTH_SECRET and NEXT_PUBLIC_FIREBASE_* environment variables.',
  CredentialsSignin:
    'Sign-in could not be completed. Please try again.',
  AccessDenied: 'Access was denied during sign-in.',
  Default: 'A general authentication error occurred.',
};

export default function LoginContent({ vocabularies }: { vocabularies: any }) {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [view, setView] = useState<AuthFormView>('signin');

  useEffect(() => {
    if (status === 'authenticated') {
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  if (status === 'loading') {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div>Loading...</div>
      </div>
    );
  }

  const helpText = error ? ERROR_HELP[error] || ERROR_HELP.Default : '';

  const titles: Record<AuthFormView, string> = {
    signin: vocabularies.auth.signIn.title,
    signup: vocabularies.auth.signUp.title,
    forgot: vocabularies.auth.forgotPassword.title,
    verify: vocabularies.auth.verifyEmail.title,
  };

  return (
    <div className='min-h-screen bg-[#f7faf9] px-5 py-10'>
      <div className='mx-auto flex min-h-[calc(100vh-80px)] max-w-md items-center justify-center'>
        <div className='w-full rounded-lg border border-[#dfe7ea] bg-white p-8 shadow-sm'>
          <p className='mb-2 text-center text-sm font-semibold uppercase tracking-wide text-docduit-blue'>
            Docduit
          </p>
          <h1 className='text-center text-2xl font-bold text-[#16243d]'>
            {titles[view]}
          </h1>

          {helpText && (
            <p className='mt-5 rounded-md border border-docduit-red/20 bg-docduit-red/10 px-3 py-2 text-sm text-docduit-red'>
              {helpText}
            </p>
          )}

          <div className='mt-6'>
            <AuthForm
              vocabularies={vocabularies}
              onViewChange={setView}
              onAuthenticated={() => router.push(callbackUrl)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
