# Swipeable Tabs and Stats Section Components

## Overview

Created two reusable UI components for the business profile and other screens that need tabbed interfaces or statistics displays.

## Components Created

### 1. SwipeableTabs Component (`/components/ui/SwipeableTabs.tsx`)

A generic, swipeable tabs component with horizontal scrolling support.

#### Features

- **Swipeable Content**: Users can swipe left/right to switch between tabs
- **Tab Headers**: Clickable tab headers with active state indicators
- **Count Badges**: Optional count display in tab titles
- **Fully Generic**: TypeScript generic support for any data type
- **FlatList Integration**: Built-in support for all FlatList features
  - Pull-to-refresh
  - Infinite scroll
  - Loading states
  - Empty states
  - Custom renderers

#### Props

```typescript
interface SwipeableTabsProps<T> {
  tabs: TabItem[]; // Array of tab definitions
  activeTab: string; // Currently active tab key
  onTabChange: (tabKey: string) => void; // Callback when tab changes
  data: T[]; // Data to display
  renderItem: (info) => ReactElement; // Item renderer
  keyExtractor: (item, index) => string; // Key extractor
  ListEmptyComponent?: ReactElement; // Empty state component
  ListFooterComponent?: ReactElement; // Footer component
  onEndReached?: () => void; // Pagination callback
  onEndReachedThreshold?: number; // Pagination threshold
  refreshControl?: any; // Refresh control
  ListHeaderComponent?: ReactElement; // Header component
  contentContainerStyle?: any; // Content container styles
}

interface TabItem {
  key: string; // Unique tab identifier
  title: string; // Tab display title
  count?: number; // Optional count badge
}
```

#### Usage Example

```typescript
import SwipeableTabs, { TabItem } from "@/components/ui/SwipeableTabs";
import { Ad } from "@/types/ad";

const tabs: TabItem[] = [
  { key: "active", title: "Active", count: 10 },
  { key: "sold", title: "Sold", count: 5 },
  { key: "draft", title: "Draft", count: 2 },
];

<SwipeableTabs
  tabs={tabs}
  activeTab={activeTab}
  onTabChange={(key) => setActiveTab(key)}
  data={filteredData}
  keyExtractor={(item: Ad) => item.id}
  renderItem={({ item }: { item: Ad }) => <MyCard item={item} />}
  ListEmptyComponent={<EmptyState />}
  onEndReached={loadMore}
  refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  }
/>;
```

#### Technical Details

- Uses `FlatList` with horizontal pagination for smooth swiping
- Uses `Animated` API for smooth scroll tracking
- Uses `ViewabilityConfig` to detect which tab is currently visible
- Automatically syncs tab header selection with swipe gestures
- Each tab gets its own vertical `FlatList` for content

---

### 2. StatsSection Component (`/components/ui/StatsSection.tsx`)

A reusable statistics display component with customizable columns and styling.

#### Features

- **Flexible Layout**: Support for 2, 3, or 4 columns
- **Custom Colors**: Each stat can have its own color
- **Loading State**: Built-in loading indicator
- **Responsive**: Automatically wraps stats based on column count
- **Theme-aware**: Uses theme colors and spacing

#### Props

```typescript
interface StatsSectionProps {
  title?: string; // Section title (default: "Statistics")
  stats: StatItem[]; // Array of statistics to display
  isLoading?: boolean; // Loading state
  columns?: 2 | 3 | 4; // Number of columns (default: 2)
}

interface StatItem {
  label: string; // Stat label/description
  value: number | string; // Stat value
  color?: string; // Optional custom color for value
}
```

#### Usage Example

```typescript
import StatsSection, { StatItem } from "@/components/ui/StatsSection";

const statsData: StatItem[] = [
  {
    label: "Total Ads",
    value: 150,
    color: colors.primary,
  },
  {
    label: "Active Ads",
    value: 42,
    color: colors.success,
  },
  {
    label: "Total Views",
    value: "1.2K",
    color: colors.text,
  },
  {
    label: "Messages",
    value: 89,
    color: colors.text,
  },
];

<StatsSection
  title="My Statistics"
  stats={statsData}
  isLoading={isLoading}
  columns={2}
/>;
```

#### Styling

- Large, bold numbers (24px, weight 700)
- Small, gray labels (12px)
- Centered alignment
- Flexible grid with automatic wrapping
- Consistent spacing (16px gap)

---

## Updated Business Profile Screen

### Changes Made

1. **Replaced Manual Tabs with SwipeableTabs**

   - Removed manual tab buttons and `FlatList`
   - Integrated `SwipeableTabs` component
   - Added swipe gesture support

2. **Replaced Manual Stats with StatsSection**

   - Removed all manual stat rendering code
   - Uses `StatsSection` component
   - Cleaner, more maintainable code

3. **Added Top Header**

   - Back button for navigation
   - Settings button for business settings
   - Title display

4. **Better Data Management**
   - Filters ads locally based on active tab
   - Prepares stats data in proper format
   - Clean separation of concerns

### Code Reduction

- **Before**: ~600+ lines
- **After**: ~300 lines
- **Reduction**: ~50% less code in the business profile screen

### Benefits

1. **Reusability**: Both components can be used across the app
2. **Maintainability**: Centralized tab and stats logic
3. **Consistency**: Uniform behavior across different screens
4. **Type Safety**: Full TypeScript support
5. **Better UX**: Native swipe gestures feel more natural
6. **Performance**: Optimized rendering with proper React patterns

---

## Future Usage Ideas

### SwipeableTabs

- Orders screen (Pending/Completed/Cancelled tabs)
- Messages screen (All/Unread/Archived tabs)
- Notifications screen (All/Mentions/Updates tabs)
- Search results (Products/Services/Users tabs)
- Saved items (Products/Sellers/Searches tabs)

### StatsSection

- User profile statistics
- Seller dashboard
- Order history summary
- Campaign performance
- App analytics
- Monthly reports

---

## Files Modified

1. **Created**: `/components/ui/SwipeableTabs.tsx`
2. **Created**: `/components/ui/StatsSection.tsx`
3. **Updated**: `/app/account/business.tsx`
4. **Created**: `/docs/SWIPEABLE_TABS_STATS_COMPONENTS.md`

---

## Testing Checklist

### SwipeableTabs

- [ ] Swipe left/right to change tabs
- [ ] Tap tab headers to switch tabs
- [ ] Tab indicator follows active tab
- [ ] Count badges display correctly
- [ ] Pull-to-refresh works on each tab
- [ ] Infinite scroll works on each tab
- [ ] Empty states display correctly
- [ ] Loading states work properly

### StatsSection

- [ ] Stats display in correct columns
- [ ] Custom colors apply correctly
- [ ] Loading state shows spinner
- [ ] Works with 2, 3, and 4 columns
- [ ] Title displays correctly
- [ ] Numbers format properly
- [ ] Responsive on different screen sizes

### Business Profile

- [ ] Profile loads correctly
- [ ] Tabs swipe smoothly
- [ ] Statistics display correctly
- [ ] Ads filter by status
- [ ] Pull-to-refresh works
- [ ] Settings button navigates correctly
- [ ] Back button works
- [ ] All product card actions work
