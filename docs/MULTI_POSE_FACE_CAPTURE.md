# Multi-Pose Face Capture Enhancement

## Overview

Enhanced `FaceAutoCapture` component to automatically guide users through capturing **all three face poses** (front, left, right) in a single session with visual progress tracking.

## New Features

### 1. Sequential Multi-Pose Capture

Users are guided through capturing:

1. **Front** - Looking straight at camera (CENTER)
2. **Left** - Head turned to the left
3. **Right** - Head turned to the right

### 2. Visual Progress Indicator

- **Step-by-step tracker** at the top of the screen
- Shows current step with numbered circles
- Completed steps show green checkmarks
- Progress bar connects the steps
- Labels: "Front", "Left", "Right"

### 3. Automatic Flow

```
START
  ↓
Capture Front Face → Verify ✓
  ↓
Capture Left Face → Verify ✓
  ↓
Capture Right Face → Verify ✓
  ↓
COMPLETE (All 3 photos returned)
```

### 4. Enhanced Feedback

- **Instructions update** for each pose
- **Success transition** between poses (1 second)
- **Progress animation** shows completion percentage
- **Final success message** before callback

## API Changes

### Before

```tsx
<FaceAutoCapture
  pose="CENTER" // Single pose
  onCaptured={(uri: string) => {}} // Single photo URI
/>
```

### After

```tsx
<FaceAutoCapture
  onCaptured={(photos: CapturedPhoto[]) => {}} // Array of photos
  requireAllPoses={true} // NEW: Enable multi-pose
  allowCameraSwitch={true} // Optional: Camera switching
  countdownSeconds={3} // Android countdown
/>
```

### New Types

```typescript
interface CapturedPhoto {
  pose: "CENTER" | "LEFT" | "RIGHT";
  uri: string;
}
```

## User Experience Flow

### 1. Step 1: Front Face

```
┌─────────────────────────────────┐
│  ①Front  →  2Left  →  3Right    │  ← Progress indicator
└─────────────────────────────────┘

     "Look straight at the camera"

         ╭─────────╮
         │  Face   │  ← Face oval (blue)
         │  Guide  │
         ╰─────────╯

     "Face detected! ✓"  ← Green text

       [Capture Photo]
```

### 2. Verifying

```
     "Verifying your face..."

         ⟳  ← Spinner

     (Processing...)
```

### 3. Success → Next Pose

```
     "✓ Face verified successfully!"

     (1 second pause)

     → Automatically moves to next pose
```

### 4. Step 2: Left Face

```
┌─────────────────────────────────┐
│  ✓Front  →  ②Left  →  3Right    │  ← Updated progress
└─────────────────────────────────┘

   "Turn your head to the left"

   (Repeat capture process...)
```

### 5. Step 3: Right Face

```
┌─────────────────────────────────┐
│  ✓Front  →  ✓Left  →  ③Right    │  ← Final step
└─────────────────────────────────┘

   "Turn your head to the right"

   (Repeat capture process...)
```

### 6. All Complete

```
┌─────────────────────────────────┐
│  ✓Front  →  ✓Left  →  ✓Right    │  ← All green
└─────────────────────────────────┘

   "✓ Face verified successfully!"

   → onCaptured([photo1, photo2, photo3])
```

## Component Props

### `onCaptured` (required)

```typescript
onCaptured: (photos: CapturedPhoto[]) => void
```

Called when all poses are captured and verified.

**Example**:

```tsx
onCaptured={(photos) => {
  console.log("Captured:", photos.length); // 3
  photos.forEach(({ pose, uri }) => {
    console.log(`${pose}: ${uri}`);
  });
}}
```

### `requireAllPoses` (optional, default: `true`)

```typescript
requireAllPoses?: boolean
```

- `true` - Capture all 3 poses (front, left, right)
- `false` - Capture only 1 pose (front)

### `allowCameraSwitch` (optional, default: `true`)

```typescript
allowCameraSwitch?: boolean
```

Enable/disable front/back camera switching button.

### `countdownSeconds` (optional, default: `3`)

```typescript
countdownSeconds?: number
```

Android auto-capture countdown duration.

## Visual Elements

### Progress Indicator

```
┌─────────────────────────────────────────┐
│  [✓] Front ═══ [②] Left ─── [3] Right  │
│   Green      Green   Grey      Grey     │
└─────────────────────────────────────────┘
```

**States**:

- **Completed**: Green circle with checkmark
- **Current**: Blue circle with number
- **Pending**: Grey circle with number

### Face Oval Colors

- **Blue** (primary) - Positioning face
- **Green** - Face detected & correct pose
- **Red** - Error state

### Status Messages

- Positioning: "Look straight at the camera"
- Detected: "Face detected! ✓" (green)
- Countdown: "Stay still..." (3, 2, 1)
- Processing: "Verifying your face..." (spinner)
- Success: "✓ Face verified successfully!" (green)
- Error: Specific error message (red)

