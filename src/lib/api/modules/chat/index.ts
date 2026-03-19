import { baseUrl, endpoints } from '../../base/base-api-endpoints';
import BaseApiService from '../../base/base-api-services';
import { AskAIParams } from './types';

class ChatServices extends BaseApiService {
  /**
   * Constructor for FolderServices.
   * @extends BaseApiService
   */
  constructor(toastPresenter: (message: string) => void) {
    super(baseUrl, toastPresenter);
  }

  async askAI(data: AskAIParams) {
    const res = await this.post({
      endpoint: endpoints.chat.askDuit,
      data,
    });
    return res;
  }

  async getAllRooms() {
    const res = await this.get({
      endpoint: endpoints.chat.room,
    });
    return res;
  }

  async getRoomChats(roomId: string) {
    const res = await this.get({
      endpoint: `${endpoints.chat.room}/${roomId}`,
    });
    return res;
  }
}

const getChatServices = (toastPresenter: (message: string) => void) =>
  new ChatServices(toastPresenter);

export default getChatServices;
