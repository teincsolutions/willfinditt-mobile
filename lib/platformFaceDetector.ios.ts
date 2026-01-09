// iOS-specific face detector (no ML Kit)
// This file is loaded on iOS via Metro's platform extensions (.ios.ts)

import { NativeModules } from "react-native";
import type { Frame } from "react-native-vision-camera";
import type {
    Face,
    FaceDetectorOptions,
    FaceDetectorPlugin,
} from "./platformFaceDetector";

const { VisionFaceDetector } = NativeModules;

export type { Face, FaceDetectorOptions, FaceDetectorPlugin };

export interface FaceDetectionResult {
  yawAngle: number;
  pitchAngle: number;
  rollAngle: number;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

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

/**
 * iOS: Detect faces in a static image file using Apple Vision framework
 * @param imageUri - The URI of the image file to analyze (file:// scheme)
 * @returns Promise with array of detected faces
 */
export async function detectFacesInImage(
  imageUri: string
): Promise<FaceDetectionResult[]> {
  if (!VisionFaceDetector) {
    console.warn("[iOS] VisionFaceDetector module not available");
    return [];
  }

  try {
    console.log("[iOS] Detecting faces in image:", imageUri);
    const faces = await VisionFaceDetector.detectFaces(imageUri);
    console.log("[iOS] Detected faces:", faces?.length || 0);
    return faces || [];
  } catch (error) {
    console.error("[iOS] Face detection in image failed:", error);
    return [];
  }
}
