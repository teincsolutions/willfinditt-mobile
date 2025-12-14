// Android-specific face detector (with Google ML Kit)
// This file is loaded on Android via Metro's platform extensions (.android.ts)
// NOTE: react-native-vision-camera-face-detector must be installed separately for Android builds

import type { Frame } from "react-native-vision-camera";
import type {
  Face,
  FaceDetectorOptions,
  FaceDetectorPlugin,
} from "./platformFaceDetector";

export type { Face, FaceDetectorOptions, FaceDetectorPlugin };

/**
 * Android: Check if face detection library is available
 */
export const isFaceDetectionAvailable = (): boolean => {
  try {
    require.resolve("react-native-vision-camera-face-detector");
    return true;
  } catch {
    console.warn(
      "[Android] react-native-vision-camera-face-detector not installed"
    );
    return false;
  }
};

/**
 * Android: Automatic or manual based on library availability
 */
export const getFaceDetectionMode = (): "automatic" | "manual" => {
  return isFaceDetectionAvailable() ? "automatic" : "manual";
};

/**
 * Android: Uses Google ML Kit for face detection (if library installed)
 */
export function usePlatformFaceDetector(
  options?: FaceDetectorOptions
): FaceDetectorPlugin {
  if (!isFaceDetectionAvailable()) {
    // Library not installed - return mock detector
    return {
      detectFaces: (_frame: Frame): Face[] => [],
      stopListeners: () => {},
    };
  }

  try {
    const {
      useFaceDetector,
    } = require("react-native-vision-camera-face-detector");

    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useFaceDetector({
      performanceMode: options?.performanceMode || "fast",
      minFaceSize: options?.minFaceSize || 0.15,
      trackingEnabled: options?.trackingEnabled || false,
      landmarkMode: "none",
      contourMode: "none",
      classificationMode: "none",
    });
  } catch (error) {
    console.error("[Android] Failed to initialize face detector:", error);
    // Fallback to manual capture
    return {
      detectFaces: (_frame: Frame): Face[] => [],
      stopListeners: () => {},
    };
  }
}
