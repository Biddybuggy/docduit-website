'use client';
import { Button } from '@/components/ui/button';
import { useChatContext } from '@/context/ChatContext';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { ChatRoomResponse, getAllRooms } from '@/services/chat.service';
import { loadConversationsFromFirestore, loadConversationFromFirestore, FirestoreConversation } from '@/services/firebase.service';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';

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
      history: {
        nohistory: noHistoryText,
        loadFailed: loadFailedText,
        retry: retryText,
        reauth: reauthText,
        reauthAction: reauthActionText,
      },
    },
  } = vocabularies;

  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const lang = (params.lang as string) === 'id' ? 'id' : 'en';
  const { user, isLoading: userInfoLoading } = useAuth();

  const roomId = searchParams.get('r');
  const {
    firebaseUser,
    status: firebaseStatus,
    retry: retryFirebaseAuth,
    needsReauth,
  } = useFirebaseAuth();

  // Firestore is only readable once the Firebase session exists, so the fetch
  // waits for it instead of failing and caching an empty list.
  const { data, error, isLoading, mutate } = useSWR<FirestoreConversation[], Error>(
    user?.email && firebaseUser ? ['firebase-conversations', user.email] : null,
    ([, userEmail]: [string, string]) => loadConversationsFromFirestore(userEmail),
    {
      revalidateOnFocus: true,
      keepPreviousData: true,
    },
  );

  const isConnecting =
    userInfoLoading || firebaseStatus === 'loading' || (isLoading && !data);
  const hasFailed = Boolean(error) || firebaseStatus === 'error';

  const {
    conversationId: activeConversationId,
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
        setConversationId(fullConversation.conversationId || fullConversation.id);
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
    <div className='min-h-0 flex-1 space-y-6 overflow-y-auto scrollbar-hide'>
      {isConnecting ? (
        <div className='space-y-4 px-4'>
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className='h-8 w-full rounded-md bg-gray-300/50 animate-pulse'
            ></div>
          ))}
        </div>
      ) : hasFailed ? (
        <div className='my-2 flex flex-col items-center gap-2 px-4 text-center'>
          <p className='italic text-red-200'>
            {needsReauth ? reauthText : loadFailedText}
          </p>
          <Button
            variant='ghost'
            className='h-auto rounded-lg border border-white/25 px-3 py-1 text-sm font-medium text-white hover:bg-white/10 hover:text-white'
            onClick={() => {
              // Without a Firebase user there is nothing to retry against;
              // anything else is recoverable in place.
              if (needsReauth) {
                router.push(
                  `/login?lang=${lang}&callbackUrl=${encodeURIComponent(
                    `/${lang}/consultation`,
                  )}`,
                );
                return;
              }
              retryFirebaseAuth();
              void mutate();
            }}
          >
            {needsReauth ? reauthActionText : retryText}
          </Button>
        </div>
      ) : data && data.length > 0 ? (
        <nav className='space-y-1 overflow-x-hidden'>
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

            const isActive =
              roomId === conversation.roomId ||
              roomId === conversation.id ||
              activeConversationId === conversation.conversationId ||
              activeConversationId === conversation.id;

            return (
              <Button
                key={conversation.id}
                variant='ghost'
                className={cn(
                  'my-1 flex w-full items-center justify-start overflow-hidden rounded-lg border border-white/15 bg-transparent px-3 py-2 text-left text-sm font-medium whitespace-nowrap text-white hover:bg-white/10 hover:text-white',
                  isActive && 'bg-white/15 text-white ring-1 ring-white/25',
                )}
                onClick={() => handleRoomClick(conversation)}
              >
                <div className='truncate'>{title}</div>
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
