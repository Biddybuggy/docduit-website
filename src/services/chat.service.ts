import { toast } from 'sonner';
import fetcher from '@/lib/fetcher';

export interface ChatRoom {
  id: string;
  title: string;
  created_at: string;
  updated_at: string | null;
  user_id: string;
}

export interface ChatRoomResponse {
  data: ChatRoom[];
  message: string;
  status_code: number;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  created_at: string;
  message: string;
  recipe: any;
  room_id: string;
  type_user: 'user' | 'bot';
  updated_at: string | null;
}

export interface ChatRoomMessagesResponse {
  data: ChatMessage[];
  message: string;
  status_code: number;
}

export interface AskAIPayload {
  conversation_id: string | null;
  message: {
    percakapan?: Array<{ pertanyaan: string; jawaban: string }>;
    topic?: string;
    question?: string;
  };
  room_id: string | null;
}

export interface AskAIResponse {
  data: {
    conversation_id: string;
    message: string;
    room_id: string;
    type_user: 'user' | 'bot';
    user_id: string;
  };
  message: string;
  status_code: number;
}

export interface UpdateRiskProfileResponse {
  data: {
    created_at: string;
    id: string;
    risk_score: number;
    updated_at: string | null;
    user_id: string;
  };
  message: string;
  status_code: number;
}

export interface GetRiskProfileResponse {
  data: {
    created_at: string;
    id: string;
    risk_score: number;
    updated_at: string | null;
    user_id: string;
  };
  message: string;
  status_code: number;
}

export interface SaveRiskProfileMessagePayload {
  conversation_id: string | null;
  messages: {
    message: string;
    type_user: 'user' | 'bot';
  }[];
  room_id: string | null;
  topic: string | null;
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const baseSingleAIUrl = process.env.NEXT_PUBLIC_AI_CHAT_URL;

export const getAllRooms = async (
  accessToken: string,
): Promise<ChatRoomResponse> => {
  try {
    return await fetcher<ChatRoomResponse>(
      `${baseUrl}/api/v1/chat/room`,
      accessToken,
    );
  } catch (error) {
    throw error;
  }
};

export const getRoomChats = async (
  roomId: string,
  accessToken: string,
): Promise<ChatRoomMessagesResponse> => {
  try {
    return await fetcher<ChatRoomMessagesResponse>(
      `${baseUrl}/api/v1/chat/room/${roomId}`,
      accessToken,
    );
  } catch (error) {
    throw error;
  }
};

export const askAI = async (
  payload: AskAIPayload,
  accessToken: string,
): Promise<AskAIResponse> => {
  try {
    return await fetcher<AskAIResponse>(
      `${baseUrl}/api/v1/chat/ask-duit`,
      accessToken,
      {
        method: 'POST',
        body: payload,
      },
    );
  } catch (error) {
    toast.error('Terjadi kesalahan saat mengirim pesan ke AI');
    throw error;
  }
};

export interface AskSingleAIPayload {
  conversation_id?: string | null;
  question: string;
}

export interface AskSingleAIResponse {
  conversation_id: string | null;
  messages: string;
}

/** Used when NEXT_PUBLIC_CHAT_DEMO_MODE=true - calls local API route (proxies to CF worker / Stack AI). */
export const askDemoAI = async (
  userMessage: string,
  options?: { userId?: string }
): Promise<{ message: string; userId?: string }> => {
  const body: { message: string; userId?: string } = { message: userMessage };
  if (options?.userId) body.userId = options.userId;

  const res = await fetch('/api/chat/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Demo AI request failed');
  }
  return res.json();
};


export const askDemoAIStream = async (
  userMessage: string,
  options?: { userId?: string }
): Promise<ReadableStream<Uint8Array>> => {
  const body: { message: string; userId?: string; stream: true } = {
    message: userMessage,
    stream: true,
  };
  if (options?.userId) body.userId = options.userId;

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Demo AI request failed');
  }

  if (!res.body) {
    throw new Error('No response body');
  }

  return res.body;
};

export const askAISingle = async (
  payload: AskSingleAIPayload,
  // accessToken: string,
): Promise<AskSingleAIResponse> => {
  try {
    return await fetcher<AskSingleAIResponse>(
      `${baseSingleAIUrl}/api/ask-duit`,
      undefined,
      {
        method: 'POST',
        body: payload,
      },
    );
  } catch (error) {
    toast.error('Terjadi kesalahan saat mengirim pesan ke AI');
    throw error;
  }
};

export const updateRiskProfile = async (
  score: number,
  accessToken: string,
): Promise<UpdateRiskProfileResponse> => {
  try {
    const formData = new FormData();
    formData.append('score', score.toString());

    return await fetcher<UpdateRiskProfileResponse>(
      `${baseUrl}/api/v1/user/update_risk_score`,
      accessToken,
      {
        method: 'PUT',
        body: formData,
        isMultipart: true,
      },
    );
  } catch (error) {
    toast.error('Terjadi kesalahan saat memperbarui skor risiko');
    throw error;
  }
};

export const getRiskProfile = async (
  accessToken: string,
): Promise<GetRiskProfileResponse> => {
  try {
    return await fetcher<GetRiskProfileResponse>(
      `${baseUrl}/api/v1/user/get_risk_score`,
      accessToken,
    );
  } catch (error) {
    throw error;
  }
};

interface SaveRiskProfileResponse {
  data: ChatMessage[];
  status_code: number;
}

export const saveRiskProfileMessage = async (
  payload: SaveRiskProfileMessagePayload,
  accessToken: string,
): Promise<SaveRiskProfileResponse> => {
  try {
    return await fetcher<SaveRiskProfileResponse>(
      `${baseUrl}/api/v1/chat/message`,
      accessToken,
      {
        method: 'POST',
        body: payload,
      },
    );
  } catch (error) {
    toast.error('Terjadi kesalahan saat menyimpan obrolan');
    throw error;
  }
};

export interface SaveRecipePayload {
  allocation: string[];
  cicilan: number;
  conversation_id: string | null;
  financial_issue_code?: string;
  gaji: number;
  is_married: boolean;
  profile: string;
  room_id: string | null;
  text: string;
}

export interface SaveRecipeResponse {
  data: {
    conversation_id: string;
    message: string;
    room_id: string;
    type_user: 'user' | 'bot';
    user_id: string;
  }[];
  message: string;
  status_code: number;
}

export const saveRecipe = async (
  payload: SaveRecipePayload,
  accessToken: string,
): Promise<SaveRecipeResponse> => {
  try {
    return await fetcher<SaveRecipeResponse>(
      `${baseUrl}/api/v1/chat/recipe`,
      accessToken,
      {
        method: 'POST',
        body: payload,
      },
    );
  } catch (error) {
    toast.error('Terjadi kesalahan saat menyimpan resep');
    throw error;
  }
};
