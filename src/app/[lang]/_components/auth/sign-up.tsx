import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import getAuthServices from '@/lib/api/modules/auth';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { safeSendGAEvent } from '@/lib/analytics';

interface AuthContentProps {
  vocabularies: any;
}

export default function AuthSignUp({ vocabularies }: AuthContentProps) {
  const {
    common: { signUp },
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
    },
  } = vocabularies;

  const [loading, setLoading] = useState(false);
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const authServices = getAuthServices((msg) => toast.error(msg));

  const onSubmit = async () => {
    if (fullname && email && password && confirmPassword) {
      if (password !== confirmPassword) {
        toast.error('Semua field harus diisi');
        return;
      }
      try {
        setLoading(true);
        const res = await authServices.authRegister({
          fullname,
          username: email,
          password,
        });
        if (res) {
          safeSendGAEvent('event', 'manual_sign_up', {
            fullname,
            username: email,
          });
          toast.success('Sign up berhasil');
        }
      } catch (error) {
        console.error(error);
        toast.error('Sign up gagal. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div className='flex flex-col gap-2'>
        <Label htmlFor='email' className='text-gray-500'>
          {fullnameText}
        </Label>
        <Input
          id='email'
          type='text'
          className='rounded-full bg-docduit-gray/40 border-0'
          placeholder={fullnamePlaceholder}
          onChange={(e) => setFullname(e.target.value)}
        />
      </div>
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
        />
      </div>
      <div className='flex flex-col gap-2'>
        <Label htmlFor='password' className='text-gray-500'>
          {confirmPasswordText}
        </Label>
        <Input
          id='password'
          type='password'
          className='rounded-full bg-docduit-gray/40 border-0'
          placeholder={confirmPasswordPlaceholder}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
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
