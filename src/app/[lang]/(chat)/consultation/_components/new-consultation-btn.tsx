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

  return (
    <MessageCirclePlus
      size={24}
      color={color}
      className='cursor-pointer'
      onClick={(e) => {
        router.push(`/${lang}/under-maintenance`);
        onNewConsultClick(e);
        handleResetChat();
      }}
    />
  );
}