## Error Handling

### Per-Pose Errors

Each pose has independent error handling:

- **No face detected** → "No face detected. Please try again."
- **Wrong pose** → "Please look straight at the camera"
- **Capture failed** → "Failed to capture photo. Please try again."

All errors auto-reset to positioning after 2 seconds.

### Retry Flow

```
Capture → Error
  ↓
Wait 2s
  ↓
Back to position (same pose)
  ↓
User tries again
```

## State Management

### Multi-Pose State

```typescript
const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);
const posesSequence: Pose[] = ["CENTER", "LEFT", "RIGHT"];
const currentPose = posesSequence[currentPoseIndex];
```

### Progression Logic

```typescript
// After successful capture
const newPhoto = { pose: currentPose, uri: photoUri };
const updatedPhotos = [...capturedPhotos, newPhoto];

if (currentPoseIndex < posesSequence.length - 1) {
  // Move to next pose
  setCurrentPoseIndex((prev) => prev + 1);
} else {
  // All done - return all photos
  onCaptured(updatedPhotos);
}
```

## Platform Differences

### iOS

- Manual capture button for each pose
- Post-capture verification using Apple Vision
- Immediate feedback with inline errors

### Android

- Automatic detection for each pose
- Real-time frame processing
- Auto-captures when correct pose detected

## Testing Checklist

- [ ] Front face capture & verification
- [ ] Left face capture & verification
- [ ] Right face capture & verification
- [ ] Progress indicator updates correctly
- [ ] All checkmarks appear after completion
- [ ] Smooth transitions between poses
- [ ] Error handling per pose
- [ ] Retry functionality
- [ ] Camera switching (if enabled)
- [ ] Final callback with all 3 photos
- [ ] Single pose mode (`requireAllPoses={false}`)

## Usage Examples

### Full KYC Verification (3 poses)

```tsx
<FaceAutoCapture
  onCaptured={(photos) => {
    // Upload all 3 photos for KYC verification
    uploadKYCPhotos({
      front: photos[0].uri,
      left: photos[1].uri,
      right: photos[2].uri,
    });
  }}
  requireAllPoses={true}
/>
```

### Simple Face Verification (1 pose)

```tsx
<FaceAutoCapture
  onCaptured={(photos) => {
    // Just verify user's face
    verifyUser(photos[0].uri);
  }}
  requireAllPoses={false}
/>
```

### Custom Settings

```tsx
<FaceAutoCapture
  onCaptured={handlePhotos}
  requireAllPoses={true}
  allowCameraSwitch={false} // Lock to front camera
  countdownSeconds={5} // Longer countdown
/>
```

## Benefits

### For Users

✅ Clear guidance through each step
✅ Visual progress tracking
✅ No confusion about what to do next
✅ Automatic transitions
✅ Immediate error feedback

### For Business

✅ Complete face verification data
✅ Multiple angles for better security
✅ Reduced fraud risk
✅ Better identity verification
✅ Professional KYC process

### For Developers

✅ Single component handles entire flow
✅ Simple callback with all photos
✅ Automatic state management
✅ Built-in error handling
✅ Platform-optimized

## Migration Guide

### Old Code

```tsx
// Separate captures for each pose
<FaceAutoCapture pose="CENTER" onCaptured={handleFront} />
<FaceAutoCapture pose="LEFT" onCaptured={handleLeft} />
<FaceAutoCapture pose="RIGHT" onCaptured={handleRight} />
```

### New Code

```tsx
// Single component, all poses
<FaceAutoCapture
  onCaptured={(photos) => {
    const [front, left, right] = photos;
    handleAllPhotos(front, left, right);
  }}
/>
```

## Technical Details

### New State Variables

- `currentPoseIndex` - Which pose we're on (0, 1, or 2)
- `capturedPhotos` - Array of successfully captured photos
- `posesSequence` - Order of poses to capture
- `progressAnim` - Animation for progress bar

### New Styles

- `progressContainer` - Top progress indicator wrapper
- `progressSteps` - Horizontal step layout
- `progressStepWrapper` - Individual step container
- `progressStep` - Circle with number/checkmark
- `progressLabel` - "Front", "Left", "Right" text
- `progressLine` - Connecting line between steps

## Files Modified

1. **components/kyc/FaceAutoCapture.tsx**

   - Added multi-pose capture logic
   - Added progress indicator UI
   - Updated state management
   - Changed callback signature

2. **app/account/business.tsx**
   - Updated to handle array of photos
   - Removed single `pose` prop
   - Added `requireAllPoses` prop

## Next Steps

1. Test on physical device with all 3 poses
2. Verify progress indicator animations
3. Test error handling for each pose
4. Confirm photo quality for all angles
5. Integrate with backend KYC upload
6. Add haptic feedback between steps
7. Consider adding photo preview after capture
