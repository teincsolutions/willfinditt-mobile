# Ads Hooks & Services Usage Guide

## Overview

This guide explains how to use the ads hooks and services for search, filtering, and displaying ads in your React Native application. We provide three main endpoints with different use cases:

1. **`/ads`** - Basic endpoint for simple listing
2. **`/ads/search`** - Advanced search with graph-like requests and facets
3. **`/ads/search/suggestions`** - Lightweight endpoint for autocomplete and quick previews

---

## Table of Contents

- [Available Hooks](#available-hooks)
- [Use Cases & Examples](#use-cases--examples)
- [Best Practices](#best-practices)
- [Performance Tips](#performance-tips)

---

## Available Hooks

### Search & Browse Hooks

| Hook | Endpoint | Use Case | Data Size |
|------|----------|----------|-----------|
| `useInfiniteAds` | `/ads` | Basic infinite scroll listing | Full |
| `useSearchAds` | `/ads/search` | Single page advanced search | Full |
| `useInfiniteSearchAds` | `/ads/search` | Infinite scroll advanced search | Full |
| `useSearchSuggestions` | `/ads/search/suggestions` | Autocomplete dropdown | Minimal |
| `useInfiniteSearchSuggestions` | `/ads/search/suggestions` | Mobile list view, quick browse | Minimal |

### Individual Ad Hooks

| Hook | Description |
|------|-------------|
| `useAd` | Get single ad by ID |

### User-Specific Hooks

| Hook | Description |
|------|-------------|
| `useMyAds` | Get current user's ads (paginated) |
| `useInfiniteMyAds` | Get current user's ads (infinite scroll) |
| `useSavedAds` | Get user's saved/favorited ads (paginated) |
| `useInfiniteSavedAds` | Get user's saved ads (infinite scroll) |
| `useSellerAds` | Get ads by specific seller (paginated) |
| `useInfiniteSellerAds` | Get ads by seller (infinite scroll) |

### Special Hooks

| Hook | Description |
|------|-------------|
| `useTrendingAds` | Get trending/popular ads |

### Mutation Hooks

| Hook | Description |
|------|-------------|
| `useCreateAd` | Create new ad |
| `useUpdateAd` | Update existing ad |
| `useDeleteAd` | Delete ad |
| `useSaveAd` | Save/favorite an ad |
| `useUnsaveAd` | Remove ad from favorites |

---

## Use Cases & Examples

### 1. Home Screen - Browse Latest Ads

**Use:** `useInfiniteAds`

```tsx
import { useInfiniteAds } from '@/hooks/useAds';
import { FlashList } from '@shopify/flash-list';

function HomeScreen() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteAds({
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const ads = data?.pages.flatMap(page => page.data) ?? [];

  return (
    <FlashList
      data={ads}
      renderItem={({ item }) => <AdCard ad={item} />}
      onEndReached={() => hasNextPage && fetchNextPage()}
      estimatedItemSize={200}
    />
  );
}
```

---

### 2. Search Screen - Autocomplete Suggestions

**Use:** `useSearchSuggestions` (lightweight, fast)

```tsx
import { useState, useEffect } from 'react';
import { useSearchSuggestions } from '@/hooks/useAds';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const { data, isLoading } = useSearchSuggestions(
    {
      query: debouncedQuery,
      limit: 5,
      sortBy: 'promotionPriority',
    },
    debouncedQuery.length >= 2 // Only search if 2+ characters
  );

  return (
    <View>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search for items..."
      />
      
      {isLoading && <ActivityIndicator />}
      
      {data?.data.map((suggestion) => (
        <SuggestionItem
          key={suggestion.id}
          title={suggestion.title}
          price={suggestion.price}
          thumbnail={suggestion.thumbnail}
          onPress={() => navigateToAd(suggestion.id)}
        />
      ))}
    </View>
  );
}
```

---

### 3. Search Results Screen - Full Details

**Use:** `useInfiniteSearchAds` (advanced filtering)

```tsx
import { useInfiniteSearchAds } from '@/hooks/useAds';
import { AdCondition } from '@/types';

function SearchResultsScreen({ route }) {
  const { searchParams } = route.params;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteSearchAds({
    search: {
      query: searchParams.query,
      categoryIds: searchParams.categories,
      cityIds: searchParams.cities,
      priceMin: searchParams.minPrice,
      priceMax: searchParams.maxPrice,
      conditions: searchParams.conditions,
      sortBy: 'promotionPriority',
      sortOrder: 'desc',
      limit: 20,
    },
    facets: {
      categories: true,
      cities: true,
      conditions: true,
      priceRanges: true,
    },
  });

  const ads = data?.pages.flatMap(page => page.data) ?? [];

  return (
    <View>
      <FilterBar facets={data?.pages[0]?.facets} />
      <FlashList
        data={ads}
        renderItem={({ item }) => <AdCard ad={item} />}
        onEndReached={() => hasNextPage && fetchNextPage()}
      />
    </View>
  );
}
```

---

### 4. Category Screen - Quick Browse

**Use:** `useInfiniteSearchSuggestions` (fast, lightweight)

```tsx
import { useInfiniteSearchSuggestions } from '@/hooks/useAds';

function CategoryScreen({ categoryId }) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteSearchSuggestions({
    categoryIds: [categoryId],
    limit: 20,
    sortBy: 'promotionPriority',
    sortOrder: 'desc',
  });

  const suggestions = data?.pages.flatMap(page => page.data) ?? [];

  return (
    <FlashList
      data={suggestions}
      renderItem={({ item }) => (
        <QuickAdCard
          id={item.id}
          title={item.title}
          price={item.price}
          thumbnail={item.thumbnail}
          isPromoted={item.isPromoted}
        />
      )}
      onEndReached={() => hasNextPage && fetchNextPage()}
      estimatedItemSize={150}
    />
  );
}
```

---

### 5. Filters Screen - Dynamic Filtering

**Use:** `useInfiniteSearchAds` or `useInfiniteSearchSuggestions`

```tsx
import { useState } from 'react';
import { useInfiniteSearchSuggestions } from '@/hooks/useAds';
import { AdCondition } from '@/types';

function FiltersScreen() {
  const [filters, setFilters] = useState({
    categoryIds: [],
    cityIds: [],
    priceMin: undefined,
    priceMax: undefined,
    conditions: [],
    promotionFilter: 'all',
  });

  const {
    data,
    refetch,
    isLoading,
  } = useInfiniteSearchSuggestions({
    ...filters,
    limit: 20,
  });

  const handleApplyFilters = () => {
    refetch();
  };

  return (
    <View>
      <CategoryFilter
        selected={filters.categoryIds}
        onChange={(ids) => setFilters({ ...filters, categoryIds: ids })}
      />
      
      <LocationFilter
        selected={filters.cityIds}
        onChange={(ids) => setFilters({ ...filters, cityIds: ids })}
      />
      
      <PriceRangeFilter
        min={filters.priceMin}
        max={filters.priceMax}
        onChange={(min, max) => 
          setFilters({ ...filters, priceMin: min, priceMax: max })
        }
      />
      
      <ConditionFilter
        selected={filters.conditions}
        onChange={(conditions) => 
          setFilters({ ...filters, conditions })
        }
      />
      
      <Button title="Apply Filters" onPress={handleApplyFilters} />
    </View>
  );
}
```

---

### 6. User Profile - Seller's Ads

**Use:** `useInfiniteSellerAds`

```tsx
import { useInfiniteSellerAds } from '@/hooks/useAds';

function SellerProfileScreen({ sellerId }) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteSellerAds(
    sellerId,
    { limit: 20 }
  );

  const sellerAds = data?.pages.flatMap(page => page.data) ?? [];

  return (
    <View>
      <SellerInfo sellerId={sellerId} />
      
      <Text>Active Listings ({data?.pages[0]?.meta.total})</Text>
      
      <FlashList
        data={sellerAds}
        renderItem={({ item }) => <AdCard ad={item} />}
        onEndReached={() => hasNextPage && fetchNextPage()}
      />
    </View>
  );
}
```

---

### 7. My Ads Screen - User's Own Ads

**Use:** `useInfiniteMyAds`

```tsx
import { useInfiniteMyAds } from '@/hooks/useAds';
import { AdStatus } from '@/types';

function MyAdsScreen() {
  const [statusFilter, setStatusFilter] = useState<AdStatus | undefined>();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteMyAds({
    limit: 20,
    status: statusFilter,
  });

  const myAds = data?.pages.flatMap(page => page.data) ?? [];

  return (
    <View>
      <StatusFilter value={statusFilter} onChange={setStatusFilter} />
      
      <FlashList
        data={myAds}
        renderItem={({ item }) => (
          <MyAdCard
            ad={item}
            onEdit={() => navigateToEdit(item.id)}
            onDelete={() => handleDelete(item.id)}
          />
        )}
        onEndReached={() => hasNextPage && fetchNextPage()}
      />
    </View>
  );
}
```

---

### 8. Favorites/Saved Ads Screen

**Use:** `useInfiniteSavedAds`

```tsx
import { useInfiniteSavedAds, useUnsaveAd } from '@/hooks/useAds';

function FavoritesScreen() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteSavedAds({ limit: 20 });

  const unsaveAdMutation = useUnsaveAd();

  const savedAds = data?.pages.flatMap(page => page.data) ?? [];

  const handleUnsave = async (adId: string) => {
    await unsaveAdMutation.mutateAsync(adId);
  };

  return (
    <FlashList
      data={savedAds}
      renderItem={({ item }) => (
        <AdCard
          ad={item}
          onUnsave={() => handleUnsave(item.id)}
        />
      )}
      onEndReached={() => hasNextPage && fetchNextPage()}
    />
  );
}
```

---

### 9. Ad Details Screen - Single Ad

**Use:** `useAd`, `useSaveAd`, `useUnsaveAd`

```tsx
import { useAd, useSaveAd, useUnsaveAd } from '@/hooks/useAds';

function AdDetailsScreen({ adId }) {
  const { data: ad, isLoading } = useAd(adId);
  const saveAdMutation = useSaveAd();
  const unsaveAdMutation = useUnsaveAd();

  const handleToggleSave = async () => {
    if (ad?.isSaved) {
      await unsaveAdMutation.mutateAsync(adId);
    } else {
      await saveAdMutation.mutateAsync(adId);
    }
  };

  if (isLoading) return <LoadingScreen />;
  if (!ad) return <NotFoundScreen />;

  return (
    <ScrollView>
      <ImageCarousel images={ad.images} />
      <Text style={styles.title}>{ad.title}</Text>
      <Text style={styles.price}>{ad.price} {ad.currency}</Text>
      <Text>{ad.description}</Text>
      
      <Button
        title={ad.isSaved ? 'Unsave' : 'Save'}
        onPress={handleToggleSave}
      />
      
      <SellerInfo user={ad.user} />
      <MoreFromSeller sellerId={ad.userId} />
    </ScrollView>
  );
}
```

---

### 10. Create/Edit Ad Screen

**Use:** `useCreateAd`, `useUpdateAd`

```tsx
import { useCreateAd, useUpdateAd } from '@/hooks/useAds';
import { CreateAdRequest } from '@/types';

function CreateAdScreen({ existingAdId }) {
  const createAdMutation = useCreateAd();
  const updateAdMutation = useUpdateAd();
  
  const [formData, setFormData] = useState<CreateAdRequest>({
    title: '',
    description: '',
    price: 0,
    categoryId: '',
    // ... other fields
  });

  const handleSubmit = async () => {
    try {
      if (existingAdId) {
        await updateAdMutation.mutateAsync({
          id: existingAdId,
          data: formData,
        });
      } else {
        const newAd = await createAdMutation.mutateAsync(formData);
        navigation.navigate('AdDetails', { adId: newAd.id });
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView>
      <AdForm data={formData} onChange={setFormData} />
      <Button
        title={existingAdId ? 'Update Ad' : 'Create Ad'}
        onPress={handleSubmit}
        loading={createAdMutation.isPending || updateAdMutation.isPending}
      />
    </ScrollView>
  );
}
```

---

## Best Practices

### 1. **Choose the Right Hook for Your Use Case**

| Screen Type | Recommended Hook | Why |
|-------------|------------------|-----|
| Autocomplete/Search bar | `useSearchSuggestions` | Minimal data, fast response |
| Mobile list view | `useInfiniteSearchSuggestions` | Lightweight scrolling |
| Search results with filters | `useInfiniteSearchAds` | Full data with facets |
| Category browse | `useInfiniteSearchSuggestions` | Fast category filtering |
| Ad details | `useAd` | Full single ad data |

### 2. **Enable/Disable Queries Conditionally**

```tsx
// Only fetch when needed
const { data } = useSearchSuggestions(
  { query },
  query.length >= 2 // enabled parameter
);

const { data } = useAd(
  adId,
  !!adId // only when adId exists
);
```

### 3. **Debounce Search Input**

```tsx
const [query, setQuery] = useState('');
const [debouncedQuery, setDebouncedQuery] = useState('');

useEffect(() => {
  const timer = setTimeout(() => setDebouncedQuery(query), 300);
  return () => clearTimeout(timer);
}, [query]);

const { data } = useSearchSuggestions({ query: debouncedQuery });
```

### 4. **Handle Loading and Error States**

```tsx
const { data, isLoading, isError, error } = useInfiniteAds();

if (isLoading) return <LoadingSpinner />;
if (isError) return <ErrorMessage message={error.message} />;
if (!data || data.pages[0].data.length === 0) return <EmptyState />;
```

### 5. **Optimize Infinite Scroll**

```tsx
<FlashList
  data={ads}
  onEndReached={() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }}
  onEndReachedThreshold={0.5} // Fetch when 50% from bottom
  ListFooterComponent={
    isFetchingNextPage ? <LoadingSpinner /> : null
  }
/>
```

---

## Performance Tips

### 1. **Use Suggestions for Quick Views**

✅ **DO:** Use `/search/suggestions` for autocomplete, mobile lists, map markers
- 80-90% less data transferred
- Faster queries
- Better UX

❌ **DON'T:** Use full search when you only need basic info

### 2. **Leverage React Query Caching**

All hooks have built-in caching:
- **Suggestions:** 5 minutes (backend also caches)
- **Full search:** 5 minutes
- **Single ad:** 1 minute
- **User ads:** 2-3 minutes
- **Trending:** 10 minutes

### 3. **Prefetch on Hover (Web) or Pre-load**

```tsx
const queryClient = useQueryClient();

const handleAdHover = (adId: string) => {
  queryClient.prefetchQuery({
    queryKey: ['ad', adId],
    queryFn: () => adService.getById(adId),
  });
};
```

### 4. **Use Minimal Data First, Load Details Later**

```tsx
// Step 1: Show suggestions quickly
const { data: suggestions } = useInfiniteSearchSuggestions(params);

// Step 2: On click, load full details
const handleAdClick = (adId: string) => {
  navigation.navigate('AdDetails', { adId });
  // useAd hook will fetch full data
};
```

### 5. **Batch Mutations with Optimistic Updates**

```tsx
const saveAdMutation = useSaveAd();

const handleSave = async (adId: string) => {
  // Optimistic update
  queryClient.setQueryData(['ad', adId], (old: Ad) => ({
    ...old,
    isSaved: true,
  }));

  try {
    await saveAdMutation.mutateAsync(adId);
  } catch (error) {
    // React Query will auto-rollback on error
  }
};
```

---

## Summary

- **3 endpoints** for different needs: basic `/ads`, advanced `/ads/search`, lightweight `/ads/search/suggestions`
- **15+ hooks** covering all ad-related operations
- **Smart caching** with React Query (5-10 minute stale times)
- **Infinite scroll** support for all major views
- **Type-safe** with TypeScript
- **Error handling** built-in with fallbacks
- **Optimized** for mobile performance

Use this guide to build fast, responsive ad browsing and search experiences! 🚀
