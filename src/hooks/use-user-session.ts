import { AuthorizedUserSession } from '@/lib/api/modules/auth/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';

function useUserSessionQuery() {
  const queryClient = useQueryClient();

  const { data: userInfo, isLoading: isUserInfoLoading } = useQuery({
    queryKey: ['user-info'],
    queryFn: () => {
      try {
        const userInfoJSON = localStorage.getItem('USER_INFO');
        if (!userInfoJSON) return false;

        const userInfo = JSON.parse(userInfoJSON);
        if (!userInfo.email) return false;

        return userInfo;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const { data: accessToken, isLoading: isAccessTokenLoading } = useQuery({
    queryKey: ['access-token'],
    queryFn: () => {
      const token = localStorage.getItem('ACCESS_TOKEN');
      return token;
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const { data: refreshToken, isLoading: isRefreshTokenLoading } = useQuery({
    queryKey: ['refresh-token'],
    queryFn: () => {
      const token = localStorage.getItem('REFRESH_TOKEN');
      return token;
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const updateUserSessionMutation = (data: AuthorizedUserSession) => {
    localStorage.setItem('USER_INFO', JSON.stringify(data.userInfo));
    localStorage.setItem('ACCESS_TOKEN', data.authorization.access_token);
    localStorage.setItem('REFRESH_TOKEN', data.authorization.refresh_token);
    queryClient.invalidateQueries({
      queryKey: ['user-info'],
    });
    queryClient.invalidateQueries({
      queryKey: ['access-token'],
    });
    queryClient.invalidateQueries({
      queryKey: ['refresh-token'],
    });
  };

  const deleteUserSessionMutation = () => {
    localStorage.removeItem('USER_INFO');
    localStorage.removeItem('ACCESS_TOKEN');
    localStorage.removeItem('REFRESH_TOKEN');
    queryClient.invalidateQueries({
      queryKey: ['user-info'],
    });
    queryClient.invalidateQueries({
      queryKey: ['access-token'],
    });
    queryClient.invalidateQueries({
      queryKey: ['refresh-token'],
    });
  };

  const isLoading = isUserInfoLoading || isAccessTokenLoading || isRefreshTokenLoading;

  return {
    userInfo,
    accessToken,
    refreshToken,
    isLoading,
    updateUserSessionMutation,
    deleteUserSessionMutation,
  };
}

export default useUserSessionQuery;
