# Ad Form Quick Reference

## Quick Start

### Navigate to Create Ad

```typescript
import { router } from "expo-router";
router.push("/ads/create");
```

### Navigate to Edit Ad

```typescript
router.push(`/ads/${adId}/edit`);
```

## Component Usage

### AdForm Component

```typescript
import AdForm, { AdFormData } from "@/components/ads/AdForm";

<AdForm
  initialData={existingData} // Optional, for edit mode
  onSubmit={handleSubmit}
  isLoading={false}
  submitButtonText="Create Ad" // or "Update Ad"
/>;
```

## Hooks

### Create Ad

```typescript
import { useCreateAd } from "@/hooks/useAds";

const createMutation = useCreateAd();

await createMutation.mutateAsync({
  title: "Product Title",
  description: "Product description",
  price: 99.99,
  currency: "USD",
  categoryId: "category-id",
  images: ["url1", "url2"],
  isNegotiable: true,
  fieldValues: [{ categoryFieldId: "field-id", value: "value" }],
});
```

### Update Ad

```typescript
import { useUpdateAd } from "@/hooks/useAds";

const updateMutation = useUpdateAd();

await updateMutation.mutateAsync({
  id: "ad-id",
  data: {
    title: "Updated Title",
    price: 89.99,
    // ... other fields
  },
});
```

### Get Category Fields

```typescript
import { useCategoryFields } from "@/hooks/useCategoryFields";

const { data: fields, isLoading } = useCategoryFields(categoryId);
```

### Upload Images

```typescript
import { useUploadAdImages } from "@/hooks/useUpload";

const uploadMutation = useUploadAdImages();

const formData = new FormData();
formData.append("images", {
  uri: imageUri,
  name: "image.jpg",
  type: "image/jpeg",
} as any);

const response = await uploadMutation.mutateAsync(formData);
// response.urls = ["url1", "url2", ...]
```

## Field Types Reference

### Category Field Type Enum

```typescript
enum CategoryFieldType {
  TEXT = "TEXT", // Single line text
  NUMBER = "NUMBER", // Numeric input
  SELECT = "SELECT", // Dropdown/Radio buttons
  RADIO = "RADIO", // Radio buttons
  CHECKBOX = "CHECKBOX", // Multiple checkboxes
  TEXTAREA = "TEXTAREA", // Multi-line text
  DATE = "DATE", // Date picker
  BOOLEAN = "BOOLEAN", // Toggle switch
}
```

### Field Rendering

```typescript
// TEXT - renders InputField
<InputField label="Brand" value={value} onChangeText={onChange} />

// NUMBER - renders InputField with numeric keyboard
<InputField keyboardType="numeric" />

// TEXTAREA - renders TextAreaField
<TextAreaField numberOfLines={4} />

// SELECT/RADIO - renders radio buttons
// Single selection

// CHECKBOX - renders checkboxes
// Multiple selection, values stored as comma-separated string

// BOOLEAN - renders toggle switch
// Values: "true" or "false" as strings
```

## Ad Condition Enum

```typescript
enum AdCondition {
  NEW = "NEW",
  LIKE_NEW = "LIKE_NEW",
  USED = "USED",
  GOOD = "GOOD",
  FAIR = "FAIR",
  POOR = "POOR",
}
```

## Validation Rules

### Required Fields

- ✅ Title (non-empty)
- ✅ Description (non-empty)
- ✅ Category ID
- ✅ Price (> 0)
- ✅ At least 1 image
- ✅ All category-specific required fields

### Optional Fields

- Condition
- Currency (defaults to "USD")
- Address
- Contact Phone
- Contact Email
- Additional category fields (if not required)

## Form Data Types

### AdFormData (Component)

```typescript
interface AdFormData {
  title: string;
  description: string;
  price: string; // String in form, converted to number for API
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

### CreateAdRequest (API)

```typescript
interface CreateAdRequest {
  title: string;
  description: string;
  price?: number; // Number for API
  currency?: string;
  condition?: AdCondition;
  categoryId: string;
  cityId?: string;
  images?: string[];
  videos?: string[];
  address?: string;
  latitude?: number;
  longitude?: number;
  contactPhone?: string;
  contactEmail?: string;
  isNegotiable?: boolean;
  fieldValues?: {
    categoryFieldId: string;
    value: string;
  }[];
}
```

## Common Patterns

### Check if User is Ad Owner

```typescript
import { useAuth } from "@/hooks/useAuth";

const { user } = useAuth();
const isOwner = user?.id === ad?.userId;

{
  isOwner && (
    <Button onPress={() => router.push(`/ads/${ad.id}/edit`)}>Edit</Button>
  );
}
```

### Handle Form Submission

```typescript
const handleSubmit = async (formData: AdFormData) => {
  try {
    const adData: CreateAdRequest = {
      ...formData,
      price: parseFloat(formData.price),
    };

    const newAd = await createMutation.mutateAsync(adData);
    toast.success("Ad created!");
    router.replace(`/ads/${newAd.id}`);
  } catch (error: any) {
    toast.error(error?.message || "Failed to create ad");
  }
};
```

### Load Existing Ad for Edit

```typescript
const { data: ad, isLoading } = useAd(adId, !!adId);

const initialData: Partial<AdFormData> = {
  title: ad?.title,
  description: ad?.description,
  price: ad?.price.toString(),
  // ... map other fields
  fieldValues: ad?.fieldValues?.map((fv) => ({
    categoryFieldId: fv.categoryFieldId,
    value: fv.value,
  })),
};
```

## Error Handling

### Display Errors

```typescript
import { toast } from "sonner-native";

try {
  await mutation.mutateAsync(data);
  toast.success("Success!");
} catch (error: any) {
  toast.error(error?.message || "An error occurred");
  console.error(error);
}
```

### Loading States

```typescript
<PrimaryButton
  title="Submit"
  onPress={handleSubmit}
  loading={mutation.isPending}
  disabled={mutation.isPending || uploadMutation.isPending}
/>
```

## Image Upload Progress

```typescript
const uploadMutation = useUploadAdImages();

// Access progress
console.log(uploadMutation.progress.percentage); // 0-100
console.log(uploadMutation.progress.loaded); // bytes loaded
console.log(uploadMutation.progress.total); // total bytes

// Show in UI
{
  uploadMutation.isPending && (
    <Text>Uploading... {uploadMutation.progress.percentage.toFixed(0)}%</Text>
  );
}
```

## Category Selection Flow

1. Fetch parent categories
2. User selects parent → Store `parentCategoryId`
3. Fetch subcategories for parent
4. User selects subcategory → Store `categoryId`
5. Fetch category fields for selected category
6. Render dynamic fields based on field types
7. Collect field values in `fieldValues` array

## Tips & Best Practices

### Performance

- Category fields only load when category is selected
- Use `enabled` flag in queries to prevent unnecessary fetches
- Images upload immediately to show progress

### UX

- Show loading spinners during async operations
- Disable form during submission
- Clear error messages
- Show success/error toasts
- Pre-fill form in edit mode
- Mark required fields with asterisk

### Validation

- Validate on submit, not on change (better UX)
- Show specific error messages
- Scroll to first error if possible
- Prevent submission if validation fails

### State Management

- Use React Query for API state
- Use local state for form fields
- Clear form after successful submission (create mode)
- Keep form data on error (allow retry)
