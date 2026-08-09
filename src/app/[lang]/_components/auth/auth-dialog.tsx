'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import AuthForm, { type AuthFormView } from './auth-form';

interface AuthDialogProps {
  vocabularies: any;
  children?: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  keepOpen?: boolean;
  showBackLink?: boolean;
}

export default function AuthDialog({
  keepOpen = false,
  showBackLink = false,
  vocabularies,
  isOpen,
  setIsOpen,
  children,
}: AuthDialogProps) {
  const [view, setView] = useState<AuthFormView>('signin');

  const {
    common: { backToHome },
    auth: {
      signIn: { title: signInTitle },
      signUp: { title: signUpTitle },
      forgotPassword: { title: forgotPasswordTitle },
      verifyEmail: { title: verifyEmailTitle },
    },
  } = vocabularies;

  const params = useParams();
  const lang = params.lang as string;

  const titles: Record<AuthFormView, string> = {
    signin: signInTitle,
    signup: signUpTitle,
    forgot: forgotPasswordTitle,
    verify: verifyEmailTitle,
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent
        className='lg:max-w-[800px] lg:max-h-[800px]'
        onInteractOutside={(e) => {
          if (keepOpen) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (keepOpen) e.preventDefault();
        }}
        showClose={!keepOpen}
      >
        <DialogHeader>
          <DialogTitle>
            <div className='flex justify-center'>
              <p className='font-semibold text-2xl'>{titles[view]}</p>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-6 p-8 lg:px-24'>
          <AuthForm
            vocabularies={vocabularies}
            onViewChange={setView}
            onAuthenticated={() => setIsOpen(false)}
          />
          {showBackLink && (
            <Link
              className='text-sm underline text-blue-500 text-center'
              href={`/${lang}/`}
            >
              {backToHome}
            </Link>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
