'use client';
import { Button } from '@/components/ui/button';
import { Loader2, MailCheck } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';
import { useAuth } from '@/hooks/useAuth';
import { resendVerificationEmail, mapFirebaseAuthError } from '@/services/firebase-auth.service';

/** Firebase throttles verification emails; don't let users walk into that. */
const RESEND_COOLDOWN_SECONDS = 60;

interface VerifyEmailGateProps {
  vocabularies: any;
}

export default function VerifyEmailGate({ vocabularies }: VerifyEmailGateProps) {
  const {
    common: { signOut: signOutText },
    auth: {
      verifyEmail: {
        title,
        sentTo,
        instructions,
        resend,
        resending,
        resent,
        resendCooldown,
        checkAgain,
        checking,
        notVerifiedYet,
        useAnotherAccount,
      },
      errors,
    },
  } = vocabularies;

  const { firebaseUser, refreshVerification } = useFirebaseAuth();
  const { logout } = useAuth();

  const [cooldown, setCooldown] = useState(0);
  const [sending, setSending] = useState(false);
  const [checkingNow, setCheckingNow] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    intervalRef.current = setInterval(() => {
      setCooldown((seconds) => (seconds <= 1 ? 0 : seconds - 1));
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [cooldown > 0]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleResend = useCallback(async () => {
    if (!firebaseUser || cooldown > 0) return;
    setSending(true);
    try {
      await resendVerificationEmail(firebaseUser);
      setCooldown(RESEND_COOLDOWN_SECONDS);
      toast.success(resent);
    } catch (error) {
      console.error('Resending the verification email failed:', error);
      toast.error(mapFirebaseAuthError(error, 'signup', errors));
    } finally {
      setSending(false);
    }
  }, [firebaseUser, cooldown, resent, errors]);

  const handleCheck = useCallback(async () => {
    setCheckingNow(true);
    try {
      const verified = await refreshVerification();
      if (!verified) toast.error(notVerifiedYet);
    } catch (error) {
      console.error('Checking verification status failed:', error);
      toast.error(errors.generic);
    } finally {
      setCheckingNow(false);
    }
  }, [refreshVerification, notVerifiedYet, errors]);

  const email = firebaseUser?.email ?? '';

  return (
    <div className='flex flex-col items-center gap-4 p-8 text-center'>
      <MailCheck className='h-10 w-10 text-docduit-red' />
      <p className='text-2xl font-semibold'>{title}</p>
      <p className='text-gray-600'>{String(sentTo).replace('{email}', email)}</p>
      <p className='text-gray-500'>{instructions}</p>

      <div className='flex flex-col items-center gap-3 sm:flex-row'>
        <Button variant='red' onClick={handleCheck} disabled={checkingNow}>
          <span className='px-4 flex items-center gap-2'>
            {checkingNow && <Loader2 className='animate-spin' />}
            {checkingNow ? checking : checkAgain}
          </span>
        </Button>
        <Button variant='outline' onClick={handleResend} disabled={sending || cooldown > 0}>
          <span className='px-4 flex items-center gap-2'>
            {sending && <Loader2 className='animate-spin' />}
            {sending
              ? resending
              : cooldown > 0
              ? String(resendCooldown).replace('{seconds}', String(cooldown))
              : resend}
          </span>
        </Button>
      </div>

      <button
        type='button'
        onClick={() => void logout()}
        className='text-sm text-gray-500 underline'
      >
        {useAnotherAccount ?? signOutText}
      </button>
    </div>
  );
}
