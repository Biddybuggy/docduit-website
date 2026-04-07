'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { signIn } from 'next-auth/react';

function LoginPageContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (status === 'authenticated') {
      const callbackUrl = searchParams.get('callbackUrl') || '/';
      router.push(callbackUrl);
    } else if (status === 'unauthenticated' && !searchParams.get('error')) {
      // Only auto sign-in if there's no error
      const callbackUrl = searchParams.get('callbackUrl') || '/';
      signIn('google', { callbackUrl });
    }
  }, [status, router, searchParams]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div>Loading...</div>
      </div>
    );
  }

  if (searchParams.get('error')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Login Failed</h1>
          <p className="text-gray-600 mb-4">There was an error during login. Please try again.</p>
          <button
            onClick={() => signIn('google', { callbackUrl: searchParams.get('callbackUrl') || '/' })}
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