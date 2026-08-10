'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { requestPasswordReset, mapFirebaseAuthError } from '@/services/firebase-auth.service';
import { forgotPasswordSchema } from '@/lib/security/schemas/firebase-auth';

interface ForgotPasswordProps {
  vocabularies: any;
  onBack: () => void;
}

export default function ForgotPassword({ vocabularies, onBack }: ForgotPasswordProps) {
  const {
    auth: {
      signIn: { email: emailText, emailPlaceholder },
      forgotPassword: { description, submit, sent, backToSignIn },
      errors,
    },
  } = vocabularies;

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    const parsed = forgotPasswordSchema.safeParse({ email });
    if (!parsed.success) {
      toast.error(errors.invalidEmail);
      return;
    }

    setLoading(true);
    try {
      await requestPasswordReset(parsed.data.email);
    } catch (error) {
      console.error('Password reset request failed:', error);
      // Anything other than a malformed address or throttling is reported as
      // success anyway — see below.
      const code = (error as { code?: string })?.code;
      if (code === 'auth/invalid-email' || code === 'auth/too-many-requests') {
        toast.error(mapFirebaseAuthError(error, 'reset', errors));
        setLoading(false);
        return;
      }
    }
    // Deliberately identical whether or not the address exists: saying
    // otherwise would turn this form into an account-enumeration oracle.
    setDone(true);
    setLoading(false);
  };

  if (done) {
    return (
      <div className='flex flex-col gap-4'>
        <p className='text-gray-600'>{sent}</p>
        <button type='button' onClick={onBack} className='text-docduit-red hover:underline'>
          {backToSignIn}
        </button>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4'>
      <p className='text-gray-500'>{description}</p>
      <div className='flex flex-col gap-2'>
        <Label htmlFor='reset-email' className='text-gray-500'>
          {emailText}
        </Label>
        <Input
          id='reset-email'
          type='email'
          autoComplete='email'
          className='rounded-full bg-docduit-gray/40 border-0'
          placeholder={emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
      </div>
      <div className='flex justify-center'>
        <Button variant='red' disabled={!email || loading} onClick={handleSubmit}>
          <p className='px-4 flex items-center gap-2'>
            {loading && <Loader2 className='animate-spin' />} {submit}
          </p>
        </Button>
      </div>
      <button type='button' onClick={onBack} className='text-sm text-docduit-red hover:underline'>
        {backToSignIn}
      </button>
    </div>
  );
}
