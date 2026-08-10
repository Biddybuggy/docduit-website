'use client';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  signInWithGoogle,
  isUserCancelledAuth,
  mapFirebaseAuthError,
} from '@/services/firebase-auth.service';
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';
import { safeSendGAEvent } from '@/lib/analytics';

interface AuthSignInGoogleProps {
  vocabularies: any;
  onSuccess?: () => void;
}

export default function AuthSignInGoogle({
  vocabularies,
  onSuccess = () => {},
}: AuthSignInGoogleProps) {
  const {
    auth: { continueWithGoogle, errors },
  } = vocabularies;
  const { redirectErrorCode } = useFirebaseAuth();
  const [loading, setLoading] = useState(false);

  // A redirect sign-in reports its failure only after the page has come back,
  // so the error surfaces here rather than in the click handler.
  useEffect(() => {
    if (redirectErrorCode) {
      toast.error(mapFirebaseAuthError({ code: redirectErrorCode }, 'google', errors));
    }
  }, [redirectErrorCode, errors]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const credential = await signInWithGoogle();
      // `null` means a redirect was started instead; the page is navigating away.
      if (!credential) return;
      safeSendGAEvent('event', 'manual_sign_in', { method: 'google' });
      onSuccess();
    } catch (error) {
      if (!isUserCancelledAuth(error)) {
        console.error('Google sign-in failed:', error);
        toast.error(mapFirebaseAuthError(error, 'google', errors));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant='red' onClick={handleGoogleSignIn} disabled={loading}>
      <p className='px-4 flex items-center gap-2'>
        {loading && <Loader2 className='animate-spin' />} {continueWithGoogle}
      </p>
    </Button>
  );
}
