import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { getProfile } from '@/services/auth.service';
import { ProfileResponse, AuthToken } from '@/types/auth.type';
import { signInWithGoogle, signOutFirebase } from '@/services/firebase-auth.service';

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
    if (session?.user?.accessToken && !session?.user?.email) {
      fetchProfile(session.user.accessToken);
    }
  }, [session?.user?.accessToken, session?.user?.email]);

  const loginWithGoogle = async () => {
    return await signInWithGoogle();
  };

  const logout = async () => {
    // Firebase first: the session bridge re-mints a NextAuth cookie whenever it
    // sees a live Firebase user without one, so clearing NextAuth alone would
    // put the user straight back where they were.
    await signOutFirebase();
    await signOut({ redirect: false });
    setProfile(null);
  };

  return {
    user: session?.user as AuthToken | undefined,
    profile,
    isLoading: status === 'loading' || isLoadingProfile,
    loginWithGoogle,
    logout,
    fetchProfile,
  };
};