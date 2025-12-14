// iOS-specific face detector (no ML Kit)
// This file is loaded on iOS via Metro's platform extensions (.ios.ts)

import type { Frame } from "react-native-vision-camera";
import type {
  Face,
  FaceDetectorOptions,
  FaceDetectorPlugin,
} from "./platformFaceDetector";

export type { Face, FaceDetectorOptions, FaceDetectorPlugin };

/**
 * iOS: Automatic face detection NOT available (avoid Google ML Kit conflicts)
 */
export const isFaceDetectionAvailable = (): boolean => {
  return false;
};

/**
 * iOS: Manual capture mode only
 */
export const getFaceDetectionMode = (): "automatic" | "manual" => {
  return "manual";
};

/**
 * iOS: Returns mock detector (no automatic detection)
 */
export function usePlatformFaceDetector(
  _options?: FaceDetectorOptions
): FaceDetectorPlugin {
  return {
    detectFaces: (_frame: Frame): Face[] => {
      // No face detection on iOS
      return [];
    },
    stopListeners: () => {
      // No-op
    },
  };
}
