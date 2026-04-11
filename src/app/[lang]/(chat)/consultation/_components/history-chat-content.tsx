'use client';
import { Button } from '@/components/ui/button';
import { useChatContext } from '@/context/ChatContext';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { ChatRoomResponse, getAllRooms } from '@/services/chat.service';
import { loadConversationsFromFirestore, loadConversationFromFirestore, FirestoreConversation } from '@/services/firebase.service';
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

  const { data, error, isLoading } = useSWR<FirestoreConversation[], Error>(
    user?.email ? ['firebase-conversations', user.email] : null,
    ([, userEmail]: [string, string]) => loadConversationsFromFirestore(userEmail),
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
    setGetChatRoomByIdLoading,
    setDemoUserId,
    setRoomIdFromQuery,
  } = useChatContext();

  const handleResetChat = () => {
    setFinancialIssueCode('');
    setTemplateCode('');
    setChatType('ai');
    setTemplateTopic('');
    setTemplateQuestions([]);
    setTemplateChoices([]);
    setTemplateAnswers([]);
    setChoiceScore([]);
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
    setDemoUserId(null);
  };

  const handleRoomClick = async (conversation: FirestoreConversation) => {
    if (!user?.email) return;

    setGetChatRoomByIdLoading(true);

    try {
      // Load the full conversation from Firebase
      const fullConversation = await loadConversationFromFirestore(user.email, conversation.roomId || conversation.id);

      if (fullConversation) {
        // Reset chat state
        handleResetChat();

        // Set the loaded conversation
        setChatRoomMessages(fullConversation.messages);
        setConversationId(fullConversation.conversationId);
        setRoomIdFromQuery(fullConversation.roomId);

        // Update URL with room ID
        const newSearchParams = new URLSearchParams(searchParams.toString());
        if (fullConversation.roomId) {
          newSearchParams.set('r', fullConversation.roomId);
        } else {
          newSearchParams.delete('r');
        }
        router.push(`?${newSearchParams.toString()}`, { scroll: false });

        onHistoryClick(fullConversation.roomId || fullConversation.id);
      }
    } catch (error) {
      console.error('Failed to load conversation:', error);
    } finally {
      setGetChatRoomByIdLoading(false);
    }
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
          Gagal memuat riwayat obrolan. Silakan coba lagi.
        </p>
      ) : data && data.length > 0 ? (
        <nav className='space-y-1 overflow-y-auto overflow-x-hidden'>
          {data.map((conversation) => {
            const title = conversation.title
              ? conversation.title
              : conversation.messages.find((msg) => msg.type_user === 'user')?.message
              ? (() => {
                  const firstUserMessage = conversation.messages.find((msg) => msg.type_user === 'user')?.message || '';
                  return firstUserMessage.length > 50
                    ? `${firstUserMessage.substring(0, 50)}...`
                    : firstUserMessage;
                })()
              : `Conversation ${conversation.id.substring(0, 8)}`;

            const isActive = roomId === conversation.roomId || roomId === conversation.id;

            return (
              <Button
                key={conversation.id}
                variant='ghost'
                className={cn(
                  `flex items-center gap-2 rounded-md py-2 text-sm font-medium overflow-hidden whitespace-nowrap my-1 ${isActive ? 'bg-white text-black' : ''}`,
                )}
                onClick={() => handleRoomClick(conversation)}
              >
                <div>{title}</div>
              </Button>
            );
          })}
        </nav>
      ) : data && data.length === 0 ? (
        <p className='italic text-center my-2'>{noHistoryText}</p>
      ) : (
        <p className='italic text-center my-2'>{noHistoryText}</p>
      )}
    </div>
  );
};

export default HistoryChatContent;
