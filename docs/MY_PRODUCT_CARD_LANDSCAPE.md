# MyProductCardLandscape Component

A landscape card component for displaying user's own ads with management options via a popup menu.

## Features

- ✅ **Status Badge** - Shows ad status (Active, Draft, Sold, Expired, Suspended, Deleted)
- ✅ **Stats Display** - Shows views and saves count
- ✅ **Location & Date** - Displays city and creation date
- ✅ **Popup Menu** - Quick actions (Edit, Promote, Stats, Share, Mark as Sold, Delete)
- ✅ **Auto-fetch** - Can fetch ad by ID if not provided
- ✅ **Optimistic Updates** - Immediate UI feedback

## Usage

### Basic Usage

```tsx
import { MyProductCardLandscape } from "@/components/ads/MyProductCardLandscape";
import { useInfiniteMyAds } from "@/hooks/useAds";
import { FlashList } from "@shopify/flash-list";

export default function MyAdsScreen() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteMyAds({ limit: 20 });

  const ads = data?.pages.flatMap((page) => page.data) || [];

  return (
    <FlashList
      data={ads}
      renderItem={({ item }) => (
        <MyProductCardLandscape
          ad={item}
          onPress={() => {
            // Navigate to ad details
            router.push(`/ads/${item.id}`);
          }}
          style={{ marginBottom: 12 }}
        />
      )}
      estimatedItemSize={100}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
    />
  );
}
```

### Filter by Status

```tsx
// Show only active ads
const { data } = useInfiniteMyAds({
  limit: 20,
  status: "ACTIVE",
});

// Show only drafts
const { data: drafts } = useInfiniteMyAds({
  limit: 20,
  status: "DRAFT",
});

// Show only sold items
const { data: sold } = useInfiniteMyAds({
  limit: 20,
  status: "SOLD",
});
```

### Custom Callbacks

```tsx
<MyProductCardLandscape
  ad={ad}
  onPress={() => {
    // Custom press handler
    console.log("Ad pressed:", ad.id);
  }}
  onEdit={(ad) => {
    // Custom edit handler
    router.push(`/edit-ad/${ad.id}`);
  }}
  onDelete={(adId) => {
    // Custom delete handler
    console.log("Ad deleted:", adId);
  }}
/>
```

### Fetch by ID Only

```tsx
// If you only have the ID
<MyProductCardLandscape adId="123" onPress={() => router.push(`/ads/123`)} />
```

## Props

| Prop       | Type                     | Required | Description                                            |
| ---------- | ------------------------ | -------- | ------------------------------------------------------ |
| `ad`       | `Ad`                     | No\*     | The ad object to display                               |
| `adId`     | `string`                 | No\*     | Ad ID to fetch (if ad not provided)                    |
| `onPress`  | `() => void`             | No       | Called when card is pressed                            |
| `onEdit`   | `(ad: Ad) => void`       | No       | Custom edit handler (default: navigate to edit screen) |
| `onDelete` | `(adId: string) => void` | No       | Called after successful deletion                       |
| `style`    | `ViewStyle`              | No       | Additional styles for the card                         |

\*Either `ad` or `adId` must be provided

## Menu Actions

### Edit

- Opens edit screen for the ad
- Default: `router.push(\`/ads/\${ad.id}/edit\`)`
- Can be overridden with `onEdit` prop

### Promote

- Navigate to promote/boost ad screen
- Helps increase ad visibility
- Requires promotion feature implementation

### View Stats

- Shows detailed analytics
- Views, saves, engagement metrics
- Default: `router.push(\`/ads/\${ad.id}/stats\`)`

### Share

- Share ad link
- Shows "Coming soon" alert (to be implemented)

### Mark as Sold

- Update ad status to SOLD
- Shows confirmation dialog
- Disabled if already sold

### Delete

- Permanently delete the ad
- Shows confirmation dialog
- Cannot be undone
- Invalidates ad queries after deletion

## Status Types

```typescript
type AdStatus =
  | "DRAFT" // Not published yet
  | "ACTIVE" // Live and visible
  | "SOLD" // Item has been sold
  | "EXPIRED" // Listing expired
  | "SUSPENDED" // Temporarily suspended
  | "DELETED"; // Soft deleted
```

## Status Colors

