// Native iOS face detection using Apple Vision framework
// This module bridges to Swift VisionFaceDetector

import { NativeModules, Platform } from "react-native";

interface FaceDetectionResult {
  pitchAngle: number;
  rollAngle: number;
  yawAngle: number;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface VisionFaceDetectorModule {
  detectFaces: (imageUri: string) => Promise<FaceDetectionResult[]>;
}

// Get the native module (iOS only)
const VisionFaceDetectorNative = Platform.select({
  ios: NativeModules.VisionFaceDetector as VisionFaceDetectorModule,
  android: null,
  default: null,
});

/**
 * Detect faces in an image using Apple Vision framework (iOS only)
 *
 * @param imageUri - File URI of the image (file://)
 * @returns Promise with array of detected faces
 */
export async function detectFacesInImage(
  imageUri: string
): Promise<FaceDetectionResult[]> {
  if (!VisionFaceDetectorNative) {
    console.warn("[VisionFaceDetector] Not available on this platform");
    return [];
  }

  try {
    const faces = await VisionFaceDetectorNative.detectFaces(imageUri);
    return faces;
  } catch (error) {
    console.error("[VisionFaceDetector] Error detecting faces:", error);
    return [];
  }
}

/**
 * Check if Vision face detection is available
 */
export function isVisionFaceDetectionAvailable(): boolean {
  return Platform.OS === "ios" && VisionFaceDetectorNative != null;
}

export type { FaceDetectionResult };
