'use client';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Loader2 } from 'lucide-react';

export default function AuthSignInGoogle() {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const callbackUrl = '/';
      await signIn('google', { callbackUrl });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant='red' onClick={handleGoogleSignIn} disabled={loading}>
      <p className='px-4 flex items-center gap-2'>
        {loading && <Loader2 className='animate-spin' />} Google Sign In
      </p>
    </Button>
  );
}
