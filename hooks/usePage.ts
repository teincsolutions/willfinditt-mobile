import { useQuery } from "@tanstack/react-query";
import { pageService, PageData } from "@/services/pageService";

export const usePage = (slug: string) => {
  return useQuery<PageData>({
    queryKey: ["page", slug],
    queryFn: () => pageService.getPageBySlug(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutes (pages don't change often)
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};
