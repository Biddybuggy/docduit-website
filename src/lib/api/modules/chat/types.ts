export type AskAIParams = {
  room_id?: string | null;
  conversation_id?: string | null;
  message?: {
    topic?: string;
    percakapan?: { pertanyaan: string; jawaban: string }[];
  };
};
