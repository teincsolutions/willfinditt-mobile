# Face Verification Modal - Preview Before Upload Update

## Changes Made

Updated `FaceVerificationModal.tsx` to show a preview of captured photos before uploading, giving users the option to review and retake if needed.

## New User Flow

### Before (Old Flow):

1. User captures face photos
2. Photos are immediately uploaded
3. No chance to review or retake

### After (New Flow):

1. User captures face photos
2. **Preview screen shows all captured photos**
3. User can choose:
   - **Retake** - Goes back to camera to capture new photos
   - **Upload** - Proceeds with upload
4. Upload happens only after user confirms

## UI Components Added

### Preview Screen

- **Photos Grid**: Shows all captured photos in a responsive grid
- **Pose Labels**: Each photo labeled (Front, Left, Right)
- **Action Buttons**:
  - **Retake Button**:
    - Icon: Camera outline
    - Color: Background gray
    - Action: Clear photos and return to camera
  - **Upload Button**:
    - Icon: Checkmark circle
    - Color: Primary color
    - Action: Start upload process

### Visual Layout

```
┌─────────────────────────────┐
│      Face Verification       │
│  [Review your photos...]     │
├─────────────────────────────┤
│                              │
│  ┌──────┐      ┌──────┐     │
│  │Front │      │Left  │     │
│  │Photo │      │Photo │     │
│  └──────┘      └──────┘     │
│                              │
│         ┌──────┐             │
│         │Right │             │
│         │Photo │             │
│         └──────┘             │
│                              │
├─────────────────────────────┤
│  [Retake]    [Upload]        │
└─────────────────────────────┘
```

## State Management

### New State Variables

```typescript
const [showPreview, setShowPreview] = useState(false);
```

### State Flow

1. **Capture Complete**: `showPreview = true`
2. **Retake Clicked**: `showPreview = false`, clear photos
3. **Upload Success**: `showPreview = false`, close modal
4. **Upload Error**: Stay on preview (`showPreview = true`)

## Code Changes

### 1. Modified `handleFacesCaptured`

```typescript
// Before: Immediately uploaded
const handleFacesCaptured = async (photos: CapturedPhoto[]) => {
  setCapturedPhotos(photos);
  setIsUploading(true);
  // ... upload logic
};

// After: Show preview first
const handleFacesCaptured = (photos: CapturedPhoto[]) => {
  setCapturedPhotos(photos);
  setShowPreview(true);
};
```

### 2. New `handleUpload` Function

```typescript
const handleUpload = async () => {
  setIsUploading(true);
  // ... upload logic moved here
};
```

### 3. New `handleRetake` Function

```typescript
const handleRetake = () => {
  setCapturedPhotos([]);
  setShowPreview(false);
};
```

### 4. Conditional Rendering

```typescript
{!showPreview ? (
  <FaceAutoCapture ... />
) : (
  <PreviewScreen ... />
)}
```

## Styles Added

### Preview Container

- Full flex container with space-between layout

### Photos Grid

- Responsive flexbox grid with wrap
- 16px padding and gap
- Center aligned content

### Photo Card

- 45% width (2 columns on most screens)
- 3:4 aspect ratio (portrait orientation)
- Rounded corners (12px)
- Shadow for depth
- Relative positioning for labels

### Preview Image

- 100% width and height (fills card)

### Pose Label

- Positioned at bottom of photo
- Primary color background
- 8px from edges
- Centered text with white color

### Action Buttons

- Flex: 1 (equal width)
- Min height: 60px
- Centered content (icon + text)
- Responsive padding from theme

## Benefits

✅ **User Control**: Users can review photos before upload  
✅ **Quality Check**: Catch bad photos before uploading  
✅ **Better UX**: Reduce frustration from accidental bad captures  
✅ **Bandwidth Savings**: Don't upload photos user wants to retake  
✅ **Clear Feedback**: Visual confirmation of what will be uploaded  
✅ **Flexible Flow**: Easy to retake without losing all progress

## Error Handling

### Upload Failure

- Shows alert with Retry/Cancel options
- **Retry**: Stays on preview, user can try upload again
- **Cancel**: Returns to camera or closes modal

### Discard Confirmation

- If user tries to close with photos captured
- Alert asks for confirmation before discarding
- Prevents accidental loss of work

## Instructions Text Updates

### Camera View

- Shows original capture instructions

### Preview View

- "Review your photos. You can retake them or proceed to upload."

## Testing Checklist

- [ ] Capture photos and verify preview shows all poses
- [ ] Verify pose labels are correct (Front, Left, Right)
- [ ] Test Retake button returns to camera
- [ ] Test Upload button triggers upload
- [ ] Verify progress overlay during upload
- [ ] Test upload success flow
- [ ] Test upload error with Retry option
- [ ] Test close confirmation with photos captured
- [ ] Verify responsive layout on different screen sizes
- [ ] Test with single pose mode (requireAllPoses=false)
- [ ] Verify photos maintain aspect ratio in preview

## Compatibility

- Works with both `requireAllPoses={true}` and `requireAllPoses={false}`
- Supports 1 to 3 photos in preview grid
- Responsive layout adapts to screen size
- Maintains all existing props and callbacks
