import {
  getSignedUrl,
  uploadAdImages,
  uploadAvatar,
  uploadDocuments,
  uploadFacePhotos,
} from "@/services/uploadService";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export interface UploadProgress {
  percentage: number;
  loaded: number;
  total: number;
}

/**
 * Hook for uploading ad images (max 5)
 */
export const useUploadAdImages = () => {
  const [progress, setProgress] = useState<UploadProgress>({
    percentage: 0,
    loaded: 0,
    total: 0,
  });

  const mutation = useMutation({
    mutationFn: async (images: FormData) => {
      return uploadAdImages(images, (percentage: number) => {
        setProgress((prev) => ({
          ...prev,
          percentage,
        }));
      });
    },
    onError: (error: any) => {
      console.error("Error uploading ad images:", error);
      throw error;
    },
  });

  return {
    ...mutation,
    progress,
  };
};

/**
 * Hook for uploading user avatar
 */
export const useUploadAvatar = () => {
  const [progress, setProgress] = useState<UploadProgress>({
    percentage: 0,
    loaded: 0,
    total: 0,
  });

  const mutation = useMutation({
    mutationFn: async (avatar: FormData) => {
      return uploadAvatar(avatar, (percentage: number) => {
        setProgress((prev) => ({
          ...prev,
          percentage,
        }));
      });
    },
    onError: (error: any) => {
      console.error("Error uploading avatar:", error);
      throw error;
    },
  });

  return {
    ...mutation,
    progress,
  };
};

/**
 * Hook for uploading KYC documents (max 3)
 */
export const useUploadDocuments = () => {
  const [progress, setProgress] = useState<UploadProgress>({
    percentage: 0,
    loaded: 0,
    total: 0,
  });

  const mutation = useMutation({
    mutationFn: async (documents: FormData) => {
      return uploadDocuments(documents, (percentage: number) => {
        setProgress((prev) => ({
          ...prev,
          percentage,
        }));
      });
    },
    onError: (error: any) => {
      console.error("Error uploading documents:", error);
      throw error;
    },
  });

  return {
    ...mutation,
    progress,
  };
};

/**
 * Hook for uploading face photos for KYC verification
 */
export const useUploadFacePhotos = () => {
  const [progress, setProgress] = useState<UploadProgress>({
    percentage: 0,
    loaded: 0,
    total: 0,
  });

  const mutation = useMutation({
    mutationFn: async (images: FormData) => {
      return await uploadFacePhotos(images, (percentage: number) => {
        setProgress((prev) => ({
          ...prev,
          percentage,
        }));
      });
    },
    onError: (error: any) => {
      console.error("Error uploading face photos:", error.response?.data);
      throw error;
    },
  });

  return {
    ...mutation,
    progress,
  };
};

/**
 * Hook for getting signed URLs for S3 objects
 */
export const useGetSignedUrl = () => {
  return useMutation({
    mutationFn: async ({
      url,
      expiresIn = 259200,
    }: {
      url: string;
      expiresIn?: number;
    }) => {
      return getSignedUrl(url, expiresIn);
    },
    onError: (error: any) => {
      console.error("Error getting signed URL:", error);
      throw error;
    },
  });
};
