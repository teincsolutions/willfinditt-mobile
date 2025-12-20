import {
  getSignedUrl,
  uploadAdImages,
  uploadAvatar,
  uploadDocuments,
  uploadFacePhotos,
  uploadMultipleFiles,
  uploadSingleFile,
  uploadUserContent,
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
 * Hook for uploading KYC documents (max 5 per API docs)
 * FormData should include: documents (files), documentType (field), optional notes
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

/**
 * Hook for uploading single file to any bucket
 * FormData should include: file, optional bucketType and folder
 */
export const useUploadSingleFile = () => {
  const [progress, setProgress] = useState<UploadProgress>({
    percentage: 0,
    loaded: 0,
    total: 0,
  });

  const mutation = useMutation({
    mutationFn: async (file: FormData) => {
      return uploadSingleFile(file, (percentage: number) => {
        setProgress((prev) => ({
          ...prev,
          percentage,
        }));
      });
    },
    onError: (error: any) => {
      console.error("Error uploading file:", error);
      throw error;
    },
  });

  return {
    ...mutation,
    progress,
  };
};

/**
 * Hook for uploading multiple files (max 10) to any bucket
 * FormData should include: files, optional bucketType and folder
 */
export const useUploadMultipleFiles = () => {
  const [progress, setProgress] = useState<UploadProgress>({
    percentage: 0,
    loaded: 0,
    total: 0,
  });

  const mutation = useMutation({
    mutationFn: async (files: FormData) => {
      return uploadMultipleFiles(files, (percentage: number) => {
        setProgress((prev) => ({
          ...prev,
          percentage,
        }));
      });
    },
    onError: (error: any) => {
      console.error("Error uploading files:", error);
      throw error;
    },
  });

  return {
    ...mutation,
    progress,
  };
};

/**
 * Hook for uploading user content with custom categorization
 * FormData should include: content file, optional category and description
 */
export const useUploadUserContent = () => {
  const [progress, setProgress] = useState<UploadProgress>({
    percentage: 0,
    loaded: 0,
    total: 0,
  });

  const mutation = useMutation({
    mutationFn: async (content: FormData) => {
      return uploadUserContent(content, (percentage: number) => {
        setProgress((prev) => ({
          ...prev,
          percentage,
        }));
      });
    },
    onError: (error: any) => {
      console.error("Error uploading user content:", error);
      throw error;
    },
  });

  return {
    ...mutation,
    progress,
  };
};
