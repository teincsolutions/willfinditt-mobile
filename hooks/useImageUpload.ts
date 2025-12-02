import { uploadImage, UploadResponse } from "@/services/uploadService";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";

export interface ImageUploadItem {
  id: string;
  uri: string;
  progress: number; // 0-100
  isUploading: boolean;
  isError?: boolean;
  uploadedData?: UploadResponse;
}

interface UseImageUploadReturn {
  images: ImageUploadItem[];
  addImages: (imageUris: string[]) => void;
  removeImage: (imageId: string) => void;
  uploadImage: (imageId: string) => Promise<void>;
  uploadAllImages: () => Promise<void>;
  isUploading: boolean;
  uploadProgress: number; // Overall progress
  clearImages: () => void;
  setImages: (images: ImageUploadItem[]) => void;
}

/**
 * Custom hook for managing image uploads with progress tracking
 * Uses TanStack Query for better state management, caching, and retry capabilities
 *
 * @param maxImages - Maximum number of images allowed (default: 5)
 * @returns Object with image management functions and state
 */
export const useImageUpload = (maxImages: number = 5): UseImageUploadReturn => {
  const [images, setImages] = useState<ImageUploadItem[]>([]);

  /**
   * TanStack Query mutation for uploading a single image
   */
  const uploadMutation = useMutation<
    UploadResponse,
    Error,
    { imageId: string; imageUri: string }
  >({
    mutationFn: async ({
      imageId,
      imageUri,
    }: {
      imageId: string;
      imageUri: string;
    }) => {
      return uploadImage(imageUri, (progress) => {
        updateImageProgress(imageId, progress);
      });
    },
    retry: 2, // Retry failed uploads twice
    retryDelay: 1000, // Wait 1 second between retries
    onMutate: ({ imageId }: { imageId: string }) => {
      // Mark image as uploading
      setImages((prev) =>
        prev.map((img) =>
          img.id === imageId
            ? { ...img, isUploading: true, progress: 0, isError: false }
            : img
        )
      );
    },
    onSuccess: (data: UploadResponse, { imageId }: { imageId: string }) => {
      // Mark image as successfully uploaded
      setImages((prev) =>
        prev.map((img) =>
          img.id === imageId
            ? {
                ...img,
                isUploading: false,
                progress: 100,
                isError: false,
                uploadedData: data,
              }
            : img
        )
      );
    },
    onError: (error: Error, { imageId }: { imageId: string }) => {
      console.error(`Failed to upload image ${imageId}:`, error);
      // Mark image as failed
      setImages((prev) =>
        prev.map((img) =>
          img.id === imageId
            ? {
                ...img,
                isUploading: false,
                isError: true,
              }
            : img
        )
      );
    },
  });

  /**
   * Add new images to the upload queue
   */
  const addImages = useCallback(
    (imageUris: string[]) => {
      const remainingSlots = maxImages - images.length;
      const urisToAdd = imageUris.slice(0, remainingSlots);

      const newImages: ImageUploadItem[] = urisToAdd.map((uri, index) => ({
        id: `${Date.now()}_${index}_${Math.random()}`,
        uri,
        progress: 0,
        isUploading: false,
        isError: false,
      }));

      setImages((prev) => [...prev, ...newImages]);
    },
    [images.length, maxImages]
  );

  /**
   * Remove an image from the upload queue
   */
  const removeImage = useCallback((imageId: string) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId));
  }, []);

  /**
   * Update progress for a specific image
   */
  const updateImageProgress = useCallback(
    (imageId: string, progress: number) => {
      setImages((prev) =>
        prev.map((img) => (img.id === imageId ? { ...img, progress } : img))
      );
    },
    []
  );

  /**
   * Upload a single image by ID
   */
  const uploadSingleImage = useCallback(
    async (imageId: string) => {
      const image = images.find((img) => img.id === imageId);
      if (!image || image.isUploading || image.uploadedData) {
        return;
      }

      await uploadMutation.mutateAsync({
        imageId: image.id,
        imageUri: image.uri,
      });
    },
    [images, uploadMutation]
  );

  /**
   * Upload all images with progress tracking
   */
  const uploadAllImages = useCallback(async () => {
    const imagesToUpload = images.filter(
      (img) => !img.isUploading && !img.uploadedData && !img.isError
    );

    if (imagesToUpload.length === 0) return;

    // Upload each image sequentially
    for (const image of imagesToUpload) {
      try {
        await uploadMutation.mutateAsync({
          imageId: image.id,
          imageUri: image.uri,
        });
      } catch (error) {
        console.error(`Failed to upload image ${image.id}:`, error);
        // Continue with next image even if one fails
      }
    }
  }, [images, uploadMutation]);

  /**
   * Calculate overall upload progress
   */
  const uploadProgress =
    images.length > 0
      ? images.reduce((acc, img) => acc + img.progress, 0) / images.length
      : 0;

  /**
   * Clear all images
   */
  const clearImages = useCallback(() => {
    setImages([]);
  }, []);

  return {
    images,
    addImages,
    removeImage,
    uploadImage: uploadSingleImage,
    uploadAllImages,
    isUploading: uploadMutation.isPending,
    uploadProgress,
    clearImages,
    setImages,
  };
};
