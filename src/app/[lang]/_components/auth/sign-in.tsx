import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { getSession } from 'next-auth/react';
import { mutate } from 'swr';
import { safeSendGAEvent } from '@/lib/analytics';

interface AuthContentProps {
  vocabularies: any;
  setIsOpen: (isOpen: boolean) => void;
}

export default function AuthSignIn({ vocabularies, setIsOpen }: AuthContentProps) {
  const { loginWithCredentials } = useAuth();
  const router = useRouter();

  const {
    common: { signIn },
    auth: {
      signIn: {
        email: emailText,
        password: passwordText,
        emailPlaceholder,
        passwordPlaceholder,
      },
    },
  } = vocabularies;

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    if (email && password) {
      setLoading(true);
      try {
        const result = await loginWithCredentials(email, password);
        if (result?.error || !result?.ok) {
          toast.error('Login gagal. Silakan coba lagi.');
        } else {
          await getSession();
          router.refresh();
          mutate('user-info');
          setIsOpen(false);
          toast.success('Login berhasil!');
          safeSendGAEvent('event', 'manual_sign_in', { email });
        }
      } catch (error) {
        toast.error('Login gagal. Silakan coba lagi.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else {
      toast.error('Semua field harus diisi');
    }
  };

  return (
    <>
      <div className='flex flex-col gap-2'>
        <Label htmlFor='email' className='text-gray-500'>
          {emailText}
        </Label>
        <Input
          id='email'
          type='email'
          className='rounded-full bg-docduit-gray/40 border-0'
          placeholder={emailPlaceholder}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className='flex flex-col gap-2'>
        <Label htmlFor='password' className='text-gray-500'>
          {passwordText}
        </Label>
        <Input
          id='password'
          type='password'
          className='rounded-full bg-docduit-gray/40 border-0'
          placeholder={passwordPlaceholder}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
        />
      </div>
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
