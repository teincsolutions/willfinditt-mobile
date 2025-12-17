# Ad Create/Edit Implementation

## Overview

This implementation provides a complete ad creation and editing system with dynamic category fields, image uploads, and comprehensive form validation.

## Files Created

### 1. `/components/ads/AdForm.tsx`

A reusable form component that handles both creating and editing ads.

**Features:**

- Dynamic category field rendering based on selected category
- Support for multiple field types:
  - TEXT
  - NUMBER
  - TEXTAREA
  - SELECT/RADIO (single choice)
  - CHECKBOX (multiple choice)
  - BOOLEAN (toggle switch)
- Image upload with progress tracking (max 5 images)
- Real-time validation
- Price and currency input
- Condition selection
- Contact information fields
- Category and subcategory selection
- Negotiable price toggle

**Props:**

```typescript
interface AdFormProps {
  initialData?: Partial<AdFormData>;
  onSubmit: (data: AdFormData) => void;
  isLoading?: boolean;
  submitButtonText?: string;
}
```

### 2. `/app/ads/create.tsx`

Screen for creating new ads.

**Features:**

- Uses `useCreateAd` hook for API mutation
- Toast notifications for success/error
- Redirects to ad details page after successful creation
- Loading state during submission

### 3. `/app/ads/[adId]/edit.tsx`

Screen for editing existing ads.

**Features:**

- Fetches existing ad data using `useAd` hook
- Pre-fills form with current ad data
- Uses `useUpdateAd` hook for API mutation
- Loading state while fetching ad data
- Error handling with redirect on failure
- Toast notifications for success/error

### 4. Updated `/app/ads/[adId]/index.tsx`

Enhanced ad details page with edit functionality.

**Changes:**

- Added edit button in header (only visible to ad owner)
- Uses `useAuth` to determine current user
- Checks if current user owns the ad
- Navigation to edit page with edit icon button

## Hooks Used

### From `useAds.ts`

- `useCreateAd()` - Create new ad mutation
- `useUpdateAd()` - Update existing ad mutation
- `useAd(id)` - Fetch single ad by ID

### From `useCategoryFields.ts`

- `useCategoryFields(categoryId)` - Fetch dynamic fields for a category

### From `useCategories.ts`

- `useParentCategories()` - Fetch top-level categories
- `useSubcategories(parentId)` - Fetch subcategories

### From `useUpload.ts`

- `useUploadAdImages()` - Upload ad images with progress tracking

### From `useAuth.ts`

- `useAuth()` - Get current authenticated user

## Form Data Structure

```typescript
export interface AdFormData {
  title: string;
  description: string;
  price: string;
  currency: string;
  condition?: AdCondition;
  categoryId: string;
  images: string[];
  address?: string;
  contactPhone?: string;
  contactEmail?: string;
  isNegotiable: boolean;
  fieldValues: {
    categoryFieldId: string;
    value: string;
  }[];
}
```

## Dynamic Category Fields

The form automatically fetches and renders category-specific fields based on the selected category. Each field type is rendered differently:

### Field Types

1. **TEXT** - Single line text input
2. **NUMBER** - Numeric input with decimal pad
3. **TEXTAREA** - Multi-line text input
4. **SELECT/RADIO** - Radio buttons for single selection
5. **CHECKBOX** - Multiple checkboxes for multiple selection (comma-separated values)
6. **BOOLEAN** - Toggle switch for true/false values

### Field Validation

- Required fields are marked with asterisk (\*)
- Form validates required fields before submission
- Price must be greater than 0
- At least one image is required
- Category must be selected

## Image Upload

### Features

- Multiple image selection (max 5)
- Progress tracking during upload
- Preview with remove capability
- Automatic upload on selection
- Support for image formats: JPG, PNG

### Upload Flow

1. User selects images from library
2. Images are uploaded to server via `useUploadAdImages` hook
3. Progress is displayed during upload
4. URLs are stored in form state after successful upload
5. User can remove images before submitting form

## Navigation Flow

### Create Flow

```
Any Screen → Create Ad Page → [Submit] → Ad Details Page
```

### Edit Flow

```
Ad Details → Edit Button (owner only) → Edit Ad Page → [Submit] → Back to Ad Details
```

## Error Handling

### Form Validation Errors

- Display alert for missing required fields
- Check all category-specific required fields
- Validate price is numeric and positive
- Ensure at least one image is uploaded

### API Errors

- Display toast notification on error
- Log error to console
- Form remains in editable state
- User can retry submission

### Loading States

- Edit page shows loading spinner while fetching ad
- Submit button shows loading state during API call
- Image upload shows progress percentage
- Form is disabled during submission

## Usage Examples

### Creating a New Ad

```typescript
// Navigate to create page
router.push("/ads/create");
```

### Editing an Existing Ad

```typescript
// Navigate to edit page (from ad details)
router.push(`/ads/${adId}/edit`);
```

### Checking if User Can Edit

```typescript
const { user } = useAuth();
const isOwner = user?.id === ad?.userId;
```

## API Integration

### Create Ad

- Endpoint: `POST /api/v1/ads/`
- Request: `CreateAdRequest`
- Response: `Ad`

### Update Ad

- Endpoint: `PATCH /api/v1/ads/:id`
- Request: `UpdateAdRequest`
- Response: `Ad`

### Get Category Fields

- Endpoint: `GET /api/v1/category-fields/category/:categoryId`
- Response: `CategoryField[]`

### Upload Images

- Endpoint: `POST /api/v1/uploads/ad-images`
- Request: `FormData` with images
- Response: `{ urls: string[] }`

## Styling

All styling uses the theme system via `useTheme()` hook:

- Colors from theme
- Spacing from theme
- Radius from theme
- Consistent with app design

## Future Enhancements

Possible improvements:

1. Image reordering (drag and drop)
2. Image cropping before upload
3. Location picker with map
4. Draft auto-save
5. Duplicate ad feature
6. Batch edit for multiple ads
7. Image optimization before upload
8. Video upload support
9. Rich text editor for description
10. Template system for common ad types

## Testing Checklist

- [ ] Create ad with all required fields
- [ ] Create ad with optional fields
- [ ] Edit existing ad
- [ ] Upload multiple images
- [ ] Remove uploaded images
- [ ] Select category and subcategory
- [ ] Fill dynamic category fields
- [ ] Test all field types (text, number, select, etc.)
- [ ] Validate required field errors
- [ ] Test price validation
- [ ] Test negotiable toggle
- [ ] Test condition selection
- [ ] Test as ad owner (edit button visible)
- [ ] Test as non-owner (edit button hidden)
- [ ] Test error handling
- [ ] Test loading states
- [ ] Test toast notifications
- [ ] Test navigation after create/edit

## Dependencies

- expo-image-picker - For image selection
- sonner-native - For toast notifications
- @tanstack/react-query - For API state management
- react-native-mmkv - For persistent storage
- @expo/vector-icons - For icons

## Notes

- Form uses controlled components for all inputs
- Images are uploaded immediately after selection
- Category fields are fetched dynamically based on category selection
- Edit mode pre-fills all fields including dynamic category fields
- Only ad owners can see the edit button
- Form data is transformed before API submission to match backend schema
