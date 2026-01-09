// Android-specific face detector (with Google ML Kit)
// This file is loaded on Android via Metro's platform extensions (.android.ts)

import type { Frame } from "react-native-vision-camera";
import type {
  Face,
  FaceDetectorOptions,
  FaceDetectorPlugin,
} from "./platformFaceDetector";

let ExpoVisionFaceDetector: any = null;
try {
  ExpoVisionFaceDetector = require('../modules/expo-vision-face-detector').default;
} catch (error) {
  console.warn('[Android] ExpoVisionFaceDetector module not found:', error);
}

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
 * Android: Automatic face detection not enabled - uses manual capture
 */
export const isFaceDetectionAvailable = (): boolean => {
  return false;
};

/**
 * Android: Manual capture mode (tap to capture)
 */
export const getFaceDetectionMode = (): "automatic" | "manual" => {
  return "manual";
};

/**
 * Android: Returns mock detector - manual capture mode only
 */
export function usePlatformFaceDetector(
  _options?: FaceDetectorOptions
): FaceDetectorPlugin {
  // Manual capture mode - no real-time detection
  return {
    detectFaces: (_frame: Frame): Face[] => [],
    stopListeners: () => {},
  };
}

/**
 * Android: Detect faces in a static image file using ML Kit
 * @param imageUri - The URI of the image file to analyze (file:// scheme)
 * @returns Promise with array of detected faces
 */
export async function detectFacesInImage(
  imageUri: string
): Promise<FaceDetectionResult[]> {
  if (!ExpoVisionFaceDetector) {
    const error = new Error("ExpoVisionFaceDetector module not available on Android. Make sure the module is properly linked.");
    console.error("[Android] VisionFaceDetector module not loaded");
    throw error;
  }

  try {
    console.log("[Android] Detecting faces in image:", imageUri);
    const faces = await ExpoVisionFaceDetector.detectFaces(imageUri);
    console.log("[Android] Detected faces:", faces?.length || 0);
    return faces || [];
  } catch (error) {
    console.error("[Android] Face detection in image failed:", error);
    throw error;
  }
}
