import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useActiveChatRoomId = () => {
  const queryClient = useQueryClient();

  const { data: activeChatRoomId } = useQuery<string | undefined>({
    queryKey: ['activeChatRoomId'],
    initialData: undefined,
  });

  const setActiveChatRoomId = useMutation({
    mutationFn: async (newId: string | undefined) => {
      queryClient.setQueryData(['activeChatRoomId'], newId);
    },
  });

  return {
    activeChatRoomId,
    setActiveChatRoomId: setActiveChatRoomId.mutate,
  };
};
