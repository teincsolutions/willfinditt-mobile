// Platform-specific face detection for vision-camera
// Android: Uses Google ML Kit via react-native-vision-camera-face-detector
// iOS: Manual capture only (to avoid Google dependencies conflict)

import { Platform } from "react-native";
import type { Frame } from "react-native-vision-camera";

export interface Face {
  pitchAngle: number;
  rollAngle: number;
  yawAngle: number;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  leftEyeOpenProbability?: number;
  rightEyeOpenProbability?: number;
  smilingProbability?: number;
  trackingId?: number;
}

export interface FaceDetectorPlugin {
  detectFaces: (frame: Frame) => Face[];
  stopListeners: () => void;
}

export interface FaceDetectorOptions {
  performanceMode?: "fast" | "accurate";
  minFaceSize?: number;
  trackingEnabled?: boolean;
}

/**
 * Check if automatic face detection is available on current platform
 */
export const isFaceDetectionAvailable = (): boolean => {
  return Platform.OS === "android";
};

/**
 * Get platform-specific face detection mode
 */
export const getFaceDetectionMode = (): "automatic" | "manual" => {
  return isFaceDetectionAvailable() ? "automatic" : "manual";
};

/**
 * Platform-specific face detector hook
 *
 * - **Android**: Uses Google ML Kit (automatic detection)
 * - **iOS**: Returns mock detector (manual capture only)
 *
 * @param options - Detection options
 * @returns FaceDetectorPlugin with detectFaces and stopListeners methods
 */
export function usePlatformFaceDetector(
  options?: FaceDetectorOptions
): FaceDetectorPlugin {
  // Android: Use Google ML Kit face detector
  if (Platform.OS === "android") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const FaceDetectorModule = require("react-native-vision-camera-face-detector");

      if (FaceDetectorModule && FaceDetectorModule.useFaceDetector) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return FaceDetectorModule.useFaceDetector({
          performanceMode: options?.performanceMode || "fast",
          minFaceSize: options?.minFaceSize || 0.15,
          trackingEnabled: options?.trackingEnabled || false,
          landmarkMode: "none",
          contourMode: "none",
          classificationMode: "none",
        });
      }
    } catch (error) {
      console.warn("[FaceDetector] Android ML Kit not available:", error);
    }
  }

  // iOS: Return mock detector (automatic detection not available)
  return {
    detectFaces: () => [],
    stopListeners: () => {},
  };
}
