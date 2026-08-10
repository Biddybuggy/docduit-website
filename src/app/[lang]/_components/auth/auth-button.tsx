'use client';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import AuthDialog from './auth-dialog';

interface AuthButtonProps {
  vocabularies: any;
}

export default function AuthButton({ vocabularies }: AuthButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    common: { signIn: signInText },
  } = vocabularies;

  // Opens the dialog rather than starting a sign-in directly: the Google flow
  // is a popup now, and browsers block popups that aren't opened straight from
  // a click on the element that offers the choice.
  return (
    <AuthDialog vocabularies={vocabularies} isOpen={isOpen} setIsOpen={setIsOpen}>
      <Button variant='red'>{signInText}</Button>
    </AuthDialog>
  );
}
