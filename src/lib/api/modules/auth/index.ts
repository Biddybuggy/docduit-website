import { baseUrl, endpoints } from '../../base/base-api-endpoints';
import BaseApiService from '../../base/base-api-services';
import {
  AuthorizedUserSession,
  LoginProps,
  RegisterProps,
  VerifyProps,
} from './types';

class AuthServices extends BaseApiService {
  /**
   * Constructor for FolderServices.
   * @extends BaseApiService
   */
  constructor(toastPresenter: (message: string) => void) {
    super(baseUrl, toastPresenter);
  }

  async getAuthorize(provider: string) {
    const res = await this.get({
      endpoint: `${endpoints.auth.authorize}/${provider}`,
    });
    return res;
  }

  async googleGetUserInfo(accessToken: string): Promise<AuthorizedUserSession> {
    const userInfo = await this.getRaw({
      endpoint: 'https://www.googleapis.com/oauth2/v3/userinfo',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const verifiedToken = await this.post({
      endpoint: endpoints.auth.verify,
      data: { access_token: accessToken, provider: 'google' },
    });

    return {
      userInfo: userInfo.data,
      authorization: verifiedToken.data.data,
    } as AuthorizedUserSession;
  }

  async authLogin(data: LoginProps) {
    const authRes = await this.post({
      endpoint: endpoints.auth.login,
      data,
    });
    const { data: authorization, status_code } = authRes.data;
    if (status_code !== 200) {
      this.toastPresenter(
        status_code === 401
          ? 'Login gagal. Periksa kembali email dan password yang anda masukan'
          : 'Terjadi kesalahan pada server. Silahkan coba beberapa saat lagi',
      );
      return false;
    }

    localStorage.setItem('ACCESS_TOKEN', authorization.access_token);

    const profileRes = await this.get({
      endpoint: endpoints.user.profile,
    });
    const { data: dataUser } = profileRes.data;

    return {
      userInfo: {
        email: dataUser.username,
        picture: dataUser.avatar,
        name: dataUser.fullname,
      },
      authorization,
    } as AuthorizedUserSession;
  }

  async authRegister(data: RegisterProps) {
    const newUserRes = await this.post({
      endpoint: endpoints.user.signUp,
      data,
    });
    const { status_code } = newUserRes.data;
    if (status_code !== 200) {
      this.toastPresenter(
        'Gagal mendaftarkan akun, terjadi kesalahan pada server. Silahkan coba beberapa saat lagi',
      );
      return false;
    }

    const loginPayload = {
      username: data.username,
      password: data.password,
    } as LoginProps;

    return await this.authLogin(loginPayload);
  }

  async authRefresh() {
    const res = await this.post({
      endpoint: endpoints.auth.refresh,
    });
    return res;
  }

  async authVerify(data: VerifyProps) {
    const res = await this.post({
      endpoint: endpoints.auth.verify,
      data,
    });
    return res;
  }
}

const getAuthServices = (toastPresenter: (message: string) => void) =>
  new AuthServices(toastPresenter);

export default getAuthServices;
