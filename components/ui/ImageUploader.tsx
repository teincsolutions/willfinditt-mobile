import { useTheme } from "@/contexts/ThemeContext";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
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

export interface ImageUploadItem {
  id: string;
  uri: string;
  progress: number; // 0-100
  isUploading: boolean;
  isError?: boolean;
}

type Props = {
  images: ImageUploadItem[];
  maxImages?: number;
  onImagesChange: (images: ImageUploadItem[]) => void;
  onUpload?: (imageUri: string) => Promise<void>;
  label?: string;
  aspectRatio?: number;
};

export default function ImageUploader({
  images,
  maxImages = 5,
  onImagesChange,
  onUpload,
  label,
  aspectRatio = 1,
}: Props) {
  const { colors, spacing, radius, icons } = useTheme();
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

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
      const newImages: ImageUploadItem[] = result.assets.map(
        (asset: any, index: number) => ({
          id: `${Date.now()}_${index}`,
          uri: asset.uri,
          progress: 0,
          isUploading: true,
        })
      );

      const updatedImages = [...images, ...newImages];
      onImagesChange(updatedImages);

      // Start uploading each image
      newImages.forEach((image) => {
        // simulateUpload(image.id, image.uri);
      });
    }
  };

  const simulateUpload = async (imageId: string, imageUri: string) => {
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      updateImageProgress(imageId, progress);
    }

    // Call actual upload function if provided
    if (onUpload) {
      try {
        await onUpload(imageUri);
        finishUpload(imageId, false);
      } catch {
        finishUpload(imageId, true);
      }
    } else {
      finishUpload(imageId, false);
    }
  };

  const updateImageProgress = (imageId: string, progress: number) => {
    onImagesChange(
      images.map((img) => (img.id === imageId ? { ...img, progress } : img))
    );
  };

  const finishUpload = (imageId: string, isError: boolean) => {
    onImagesChange(
      images.map((img) =>
        img.id === imageId
          ? { ...img, isUploading: false, progress: 100, isError }
          : img
      )
    );
  };

  const removeImage = (imageId: string) => {
    onImagesChange(images.filter((img) => img.id !== imageId));
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

              {/* Error Indicator */}
              {image.isError && (
                <View
                  style={[
                    styles.errorBadge,
                    {
                      backgroundColor: colors.error,
                      borderRadius: 999,
                    },
                  ]}
                >
                  <Feather name="x" size={16} color={colors.textWhite} />
                </View>
              )}

              {/* Remove Button */}
              {!image.isUploading && (
                <Pressable
                  onPress={() => removeImage(image.id)}
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
