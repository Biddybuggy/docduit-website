export const generalizeUrls = (url: string) => {
  if (!url || url === '') return '';
  if (url.endsWith('/')) url = url.slice(0, -1);
  return url;
};

export const baseUrl = generalizeUrls(process.env.NEXT_PUBLIC_API_URL || '');
export const chatAIUrl = generalizeUrls(
  process.env.NEXT_PUBLIC_AI_CHAT_URL || '',
);

const prefix = `/api/v1`;

export const endpoints = {
  auth: {
    authorize: `${prefix}/auth/authorize`,
    callback: `${prefix}/auth/callback`,
    login: `${prefix}/auth/login`,
    refresh: `${prefix}/auth/refresh`,
    verify: `${prefix}/auth/verify`,
  },
  user: {
    changePassword: `${prefix}/user/change_password`,
    profile: `${prefix}/user/get_profile`,
    signUp: `${prefix}/user/signup`,
    updateProfile: `${prefix}/user/update_profile`,
  },
  chat: {
    askDuit: `${prefix}/chat/ask-duit`,
    room: `${prefix}/chat/room`,
  },
};
