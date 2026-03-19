'use client';
import { Button } from '@/components/ui/button';
import { useChatContext } from '@/context/ChatContext';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { ChatRoomResponse, getAllRooms } from '@/services/chat.service';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';

interface HistoryChatContentProps {
  onHistoryClick?: (e: any) => void;
  vocabularies: any;
}

const HistoryChatContent = ({
  onHistoryClick = () => {},
  vocabularies,
}: HistoryChatContentProps) => {
  const {
    chat: {
      history: { nohistory: noHistoryText },
    },
  } = vocabularies;

  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const lang = (params.lang as string) === 'id' ? 'id' : 'en';
  const { user, isLoading: userInfoLoading } = useAuth();

  const roomId = searchParams.get('r');

  const { data, error, isLoading } = useSWR<ChatRoomResponse, Error>(
    user?.accessToken ? 'chat-room-history' : null,
    ([token]) => getAllRooms(token as string),
    {
      revalidateOnFocus: true,
    },
  );

  const {
    setConversationId,
    setMessage,
    setChatType,
    setChoiceScore,
    setTemplateTopic,
    setTemplateQuestions,
    setTemplateChoices,
    setTemplateAnswers,
    setIsMarried,
    setTemplateCode,
    setFinancialIssueCode,
    setGaji,
    setCicilan,
    setResep,
    setChatRoomMessages,
    setMessagesToAdded,
    setGetChatRoomByIdLoading
  } = useChatContext();

  const handleResetChat = () => {
    setFinancialIssueCode('');
    setTemplateCode('');
    setChatType('ai');
    setTemplateTopic('');
    setTemplateQuestions([]);
    setTemplateChoices([]);
    setTemplateAnswers([]);
    setChoiceScore(0);
    setGaji(0);
    setCicilan(0);
    setIsMarried(false);
    setMessage('');
    setConversationId(null);
    setResep({
      profile: '',
      text: '',
      allocation: [],
    });
    setChatRoomMessages(null);
    setMessagesToAdded(null);
  };

  const handleRoomClick = (roomId: string) => {
    setGetChatRoomByIdLoading(true);
    router.push(`/${lang}/under-maintenance`);
    onHistoryClick(roomId);
    handleResetChat();
  };

  return (
    <div className='space-y-6 overflow-y-auto scrollbar-hide'>
      {isLoading || userInfoLoading ? (
        <div className='space-y-4 px-4'>
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className='h-8 w-full rounded-md bg-gray-300/50 animate-pulse'
            ></div>
          ))}
        </div>
      ) : error ? (
        <p className='italic text-center my-2 text-red-500'>
          Gagal memuat riwayat obrolan
        </p>
      ) : data && data?.data?.length > 0 ? (
        <nav className='space-y-1 overflow-y-auto overflow-x-hidden'>
          {data.data.map((chat) => (
            <Button
              key={chat.id}
              variant='ghost'
              className={cn(
                `flex items-center gap-2 rounded-md py-2 text-sm font-medium overflow-hidden whitespace-nowrap my-1 ${roomId === chat.id ? 'bg-white text-black' : ''}`,
              )}
              onClick={() => handleRoomClick(chat.id)}
            >
              <div>{chat.title}</div>
            </Button>
          ))}
        </nav>
      ) : (
        <p className='italic text-center my-2'>{noHistoryText}</p>
      )}
    </div>
  );
};

export default HistoryChatContent;
