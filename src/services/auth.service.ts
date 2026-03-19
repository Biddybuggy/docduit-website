import { toast } from 'sonner';
import fetcher from '@/lib/fetcher';
import {
  AuthResponse,
  LoginPayload,
  GoogleLoginPayload,
  ProfileResponse,
} from '@/types/auth.type';
import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  try {
    return await fetcher<AuthResponse>(
      `${baseUrl}/api/v1/auth/login`,
      undefined,
      {
        method: 'POST',
        body: payload,
      },
    );
  } catch (error) {
    toast.error('Login failed. Please check your credentials.');
    throw error;
  }
};

export const googleLogin = async (
  payload: GoogleLoginPayload,
): Promise<AuthResponse> => {
  try {
    return await fetcher<AuthResponse>(
      `${baseUrl}/api/v1/auth/verify`,
      undefined,
      {
        method: 'POST',
        body: payload,
      },
    );
  } catch (error) {
    toast.error('Google login failed. Please try again.');
    throw error;
  }
};

export const refreshToken = async (
  refreshToken: string,
): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(
      `${baseUrl}/api/v1/auth/refresh`,
      null,
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProfile = async (
  accessToken: string,
): Promise<ProfileResponse> => {
  try {
    return await fetcher<ProfileResponse>(
      `${baseUrl}/api/v1/user/get_profile`,
      accessToken,
    );
  } catch (error) {
    throw error;
  }
};
