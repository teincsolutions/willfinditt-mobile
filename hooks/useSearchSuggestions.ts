// hooks/useSearchSuggestions.ts
import { adService } from '@/services/adService';
import { useQuery } from '@tanstack/react-query';

export function useSearchSuggestions(query: string) {
  return useQuery({
    queryKey: ['search-suggestions', query],
    queryFn: async() => await adService.searchSuggestions({query}),
    enabled: !!query && query.length > 0,
    staleTime: 30000, // Cache for 30 seconds
  });
}
