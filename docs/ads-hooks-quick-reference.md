# Ads Hooks Quick Reference

## 🔍 Search & Browse

```tsx
// Basic infinite scroll - simple listing
useInfiniteAds({ categoryId, cityId, limit: 20 })

// Advanced search - full data with facets
useSearchAds({ search: { query, categoryIds, priceMin, priceMax }, facets })
useInfiniteSearchAds({ search: { ... }, facets })

// Suggestions - lightweight, fast (autocomplete, mobile lists)
useSearchSuggestions({ query, limit: 5 })  // Single page
useInfiniteSearchSuggestions({ query, categoryIds })  // Infinite scroll
```

## 📱 Individual & User Ads

```tsx
// Single ad
useAd(adId)

// Current user's ads
useMyAds({ status: 'ACTIVE' })
useInfiniteMyAds({ limit: 20 })

// Saved/favorite ads
useSavedAds()
useInfiniteSavedAds()

// Specific seller's ads
useSellerAds(userId, { limit: 20 })
useInfiniteSellerAds(userId)
```

## ⭐ Special

```tsx
// Trending ads
useTrendingAds({ limit: 10 })
```

## ✏️ Mutations

```tsx
// Create/Update/Delete
const createMutation = useCreateAd()
const updateMutation = useUpdateAd()
const deleteMutation = useDeleteAd()

await createMutation.mutateAsync(data)
await updateMutation.mutateAsync({ id, data })
await deleteMutation.mutateAsync(id)

// Save/Unsave
const saveMutation = useSaveAd()
const unsaveMutation = useUnsaveAd()

await saveMutation.mutateAsync(adId)
await unsaveMutation.mutateAsync(adId)
```

## 🎯 Common Filters

```tsx
{
  // Text search
  query: "iPhone",
  
  // Categories (multiple)
  categoryIds: ["cat_123", "cat_456"],
  
  // Locations (multiple)
  cityIds: ["city_abc", "city_def"],
  
  // Price range
  priceMin: 100,
  priceMax: 1000,
  
  // Conditions (multiple)
  conditions: ["NEW", "LIKE_NEW"],
  
  // Promotions
  promotionFilter: "promoted_only" | "non_promoted_only" | "all",
  
  // Sorting
  sortBy: "promotionPriority" | "createdAt" | "price" | "views",
  sortOrder: "asc" | "desc",
  
  // Pagination
  page: 1,
  limit: 20
}
```

## 🚀 Performance Tips

```tsx
// ✅ Use suggestions for autocomplete (fast, minimal data)
useSearchSuggestions({ query, limit: 5 }, query.length >= 2)

// ✅ Use suggestions for mobile lists (lightweight)
useInfiniteSearchSuggestions({ categoryIds: [id] })

// ✅ Use full search for detailed results
useInfiniteSearchAds({ search, facets })

// ✅ Conditional fetching
useAd(adId, !!adId)
useSearchSuggestions(params, enabled)

// ✅ Debounce search input
const [query, setQuery] = useState('');
const [debounced, setDebounced] = useState('');

useEffect(() => {
  const timer = setTimeout(() => setDebounced(query), 300);
  return () => clearTimeout(timer);
}, [query]);
```

## 📊 Data Size Comparison

| Hook | Endpoint | Data Size | Use Case |
|------|----------|-----------|----------|
| `useSearchSuggestions` | `/ads/search/suggestions` | ~10% | Autocomplete |
| `useInfiniteSearchSuggestions` | `/ads/search/suggestions` | ~10% | Mobile lists |
| `useSearchAds` | `/ads/search` | 100% | Full results |
| `useInfiniteSearchAds` | `/ads/search` | 100% | Full results + scroll |
| `useInfiniteAds` | `/ads` | 100% | Basic listing |

## 🎨 Common Patterns

### Autocomplete
```tsx
const [query, setQuery] = useState('');
const { data } = useSearchSuggestions({ query, limit: 5 }, query.length >= 2);
```

### Category Browse
```tsx
const { data, fetchNextPage, hasNextPage } = useInfiniteSearchSuggestions({
  categoryIds: [categoryId],
  limit: 20
});
```

### Search Results
```tsx
const { data, fetchNextPage, hasNextPage } = useInfiniteSearchAds({
  search: { query, categoryIds, priceMin, priceMax },
  facets: { categories: true, cities: true }
});
```

### Seller Profile
```tsx
const { data, fetchNextPage, hasNextPage } = useInfiniteSellerAds(
  sellerId,
  { limit: 20 }
);
```

### Save/Unsave
```tsx
const saveMutation = useSaveAd();
const unsaveMutation = useUnsaveAd();

const handleToggleSave = async (ad) => {
  if (ad.isSaved) {
    await unsaveMutation.mutateAsync(ad.id);
  } else {
    await saveMutation.mutateAsync(ad.id);
  }
};
```

---

**Full Documentation:** See `docs/ads-hooks-usage-guide.md`
