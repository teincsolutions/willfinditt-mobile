import { useTheme } from "@/contexts/ThemeContext";
import { useImageUpload } from "@/hooks/useImageUpload";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import AppText from "./AppText";

type Props = {
  maxImages?: number;
  label?: string;
  aspectRatio?: number;
  autoUpload?: boolean; // Automatically upload images after selection
  onImagesUploaded?: (uploadedUrls: string[]) => void; // Callback with uploaded URLs
};

export default function ImageUploader({
  maxImages = 5,
  label,
  aspectRatio = 1,
  autoUpload = true,
  onImagesUploaded,
}: Props) {
  const { colors, spacing, radius, icons } = useTheme();
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  // Use the custom hook for image upload management
  const {
    images,
    addImages,
    removeImage: removeImageFromHook,
    uploadAllImages,
    uploadImage,
  } = useImageUpload(maxImages);

  // Auto-upload images when autoUpload is enabled
  useEffect(() => {
    if (autoUpload && images.length > 0) {
      const newImages = images.filter(
        (img) => !img.isUploading && !img.uploadedData && !img.isError
      );

      if (newImages.length > 0) {
        uploadAllImages();
      }
    }
  }, [images, autoUpload, uploadAllImages]);

  // Notify parent component when all images are uploaded
  useEffect(() => {
    const uploadedImages = images.filter((img) => img.uploadedData);

    if (uploadedImages.length > 0 && onImagesUploaded) {
      const urls = uploadedImages
        .map((img) => img.uploadedData?.url || img.uploadedData?.urls?.[0])
        .filter(Boolean) as string[];

      if (urls.length > 0) {
        onImagesUploaded(urls);
      }
    }
  }, [images, onImagesUploaded]);

  const pickImages = async () => {
    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: remainingSlots,
    });

    if (!result.canceled) {
      const imageUris = result.assets.map((asset: any) => asset.uri);
      addImages(imageUris);
    }
  };

  const handleRemoveImage = (imageId: string) => {
    removeImageFromHook(imageId);
  };

  const handleRetryUpload = (imageId: string) => {
    uploadImage(imageId);
  };

  const openFullscreen = (uri: string) => {
    setFullscreenImage(uri);
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
  };

  return (
    <View>
      {label && (
        <AppText
          variant="sm"
          style={{ marginBottom: spacing.sm, fontWeight: "500" }}
        >
          {label}
        </AppText>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Existing Images */}
        {images.map((image) => (
          <View key={image.id} style={styles.imageContainer}>
            <Pressable
              onPress={() => !image.isUploading && openFullscreen(image.uri)}
              style={[
                styles.imageWrapper,
                {
                  backgroundColor: colors.inputBg,
                  borderRadius: radius.md,
                  borderColor: image.isError ? colors.error : colors.border,
                },
              ]}
            >
              <Image
                source={{ uri: image.uri }}
                style={[
                  styles.image,
                  {
                    borderRadius: radius.md,
                    opacity: image.isUploading ? 0.5 : 1,
                  },
                ]}
                resizeMode="cover"
              />

              {/* Upload Progress Overlay */}
              {image.isUploading && (
                <View style={styles.progressOverlay}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        backgroundColor: colors.backgroundGray,
                        borderRadius: radius.sm,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${image.progress}%`,
                          backgroundColor: colors.primary,
                          borderRadius: radius.sm,
                        },
                      ]}
                    />
                  </View>
                  <AppText
                    variant="xs"
                    style={{ color: colors.textWhite, marginTop: spacing.xs }}
                  >
                    {image.progress}%
                  </AppText>
                </View>
              )}

              {/* Loading Spinner */}
              {image.isUploading && (
                <View style={styles.spinnerOverlay}>
                  <ActivityIndicator size="large" color={colors.primary} />
                </View>
              )}

              {/* Error Indicator with Retry */}
              {image.isError && (
                <Pressable
                  onPress={() => handleRetryUpload(image.id)}
                  style={[
                    styles.errorBadge,
                    {
                      backgroundColor: colors.error,
                      borderRadius: 999,
                    },
                  ]}
                >
                  <Feather
                    name="rotate-cw"
                    size={16}
                    color={colors.textWhite}
                  />
                </Pressable>
              )}

              {/* Success Indicator */}
              {!image.isUploading && !image.isError && image.uploadedData && (
                <View
                  style={[
                    styles.successBadge,
                    {
                      backgroundColor: colors.green,
                      borderRadius: 999,
                    },
                  ]}
                >
                  <Feather name="check" size={16} color={colors.textWhite} />
                </View>
              )}

              {/* Remove Button */}
              {!image.isUploading && (
                <Pressable
                  onPress={() => handleRemoveImage(image.id)}
                  style={[
                    styles.removeButton,
                    {
                      backgroundColor: colors.error,
                      borderRadius: 999,
                    },
                  ]}
                >
                  <Feather name="x" size={16} color={colors.textWhite} />
                </Pressable>
              )}
            </Pressable>
          </View>
        ))}

        {/* Add Image Button */}
        {images.length < maxImages && (
          <Pressable
            onPress={pickImages}
            style={[
              styles.addButton,
              {
                backgroundColor: colors.inputBg,
                borderColor: colors.border,
                borderRadius: radius.md,
              },
            ]}
          >
            <Feather name="plus" size={icons.lg} color={colors.iconGray} />
            <AppText
              variant="xs"
              style={{ color: colors.iconGray, marginTop: spacing.xs }}
            >
              Add Photo
            </AppText>
          </Pressable>
        )}
      </ScrollView>

      {/* Image Counter */}
      <AppText
        variant="xs"
        style={{
          color: colors.textGray,
          marginTop: spacing.sm,
        }}
      >
        {images.length}/{maxImages} images. Max {maxImages} images allowed
      </AppText>

      {/* Fullscreen Modal */}
      <Modal
        visible={fullscreenImage !== null}
        transparent
        animationType="fade"
        onRequestClose={closeFullscreen}
      >
        <View style={styles.fullscreenContainer}>
          <Pressable
            style={styles.fullscreenBackdrop}
            onPress={closeFullscreen}
          >
            <View style={styles.fullscreenContent}>
              {fullscreenImage && (
                <Image
                  source={{ uri: fullscreenImage }}
                  style={styles.fullscreenImage}
                  resizeMode="contain"
                />
              )}

              <Pressable
                onPress={closeFullscreen}
                style={[
                  styles.closeButton,
                  {
                    backgroundColor: colors.background,
                    borderRadius: 999,
                  },
                ]}
              >
                <Feather name="x" size={24} color={colors.text} />
              </Pressable>
            </View>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    gap: 12,
    paddingVertical: 4,
  },
  imageContainer: {
    position: "relative",
  },
  imageWrapper: {
    width: 120,
    height: 120,
    borderWidth: 1,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  progressOverlay: {
    position: "absolute",
    bottom: 8,
    left: 8,
    right: 8,
    alignItems: "center",
  },
  progressBar: {
    width: "100%",
    height: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
  },
  spinnerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  errorBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  successBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    width: 120,
    height: 120,
    borderWidth: 2,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
  },
  fullscreenBackdrop: {
    flex: 1,
  },
  fullscreenContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fullscreenImage: {
    width: "100%",
    height: "100%",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
