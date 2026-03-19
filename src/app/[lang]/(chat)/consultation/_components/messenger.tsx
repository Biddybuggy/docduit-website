// import { useChatQuery } from '@/hooks/use-chat-query';
// import ChatroomQuestionTemplates from './chatroom/question-templates';
// import { Input } from '@/components/ui/input';
// import { useEffect, useRef, useState } from 'react';
// import { ArrowUp, RotateCcw } from 'lucide-react';
// import { cn } from '@/lib/utils';

// import { AskAIParams } from '@/lib/api/modules/chat/types';
// import { Button } from '@/components/ui/button';
// import ReactMarkdown from 'react-markdown';

// interface MessengerProps {
//   activeChatRoomId?: string;
//   onChatSent?: () => void;
//   vocabularies: any;
//   className?: string;
// }
// export default function Messenger({
//   activeChatRoomId,
//   vocabularies,
//   onChatSent = () => {},
//   className,
// }: MessengerProps) {
//   const {
//     chat: { whatDoYouWant, toConsult },
//   } = vocabularies;
//   const { useGetRoomChats, useSendChatAI } = useChatQuery();

//   const { data: chatRoomMessages, isLoading: isLoadingChats } =
//     useGetRoomChats(activeChatRoomId);
//   const {
//     mutateAsync: askAI,
//     variables: sendChatParams,
//     isPending: isSendingChat,
//   } = useSendChatAI();

//   const [message, setMessage] = useState('');
//   const [isError, setIsError] = useState(false);
//   const [lastPayload, setLastPayload] = useState<AskAIParams | undefined>(
//     undefined,
//   );
//   const chatContainerRef = useRef<HTMLDivElement>(null);

//   const sendMessage = async (newMessage: string) => {
//     if (!newMessage) return;

//     setIsError(false);
//     const lastConversation = chatRoomMessages
//       .filter((msg) => msg.type_user === 'bot')
//       .pop();

//     const payload = { message: newMessage } as AskAIParams;
//     if (activeChatRoomId) payload.room_id = activeChatRoomId;
//     if (lastConversation)
//       payload.conversation_id = lastConversation.conversation_id;

//     setLastPayload(payload);
//     const response = await askAI(payload);
//     if (response.status === 200) {
//       const { data } = response;
//       if (data.status_code === 200) {
//         setMessage('');
//         onChatSent();
//       } else {
//         setIsError(true);
//       }
//     }
//   };

//   const retrySendMessage = async () => {
//     if (!lastPayload?.message) return;

//     setIsError(false);
//     const response = await askAI(lastPayload);
//     if (response.status === 200) {
//       const { data } = response;
//       if (data.status_code === 200) {
//         setMessage('');
//         onChatSent();
//       } else {
//         setIsError(true);
//       }
//     }
//   };

//   const handleTemplateMsg = (msg: string) => {
//     sendMessage(msg);
//   };

//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop =
//         chatContainerRef.current.scrollHeight;
//     }
//   }, [chatRoomMessages]);

