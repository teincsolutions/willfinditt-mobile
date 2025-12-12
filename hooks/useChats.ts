import { chatsSerivce } from '@/services/chatService';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

export const useChats = (params?: {
  page?: number;
  limit?: number;
  search?:string;
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
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });
};

// Hook to fetch chat statistics for current user
export const useChatStats = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["chat-stats"],
    queryFn: () => chatsSerivce.getStats(),
    enabled,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000,
  });
};
