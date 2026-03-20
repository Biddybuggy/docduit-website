import { useChatContext } from '@/context/ChatContext';
import { MessageCirclePlus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
interface NewConsultationBtnProps {
  color?: string;
  onNewConsultClick?: (e: any) => void;
}
export default function NewConsultationBtn({
  color = 'white',
  onNewConsultClick = () => {},
}: NewConsultationBtnProps) {
  const router = useRouter();
  const params = useParams();
  const lang = (params.lang as string) === 'id' ? 'id' : 'en';

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
    setDemoUserId,
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
    setDemoUserId(null);
  };

  const isDemoMode = process.env.NEXT_PUBLIC_CHAT_DEMO_MODE === 'true';

  return (
    <MessageCirclePlus
      size={24}
      color={color}
      className='cursor-pointer'
      onClick={(e) => {
        if (isDemoMode) {
          router.push(`/${lang}/consultation`, { scroll: false });
        } else {
          router.push(`/${lang}/under-maintenance`);
        }
        onNewConsultClick(e);
        handleResetChat();
      }}
    />
  );
}
