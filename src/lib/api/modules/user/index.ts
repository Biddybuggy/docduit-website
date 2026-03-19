import { baseUrl, endpoints } from '../../base/base-api-endpoints';
import BaseApiService from '../../base/base-api-services';
import { ChangePasswordProps, SignUpProps } from './types';

class UserServices extends BaseApiService {
  /**
   * Constructor for FolderServices.
   * @extends BaseApiService
   */
  constructor(toastPresenter: (message: string) => void) {
    super(baseUrl, toastPresenter);
  }

  async getProfile() {
    const res = await this.get({
      endpoint: endpoints.user.profile,
    });
    return res;
  }

  async signUp(data: SignUpProps) {
    const res = await this.post({
      endpoint: endpoints.user.signUp,
      data,
    });
    return res;
  }

  async changePassword(data: ChangePasswordProps) {
    const res = await this.post({
      endpoint: endpoints.user.changePassword,
      data,
    });
    return res;
  }

  async updateProfile(data: FormData) {
    const res = await this.put({
      endpoint: endpoints.user.updateProfile,
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res;
  }
}

const getUserServices = (toastPresenter: (message: string) => void) =>
  new UserServices(toastPresenter);

export default getUserServices;
