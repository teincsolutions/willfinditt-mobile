import { Ad } from "@/types";

/**
 * Removes duplicate ads based on their unique ID
 * @param ads - Array of ads that may contain duplicates
 * @returns Array of ads with duplicates removed
 */
export function deduplicateAds(ads: Ad[]): Ad[] {
  const seen = new Set<string>();
  return ads.filter((ad) => {
    if (seen.has(ad.id)) {
      return false;
    }
    seen.add(ad.id);
    return true;
  });
}
