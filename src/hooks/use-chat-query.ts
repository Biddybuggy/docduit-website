// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { useToast } from './use-toast';
// import getChatServices from '@/lib/api/modules/chat';
// import { AskAIParams } from '@/lib/api/modules/chat/types';
// import useUserSessionQuery from './use-user-session';
// import getChatV2Services from '@/lib/api/modules/chat-v2';

// export type ChatDataType = {
//   conversation_id?: string;
//   id?: string;
//   room_id?: string;
//   updated_at?: string;
//   created_at?: string;
//   message: string;
//   type_user: string;
// };

// export type ChatRoomDataType = {
//   created_at: string;
//   id: string;
//   title: string;
//   updated_at?: string;
//   user_id?: string;
// };

// export function useChatQuery() {
//   const queryClient = useQueryClient();
//   const { deleteUserSessionMutation, userInfo } = useUserSessionQuery();
//   const { toast } = useToast();
//   const chatServices = getChatServices((msg) =>
//     toast({
//       title: 'Oops!',
//       description: msg,
//       variant: 'destructive',
//     }),
//   );
//   const chatV2Services = getChatV2Services((msg) =>
//     toast({
//       title: 'Oops!',
//       description: msg,
//       variant: 'destructive',
//     }),
//   );

//   const useGetRoomChats = (chatRoomId?: string) => {
//     return useQuery({
//       queryKey: ['chatRoom', chatRoomId],
//       enabled: Boolean(chatRoomId),
//       queryFn: async () => {
//         if (!chatRoomId) return [];
//         const res = await chatServices.getRoomChats(chatRoomId);
//         let chatData: ChatDataType[] = [];
//         if (res.status === 200) {
//           const data = res.data.data || [];
//           chatData = data;
//         } else if (res.status === 401) {
//           deleteUserSessionMutation();
//         }
//         return chatData;
//       },
//       initialData: [],
//     });
//   };

//   const resetStaticRoomChats = () => {
//     queryClient.setQueryData(['staticRoomChats'], []);
//   };

//   const {
//     data: chatRooms,
//     isLoading: isLoadingChatRooms,
//     refetch: refetchChatRooms,
//   } = useQuery({
//     queryKey: ['rooms'],
//     retry: false,
//     queryFn: async () => {
//       return [];
//       // const res = await chatServices.getAllRooms();
//       // let roomsData: ChatRoomDataType[] = [];
//       // if (res.status === 200) {
//       //   const data = res.data.data || [];
//       //   roomsData = data;
//       // } else if (res.status === 401) {
//       //   deleteUserSessionMutation();
//       // }
//       // return roomsData;
//     },
//   });

//   const fetchChatRoomFromLocalStorage = () => {
//     const email = userInfo?.email;
//     if (!email) return [];
//     const localData = localStorage.getItem(email);
//     if (!localData) return [];

//     try {
//       const rooms = JSON.parse(localData);
//       return rooms as ChatRoomDataType[];
//     } catch (error) {
//       console.error('[Rooms] Error parsing local storage data:', error);
//       return [];
//     }
//   };

//   const { data: chatRoomsV2, refetch: refetchChatRoomsV2 } = useQuery({
//     queryKey: ['rooms-local'],
//     enabled: true,
//     retry: false,
//     queryFn: fetchChatRoomFromLocalStorage,
//     initialData: () => fetchChatRoomFromLocalStorage(),
//   });

//   const updateChatRoomV2 = (newRoom: ChatRoomDataType) => {
//     const email = userInfo?.email;
//     if (!email) return;
//     const localDataJSON = localStorage.getItem(email);
//     let updatedRooms = [];

//     if (localDataJSON) {
//       try {
//         const existingRooms = JSON.parse(localDataJSON);
//         updatedRooms = existingRooms;
//       } catch (error) {
//         console.error('[Rooms Add] Error parsing local storage data:', error);
//         return [];
//       }
//     }
//     const roomIndex = updatedRooms.findIndex(
//       (room: ChatRoomDataType) => room.id === newRoom.id,
//     );
//     if (roomIndex !== -1) {
//       const currentRoom = updatedRooms[roomIndex];
//       updatedRooms[roomIndex] = {
//         ...currentRoom,
//         updated_at: new Date().toISOString(),
//       };
//     } else {
//       updatedRooms.push(newRoom);
//     }
//     localStorage.setItem(email, JSON.stringify(updatedRooms));
//     refetchChatRoomsV2();
//   };

