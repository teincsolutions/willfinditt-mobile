import { useTheme } from "@/contexts/ThemeContext";
import { useUploadFacePhotos } from "@/hooks/useUpload";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import AppText from "../ui/AppText";
import FaceAutoCapture from "./FaceAutoCapture";

interface CapturedPhoto {
  pose: "CENTER" | "LEFT" | "RIGHT";
  uri: string;
}

interface FaceVerificationModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: (urls: string[]) => void;
  requireAllPoses?: boolean;
  countdownSeconds?: number;
  allowCameraSwitch?: boolean;
}

export default function FaceVerificationModal({
  visible,
  onClose,
  onSuccess,
  requireAllPoses = true,
  countdownSeconds = 3,
  allowCameraSwitch = true,
}: FaceVerificationModalProps) {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const { mutateAsync: uploadFacePhotos, progress } = useUploadFacePhotos();

  const handleFacesCaptured = (photos: CapturedPhoto[]) => {
    setCapturedPhotos(photos);
    setShowPreview(true);
  };

  const handleUpload = async () => {
    setIsUploading(true);

    try {
      // Convert captured photos to FormData
      const formData = new FormData();

      for (const photo of capturedPhotos) {
        const filename = `face-${photo.pose.toLowerCase()}-${Date.now()}.jpg`;

        // Create the file object for FormData
        formData.append("photos", {
          uri: photo.uri,
          type: "image/jpeg",
          name: filename,
        } as any);
      }

      // Upload to backend
      const response = await uploadFacePhotos(formData);

      if (response.urls && response.urls.length > 0) {
        toast.success("Success", {
          description: "Face verification photos uploaded successfully!",
        });

        // Call success callback with uploaded URLs
        onSuccess?.(response.urls);

        // Close modal after short delay
        setTimeout(() => {
          onClose();
          setCapturedPhotos([]);
          setShowPreview(false);
        }, 500);
      } else {
        throw new Error("No URLs returned from upload");
      }
    } catch (error: any) {
      console.error("Error uploading face photos:", error);
      Alert.alert(
        "Upload Failed",
        error?.response?.data?.message ||
          "Failed to upload face photos. Please try again.",
        [
          {
            text: "Retry",
            onPress: () => {
              setIsUploading(false);
              setShowPreview(true); // Stay on preview
            },
          },
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => {
              setCapturedPhotos([]);
              setIsUploading(false);
              setShowPreview(false);
              onClose();
            },
          },
        ]
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleRetake = () => {
    setCapturedPhotos([]);
    setShowPreview(false);
  };

  const handleClose = () => {
    if (isUploading) {
      Alert.alert(
        "Upload in Progress",
        "Please wait while we upload your photos.",
        [{ text: "OK" }]
      );
      return;
    }

    if (capturedPhotos.length > 0) {
      Alert.alert(
        "Discard Photos?",
        "Are you sure you want to close? Your captured photos will be lost.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => {
              setCapturedPhotos([]);
              setShowPreview(false);
              onClose();
            },
          },
        ]
      );
    } else {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              paddingTop: insets.top + spacing.md,
              paddingHorizontal: spacing.lg,
              paddingBottom: spacing.md,
              backgroundColor: colors.backgroundPrimary,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <View style={styles.headerContent}>
            <AppText variant="xl" style={{ fontWeight: "700" }}>
              Face Verification
            </AppText>
            <TouchableOpacity
              onPress={handleClose}
              style={{
                padding: spacing.sm,
                marginRight: -spacing.sm,
              }}
              disabled={isUploading}
            >
              <Ionicons
                name="close"
                size={28}
                color={isUploading ? colors.textGray : colors.text}
              />
            </TouchableOpacity>
          </View>

          {/* Instructions */}
          <View style={{ marginTop: spacing.md }}>
            <AppText
              style={{
                color: colors.textGray,
                fontSize: 14,
                lineHeight: 20,
              }}
            >
              {showPreview
                ? "Review your photos. You can retake them or proceed to upload."
                : requireAllPoses
                ? "Please capture your face from three angles: front, left, and right. Keep your face within the oval guide."
                : "Please position your face within the oval guide and stay still."}
            </AppText>
          </View>
        </View>

        {/* Camera View or Preview */}
        <View style={styles.cameraContainer}>
          {!showPreview ? (
            <FaceAutoCapture
              onCaptured={handleFacesCaptured}
              countdownSeconds={countdownSeconds}
              allowCameraSwitch={allowCameraSwitch}
              requireAllPoses={requireAllPoses}
            />
          ) : (
            <View style={styles.previewContainer}>
              <View style={styles.photosGrid}>
                {capturedPhotos.map((photo, index) => (
                  <View key={photo.pose} style={styles.photoCard}>
                    <Image
                      source={{ uri: photo.uri }}
                      style={styles.previewImage}
                      resizeMode="cover"
                    />
                    <View
                      style={[
                        styles.poseLabel,
                        { backgroundColor: colors.primary },
                      ]}
                    >
                      <AppText
                        variant="xs"
                        style={{ color: colors.textWhite, fontWeight: "600" }}
                      >
                        {photo.pose === "CENTER"
                          ? "Front"
                          : photo.pose === "LEFT"
                          ? "Left"
                          : "Right"}
                      </AppText>
                    </View>
                  </View>
                ))}
              </View>

              {/* Action Buttons */}
              <View
                style={[
                  styles.previewActions,
                  {
                    paddingHorizontal: spacing.lg,
                    paddingBottom: insets.bottom + spacing.lg,
                    paddingTop: spacing.lg,
                    backgroundColor: colors.backgroundPrimary,
                    borderTopWidth: 1,
                    borderTopColor: colors.border,
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={handleRetake}
                  style={[
                    styles.actionButton,
                    {
                      backgroundColor: colors.backgroundGray,
                      borderRadius: spacing.md,
                      padding: spacing.md,
                      flex: 1,
                      marginRight: spacing.sm,
                    },
                  ]}
                  disabled={isUploading}
                >
                  <Ionicons
                    name="camera-outline"
                    size={24}
                    color={colors.text}
                  />
                  <AppText
                    variant="md"
                    style={{ marginTop: spacing.xs, fontWeight: "600" }}
                  >
                    Retake
                  </AppText>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleUpload}
                  style={[
                    styles.actionButton,
                    {
                      backgroundColor: colors.primary,
                      borderRadius: spacing.md,
                      padding: spacing.md,
                      flex: 1,
                      marginLeft: spacing.sm,
                    },
                  ]}
                  disabled={isUploading}
                >
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={24}
                    color={colors.textWhite}
                  />
                  <AppText
                    variant="md"
                    style={{
                      marginTop: spacing.xs,
                      fontWeight: "600",
                      color: colors.textWhite,
                    }}
                  >
                    Upload
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Upload Progress Overlay */}
        {isUploading && (
          <View style={styles.uploadOverlay}>
            <View
              style={[
                styles.uploadCard,
                {
                  backgroundColor: colors.backgroundPrimary,
                  padding: spacing.xl,
                  borderRadius: spacing.md,
                },
              ]}
            >
              <ActivityIndicator size="large" color={colors.primary} />
              <AppText
                variant="lg"
                style={{
                  marginTop: spacing.lg,
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                Uploading Photos...
              </AppText>
              <AppText
                style={{
                  marginTop: spacing.sm,
                  color: colors.textGray,
                  textAlign: "center",
                }}
              >
                {progress.percentage}% complete
              </AppText>

              {/* Progress Bar */}
              <View
                style={[
                  styles.progressBarContainer,
                  {
                    backgroundColor: colors.backgroundGray,
                    marginTop: spacing.lg,
                  },
                ]}
              >
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${progress.percentage}%`,
                      backgroundColor: colors.primary,
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    zIndex: 10,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cameraContainer: {
    flex: 1,
  },
  previewContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  photosGrid: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    gap: 16,
    justifyContent: "center",
    alignContent: "center",
  },
  photoCard: {
    width: "45%",
    aspectRatio: 3 / 4,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  poseLabel: {
    position: "absolute",
    bottom: 8,
    left: 8,
    right: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  previewActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 60,
  },
  uploadOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  uploadCard: {
    width: "100%",
    maxWidth: 320,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  progressBarContainer: {
    width: "100%",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
});
