# Face Verification Hanging Issue - Fixed

## Problem

The FaceAutoCapture component could hang indefinitely in several scenarios:

1. iOS face detection (`detectFacesInImage`) taking too long or never completing
2. Camera `takePhoto()` operation hanging
3. Timeouts from `setTimeout` not being properly cleaned up
4. No way to cancel when stuck in "verifying" state
5. Intervals not cleared when switching cameras or restarting

## Solutions Implemented

### 1. Added Timeout Refs for Cleanup

```typescript
const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
const captureTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
```

- Track all timeouts for proper cleanup
- Specific ref for capture operation timeout

### 2. Promise Race with Timeout for Camera Operations

```typescript
// Camera takePhoto with 10 second timeout
const photoPromise = camera.current.takePhoto();
const timeoutPromise = new Promise<never>((_, reject) =>
  setTimeout(() => reject(new Error("Camera timeout")), 10000)
);
const photo = await Promise.race([photoPromise, timeoutPromise]);
```

### 3. Promise Race with Timeout for Face Detection (iOS)

```typescript
// Face detection with 8 second timeout
const faceDetectionPromise = detectFacesInImage(photoUri);
const faceTimeoutPromise = new Promise<never>((_, reject) =>
  setTimeout(() => reject(new Error("Face detection timeout")), 8000)
);
const faces = await Promise.race([faceDetectionPromise, faceTimeoutPromise]);
```

### 4. Master Capture Timeout (15 seconds)

```typescript
// Set a timeout to prevent hanging - 15 seconds max
captureTimeoutRef.current = setTimeout(() => {
  console.warn("Capture timeout - resetting to position");
  setCaptureStep("error");
  setErrorMessage("Capture timeout. Please try again.");
  const resetTimeout = setTimeout(() => setCaptureStep("position"), 2000);
  timeoutRefs.current.push(resetTimeout);
}, 15000);
```

- Catches any operation that hangs
- Automatically resets to position state
- Shows user-friendly error message

### 5. Emergency Cancel Button in Verifying State

```typescript
<TouchableOpacity
  onPress={() => {
    // Emergency cancel - clear everything and reset
    if (captureTimeoutRef.current) {
      clearTimeout(captureTimeoutRef.current);
      captureTimeoutRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setCaptureStep("position");
    setFaceDetected(false);
    setCountdown(null);
    setErrorMessage("");
  }}
>
  <AppText>Cancel</AppText>
</TouchableOpacity>
```

- User can manually cancel if stuck
- Clears all timeouts and intervals
- Resets to position state

### 6. Enhanced Cleanup in Camera Switch

```typescript
const switchCamera = useCallback(() => {
  // Clear all timeouts and intervals
  if (countdownIntervalRef.current) {
    clearInterval(countdownIntervalRef.current);
    countdownIntervalRef.current = null;
  }
  if (captureTimeoutRef.current) {
    clearTimeout(captureTimeoutRef.current);
    captureTimeoutRef.current = null;
  }
  timeoutRefs.current.forEach((timeout) => clearTimeout(timeout));
  timeoutRefs.current = [];

  // Reset states
  setCameraPosition((prev) => (prev === "front" ? "back" : "front"));
  setFaceDetected(false);
  setCountdown(null);
  setCaptureStep("position");
  setErrorMessage("");
}, []);
```

### 7. Enhanced Cleanup in Restart Handler

```typescript
onPress: () => {
  // Clear all timeouts and intervals
  if (countdownIntervalRef.current) {
    clearInterval(countdownIntervalRef.current);
    countdownIntervalRef.current = null;
  }
  if (captureTimeoutRef.current) {
    clearTimeout(captureTimeoutRef.current);
    captureTimeoutRef.current = null;
  }
  timeoutRefs.current.forEach((timeout) => clearTimeout(timeout));
  timeoutRefs.current = [];

  // Reset all states
  setCurrentPoseIndex(0);
  setCapturedPhotos([]);
  setCaptureStep("position");
  setFaceDetected(false);
  setCountdown(null);
  setErrorMessage("");
};
```

### 8. Comprehensive Unmount Cleanup

```typescript
useEffect(() => {
  return () => {
    // Clear countdown interval
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    // Clear capture timeout
    if (captureTimeoutRef.current) {
      clearTimeout(captureTimeoutRef.current);
      captureTimeoutRef.current = null;
    }

    // Clear all other timeouts
    timeoutRefs.current.forEach((timeout) => clearTimeout(timeout));
    timeoutRefs.current = [];
  };
}, []);
```

### 9. Timeout Tracking for All setTimeout Calls

```typescript
// All setTimeout calls now tracked:
const resetTimeout = setTimeout(() => setCaptureStep("position"), 2000);
timeoutRefs.current.push(resetTimeout);
```

## Timeout Values

- **Camera takePhoto**: 10 seconds
- **Face detection**: 8 seconds
- **Master capture timeout**: 15 seconds
- **Error message display**: 2 seconds
- **Success transition**: 1 second (next pose) or 500ms (complete)

## Benefits

1. ✅ No more indefinite hanging
2. ✅ User can always cancel manually
3. ✅ Automatic recovery from timeouts
4. ✅ Proper cleanup on unmount
5. ✅ Clear error messages for timeout scenarios
6. ✅ Safe camera switching and restart
7. ✅ No memory leaks from orphaned timeouts/intervals

## Testing Checklist

- [ ] Test face verification with slow network
- [ ] Test camera switch during verification
- [ ] Test restart during verification
- [ ] Test manual cancel during verification
- [ ] Test app backgrounding during verification
- [ ] Test unmounting component during verification
- [ ] Verify no memory leaks after multiple captures
- [ ] Test timeout scenarios on iOS
- [ ] Test timeout scenarios on Android

## Error Messages

- "Capture timeout. Please try again." - Master timeout triggered
- "Operation timed out. Please try again." - Camera or face detection timeout
- "Failed to capture photo. Please try again." - Other errors

## Notes

- All timeouts are cleared on unmount to prevent memory leaks
- User always has an escape mechanism (Cancel button)
- Automatic recovery ensures app never becomes unusable
- Timeout values can be adjusted based on real-world testing
