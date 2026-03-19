export interface LoginPayload {
  username: string;
  password: string;
}

export interface GoogleLoginPayload {
  access_token: string;
  provider: string;
}

export interface AuthResponse {
  data: {
    access_token: string;
    refresh_token: string;
    token_type: string;
  };
  message: string;
  status_code: number;
}

export interface UserProfile {
  avatar: string;
  created_at: string;
  fullname: string;
  id: string;
  login_at: string | null;
  password: string;
  provider: string;
  updated_at: string | null;
  username: string;
}

export interface ProfileResponse {
  data: UserProfile;
  message: string;
  status_code: number;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  username: string;
}