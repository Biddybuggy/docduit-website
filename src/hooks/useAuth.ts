import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { getProfile } from '@/services/auth.service';
import { ProfileResponse, AuthToken } from '@/types/auth.type';

export const useAuth = () => {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<ProfileResponse['data'] | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  const fetchProfile = async (accessToken: string) => {
    setIsLoadingProfile(true);
    try {
      const response = await getProfile(accessToken);
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  useEffect(() => {
    if (session?.user?.accessToken) {
      fetchProfile(session.user.accessToken);
    }
  }, [session?.user?.accessToken]);

  const loginWithCredentials = async (username: string, password: string) => {
    return await signIn('credentials', {
      username,
      password,
      redirect: false,
    });
  };

  const loginWithGoogle = async () => {
    return await signIn('google', { redirect: false });
  };

  const logout = async () => {
    await signOut({ redirect: false });
    setProfile(null);
  };

  return {
    user: session?.user as AuthToken | undefined,
    profile,
    isLoading: status === 'loading' || isLoadingProfile,
    loginWithCredentials,
    loginWithGoogle,
    logout,
    fetchProfile,
  };
};