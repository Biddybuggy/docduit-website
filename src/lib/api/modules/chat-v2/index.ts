import { chatAIUrl } from '../../base/base-api-endpoints';
import BaseApiService from '../../base/base-api-services';
import { AskAIParams } from '../chat/types';

class ChatV2Services extends BaseApiService {
  /**
   * Constructor for FolderServices.
   * @extends BaseApiService
   */
  constructor(toastPresenter: (message: string) => void) {
    super(chatAIUrl, toastPresenter);
  }

  async askAI(data: AskAIParams) {
    const res = await this.post({
      endpoint: '/api/v1/chat/ask-duit',
      data,
      useAuthorization: true,
    });

    return res;
  }
}

const getChatV2Services = (toastPresenter: (message: string) => void) =>
  new ChatV2Services(toastPresenter);

export default getChatV2Services;
