'use client';

import ProfileComponent from './profile-component';
import AuthButton from './auth-button';
import ProfileComponentSkeleton from './profile-component-skeleton';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import { getProfile } from '@/services/auth.service';
import { useEffect, useState } from 'react';

export type User = {
  picture: string | undefined;
  fullname: string | undefined;
  username: string | undefined;
};

interface AuthButtonProps {
  vocabularies: any;
}
export default function AuthenticationSection({
  vocabularies,
}: AuthButtonProps) {
  const { data, status } = useSession();
  const [userInfo, setUserInfo] = useState<User | null>(null);

  const {
    data: userData,
    isLoading: isLoadingProfile,
    error,
  } = useSWR(['user-info' + data?.user?.accessToken], () =>
    data?.user?.accessToken && status === 'authenticated' && !data?.user?.email
      ? getProfile(data?.user?.accessToken as string)
      : null,
  );

  useEffect(() => {
    if (status === 'authenticated') {
      // For Google users, use session data directly
      if (data?.user?.email) {
        setUserInfo({
          fullname: data.user.name || data.user.email,
          username: data.user.email,
          picture: data.user.image,
        });
      } else if (userData) {
        // For backend users, use API data
        setUserInfo({
          fullname: userData?.data?.fullname,
          username: userData?.data?.username,
          picture: userData?.data?.avatar,
        });
      } else if (error) {
        setUserInfo(null);
      }
    } else {
      setUserInfo(null);
    }
  }, [data, userData, error, status]);

  return (
    <>
      {status === 'loading' || (isLoadingProfile && !data?.user?.email) ? (
        <ProfileComponentSkeleton />
      ) : userInfo ? (
        <ProfileComponent
          userInfo={userInfo}
          vocabularies={vocabularies}
        />
      ) : (
        <AuthButton vocabularies={vocabularies} />
      )}
    </>
  );
}
