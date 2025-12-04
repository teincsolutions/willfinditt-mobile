// hooks/useSearchSuggestions.ts
import { adService } from '@/services/adService';
import { Ad, Suggestion } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useSearchSuggestions(query: string) {
  return useQuery({
    queryKey: ['search-suggestions', query],
    queryFn: () => fetchSuggestions(query),
    enabled: !!query && query.length > 0,
    staleTime: 30000, // Cache for 30 seconds
  });
}

async function fetchSuggestions(query: string): Promise<Suggestion[]> {
  try {
    // Fetch ads matching the search query
    const response = await adService.getAll({
      search: query,
      limit: 10, // Limit suggestions to 10 items
      page: 1,
    });

    // Convert ads to suggestions format
    const suggestions: Suggestion[] = response.data.map((ad: Ad) => ({
      id: ad.id, // Keep as string
      keyword: ad.title,
      productId: ad.id,
      categoryId: ad.categoryId,
      categoryFieldId: ad.categoryFieldId,
      isRecent: false,
    }));

    return suggestions;
  } catch (error) {
    console.error('Error fetching search suggestions:', error);
    return [];
  }
}
