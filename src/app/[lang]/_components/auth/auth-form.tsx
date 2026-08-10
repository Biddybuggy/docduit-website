'use client';
import { useState } from 'react';
import AuthSignIn from './sign-in';
import AuthSignUp from './sign-up';
import AuthSignInGoogle from './sign-in-google';
import ForgotPassword from './forgot-password';

export type AuthFormView = 'signin' | 'signup' | 'forgot';

interface AuthFormProps {
  vocabularies: any;
  /** Called once a fully verified user has signed in. */
  onAuthenticated?: () => void;
  onViewChange?: (view: AuthFormView) => void;
}

/**
 * The sign-in / sign-up / reset / verify switcher, shared by the auth dialog
 * and the standalone /login page so the two cannot drift apart.
 */
export default function AuthForm({
  vocabularies,
  onAuthenticated = () => {},
  onViewChange = () => {},
}: AuthFormProps) {
  const [view, setView] = useState<AuthFormView>('signin');

  const {
    common: { alreadyHaveAccount, signIn, dontHaveAccount, signUp, or },
  } = vocabularies;

  const go = (next: AuthFormView) => {
    setView(next);
    onViewChange(next);
  };

  if (view === 'forgot') {
    return <ForgotPassword vocabularies={vocabularies} onBack={() => go('signin')} />;
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-4'>
        {view === 'signin' ? (
          <>
            <AuthSignIn
              vocabularies={vocabularies}
              onSuccess={onAuthenticated}
              onForgotPassword={() => go('forgot')}
            />
            <p className='text-start text-gray-500'>
              {dontHaveAccount}&nbsp;
              <button onClick={() => go('signup')} className='text-docduit-red'>
                {signUp}
              </button>
            </p>
          </>
        ) : (
          <>
            <AuthSignUp
              vocabularies={vocabularies}
              onSuccess={onAuthenticated}
              onSignIn={() => go('signin')}
            />
            <p className='text-start text-gray-500'>
              {alreadyHaveAccount}&nbsp;
              <button onClick={() => go('signin')} className='text-docduit-red'>
                {signIn}
              </button>
            </p>
          </>
        )}
      </div>
      <p className='text-xl text-docduit-gray text-center'>{or}</p>
      <div className='flex justify-center'>
        <AuthSignInGoogle vocabularies={vocabularies} onSuccess={onAuthenticated} />
      </div>
    </div>
  );
}