//   const useSendChatAI = () => {
//     return useMutation({
//       mutationFn: (payload: AskAIParams) => {
//         // return chatServices.askAI(payload);
//         return chatV2Services.askAI(payload);
//       },
//       onSuccess: (response) => {
//         if (response.status === 200) {
//           const { data } = response;
//           if (data.status_code === 200) {
//             const newChatData = data.data;
//             const roomId = newChatData.room_id;
//             queryClient.invalidateQueries({ queryKey: ['chatRoom', roomId] });
//             queryClient.invalidateQueries({ queryKey: ['rooms'] });
//             queryClient.setQueryData(['activeChatRoomId'], roomId);
//           }
//         } else if (response.status === 401) {
//           deleteUserSessionMutation();
//         }
//       },
//     });
//   };

//   const updateLocalRoomChats = (
//     chatRoomId: string,
//     newChatDatas: ChatDataType[],
//   ) => {
//     if (!chatRoomId) return;
//     const localData = localStorage.getItem(chatRoomId);
//     let updatedChats: ChatDataType[] = [];
//     if (localData) {
//       try {
//         const chats = JSON.parse(localData);
//         updatedChats = chats as ChatDataType[];
//       } catch (error) {
//         console.error(
//           '[Update Chats by Room ID] Error parsing local storage data:',
//           error,
//         );
//       }
//     }

//     localStorage.setItem(
//       chatRoomId,
//       JSON.stringify([...updatedChats, ...newChatDatas]),
//     );
//   };

//   const useSendChatAIV2 = (activeChatRoomId: string) => {
//     return useMutation({
//       mutationFn: (payload: AskAIParams) => {
//         return chatV2Services.askAI(payload);
//       },
//       onSuccess: (response, variables) => {
//         if (response.status === 200) {
//           const { data } = response;
//           let newChatData = [
//             {
//               type_user: 'bot',
//               message: data?.messages,
//               conversation_id: data?.conversation_id,
//               created_at: new Date().toISOString(),
//             },
//           ];
//           if (variables?.question) {
//             newChatData = [
//               {
//                 conversation_id: '',
//                 type_user: 'user',
//                 message: variables?.question,
//                 created_at: new Date().toISOString(),
//               },
//               ...newChatData,
//             ];
//           }
//           const currentRoom = {
//             created_at: new Date().toISOString(),
//             id: activeChatRoomId,
//             title:
//               variables?.topic || variables?.question || 'New Conversation',
//             updated_at: new Date().toISOString(),
//           };
//           updateChatRoomV2(currentRoom);
//           updateLocalRoomChats(activeChatRoomId, newChatData);
//         } else if (response.status === 401) {
//           deleteUserSessionMutation();
//         }
//       },
//     });
//   };

//   return {
//     chatRooms: chatRooms || [],
//     chatRoomsV2,
//     refetchChatRooms,
//     refetchChatRoomsV2,
//     updateChatRoomV2,
//     isLoadingChatRooms,
//     useSendChatAI,
//     useSendChatAIV2,
//     useGetRoomChats,
//     resetStaticRoomChats,
//   };
// }

// export const getLocalRoomChats = (chatRoomId?: string) => {
//   if (typeof window === 'undefined') {
//     // Return an empty array if running on the server
//     return [];
//   }
//   if (!chatRoomId) return [];
//   const localData = localStorage.getItem(chatRoomId);
//   if (!localData) return [];

//   try {
//     const chats = JSON.parse(localData);
//     return chats as ChatDataType[];
//   } catch (error) {
//     console.error(
//       '[Chats by Room ID] Error parsing local storage data:',
//       error,
//     );
//     return [];
//   }
// };
