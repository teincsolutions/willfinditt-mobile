import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { chatsSerivce } from '@/services/chatService';
import { Chat } from '@/types';

export const useChats = (params?: {
  page?: number;
  limit?: number;
  adId?: string;
}) => {
  return useInfiniteQuery({
    queryKey: ["chats", params],
    queryFn: ({ pageParam = 1 }) =>
      chatsSerivce.listMyChats({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.meta) {
        return undefined;
      }
      const { page, totalPages } = lastPage.meta;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};
