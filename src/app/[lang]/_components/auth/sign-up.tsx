'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { safeSendGAEvent } from '@/lib/analytics';
import { signUpWithEmail, mapFirebaseAuthError } from '@/services/firebase-auth.service';
import { signUpSchema } from '@/lib/security/schemas/firebase-auth';

interface AuthSignUpProps {
  vocabularies: any;
  onSuccess: () => void;
  onSignIn: () => void;
}

export default function AuthSignUp({
  vocabularies,
  onSuccess,
  onSignIn,
}: AuthSignUpProps) {
  const {
    common: { signUp, signIn },
    auth: {
      signUp: {
        email: emailText,
        password: passwordText,
        confirmPassword: confirmPasswordText,
        fullname: fullnameText,
        emailPlaceholder,
        passwordPlaceholder,
        confirmPasswordPlaceholder,
        fullnamePlaceholder,
      },
      errors,
    },
  } = vocabularies;

  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailTaken, setEmailTaken] = useState(false);

  const onSubmit = async () => {
    const parsed = signUpSchema.safeParse({
      fullname,
      email,
      password,
      confirmPassword,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? errors.allFieldsRequired);
      return;
    }

    setLoading(true);
    setEmailTaken(false);
    try {
      await signUpWithEmail(parsed.data.email, parsed.data.password, parsed.data.fullname);
      safeSendGAEvent('event', 'manual_sign_up', { method: 'password' });
      onSuccess();
    } catch (error) {
      console.error('Sign up failed:', error);
      const code = (error as { code?: string })?.code;
      // Email enumeration protection means we cannot tell *which* provider the
      // existing account uses, so point at both routes rather than guessing.
      if (code === 'auth/email-already-in-use') setEmailTaken(true);
      toast.error(mapFirebaseAuthError(error, 'signup', errors));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='flex flex-col gap-2'>
        <Label htmlFor='signup-fullname' className='text-gray-500'>
          {fullnameText}
        </Label>
        <Input
          id='signup-fullname'
          type='text'
          autoComplete='name'
          className='rounded-full bg-docduit-gray/40 border-0'
          placeholder={fullnamePlaceholder}
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
        />
      </div>
      <div className='flex flex-col gap-2'>
        <Label htmlFor='signup-email' className='text-gray-500'>
          {emailText}
        </Label>
        <Input
          id='signup-email'
          type='email'
          autoComplete='email'
          className='rounded-full bg-docduit-gray/40 border-0'
          placeholder={emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className='flex flex-col gap-2'>
        <Label htmlFor='signup-password' className='text-gray-500'>
          {passwordText}
        </Label>
        <Input
          id='signup-password'
          type='password'
          autoComplete='new-password'
          className='rounded-full bg-docduit-gray/40 border-0'
          placeholder={passwordPlaceholder}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className='flex flex-col gap-2'>
        <Label htmlFor='signup-confirm-password' className='text-gray-500'>
          {confirmPasswordText}
        </Label>
        <Input
          id='signup-confirm-password'
          type='password'
          autoComplete='new-password'
          className='rounded-full bg-docduit-gray/40 border-0'
          placeholder={confirmPasswordPlaceholder}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
        />
      </div>
      {emailTaken && (
        <p className='text-sm text-docduit-red'>
          {errors.emailInUse}{' '}
          <button type='button' onClick={onSignIn} className='underline'>
            {signIn}
          </button>
        </p>
      )}
      <div className='flex justify-center'>
        <Button variant='red' disabled={loading} onClick={onSubmit}>
          <p className='px-4 flex items-center gap-2'>
            {loading && <Loader2 className='animate-spin' />} {signUp}
          </p>
        </Button>
      </div>
    </>
  );
}