//   return (
//     <div className={cn('h-full overflow-auto', className)}>
//       <div
//         className={cn(
//           'h-full flex flex-col',
//           chatRoomMessages.length > 0
//             ? 'justify-between'
//             : 'gap-4 justify-center',
//         )}
//       >
//         {chatRoomMessages.length === 0 && !isSendingChat && !isError && (
//           <p className='font-bold text-lg md:text-4xl text-center'>
//             {whatDoYouWant}&nbsp;
//             <span className='text-docduit-blue'>{toConsult}</span>
//           </p>
//         )}
//         {chatRoomMessages.length > 0 ? (
//           <div
//             ref={chatContainerRef}
//             className='flex-1 overflow-y-auto p-4 space-y-4'
//           >
//             {chatRoomMessages.map((chat) => (
//               <div
//                 key={chat.id}
//                 className={cn(
//                   'flex items-end space-x-2',
//                   chat.type_user === 'user' && 'justify-end',
//                 )}
//               >
//                 <div
//                   className={cn(
//                     'p-4 rounded-lg',
//                     chat.type_user === 'bot'
//                       ? 'bg-docduit-lightgray rounded-bl-none'
//                       : 'bg-docduit-blue/10 rounded-br-none',
//                   )}
//                 >
//                   <ReactMarkdown>{chat.message}</ReactMarkdown>
//                 </div>
//               </div>
//             ))}
//             {isSendingChat && (
//               <div className='flex items-end space-x-2'>
//                 <div className='p-4 rounded-lg bg-docduit-lightgray rounded-bl-none'>
//                   <p className='text-sm animate-typing overflow-hidden whitespace-nowrap'>
//                     Thinking ...
//                   </p>
//                 </div>
//               </div>
//             )}
//             {isError && (
//               <div className='flex items-end space-x-2'>
//                 <div className='p-4 rounded-lg bg-docduit-lightgray rounded-bl-none'>
//                   Gagal mendapatkan respon dari AI, silahkan coba lagi
//                 </div>
//                 {lastPayload && (
//                   <Button variant='outline' onClick={retrySendMessage}>
//                     <RotateCcw className='w-8 h-8' />
//                   </Button>
//                 )}
//               </div>
//             )}
//           </div>
//         ) : isSendingChat || isError ? (
//           <div
//             ref={chatContainerRef}
//             className='flex-1 overflow-y-auto p-4 space-y-4'
//           >
//             <div className={'flex items-end space-x-2 justify-end'}>
//               <div className='p-4 rounded-lg bg-docduit-blue/10 rounded-br-none'>
//                 <ReactMarkdown>
//                   {sendChatParams?.message || lastPayload?.message}
//                 </ReactMarkdown>
//               </div>
//             </div>
//             {isSendingChat && (
//               <div className='flex items-end space-x-2'>
//                 <div className='p-4 rounded-lg bg-docduit-lightgray rounded-bl-none'>
//                   <p className='text-sm animate-typing overflow-hidden whitespace-nowrap'>
//                     Thinking ...
//                   </p>
//                 </div>
//               </div>
//             )}
//             {isError && (
//               <div className='flex items-end space-x-2'>
//                 <div className='p-4 rounded-lg bg-docduit-lightgray rounded-bl-none'>
//                   Gagal mendapatkan respon dari AI, silahkan coba lagi
//                 </div>
//                 {lastPayload && (
//                   <Button variant='outline' onClick={retrySendMessage}>
//                     <RotateCcw className='w-8 h-8' />
//                   </Button>
//                 )}
//               </div>
//             )}
//           </div>
//         ) : (
//           <></>
//         )}
//         <div className='rounded-full flex justify-center items-center border-2'>
//           <Input
//             disabled={isLoadingChats || isSendingChat}
//             value={message}
//             placeholder='Tuliskan pertanyaanmu'
//             className='min-h-10 rounded-full border-0 focus:outline-none'
//             onChange={(e) => setMessage(e.target.value)}
//             onKeyDown={(e) => {
//               if (e.key === 'Enter') {
//                 sendMessage(message);
//               }
//             }}
//           />
//           <Button
//             className='!rounded-full !w-10 !h-10 bg-docduit-blue text-white flex items-center justify-center m-2 hover:bg-white hover:text-docduit-blue hover:border hover:border-docduit-blue cursor-pointer'
//             onClick={() => sendMessage(message)}
//             disabled={isLoadingChats || isSendingChat}
//           >
//             <ArrowUp className='w-8 h-8' />
//           </Button>
//         </div>
//         {chatRoomMessages.length === 0 && !isSendingChat && !isError && (
//           <ChatroomQuestionTemplates
//             vocabularies={vocabularies}
//             onTemplateClicked={handleTemplateMsg}
//           />
//         )}
//       </div>
//     </div>
//   );
// }
