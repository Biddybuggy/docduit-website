export type LoginProps = {
  username: string;
  password: string;
};

export type RegisterProps = {
  fullname: string;
  username: string;
  password: string;
};

export type VerifyProps = {
  access_token: string;
  provider: string;
};

export type GoogleUserInfo = {
  sub?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email?: string;
  email_verified?: boolean;
};

export type InternalUserInfo = {
  avatar?: string;
  created_at?: string;
  fullname?: string;
  id?: string;
  login_at?: string;
  password?: string;
  provider?: string;
  updated_at?: string;
  username?: string;
};

export type UserInfo = {
  email?: string;
  name?: string;
  picture?: string;
};

export type AuthorizationProps = {
  access_token: string;
  refresh_token: string;
  token_type: string;
};

export type AuthorizedUserSession = {
  userInfo: UserInfo;
  authorization: AuthorizationProps;
};
