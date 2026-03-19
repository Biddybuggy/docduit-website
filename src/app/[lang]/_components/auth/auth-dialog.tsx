'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import AuthSignIn from './sign-in';
import AuthSignUp from './sign-up';
import { useToast } from '@/hooks/use-toast';
import AuthSignInGoogle from './sign-in-google';
import Link from 'next/link';
import { useParams } from 'next/navigation';

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
  const { toast } = useToast();
  const [displayForm, setDisplayForm] = useState<'signin' | 'signup'>('signin');

  const {
    common: { alreadyHaveAccount, signIn, dontHaveAccount, signUp, or },
    auth: {
      signIn: { title: signInTitle },
      signUp: { title: signUpTitle },
    },
  } = vocabularies;

  const params = useParams();
  const lang = params.lang as string;

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
              <p className='font-semibold text-2xl'>
                {displayForm === 'signin' ? signInTitle : signUpTitle}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-6 p-8 lg:px-24'>
          <div className='flex flex-col gap-4'>
            {displayForm === 'signin' ? (
              <>
                <AuthSignIn setIsOpen={setIsOpen} vocabularies={vocabularies} />
                <p className='text-start text-gray-500'>
                  {dontHaveAccount}&nbsp;
                  <button
                    onClick={() => setDisplayForm('signup')}
                    className='text-docduit-red'
                  >
                    {signUp}
                  </button>
                </p>
              </>
            ) : (
              <>
                <AuthSignUp vocabularies={vocabularies} />
                <p className='text-start text-gray-500'>
                  {alreadyHaveAccount}&nbsp;
                  <button
                    onClick={() => setDisplayForm('signin')}
                    className='text-docduit-red'
                  >
                    {signIn}
                  </button>
                </p>
              </>
            )}
          </div>
          <p className='text-xl text-docduit-gray text-center'>{or}</p>
          <div className='flex justify-center'>
            <AuthSignInGoogle />
          </div>
          {showBackLink && (
            <Link
              className='text-sm underline text-blue-500 text-center'
              href={`/${lang}/`}
            >
              Kembali ke halaman utama
            </Link>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
