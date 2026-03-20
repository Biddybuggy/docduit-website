import ChatroomQuestionTemplates from './chatroom/question-templates';
import { Input } from '@/components/ui/input';
import { useEffect, useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import {
  cn,
  convertRupiahToNumber,
  getTemplateId,
  handleMarriageStatus,
} from '@/lib/utils';

import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import {
  choicesTemplateLibraries,
  getChoicesTemplateAnswer,
  getChoicesTemplateAnswerForResep,
  getChoicesTemplateOptions,
  getChoicesTemplateQuestions,
  getTemplateQuestions,
  getTemplateTopic,
} from '@/lib/template-chat';
import PrescriptionModal from './PrescriptionModal';
import { useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import {
  askAI,
  askDemoAI,
  AskAIPayload,
  ChatRoomMessagesResponse,
  getRiskProfile,
  GetRiskProfileResponse,
  getRoomChats,
  saveRecipe,
  saveRiskProfileMessage,
  updateRiskProfile,
} from '@/services/chat.service';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import ChatSkeleton from './chat-skeleton';
import { ChatMessage, useChatContext } from '@/context/ChatContext';
import { mutate } from 'swr';

const isDemoMode = process.env.NEXT_PUBLIC_CHAT_DEMO_MODE === 'true';

interface MessengerProps {
  onChatSent?: () => void;
  vocabularies: any;
  className?: string;
}
export default function MessengerV2({
  vocabularies,
  onChatSent = () => {},
  className,
}: MessengerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const {
    chat: { placeholderNominal, placeholderQuestion, whatDoYouWant, toConsult },
  } = vocabularies;

  const placeholderNominalStr = placeholderNominal ?? "";
  const placeholderQuestionStr = placeholderQuestion ?? "";
  const [isLoading, setIsLoading] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isResepModalOpen, setIsResepModalOpen] = useState(false);
  const [isNominalInput, setIsNominalInput] = useState(false);

  const { user, isLoading: isLoadingUser } = useAuth();

  const {
    chatRoomMessages,
    setChatRoomMessages,
    messagesToAdded,
    setMessagesToAdded,
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
    demoUserId,
    setDemoUserId,
  } = useChatContext();

  useEffect(() => {
    if (!roomIdFromQuery) {
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
    }
  }, [
    roomIdFromQuery,
    setFinancialIssueCode,
    setTemplateCode,
    setChatType,
    setTemplateTopic,
    setTemplateQuestions,
    setTemplateChoices,
    setTemplateAnswers,
    setChoiceScore,
    setGaji,
    setCicilan,
    setIsMarried,
    setMessage,
    setConversationId,
    setResep,
    setChatRoomMessages,
    setMessagesToAdded,
  ]);

  useEffect(() => {
    const lastBotMessage = chatRoomMessages
      ?.filter((msg) => msg.type_user === 'bot')
      .pop()?.message;

    if (lastBotMessage?.includes('Contoh masukkan:')) {
      setIsNominalInput(true);
    } else {
      setIsNominalInput(false);
    }
  }, [chatRoomMessages]);

  const formatNumber = (value: string): string => {
    const cleanValue = value.replace(/\D/g, '');
    if (!cleanValue) return '';
    return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleNominalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.startsWith('0') || value.includes('-')) {
      return;
    }
    const formattedValue = formatNumber(value);
    setMessage(formattedValue);
  };

  useEffect(() => {
    const roomId = searchParams.get('r');
    if (roomId) {
      setRoomIdFromQuery(roomId);
    } else {
      setRoomIdFromQuery(null);
      setChatRoomMessages(null);
      setChatType('ai');
      setResep({
        profile: '',
        text: '',
        allocation: [],
      });
      setConversationId(null);
      setFinancialIssueCode('');
    }
  }, [searchParams]);

  const {
    data,
    isLoading: isLoadingChat,
    mutate: mutateChat,
    error: chatError,
  } = useSWR<ChatRoomMessagesResponse, Error>(
    roomIdFromQuery && user?.accessToken
      ? '/api/v1/room/' + roomIdFromQuery
      : null,
    ([url, token]) => getRoomChats(roomIdFromQuery!, token as string),
    {
      revalidateOnFocus: true,
    },
  );

  useEffect(() => {
    if (!isLoadingChat || chatError) {
      setGetChatRoomByIdLoading(false);
    }
  }, [isLoadingChat, setGetChatRoomByIdLoading, roomIdFromQuery, chatError]);

  const {
    data: riskProfileData,
    isLoading: isLoadingRisk,
    mutate: mutateRisk,
  } = useSWR<GetRiskProfileResponse, Error>(
    user?.accessToken
      ? ['/api/v1/user/get_risk_score', user?.accessToken]
      : null,
    ([url, token]) => getRiskProfile(token as string),
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      revalidateIfStale: true,
    },
  );

  useEffect(() => {
    if (data?.data) {
      const filteredMessages = data.data.filter(
        (msg) => !msg.recipe || Object.keys(msg.recipe).length === 0,
      );

      setChatRoomMessages(
        filteredMessages.map((msg) => ({
          type_user: msg.type_user,
          message: msg.message,
          conversation_id: msg.conversation_id,
          room_id: msg.room_id,
        })),
      );

      setConversationId(data?.data[0]?.conversation_id);

      const templateId = getTemplateId(data.data[2]?.message);
      setTemplateCode(templateId);

      if (data.data.some((msg) => msg.message === 'Saya punya hutang.')) {
        setFinancialIssueCode('hutang');
        setChatType('financial_choices');
      }

      if (
        data.data.some(
          (msg) =>
            msg.message ===
            'Saya hanya ingin berinvestasi sesuai kondisi saya.',
        )
      ) {
        setChatType('financial_choices');
      }

      if (
        data.data.some((msg) => msg.message === 'Saya ingin membeli sesuatu.')
      ) {
        setChatType('financial_choices');
      }

      if (data.data.some((msg) => msg.message.startsWith('Profil Risiko:'))) {
        setFinancialIssueCode('risk_profile');
      }

      const recipeMessage = data.data.find(
        (msg) => msg.recipe && Object.keys(msg.recipe).length > 0,
      );

      if (recipeMessage) {
        setResep({
          allocation: recipeMessage.recipe.allocation,
          profile: recipeMessage.recipe.profile,
          text: recipeMessage.recipe.text,
        });
        setGaji(recipeMessage.recipe.gaji);
        setCicilan(recipeMessage.recipe.cicilan);
        setIsMarried(recipeMessage.recipe.is_married);
        setFinancialIssueCode(recipeMessage.recipe.financial_issue_code);
        if (data.data.some((msg) => msg.message.startsWith('Profil Risiko:'))) {
          setFinancialIssueCode('risk_profile');
        }
      }
    }
  }, [data?.data]);

  useEffect(() => {
    if (
      (data?.data &&
        !isLoadingChat &&
        templateCode === 'A22A' &&
        chatRoomMessages?.length === 15) ||
      (data?.data &&
        !isLoadingChat &&
        templateCode === 'A22B' &&
        chatRoomMessages?.length === 13)
    ) {
      setChatType('financial_choices');

      const newChatsToAdd: ChatMessage[] = [
        ...(chatRoomMessages || []),
        {
          type_user: 'bot',
          message: 'Apa masalah keuanganmu saat ini?',
        },
      ];
      setChatRoomMessages(newChatsToAdd);

      const newChatsToSave: ChatMessage[] = [
        ...(messagesToAdded || []),
        {
          type_user: 'bot',
          message: 'Apa masalah keuanganmu saat ini?',
        },
      ];
      setMessagesToAdded(newChatsToSave);
    }
  }, [chatRoomMessages?.length, templateCode, isLoadingChat, data?.data]);

  useEffect(() => {
    if (data?.data && templateCode === 'A22A') {
      setIsMarried(handleMarriageStatus(data?.data[1]?.message));
      setGaji(convertRupiahToNumber(data?.data[5]?.message));
      setCicilan(convertRupiahToNumber(data?.data[9]?.message));
    }

    if (data?.data && templateCode === 'A22B') {
      setIsMarried(handleMarriageStatus(data?.data[1]?.message));
      setGaji(convertRupiahToNumber(data?.data[3]?.message));
      setCicilan(convertRupiahToNumber(data?.data[7]?.message));
    }
  }, [data?.data, templateCode]);

  const sendMessage = async (newMessage: string) => {
    if (!newMessage) return;

    setIsLoading(true);
    const newChatsToAdd: ChatMessage[] = [
      ...(chatRoomMessages || []),
      {
        type_user: 'user',
        message: newMessage,
      },
    ];
    setChatRoomMessages(newChatsToAdd);

    const newChatsToSave: ChatMessage[] = [
      ...(messagesToAdded || []),
      {
        type_user: 'user',
        message: newMessage,
      },
    ];
    setMessagesToAdded(newChatsToSave);

    // Jika ini adalah jawaban untuk pertanyaan hutang
    if (chatType === 'debt_question' && financialIssueCode === 'hutang') {
      const botMessage = `Silahkan menyisihkan 50% dari gaji dalam satu bulan untuk membayar hutang sampai hutangmu lunas. Sisihkan 10% untuk ditabung, dan sisa 40% untuk kehidupan sehari-hari. Ini resepmu, ya. Untuk mengetahui risk profilemu, silahkan klik tombol di bawah.`;

      setResep({
        profile: '',
        text: `Silahkan menyisihkan 50% dari gaji dalam satu bulan untuk membayar hutang sampai hutangmu lunas. Sisihkan 10% untuk ditabung, dan sisa 40% untuk kehidupan sehari-hari.`,
        allocation: [],
      });

      newChatsToAdd.push({
        type_user: 'bot',
        message: botMessage,
      });
      setChatRoomMessages(newChatsToAdd);
      newChatsToSave.push({
        type_user: 'bot',
        message: botMessage,
      });
      setMessagesToAdded(newChatsToSave);
      setChatType('financial_choices');
      setMessage('');
      setIsLoading(false);

      if (!isDemoMode) {
        const saveMessagePayload = {
          conversation_id: conversationId || null,
          messages: newChatsToSave,
          room_id: roomIdFromQuery || null,
          topic: '-',
        };
        await saveRiskProfileMessage(
          saveMessagePayload,
          user?.accessToken as string,
        );
        setMessagesToAdded(null);
        const saveRecipePayload = {
          allocation: [],
          cicilan: cicilan,
          conversation_id: conversationId || null,
          financial_issue_code: 'hutang',
          gaji: gaji,
          is_married: isMarried,
          profile: '',
          room_id: roomIdFromQuery || null,
          text: `Silahkan menyisihkan 50% dari gaji dalam satu bulan untuk membayar hutang sampai hutangmu lunas. Sisihkan 10% untuk ditabung, dan sisa 40% untuk kehidupan sehari-hari.`,
        };
        await saveRecipe(saveRecipePayload, user?.accessToken as string);
        mutate('chat-room-history');
        mutateRisk();
      } else {
        setMessagesToAdded(null);
      }

      return;
    }

    const lastConversation =
      chatRoomMessages &&
      chatRoomMessages.filter((msg) => msg.type_user === 'bot').pop();

    const userChat =
      chatRoomMessages &&
      chatRoomMessages.filter((msg) => msg.type_user === 'user');

    const filteredMessages =
      chatRoomMessages?.filter((msg) => msg.message !== '-') || [];

    const previousMessages = [];

    for (let i = 0; i < filteredMessages.length - 1; i++) {
      const current = filteredMessages[i];
      const next = filteredMessages[i + 1];

      if (current.type_user === 'bot' && next?.type_user === 'user') {
        previousMessages.push({
          pertanyaan: current.message,
          jawaban: next.message,
        });

        i++;
      }
    }

    try {
      if (isDemoMode) {
        const { message: botMessage, userId: newUserId } = await askDemoAI(
          newMessage,
          { userId: demoUserId ?? undefined }
        );
        if (newUserId) setDemoUserId(newUserId);
        const newChatData: ChatMessage = {
          type_user: 'bot',
          message: botMessage,
          conversation_id: 'demo',
          room_id: 'demo',
        };

        const newChatsToAddLagi: ChatMessage[] = [
          ...(newChatsToAdd || chatRoomMessages || []),
          newChatData,
        ];
        setChatRoomMessages(newChatsToAddLagi);
        setMessage('');
        onChatSent();
      } else {
        const payload: AskAIPayload = {
          conversation_id: lastConversation?.conversation_id || null,
          message: {
            percakapan: [
              ...(previousMessages || []),
              {
                jawaban: newMessage,
                pertanyaan: '-',
              },
            ],
            topic: userChat ? userChat[0].message : newMessage,
          },
          room_id: lastConversation?.room_id || null,
        };

        const response = await askAI(payload, user?.accessToken as string);
        const { data } = response;
        const newChatData: ChatMessage = {
          type_user: 'bot',
          message: data?.message,
          conversation_id: data?.conversation_id,
          room_id: data?.room_id,
        };

        setConversationId(data?.conversation_id);
        setRoomIdFromQuery(data?.room_id);

        const newChatsToAddLagi: ChatMessage[] = [
          ...(newChatsToAdd || chatRoomMessages || []),
          newChatData,
        ];
        setChatRoomMessages(newChatsToAddLagi);
        router.push(`?r=${data?.room_id}`, { scroll: false });
        setMessage('');
        onChatSent();
        mutate('chat-room-history');
        mutateRisk();
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : 'Terjadi kesalahan saat mengirim pesan ke AI'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const sendTemplateMessage = async (answers: string[]) => {
    if (!templateTopic) return;
    if (!templateQuestions.length) return;
    if (!answers.length) return;

    setIsLoading(true);
    try {
      if (isDemoMode) {
        const lastAnswer = answers[answers.length - 1];
        const { message: botMessage, userId: newUserId } = await askDemoAI(
          lastAnswer,
          { userId: demoUserId ?? undefined }
        );
        if (newUserId) setDemoUserId(newUserId);
        const newChatData: ChatMessage = {
          type_user: 'bot',
          message: botMessage,
          conversation_id: 'demo',
          room_id: 'demo',
        };
        const newChatsToAdd: ChatMessage[] = [
          ...(chatRoomMessages || []),
          newChatData,
        ];
        setChatRoomMessages(newChatsToAdd);
        setMessage('');
        onChatSent();
      } else {
        const payload = {
          conversation_id: null,
          message: {
            percakapan: templateQuestions.map((question, index) => ({
              pertanyaan: question,
              jawaban: answers[index],
            })),
            topic: templateTopic,
          },
          room_id: null,
        } as AskAIPayload;

        const response = await askAI(payload, user?.accessToken as string);

        if (response.status_code === 200) {
          const { data } = response;
          const newChatData: ChatMessage = {
            type_user: 'bot',
            message: data?.message,
            conversation_id: data?.conversation_id,
          };

          const newChatsToAdd: ChatMessage[] = [
            ...(chatRoomMessages || []),
            newChatData,
          ];
          setChatRoomMessages(newChatsToAdd);
          setMessage('');
          onChatSent();

          const roomId = data?.room_id;
          router.push(`?r=${roomId}`, { scroll: false });
          mutate('chat-room-history');
          mutateRisk();
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : 'Terjadi kesalahan saat mengirim pesan ke AI.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const QUIZ_DISABLED_TEMPLATES = ['A22A', 'A22B'];

  const handleTemplateMsg = (templateId: string, displayText?: string) => {
    if (QUIZ_DISABLED_TEMPLATES.includes(templateId)) {
      const message = displayText || getTemplateTopic(templateId);
      void sendMessage(message);
      return;
    }
    setChatType('template');
    setTemplateCode(templateId);
    setTemplateAnswers([]);
    const template = getTemplateQuestions(templateId);
    const topic = getTemplateTopic(templateId);
    setTemplateTopic(topic);
    setTemplateQuestions(template);
    setChatRoomMessages([
      {
        type_user: 'user',
        message: topic,
      },
      {
        type_user: 'bot',
        message: template[0],
      },
    ]);
  };

  const handleChoicesMsg = () => {
    setTemplateCode('RISK');
    setIsLoading(true);
    setChatType('choices');
    setTemplateAnswers([]);
    const questions = getChoicesTemplateQuestions();
    const options = getChoicesTemplateOptions();
    const topic = choicesTemplateLibraries.topic;
    setTemplateTopic(topic);
    setTemplateQuestions(questions);
    setTemplateChoices(options);
    setChatRoomMessages([
      {
        type_user: 'user',
        message: topic,
      },
    ]);
    setTimeout(() => {
      const newChatsToAdd: ChatMessage[] = [
        ...(chatRoomMessages || []),
        {
          type_user: 'bot',
          message: questions[0],
        },
      ];
      setChatRoomMessages(newChatsToAdd);

      setIsLoading(false);
    }, 1000);
  };

  const handleAnswerTemplate = (answer: string) => {
    if (!answer) return;

    setMessage('');

    const currentAnswer = [...templateAnswers, answer];
    setTemplateAnswers(currentAnswer);

    if (chatRoomMessages?.length === 2) {
      const merriageStatus = handleMarriageStatus(answer);
      setIsMarried(merriageStatus);
    }

    if (chatRoomMessages?.length === 6 && templateCode === 'A22A') {
      const penghasilan = convertRupiahToNumber(answer);
      setGaji(penghasilan);
    }

    if (chatRoomMessages?.length === 10 && templateCode === 'A22A') {
      const tagihan = convertRupiahToNumber(answer);
      setCicilan(tagihan);
    }

    if (chatRoomMessages?.length === 4 && templateCode === 'A22B') {
      const penghasilan = convertRupiahToNumber(answer);
      setGaji(penghasilan);
    }

    if (chatRoomMessages?.length === 8 && templateCode === 'A22B') {
      const tagihan = convertRupiahToNumber(answer);
      setCicilan(tagihan);
    }

    const currentAnswerLength = currentAnswer.length;
    const newChatsToAdd: ChatMessage[] = [
      ...(chatRoomMessages || []),
      {
        type_user: 'user',
        message: answer,
      },
    ];

    if (currentAnswerLength === templateQuestions.length) {
      setChatType('ai');
      sendTemplateMessage(currentAnswer);
    } else if (currentAnswerLength < templateQuestions.length) {
      newChatsToAdd.push({
        type_user: 'bot',
        message: templateQuestions[currentAnswerLength],
      });
    }
    setChatRoomMessages(newChatsToAdd);
  };

  const handleAnswerChoices = async (answer: string, score: number) => {
    setMessage('');
    const currentScore = choiceScore + score;
    const currentAnswerLength = templateAnswers.length + 1;
    const newChatsToAdd: ChatMessage[] = [
      ...(chatRoomMessages || []),
      {
        type_user: 'user',
        message: answer,
      },
    ];
    if (currentAnswerLength === templateQuestions.length) {
      setChatType('ai');
      newChatsToAdd.push({
        type_user: 'bot',
        message: getChoicesTemplateAnswer(currentScore),
      });

      if (!isDemoMode) {
        const saveMessagePayload = {
          conversation_id: null,
          messages: newChatsToAdd,
          room_id: null,
          topic: 'Bagaimana memilih instrumen investasi yang tepat',
        };
        await updateRiskProfile(currentScore, user?.accessToken as string);
        const response = await saveRiskProfileMessage(
          saveMessagePayload,
          user?.accessToken as string,
        );
        setMessagesToAdded(null);
        router.push(`?r=${response.data[0].room_id}`, { scroll: false });
        mutate('chat-room-history');
        mutateRisk();
      } else {
        setMessagesToAdded(null);
      }
    } else if (currentAnswerLength < templateQuestions.length) {
      newChatsToAdd.push({
        type_user: 'bot',
        message: templateQuestions[currentAnswerLength],
      });
    }
    setChatRoomMessages(newChatsToAdd);

    const currentAnswer = [...templateAnswers, answer];
    setTemplateAnswers(currentAnswer);
    setChoiceScore(currentScore);
  };

  const handleFinancialIssueChoice = async (choice: string, code: string) => {
    setFinancialIssueCode(code);
    const newChatsToAdd: ChatMessage[] = [
      ...(chatRoomMessages || []),
      {
        type_user: 'user',
        message: choice,
      },
    ];

    const newChatsToSave: ChatMessage[] =
      code === 'risk_profile'
        ? [
            {
              type_user: 'user',
              message: choice,
            },
          ]
        : [
            ...(messagesToAdded || []),
            {
              type_user: 'user',
              message: choice,
            },
          ];
    // setMessagesToAdded(newChatsToSave);

    if (code === 'membeli') {
      const maxCicilan = gaji * 0.3;

      const apakahCicilanTerlaluBanyak = cicilan > maxCicilan;

      let resepMessage = '';

      if (apakahCicilanTerlaluBanyak) {
        resepMessage =
          'Tugasmu yang utama adalah mengurangi cicilan-cicilan ini dan kurangi biaya ngopi, biaya nonton atau hang out dulu ya, sampai cicilan-cicilanmu totalnya maksimal hanya 30% dari pendapatanmu bulanan.';
      } else {
        resepMessage =
          'Kamu sudah lumayan sehat, pastikan cicilanmu per bulan kurang dari 30%, dan pastikan kehidupan sehari-harimu (beli makan, uang transport, beli sembako, dll) itu terpenuhi dengan maksimal 50% dari pendapatan bulananmu.';
      }

      const botMessage = `${resepMessage} Ini resepmu, ya. Anda boleh mencoba kalkulator finansial yang tersedia di halaman utama.`;
      setResep({
        profile: '',
        text: resepMessage,
        allocation: [],
      });
      newChatsToAdd.push({
        type_user: 'bot',
        message: botMessage,
      });
      newChatsToSave.push({
        type_user: 'bot',
        message: botMessage,
      });
      setChatType('financial_choices');

      if (!isDemoMode) {
        const saveMessagePayload = {
          conversation_id: conversationId || null,
          messages: newChatsToSave,
          room_id: roomIdFromQuery || null,
          topic: '-',
        };
        await saveRiskProfileMessage(
          saveMessagePayload,
          user?.accessToken as string,
        );
        const saveRecipePayload = {
          allocation: [],
          cicilan: cicilan,
          conversation_id: conversationId || null,
          financial_issue_code: 'membeli',
          gaji: gaji,
          is_married: isMarried,
          profile: '',
          room_id: roomIdFromQuery || null,
          text: resepMessage,
        };
        await saveRecipe(saveRecipePayload, user?.accessToken as string);
        mutate('chat-room-history');
        mutateRisk();
      }
      setMessagesToAdded(null);
    } else if (code === 'investasi') {
      const riskScore = isDemoMode ? 3 : riskProfileData?.data?.risk_score;
      if (!isDemoMode && riskProfileData?.data.risk_score === 0) {
        return toast.error(
          'Anda tidak memiliki profil resiko, silahkan mengisi instrumen investasi.',
        );
      }

      const botMessage =
        'Sebelum Anda mulai berinvestasi, Anda boleh cek profil resiko dulu ya.';
      newChatsToAdd.push({
        type_user: 'bot',
        message: botMessage,
      });
      newChatsToSave.push({
        type_user: 'bot',
        message: botMessage,
      });

      const dataResep = getChoicesTemplateAnswerForResep(
        (riskScore ?? 3) as number,
      );

      setResep(dataResep);

      if (!isDemoMode) {
        const saveMessagePayload = {
          conversation_id: conversationId || null,
          messages: newChatsToSave,
          room_id: roomIdFromQuery || null,
          topic: '-',
        };
        await saveRiskProfileMessage(
          saveMessagePayload,
          user?.accessToken as string,
        );
        const saveRecipePayload = {
          allocation: dataResep.allocation || [],
          cicilan: cicilan,
          conversation_id: conversationId || null,
          financial_issue_code: 'investasi',
          gaji: gaji,
          is_married: isMarried,
          profile: dataResep.profile || '',
          room_id: roomIdFromQuery || null,
          text: dataResep.text || '',
        };
        await saveRecipe(saveRecipePayload, user?.accessToken as string);
        mutate('chat-room-history');
        mutateRisk();
      }
      setMessagesToAdded(null);
    } else if (code === 'hutang') {
      newChatsToAdd.push({
        type_user: 'bot',
        message: 'Berapa hutangmu saat ini?\n\nContoh masukkan: 10.000.000',
      });
      newChatsToSave.push({
        type_user: 'bot',
        message: 'Berapa hutangmu saat ini?\n\nContoh masukkan: 10.000.000',
      });
      setChatType('debt_question');
      setMessagesToAdded(newChatsToSave);
    } else if (code === 'risk_profile') {
      const riskScore = isDemoMode ? 3 : riskProfileData?.data?.risk_score;
      if (!isDemoMode && riskProfileData?.data.risk_score === 0) {
        return toast.error(
          'Anda tidak memiliki profil resiko, silahkan mengisi instrumen investasi.',
        );
      }

      const answerMsg = getChoicesTemplateAnswer((riskScore ?? 3) as number);
      newChatsToAdd.push({
        type_user: 'bot',
        message: answerMsg,
      });
      newChatsToSave.push({
        type_user: 'bot',
        message: answerMsg,
      });

      if (!isDemoMode) {
        const saveMessagePayload = {
          conversation_id: conversationId || null,
          messages: newChatsToSave,
          room_id: roomIdFromQuery || null,
          topic: '-',
        };
        await saveRiskProfileMessage(
          saveMessagePayload,
          user?.accessToken as string,
        );
        mutate('chat-room-history');
        mutateRisk();
      }
      setMessagesToAdded(null);
    } else if (code === 'resep') {
      setIsResepModalOpen(true);
    }

    setChatRoomMessages(newChatsToAdd);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatRoomMessages]);

  const financialChoices = [
    { text: 'Saya punya hutang.', code: 'hutang' },
    { text: 'Saya ingin membeli sesuatu.', code: 'membeli' },
    {
      text: 'Saya hanya ingin berinvestasi sesuai kondisi saya.',
      code: 'investasi',
    },
  ];

  return (
    <div className={cn('h-full overflow-auto', className)}>
      <div
        className={cn(
          'h-full flex flex-col',
          chatRoomMessages && chatRoomMessages?.length > 0
            ? 'justify-between'
            : 'gap-4 justify-center',
        )}
      >
        {(isLoadingUser || getChatRoomByIdLoading) && !isDemoMode ? (
          <ChatSkeleton />
        ) : !chatRoomMessages ? (
          <p className='font-bold text-lg md:text-4xl text-center'>
            {whatDoYouWant}{' '}
            <span className='text-docduit-blue'>{toConsult}</span>
          </p>
        ) : (
          <div
            ref={chatContainerRef}
            className='flex-1 overflow-y-auto p-4 space-y-4'
          >
            {chatRoomMessages
              ?.filter((chat) => chat.message !== '-')
              .map((chat, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-end space-x-2',
                    chat.type_user === 'user' && 'justify-end',
                  )}
                >
                  <div
                    className={cn(
                      'p-4 rounded-lg',
                      chat.type_user === 'bot'
                        ? 'bg-docduit-lightgray rounded-bl-none'
                        : 'bg-docduit-blue/10 rounded-br-none',
                    )}
                  >
                    <ReactMarkdown>{chat.message}</ReactMarkdown>
                  </div>
                </div>
              ))}
            {isLoading && (
              <div className='flex items-end space-x-2'>
                <div className='p-4 rounded-lg bg-docduit-lightgray rounded-bl-none'>
                  <p className='text-sm animate-typing overflow-hidden whitespace-nowrap'>
                    Thinking ...
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
        {chatType === 'choices' && !isLoadingUser && (
          <div className='flex flex-col gap-2'>
            {templateChoices[templateAnswers.length]?.map((choice, index) => (
              <div
                key={index}
                onClick={() => handleAnswerChoices(choice, index + 1)}
                className='p-4 border-2 rounded-lg flex gap-4 hover:bg-gray-100 cursor-pointer'
              >
                <p>{choice}</p>
              </div>
            ))}
          </div>
        )}
        {chatType === 'financial_choices' && !isLoadingUser && (
          <div className='flex flex-col gap-2'>
            {financialIssueCode === 'hutang' ? (
              <>
                <div
                  onClick={
                    riskProfileData?.data.risk_score === 0
                      ? undefined
                      : () =>
                          handleFinancialIssueChoice(
                            'Ketahui profil resiko saya.',
                            'risk_profile',
                          )
                  }
                  className={`p-4 border-2 rounded-lg flex flex-col gap-0 ${
                    riskProfileData?.data.risk_score === 0
                      ? 'cursor-not-allowed opacity-50'
                      : 'hover:bg-gray-100 cursor-pointer'
                  }`}
                >
                  <p>Ketahui profil resiko saya.</p>
                  {riskProfileData?.data.risk_score === 0 && (
                    <p className='text-xs text-gray-500'>
                      Silakan isi instrumen investasi terlebih dahulu
                    </p>
                  )}
                </div>
                <div
                  onClick={() => setIsResepModalOpen(true)}
                  className='p-4 border-2 rounded-lg flex gap-4 hover:bg-gray-100 cursor-pointer'
                >
                  <p>Buka resep hasil konsultasi.</p>
                </div>
              </>
            ) : financialIssueCode === 'hutang' ||
              financialIssueCode === 'investasi' ||
              financialIssueCode === 'membeli' ? (
              <>
                <div
                  onClick={
                    riskProfileData?.data.risk_score === 0
                      ? undefined
                      : () =>
                          handleFinancialIssueChoice(
                            'Ketahui profil resiko saya.',
                            'risk_profile',
                          )
                  }
                  className={`p-4 border-2 rounded-lg flex flex-col gap-0 ${
                    riskProfileData?.data.risk_score === 0
                      ? 'cursor-not-allowed opacity-50'
                      : 'hover:bg-gray-100 cursor-pointer'
                  }`}
                >
                  <p>Ketahui profil resiko saya.</p>
                  {riskProfileData?.data.risk_score === 0 && (
                    <p className='text-xs text-gray-500'>
                      Silakan isi instrumen investasi terlebih dahulu
                    </p>
                  )}
                </div>
                <div
                  onClick={() => setIsResepModalOpen(true)}
                  className='p-4 border-2 rounded-lg flex gap-4 hover:bg-gray-100 cursor-pointer'
                >
                  <p>Buka resep hasil konsultasi.</p>
                </div>
              </>
            ) : financialIssueCode === 'risk_profile' ? (
              <div
                onClick={() => setIsResepModalOpen(true)}
                className='p-4 border-2 rounded-lg flex gap-4 hover:bg-gray-100 cursor-pointer'
              >
                <p>Buka resep hasil konsultasi.</p>
              </div>
            ) : financialIssueCode === 'resep' ? (
              <div> </div>
            ) : (
              financialChoices.map((choice, index) => (
                <div
                  key={index}
                  onClick={
                    choice.code === 'investasi' &&
                    riskProfileData?.data.risk_score === 0
                      ? undefined
                      : () =>
                          handleFinancialIssueChoice(choice.text, choice.code)
                  }
                  className={`p-4 border-2 rounded-lg flex flex-col gap-0 ${
                    choice.code === 'investasi' &&
                    riskProfileData?.data.risk_score === 0
                      ? 'cursor-not-allowed opacity-50'
                      : 'hover:bg-gray-100 cursor-pointer'
                  }`}
                >
                  <p>{choice.text}</p>
                  {choice.code === 'investasi' &&
                    riskProfileData?.data.risk_score === 0 && (
                      <p className='text-xs text-gray-500'>
                        Silakan isi instrumen investasi terlebih dahulu
                      </p>
                    )}
                </div>
              ))
            )}
          </div>
        )}
        {chatType !== 'choices' && chatType !== 'financial_choices' && (
          <div className='rounded-full flex justify-center items-center border-2'>
            <Input
              disabled={
                isLoading ||
                financialIssueCode === 'risk_profile' ||
                isLoadingChat
              }
              value={message}
              placeholder={
                isNominalInput
                  ? placeholderNominalStr
                  : placeholderQuestionStr
              }
              className='min-h-10 rounded-full border-0 focus:outline-none'
              onChange={(e) =>
                isNominalInput
                  ? handleNominalInputChange(e)
                  : setMessage(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (chatType === 'template') {
                    handleAnswerTemplate(message);
                  } else {
                    sendMessage(message);
                  }
                }
              }}
            />
            <Button
              className='!rounded-full !w-10 !h-10 bg-docduit-blue text-white flex items-center justify-center m-2 hover:bg-white hover:text-docduit-blue hover:border hover:border-docduit-blue cursor-pointer'
              onClick={() => {
                if (chatType === 'template') {
                  handleAnswerTemplate(message);
                } else {
                  sendMessage(message);
                }
              }}
              disabled={isLoading}
            >
              <ArrowUp className='w-8 h-8' />
            </Button>
          </div>
        )}
        {chatRoomMessages === null &&
          !isLoading &&
          !isLoadingUser &&
          !getChatRoomByIdLoading && (
            <ChatroomQuestionTemplates
              vocabularies={vocabularies}
              onTemplateClicked={handleTemplateMsg}
              onTemplateChoicesClicked={handleChoicesMsg}
            />
          )}
      </div>
      {isResepModalOpen && (
        <PrescriptionModal
          onClose={() => setIsResepModalOpen(false)}
          resep={resep}
          isMarried={isMarried}
        />
      )}
    </div>
  );
}