- **ACTIVE**: Green (success)
- **DRAFT**: Orange (warning)
- **SOLD**: Gray (textGray)
- **EXPIRED**: Red (error)
- **SUSPENDED**: Red (error)
- **DELETED**: Gray (textGray)

## Card Layout

```
┌─────────────────────────────────────────┐
│ [Image]  Title                  [Badge] │
│ [80x80]  Price        Views ●  Saves ♥  │
│          Location • Date         [Menu] │
└─────────────────────────────────────────┘
```

## Example Screens

### My Ads (All)

```tsx
export default function MyAdsScreen() {
  const { data, fetchNextPage, hasNextPage } = useInfiniteMyAds();
  const ads = data?.pages.flatMap((page) => page.data) || [];

  return (
    <FlashList
      data={ads}
      renderItem={({ item }) => <MyProductCardLandscape ad={item} />}
      estimatedItemSize={100}
    />
  );
}
```

### Active Ads Only

```tsx
export default function ActiveAdsScreen() {
  const { data } = useInfiniteMyAds({ status: "ACTIVE" });
  const ads = data?.pages.flatMap((page) => page.data) || [];

  return (
    <FlashList
      data={ads}
      renderItem={({ item }) => (
        <MyProductCardLandscape
          ad={item}
          onPress={() => router.push(`/ads/${item.id}`)}
        />
      )}
      estimatedItemSize={100}
    />
  );
}
```

### Drafts

```tsx
export default function DraftsScreen() {
  const { data } = useInfiniteMyAds({ status: "DRAFT" });
  const ads = data?.pages.flatMap((page) => page.data) || [];

  return (
    <View>
      <AppText variant="lg" style={{ marginBottom: 16 }}>
        My Drafts ({ads.length})
      </AppText>
      <FlashList
        data={ads}
        renderItem={({ item }) => (
          <MyProductCardLandscape
            ad={item}
            onPress={() => router.push(`/ads/${item.id}/edit`)}
          />
        )}
        estimatedItemSize={100}
      />
    </View>
  );
}
```

## Comparison with ProductCardSmallLandscape

| Feature      | MyProductCardLandscape      | ProductCardSmallLandscape |
| ------------ | --------------------------- | ------------------------- |
| User         | Ad owner                    | Any user                  |
| Actions      | Edit, Delete, Promote, etc. | Save/Unsave only          |
| Status Badge | ✅ Yes                      | ❌ No                     |
| Stats        | ✅ Views + Saves            | ❌ None                   |
| Menu         | ✅ Popup with 6 actions     | ❌ Just favorite button   |
| Location     | ✅ Yes                      | ❌ No                     |
| Date         | ✅ Creation date            | ❌ No                     |

## Integration with useInfiniteMyAds

The component works seamlessly with `useInfiniteMyAds` hook:

```tsx
const {
  data, // Pages of ads
  fetchNextPage, // Load more
  hasNextPage, // More available?
  isLoading, // Initial load
  isFetchingNextPage, // Loading more
} = useInfiniteMyAds({
  limit: 20, // Items per page
  status: "ACTIVE", // Optional filter
});
```

## Deletion Behavior

When an ad is deleted:

1. Shows confirmation dialog
2. Calls `deleteAdMutation.mutateAsync(ad.id)`
3. Invalidates queries: `["my-ads"]`, `["my-ads-infinite"]`
4. Removes card from list automatically
5. Calls `onDelete(adId)` callback if provided

## Error Handling

```tsx
<MyProductCardLandscape
  ad={ad}
  onDelete={(adId) => {
    // Success - ad is already removed from list
    console.log("Deleted:", adId);
  }}
/>
```

If deletion fails:

- Shows error alert: "Failed to delete ad. Please try again."
- Logs error to console
- Ad remains in list

## Loading State

Shows spinner while fetching ad by ID:

```tsx
<MyProductCardLandscape adId="123" />
// Shows ActivityIndicator while loading
```

## Styling

```tsx
<MyProductCardLandscape
  ad={ad}
  style={{
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  }}
/>
```

## Related Components

- `ProductCardSmallLandscape` - For viewing other users' ads
- `PopupMenu` - Reusable menu component
- `FavouriteButton` - Save/unsave functionality

## Related Hooks

- `useInfiniteMyAds` - Fetch user's ads with pagination
- `useDeleteAd` - Delete ad mutation
- `useAd` - Fetch single ad by ID
