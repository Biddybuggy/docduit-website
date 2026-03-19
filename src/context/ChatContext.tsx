'use client';

import { ChatRoom } from '@/services/chat.service';
import { createContext, useContext, useState, ReactNode } from 'react';

interface IResep {
  profile?: string;
  text?: string;
  allocation?: string[];
}

export interface ChatMessage {
  message: string;
  type_user: 'user' | 'bot';
  conversation_id?: string;
  room_id?: string;
}

interface ChatContextType {
  chatRoomMessages: ChatMessage[] | null;
  setChatRoomMessages: (value: ChatMessage[] | null) => void;
  messagesToAdded: ChatMessage[] | null;
  setMessagesToAdded: (value: ChatMessage[] | null) => void;
  chatRoomsData: ChatRoom[] | null;
  setChatRoomsData: (value: ChatRoom[] | null) => void;
  roomIdFromQuery: string | null;
  setRoomIdFromQuery: (value: string | null) => void;
  conversationId: string | null;
  setConversationId: (value: string | null) => void;
  message: string;
  setMessage: (value: string) => void;
  chatType: string;
  setChatType: (value: string) => void;
  choiceScore: number;
  setChoiceScore: (value: number) => void;
  templateTopic: string;
  setTemplateTopic: (value: string) => void;
  templateQuestions: string[];
  setTemplateQuestions: (value: string[]) => void;
  templateChoices: string[][];
  setTemplateChoices: (value: string[][]) => void;
  templateAnswers: string[];
  setTemplateAnswers: (value: string[]) => void;
  isMarried: boolean;
  setIsMarried: (value: boolean) => void;
  templateCode: string;
  setTemplateCode: (value: string) => void;
  financialIssueCode: string;
  setFinancialIssueCode: (value: string) => void;
  gaji: number;
  setGaji: (value: number) => void;
  cicilan: number;
  setCicilan: (value: number) => void;
  resep: IResep;
  setResep: (value: IResep) => void;
  getChatRoomByIdLoading: boolean;
  setGetChatRoomByIdLoading: (value: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chatRoomMessages, setChatRoomMessages] = useState<
    ChatMessage[] | null
  >(null);
  const [messagesToAdded, setMessagesToAdded] = useState<ChatMessage[] | null>(
    null,
  );
  const [chatRoomsData, setChatRoomsData] = useState<ChatRoom[] | null>(null);
  const [roomIdFromQuery, setRoomIdFromQuery] = useState<string | null>(null); //
  const [conversationId, setConversationId] = useState<string | null>(null); //
  const [message, setMessage] = useState(''); //
  const [chatType, setChatType] = useState('ai'); //
  const [choiceScore, setChoiceScore] = useState(0); //
  const [templateTopic, setTemplateTopic] = useState<string>(''); //
  const [templateQuestions, setTemplateQuestions] = useState<string[]>([]); //
  const [templateChoices, setTemplateChoices] = useState<string[][]>([]); //
  const [templateAnswers, setTemplateAnswers] = useState<string[]>([]); //
  const [isMarried, setIsMarried] = useState<boolean>(false); //
  const [templateCode, setTemplateCode] = useState<string>(''); //
  const [financialIssueCode, setFinancialIssueCode] = useState<string>(''); //
  const [gaji, setGaji] = useState<number>(0); //
  const [cicilan, setCicilan] = useState<number>(0); //
  const [resep, setResep] = useState<IResep>({
    profile: '',
    text: '',
    allocation: [],
  });
  const [getChatRoomByIdLoading, setGetChatRoomByIdLoading] = useState(false);

  return (
    <ChatContext.Provider
      value={{
        chatRoomMessages,
        setChatRoomMessages,
        messagesToAdded,
        setMessagesToAdded,
        chatRoomsData,
        setChatRoomsData,
        roomIdFromQuery,
        setRoomIdFromQuery,
        conversationId,
        setConversationId,
        message,
        setMessage,
        chatType,
        setChatType,
        choiceScore,
        setChoiceScore,
        templateTopic,
        setTemplateTopic,
        templateQuestions,
        setTemplateQuestions,
        templateChoices,
        setTemplateChoices,
        templateAnswers,
        setTemplateAnswers,
        isMarried,
        setIsMarried,
        templateCode,
        setTemplateCode,
        financialIssueCode,
        setFinancialIssueCode,
        gaji,
        setGaji,
        cicilan,
        setCicilan,
        resep,
        setResep,
        getChatRoomByIdLoading,
        setGetChatRoomByIdLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};
