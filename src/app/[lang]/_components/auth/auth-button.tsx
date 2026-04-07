'use client';
import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

interface AuthButtonProps {
  vocabularies: any;
}

export default function AuthButton({ vocabularies }: AuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    common: { signIn: signInText },
  } = vocabularies;

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl: window.location.href });
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant='red' onClick={handleSignIn} disabled={isLoading}>
      {isLoading ? 'Signing in...' : signInText}
    </Button>
  );
}
