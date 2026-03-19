'use client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import getAuthServices from '@/lib/api/modules/auth';
import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { signIn } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import { mutate } from 'swr';
import { safeSendGAEvent } from '@/lib/analytics';

export default function AuthSignInGoogle() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const authServices = getAuthServices((msg) =>
    toast({
      title: 'Oops!',
      description: msg,
      variant: 'destructive',
    }),
  );

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const { access_token } = tokenResponse;
      
      try {
        setLoading(true);
        // Verifikasi token dan dapatkan data pengguna
        const res = await authServices.googleGetUserInfo(access_token);
        const userInfo = res.userInfo;

        // Kirim access_token ke NextAuth
        const result = await signIn('credentials', {
          access_token,
          redirect: false,
        });

        if (result?.error) {
          throw new Error('Gagal login dengan NextAuth');
        }

        mutate('user-info');
        safeSendGAEvent('event', 'google_sign_in', { userInfo });
      } catch (error) {
        console.error('Error during Google login:', error);
        toast({
          title: 'Gagal Login',
          description: 'Terjadi kesalahan saat login dengan Google.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setLoading(false);
      toast({
        title: 'Gagal Login',
        description: 'Gagal memulai proses login dengan Google.',
        variant: 'destructive',
      });
    },
    flow: 'implicit',
    scope: 'openid email profile',
  });

  return (
    <>
      <Button
        variant='red'
        onClick={() => {
          setLoading(true);
          login();
        }}
        disabled={loading}
      >
        <p className='px-4 flex items-center gap-2'>
          {loading && <Loader2 className='animate-spin' />} Google Sign In
        </p>
      </Button>
    </>
  );
}
