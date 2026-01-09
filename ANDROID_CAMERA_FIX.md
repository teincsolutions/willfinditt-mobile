# Android Camera "Camera is closed" Fix

## Issues Identified

1. **Camera State Management** - The camera was being set to inactive during verification (`isActive={captureStep !== "verifying"}`), causing it to close when trying to take a photo
2. **Unused Module Code** - The Android native module had boilerplate WebView code that wasn't being used
3. **Missing Delay for Android** - Android needs a small delay to ensure the camera is ready before taking a photo

## Fixes Applied

### 1. FaceAutoCapture.tsx Changes

#### Keep Camera Active During Verification
**File:** `components/kyc/FaceAutoCapture.tsx`

Changed from:
```tsx
<Camera
  ref={camera}
  style={StyleSheet.absoluteFill}
  device={device}
  isActive={captureStep !== "verifying"}  // ❌ This closes the camera
  photo={true}
  frameProcessor={isAutoDetectionEnabled ? frameProcessor : undefined}
/>
```

To:
```tsx
<Camera
  ref={camera}
  style={StyleSheet.absoluteFill}
  device={device}
  isActive={true}  // ✅ Keep camera active at all times
  photo={true}
  frameProcessor={isAutoDetectionEnabled ? frameProcessor : undefined}
/>
```

#### Add Android Camera Preparation Delay
Added a small delay before taking photos on Android to ensure the camera is ready:

```tsx
// Check if camera is ready (Android)
if (Platform.OS === "android") {
  try {
    // Small delay to ensure camera is ready
    await new Promise(resolve => setTimeout(resolve, 100));
  } catch (e) {
    console.warn("Camera preparation delay failed:", e);
  }
}
```

### 2. Native Module Cleanup

#### ExpoVisionFaceDetectorModule.kt
**File:** `modules/expo-vision-face-detector/android/src/main/java/expo/modules/visionfacedetector/ExpoVisionFaceDetectorModule.kt`

Removed unused WebView boilerplate code and simplified to:
```kotlin
class ExpoVisionFaceDetectorModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoVisionFaceDetector")

    Function("hello") {
      "ExpoVisionFaceDetector initialized"
    }

    Function("isAvailable") {
      true
    }
  }
}
```

#### ExpoVisionFaceDetectorView.kt
**File:** `modules/expo-vision-face-detector/android/src/main/java/expo/modules/visionfacedetector/ExpoVisionFaceDetectorView.kt`

Removed unused WebView code:
```kotlin
class ExpoVisionFaceDetectorView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  // Placeholder view - not used in current implementation
  // Android face detection uses react-native-vision-camera-face-detector directly
}
```

## How the System Works

### Android
- Uses `react-native-vision-camera-face-detector` (Google ML Kit) for automatic face detection
- The expo module is just a placeholder since Android uses the third-party library directly
- Frame processor runs in real-time to detect faces
- When the correct pose is detected, countdown starts and photo is captured

### iOS  
- Uses Apple Vision framework through the expo native module
- Real-time detection during capture
- Post-capture verification of face in the image
- Validates pose (yaw angle) after capture

## Testing Steps

1. **Clean Build**
   ```bash
   cd android
   ./gradlew clean
   cd ..
   ```

2. **Rebuild Development Build**
   ```bash
   eas build -p android --profile development
   ```

3. **Test Camera**
   - Open face verification flow
   - Camera should remain active throughout the process
   - "Camera is closed" error should no longer appear
   - Face detection warnings are expected if running in Expo Go (requires dev build)

## Additional Notes

- The warning `[Android] react-native-vision-camera-face-detector not installed` will appear in Expo Go but not in development/production builds
- The package is correctly installed in package.json: `"react-native-vision-camera-face-detector": "^1.10.1"`
- iOS works fine because it uses the native Apple Vision module
- Android camera needs to stay active (`isActive={true}`) even during photo capture verification

## Dependencies Status
✅ `react-native-vision-camera@^4.7.3` - Installed
✅ `react-native-vision-camera-face-detector@^1.10.1` - Installed
✅ expo-vision-face-detector module - Configured for both platforms
