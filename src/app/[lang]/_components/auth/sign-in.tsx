'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { safeSendGAEvent } from '@/lib/analytics';
import { signInWithEmail, mapFirebaseAuthError } from '@/services/firebase-auth.service';
import { signInSchema } from '@/lib/security/schemas/firebase-auth';

interface AuthSignInProps {
  vocabularies: any;
  onSuccess: () => void;
  /** Signed in, but the address still needs confirming. */
  onNeedsVerification: () => void;
  onForgotPassword: () => void;
}

export default function AuthSignIn({
  vocabularies,
  onSuccess,
  onNeedsVerification,
  onForgotPassword,
}: AuthSignInProps) {
  const {
    common: { signIn },
    auth: {
      signIn: {
        email: emailText,
        password: passwordText,
        emailPlaceholder,
        passwordPlaceholder,
        forgotPassword: forgotPasswordText,
      },
      errors,
    },
  } = vocabularies;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    const parsed = signInSchema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? errors.allFieldsRequired);
      return;
    }

    setLoading(true);
    try {
      const credential = await signInWithEmail(parsed.data.email, parsed.data.password);
      safeSendGAEvent('event', 'manual_sign_in', { method: 'password' });

      // The NextAuth session is minted by the auth bridge once Firebase
      // reports the new user, so there is nothing to await here.
      if (!credential.user.emailVerified) {
        onNeedsVerification();
        return;
      }
      onSuccess();
    } catch (error) {
      console.error('Email sign-in failed:', error);
      toast.error(mapFirebaseAuthError(error, 'signin', errors));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='flex flex-col gap-2'>
        <Label htmlFor='signin-email' className='text-gray-500'>
          {emailText}
        </Label>
        <Input
          id='signin-email'
          type='email'
          autoComplete='email'
          className='rounded-full bg-docduit-gray/40 border-0'
          placeholder={emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className='flex flex-col gap-2'>
        <Label htmlFor='signin-password' className='text-gray-500'>
          {passwordText}
        </Label>
        <Input
          id='signin-password'
          type='password'
          autoComplete='current-password'
          className='rounded-full bg-docduit-gray/40 border-0'
          placeholder={passwordPlaceholder}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
        />
      </div>
      <button
        type='button'
        onClick={onForgotPassword}
        className='self-start text-sm text-docduit-red hover:underline'
      >
        {forgotPasswordText}
      </button>
      <div className='flex justify-center'>
        <Button
          variant='red'
          disabled={!email || !password || loading}
          onClick={handleSignIn}
        >
          <p className='px-4 flex items-center gap-2'>
            {loading && <Loader2 className='animate-spin' />} {signIn}
          </p>
        </Button>
      </div>
    </>
  );
}
