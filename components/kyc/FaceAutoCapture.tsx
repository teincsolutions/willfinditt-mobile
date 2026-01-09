import { useTheme } from "@/contexts/ThemeContext";
import { isVisionFaceDetectionAvailable } from "@/lib/iosVisionFaceDetector";
import {
  detectFacesInImage,
  isFaceDetectionAvailable,
  usePlatformFaceDetector,
  type Face,
} from "@/lib/platformFaceDetector";
import Ionicons from "@expo/vector-icons/Ionicons";
import Constants from "expo-constants";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useFrameProcessor,
  type CameraPosition,
} from "react-native-vision-camera";
import { scheduleOnRN } from "react-native-worklets";
import AppText from "../ui/AppText";

type Pose = "CENTER" | "LEFT" | "RIGHT";
type CaptureStep = "position" | "verifying" | "success" | "error";

interface CapturedPhoto {
  pose: Pose;
  uri: string;
}

export default function FaceAutoCapture({
  onCaptured,
  countdownSeconds = 3,
  allowCameraSwitch = true,
  requireAllPoses = true,
}: {
  onCaptured: (photos: CapturedPhoto[]) => void;
  countdownSeconds?: number;
  allowCameraSwitch?: boolean;
  requireAllPoses?: boolean;
}) {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const camera = useRef<Camera>(null);
  const [cameraPosition, setCameraPosition] = useState<CameraPosition>("front");
  const device = useCameraDevice(cameraPosition);
  const { hasPermission, requestPermission } = useCameraPermission();

  // Multi-pose capture state
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);
  const posesSequence: Pose[] = requireAllPoses
    ? ["CENTER", "LEFT", "RIGHT"]
    : ["CENTER"];
  const currentPose = posesSequence[currentPoseIndex];

  const [captureStep, setCaptureStep] = useState<CaptureStep>("position");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
  const captureTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const instruction =
    currentPose === "CENTER"
      ? "Look straight at the camera"
      : currentPose === "LEFT"
      ? "Turn your head to the left"
      : "Turn your head to the right";

  // Check if automatic detection is available (Android only)
  const isAutoDetectionEnabled = isFaceDetectionAvailable();

  // Progress animation
  useEffect(() => {
    const progress = (currentPoseIndex / posesSequence.length) * 100;
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [currentPoseIndex, posesSequence.length, progressAnim]);

  // Pulse animation for face oval
  useEffect(() => {
    if (faceDetected && captureStep === "position") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [faceDetected, captureStep, pulseAnim]);

  // Fade animation for status messages
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [captureStep, fadeAnim]);

  // Camera switch handler
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

    setCameraPosition((prev) => (prev === "front" ? "back" : "front"));
    setFaceDetected(false);
    setCountdown(null);
    setCaptureStep("position");
    setErrorMessage("");
  }, []);

  // Reset/Restart handler
  const resetCapture = useCallback(() => {
    const photosCount = capturedPhotos.length;
    const message =
      photosCount > 0
        ? `You have captured ${photosCount} photo${
            photosCount > 1 ? "s" : ""
          }. Are you sure you want to restart?`
        : "Are you sure you want to restart?";

    Alert.alert("Restart Capture?", message, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Restart",
        style: "destructive",
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

          setCurrentPoseIndex(0);
          setCapturedPhotos([]);
          setCaptureStep("position");
          setFaceDetected(false);
          setCountdown(null);
          setErrorMessage("");
        },
      },
    ]);
  }, [capturedPhotos.length]);

  const isCorrectPose = useCallback(
    (face: Face, angleInRadians = true) => {
      // Convert radians to degrees if needed (iOS Vision returns radians)
      const yaw = angleInRadians
        ? face.yawAngle * (180 / Math.PI)
        : face.yawAngle;

      if (currentPose === "CENTER") return Math.abs(yaw) < 15;
      if (currentPose === "LEFT") return yaw > 20;
      if (currentPose === "RIGHT") return yaw < -20;
      return false;
    },
    [currentPose]
  );

  const capturePhoto = useCallback(async () => {
    if (!camera.current || captureStep === "verifying") return;

    // Clear any existing capture timeout
    if (captureTimeoutRef.current) {
      clearTimeout(captureTimeoutRef.current);
      captureTimeoutRef.current = null;
    }

    // Check if camera is ready (Android)
    if (Platform.OS === "android") {
      try {
        // Small delay to ensure camera is ready
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (e) {
        console.warn("Camera preparation delay failed:", e);
      }
    }

    setCaptureStep("verifying");
    setCountdown(null);

    // Set a timeout to prevent hanging - 15 seconds max
    captureTimeoutRef.current = setTimeout(() => {
      console.warn("Capture timeout - resetting to position");
      setCaptureStep("error");
      setErrorMessage("Capture timeout. Please try again.");
      const resetTimeout = setTimeout(() => setCaptureStep("position"), 2000);
      timeoutRefs.current.push(resetTimeout);
    }, 15000);

    try {
      // Add timeout wrapper for takePhoto
      const photoPromise = camera.current.takePhoto();
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Camera timeout")), 10000)
      );

      const photo = await Promise.race([photoPromise, timeoutPromise]);
      const photoUri = `file://${photo.path}`;

      // Verify face in captured photo for both platforms
      // Add timeout for face detection
      const faceDetectionPromise = detectFacesInImage(photoUri);
      const faceTimeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Face detection timeout")), 8000)
      );

      const faces = await Promise.race([
        faceDetectionPromise,
        faceTimeoutPromise,
      ]);

      if (faces.length === 0) {
        setCaptureStep("error");
        setErrorMessage(
          `No ${
            currentPose === "CENTER" ? "" : currentPose.toLowerCase()
          } face detected. Please try again.`
        );
        const resetTimeout = setTimeout(
          () => setCaptureStep("position"),
          2000
        );
        timeoutRefs.current.push(resetTimeout);
        return;
      }

      // Check pose (iOS uses radians, Android uses degrees)
      const face = faces[0];
      const isRadians = Platform.OS === "ios";
      if (!isCorrectPose(face, isRadians)) {
        const poseInstruction =
          currentPose === "CENTER"
            ? "look straight at the camera"
            : currentPose === "LEFT"
            ? "turn your head to the left"
            : "turn your head to the right";

        setCaptureStep("error");
        setErrorMessage(`Please ${poseInstruction}`);
        const resetTimeout = setTimeout(
          () => setCaptureStep("position"),
          2000
        );
        timeoutRefs.current.push(resetTimeout);
        return;
      }

      // Clear the capture timeout on success
      if (captureTimeoutRef.current) {
        clearTimeout(captureTimeoutRef.current);
        captureTimeoutRef.current = null;
      }

      // Face verified - success!
      setCaptureStep("success");

      // Add to captured photos
      const newPhoto: CapturedPhoto = {
        pose: currentPose,
        uri: photoUri,
      };
      const updatedPhotos = [...capturedPhotos, newPhoto];
      setCapturedPhotos(updatedPhotos);

      // Check if we need more poses
      if (currentPoseIndex < posesSequence.length - 1) {
        // Move to next pose
        const nextPoseTimeout = setTimeout(() => {
          setCurrentPoseIndex((prev) => prev + 1);
          setCaptureStep("position");
          setFaceDetected(false);
        }, 1000);
        timeoutRefs.current.push(nextPoseTimeout);
      } else {
        // All poses captured - complete!
        const completeTimeout = setTimeout(() => {
          onCaptured(updatedPhotos);
        }, 500);
        timeoutRefs.current.push(completeTimeout);
      }
    } catch (error: any) {
      console.error("Error taking picture:", error);

      // Clear the capture timeout on error
      if (captureTimeoutRef.current) {
        clearTimeout(captureTimeoutRef.current);
        captureTimeoutRef.current = null;
      }

      setCaptureStep("error");
      const errorMsg = error?.message?.includes("timeout")
        ? "Operation timed out. Please try again."
        : "Failed to capture photo. Please try again.";
      setErrorMessage(errorMsg);
      const resetTimeout = setTimeout(() => setCaptureStep("position"), 2000);
      timeoutRefs.current.push(resetTimeout);
    }
  }, [
    captureStep,
    onCaptured,
    currentPose,
    isCorrectPose,
    capturedPhotos,
    currentPoseIndex,
    posesSequence.length,
  ]);

  const startCountdown = useCallback(() => {
    if (countdownIntervalRef.current || captureStep === "verifying") return;

    setCountdown(countdownSeconds);
    let count = countdownSeconds;

    countdownIntervalRef.current = setInterval(() => {
      count -= 1;
      setCountdown(count);

      if (count <= 0) {
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
          countdownIntervalRef.current = null;
        }
        capturePhoto();
      }
    }, 1000) as any;
  }, [countdownSeconds, capturePhoto, captureStep]);

  // Android: Initialize platform-specific face detector
  const faceDetector = usePlatformFaceDetector({
    performanceMode: "fast",
    minFaceSize: 0.15,
    trackingEnabled: false,
  });

  const onFacesDetected = useCallback(
    (faces: Face[]) => {
      if (captureStep === "verifying" || countdown !== null) return;

      if (faces.length === 1) {
        const face = faces[0];
        if (isCorrectPose(face, false)) {
          // Android returns degrees
          setFaceDetected(true);
          startCountdown();
        } else {
          setFaceDetected(false);
        }
      } else {
        setFaceDetected(false);
      }
    },
    [captureStep, countdown, isCorrectPose, startCountdown]
  );

  // Android: Frame processor for real-time detection
  const frameProcessor = useFrameProcessor(
    (frame) => {
      "worklet";
      const faces = faceDetector.detectFaces(frame);
      scheduleOnRN(onFacesDetected, faces);
    },
    [onFacesDetected, faceDetector]
  );

  // Cleanup effect - clear all timeouts and intervals on unmount
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

  if (!hasPermission) {
    return (
      <View
        style={[styles.centerContainer, { backgroundColor: colors.background }]}
      >
        <AppText style={{ marginBottom: spacing.md }}>
          We need camera permission for face verification
        </AppText>
        <TouchableOpacity onPress={requestPermission}>
          <AppText style={{ color: colors.primary, paddingVertical: spacing.md, fontWeight: "600" }}>
            Grant Permission
          </AppText>
        </TouchableOpacity>
      </View>
    );
  }

  if (device == null) {
    return (
      <View style={styles.centerContainer}>
        <AppText>No camera device found</AppText>
      </View>
    );
  }

  // Check if running in Expo Go (iOS face detection requires custom dev build)
  const isExpoGo = Constants.expoGoConfig != null;
  if (Platform.OS === "ios" && isExpoGo && !isVisionFaceDetectionAvailable()) {
    return (
      <View style={styles.centerContainer}>
        <AppText
          variant="lg"
          style={{
            textAlign: "center",
            paddingHorizontal: spacing.xl,
            marginBottom: spacing.lg,
          }}
        >
          ⚠️ Face Detection Requires Dev Build
        </AppText>
        <AppText
          style={{
            textAlign: "center",
            paddingHorizontal: spacing.xl,
            marginBottom: spacing.md,
          }}
        >
          iOS face detection uses a native module that doesn&apos;t work in Expo
          Go.
        </AppText>
        <AppText
          style={{
            textAlign: "center",
            paddingHorizontal: spacing.xl,
            marginBottom: spacing.xl,
            color: colors.textGray,
          }}
        >
          Please build a development build:
        </AppText>
        <View
          style={{
            backgroundColor: colors.background,
            padding: spacing.md,
            borderRadius: 8,
          }}
        >
          <AppText style={{ fontFamily: "monospace", fontSize: 12 }}>
            eas build -p ios --profile development
          </AppText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
        frameProcessor={isAutoDetectionEnabled ? frameProcessor : undefined}
      />

      {/* Overlay */}
      <View pointerEvents="box-none" style={styles.overlay}>
        {/* Progress indicator */}
        {requireAllPoses && (
          <View
            style={[
              styles.progressContainer,
              {
                top: spacing.lg,
                paddingHorizontal: spacing.xl,
              },
            ]}
          >
            <View style={styles.progressSteps}>
              {posesSequence.map((pose, index) => (
                <View key={pose} style={styles.progressStepWrapper}>
                  <View
                    style={[
                      styles.progressStep,
                      {
                        backgroundColor:
                          index < currentPoseIndex ||
                          (index === currentPoseIndex &&
                            captureStep === "success")
                            ? "#00FF00"
                            : index === currentPoseIndex
                            ? colors.primary
                            : "rgba(255,255,255,0.3)",
                      },
                    ]}
                  >
                    {index < currentPoseIndex ||
                    (index === currentPoseIndex &&
                      captureStep === "success") ? (
                      <Ionicons name="checkmark" size={16} color="#000" />
                    ) : (
                      <AppText
                        style={{
                          color: index === currentPoseIndex ? "#fff" : "#999",
                          fontSize: 12,
                          fontWeight: "600",
                        }}
                      >
                        {index + 1}
                      </AppText>
                    )}
                  </View>
                  <AppText
                    style={[
                      styles.progressLabel,
                      {
                        color:
                          index === currentPoseIndex
                            ? "#fff"
                            : "rgba(255,255,255,0.6)",
                      },
                    ]}
                  >
                    {pose === "CENTER"
                      ? "Front"
                      : pose === "LEFT"
                      ? "Left"
                      : "Right"}
                  </AppText>
                  {index < posesSequence.length - 1 && (
                    <View
                      style={[
                        styles.progressLine,
                        {
                          backgroundColor:
                            index < currentPoseIndex
                              ? "#00FF00"
                              : "rgba(255,255,255,0.3)",
                        },
                      ]}
                    />
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Top action buttons */}
        <View
          style={[
            styles.topActions,
            {
              bottom: requireAllPoses ? spacing.xl * 3.5 : spacing.xl,
              left: spacing.xl,
              right: spacing.xl,
            },
          ]}
        >
          {/* Restart button - shows if any photos captured */}
          {capturedPhotos.length > 0 && captureStep === "position" && (
            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  backgroundColor: "rgba(255,0,0,0.7)",
                  padding: spacing.md,
                  borderRadius: 50,
                },
              ]}
              onPress={resetCapture}
            >
              <Ionicons name="refresh" size={24} color={colors.iconWhite} />
            </TouchableOpacity>
          )}

          {/* Spacer */}
          <View style={{ flex: 1 }} />

          {/* Camera switch button */}
          {allowCameraSwitch && captureStep === "position" && (
            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  backgroundColor: "rgba(0,0,0,0.5)",
                  padding: spacing.md,
                  borderRadius: 50,
                },
              ]}
              onPress={switchCamera}
            >
              <Ionicons
                name="camera-reverse"
                size={28}
                color={colors.iconWhite}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Face oval guide with pulse animation */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.faceOval,
            {
              borderColor:
                captureStep === "success"
                  ? "#00FF00"
                  : captureStep === "error"
                  ? "#FF0000"
                  : faceDetected
                  ? "#00FF00"
                  : colors.primary,
              marginBottom: spacing.lg,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />

        {/* Countdown display */}
        {countdown !== null && countdown > 0 && (
          <Animated.View
            style={[
              styles.countdownContainer,
              { opacity: fadeAnim, transform: [{ scale: pulseAnim }] },
            ]}
          >
            <AppText style={styles.countdownText}>{countdown}</AppText>
          </Animated.View>
        )}

        {/* Verifying indicator with cancel button */}
        {captureStep === "verifying" && (
          <Animated.View
            style={[styles.verifyingContainer, { opacity: fadeAnim }]}
          >
            <ActivityIndicator size="large" color={colors.iconWhite} />
            <AppText style={[styles.verifyingText, { marginTop: spacing.md }]}>
              Verifying face...
            </AppText>
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
              style={{
                marginTop: spacing.lg,
                paddingHorizontal: spacing.lg,
                paddingVertical: spacing.sm,
                backgroundColor: "rgba(255, 0, 0, 0.8)",
                borderRadius: 20,
              }}
            >
              <AppText style={{ color: colors.textWhite, fontWeight: "600" }}>
                Cancel
              </AppText>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Status message */}
        <Animated.View
          style={[
            styles.statusContainer,
            {
              top: insets.top + spacing.xxl,
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.md,
              opacity: fadeAnim,
            },
          ]}
        >
          <AppText
            variant="lg"
            style={[
              styles.statusText,
              {
                color:
                  captureStep === "success"
                    ? "#00FF00"
                    : captureStep === "error"
                    ? "#FF0000"
                    : faceDetected
                    ? "#00FF00"
                    : colors.textWhite,
              },
            ]}
          >
            {captureStep === "verifying"
              ? "Verifying your face..."
              : captureStep === "success"
              ? "✓ Face verified successfully!"
              : captureStep === "error"
              ? errorMessage
              : countdown !== null
              ? "Stay still..."
              : faceDetected
              ? "Face detected! ✓"
              : isAutoDetectionEnabled
              ? instruction
              : `${instruction}\n(Tap to capture - face will be verified)`}
          </AppText>
        </Animated.View>

        {/* Bottom action buttons */}
        <View
          style={[
            styles.bottomActions,
            {
              bottom: insets.bottom + 40,
              left: spacing.xl,
              right: spacing.xl,
            },
          ]}
        >
          {/* Capture button - iOS always, Android as fallback */}
          {captureStep === "position" &&
            (!isAutoDetectionEnabled || (!faceDetected && !countdown)) && (
              <Pressable
                onPress={capturePhoto}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed
                      ? colors.backgroundGray
                      : colors.background,
                    padding: spacing.sm,
                    borderRadius: spacing.xl + spacing.sm,
                  },
                ]}
              >
                <View
                  style={{
                    padding: spacing.xl,
                    borderRadius: spacing.xl,
                    backgroundColor: colors.iconWhite,
                  }}
                />
              </Pressable>
            )}

          {/* Retake All button - shows if photos captured */}
          {((capturedPhotos.length > 0 && captureStep === "position") ||
            capturedPhotos.length === 3) && (
            <Pressable
              onPress={resetCapture}
              style={({ pressed }) => [
                styles.retakeButton,
                {
                  backgroundColor: pressed
                    ? "rgba(255,0,0,0.9)"
                    : "rgba(255,0,0,0.7)",
                  paddingHorizontal: spacing.lg,
                  paddingVertical: spacing.sm,
                  marginTop: spacing.md,
                  borderRadius: 20,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
            >
              <Ionicons
                name="refresh"
                size={18}
                color={colors.iconWhite}
                style={{ marginRight: 8 }}
              />
              <AppText style={styles.retakeButtonText}>
                Retake All ({capturedPhotos.length}/{posesSequence.length})
              </AppText>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  progressContainer: {
    position: "absolute",
    width: "100%",
    alignItems: "center",
  },
  progressSteps: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
  },
  progressStepWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  progressLabel: {
    fontSize: 10,
    fontWeight: "600",
    marginLeft: 6,
    marginRight: 8,
  },
  progressLine: {
    width: 20,
    height: 2,
    marginHorizontal: 4,
  },
  topActions: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionButton: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  switchButton: {
    position: "absolute",
  },
  faceOval: {
    width: 260,
    height: 360,
    borderRadius: 180,
    borderWidth: 4,
  },
  countdownContainer: {
    position: "absolute",
    top: "30%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 100,
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  countdownText: {
    color: "#fff",
    fontSize: 64,
    fontWeight: "bold",
  },
  verifyingContainer: {
    position: "absolute",
    top: "30%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 20,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  verifyingText: {
    fontSize: 18,
    fontWeight: "600",
  },
  statusContainer: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 20,
  },
  statusText: {
    textAlign: "center",
    fontWeight: "600",
  },
  bottomActions: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  retakeButton: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  retakeButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  captureButton: {
    borderRadius: 25,
  },
  captureButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
