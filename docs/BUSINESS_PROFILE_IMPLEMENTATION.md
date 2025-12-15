# Business Profile Implementation

## Overview

Implemented a comprehensive business profile screen for sellers to view and manage their seller profile, statistics, and listings.

## Files Created/Modified

### 1. `/hooks/useSeller.ts` (NEW)

Custom React Query hook for managing seller profile operations:

- **Queries:**

  - `getMySellerProfile()` - Fetch current user's seller profile
  - `getSellerProfile(sellerId)` - Fetch any seller profile by ID
  - `getSellerStats(sellerId)` - Fetch seller statistics

- **Mutations:**
  - `createSellerProfile()` - Create new seller profile
  - `updateSellerProfile()` - Update existing seller profile
  - `deleteSellerProfile()` - Delete seller profile

### 2. `/app/account/business.tsx` (UPDATED)

Complete business profile screen with the following sections:

#### Header Section

- Custom header with back button and settings icon
- Responsive to theme colors and spacing

#### Profile Information

- Avatar with verification badge
- Business name and type
- Seller rating with stars
- Verification status badge
- Action buttons (Edit Profile, Share)
- Business description
- Location (city)
- Website link (if available)

#### Statistics Section

- Total Ads count
- Active Ads count
- Total Views count
- Total Messages count
- Color-coded stats for better UX

#### Tabs Section

Filterable listings with three tabs:

- **Active Tab** - Shows active listings
- **Sold Tab** - Shows sold items
- **Draft Tab** - Shows draft listings

#### Listings Display

- Uses `MyProductCardLandscape` component
- Infinite scroll with pagination
- Pull-to-refresh functionality
- Empty state messages for each tab
- Loading indicators

#### Empty States

- **No Seller Profile**: Prompts user to create business profile
- **No Listings**: Custom messages based on active tab

## Features

### 1. Seller Profile Display

- Complete business information
- Visual verification badge for verified sellers
- Professional rating display
- Social proof (reviews count)

### 2. Statistics Dashboard

- Real-time seller metrics
- Color-coded statistics
- Easy-to-scan grid layout

### 3. Listing Management

- Tab-based filtering (Active/Sold/Draft)
- Each tab shows accurate count
- Uses existing `MyProductCardLandscape` component
- Supports all product card actions (edit, promote, delete, etc.)

### 4. Interactive Actions

- Edit Profile - Navigate to edit/create seller profile
- Share - Share business profile (placeholder)
- Settings - Navigate to business settings
- Tap on listing - View listing details

### 5. Data Handling

- Efficient infinite scroll with React Query
- Pull-to-refresh on entire screen
- Optimistic updates on mutations
- Proper loading and error states

## UI/UX Highlights

- **Theme-aware**: Uses theme colors, spacing, and radius
- **Responsive**: Adapts to different screen sizes
- **Accessible**: Clear labels and proper contrast
- **Performant**: Efficient data fetching and rendering
- **Intuitive**: Clear navigation and action buttons

## Dependencies Used

- **@tanstack/react-query** - Data fetching and caching
- **expo-router** - Navigation
- **expo-image** - Image rendering (via Avatar component)
- **@expo/vector-icons** - Icons (Ionicons)
- **sonner-native** - Toast notifications

## Integration Points

### Services

- `sellerService` - API calls for seller operations
- `adService` - API calls for ads (via useInfiniteAds hook)

### Hooks

- `useAuth()` - Get current user
- `useSeller()` - Seller profile operations
- `useInfiniteAds()` - Fetch user's ads with pagination
- `useTheme()` - Access theme values

### Components

- `Avatar` - User avatar with verification badge
- `SellerRating` - Star rating display
- `MyProductCardLandscape` - Listing card
- `PrimaryButton` - Call-to-action button
- `AppText` - Themed text component
- `AppView` - Themed view wrapper

## Future Enhancements

1. **Add Status Filter to API**: Currently filtering locally, should add status param to API
2. **Implement Share**: Add native share functionality
3. **Business Settings**: Create settings screen
4. **Edit Seller Profile**: Create edit/create profile screens
5. **Social Media Links**: Display and link to social media accounts
6. **Reviews Section**: Add expandable reviews section
7. **Analytics Page**: Detailed analytics for sellers
8. **Quick Actions**: Add floating action button for quick listing creation

## Testing Checklist

- [ ] Profile loads correctly for users with seller profile
- [ ] Empty state shows for users without seller profile
- [ ] Statistics display correct values
- [ ] Tab switching filters listings correctly
- [ ] Infinite scroll works on all tabs
- [ ] Pull-to-refresh updates data
- [ ] Edit profile navigation works
- [ ] Listing cards display correctly
- [ ] All product card actions work (edit, delete, promote, etc.)
- [ ] Loading states display properly
- [ ] Error states handled gracefully
- [ ] Theme switching works correctly
- [ ] Back navigation works

## Notes

- The component gracefully handles missing seller profiles
- All mutations automatically update the cache
- Statistics query has shorter stale time (2 mins) for freshness
- The design follows the existing app's design patterns
- Uses consistent spacing and styling with the rest of the app
