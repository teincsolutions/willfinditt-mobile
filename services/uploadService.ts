import { convertS3UrlToSignedRequest } from "@/lib/convertS3UrlsToSignedRequest";
import { AxiosProgressEvent } from "axios";
import api from "./api";

export interface UploadResponse {
  urls?: string[];
  url?: string;
  thumbnail?: string;
  bucketType?: string;
  folder?: string;
  category?: string;
  description?: string;
  documentType?: string;
  notes?: string;
  message: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface SignedUrlResponse {
  url: string;
  expiresIn: number;
  bucketType?: string;
  key: string;
}

export type UploadProgressCallback = (progress: number) => void;

/**
 * Get signed URL for a given S3 URL with optional expiry time (in seconds) default 3 days
 * Note: Requires convertS3UrlToSignedRequest utility function
 */
export const getSignedUrl = async (
  url: string,
  expiresIn: number = 259200, // 3 days in seconds
): Promise<string> => {
  const requestPath = convertS3UrlToSignedRequest(url);
  const signedUrl = await api.get<SignedUrlResponse>(requestPath, {
    params: {
      expiresIn,
    },
  });
  return signedUrl.data.url;
};

/**
 * Upload ad images (max 5) - uses ADS_MEDIA bucket
 */
export const uploadAdImages = async (
  images: FormData,
  onProgress?: UploadProgressCallback,
): Promise<UploadResponse> => {
  const response = await api.post<UploadResponse>(
    "/api/v1/upload/ad-images",
    images,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentage = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          onProgress(percentage);
        }
      },
    },
  );
  return response.data;
};

/**
 * Upload user avatar
 */
export const uploadAvatar = async (
  avatar: FormData,
  onProgress?: UploadProgressCallback,
): Promise<UploadResponse> => {
  const response = await api.post<UploadResponse>(
    "/api/v1/upload/avatar",
    avatar,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentage = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          onProgress(percentage);
        }
      },
    },
  );
  return response.data;
};

/**
 * Upload documents (max 5 per API docs) with progress callback
 * Requires: documents (files), documentType (field), optional notes
 */
export const uploadDocuments = async (
  documents: FormData,
  onProgress?: UploadProgressCallback,
): Promise<UploadResponse> => {
  const response = await api.post<UploadResponse>(
    "/api/v1/upload/kyc-documents",
    documents,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentage = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          onProgress(percentage);
        }
      },
    },
  );
  return response.data;
};

/**
 * Upload face photos (max 3) with progress callback and optional notes
 */
export const uploadFacePhotos = async (
  formData: FormData,
  onProgress?: UploadProgressCallback,
): Promise<UploadResponse> => {
  const response = await api.post<UploadResponse>(
    "/api/v1/upload/face-photos",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentage = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          onProgress(percentage);
        }
      },
    },
  );
  return response.data;
};

/**
 * Upload single file to any bucket
 * @param file - FormData with file, optional bucketType and folder
 */
export const uploadSingleFile = async (
  file: FormData,
  onProgress?: UploadProgressCallback,
): Promise<UploadResponse> => {
  const response = await api.post<UploadResponse>(
    "/api/v1/upload/single",
    file,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentage = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          onProgress(percentage);
        }
      },
    },
  );
  return response.data;
};

/**
 * Upload multiple files (max 10) to any bucket
 * @param files - FormData with files, optional bucketType and folder
 */
export const uploadMultipleFiles = async (
  files: FormData,
  onProgress?: UploadProgressCallback,
): Promise<UploadResponse> => {
  const response = await api.post<UploadResponse>(
    "/api/v1/upload/multiple",
    files,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentage = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          onProgress(percentage);
        }
      },
    },
  );
  return response.data;
};

/**
 * Upload user content with custom categorization
 * @param content - FormData with content file, optional category and description
 */
export const uploadUserContent = async (
  content: FormData,
  onProgress?: UploadProgressCallback,
): Promise<UploadResponse> => {
  const response = await api.post<UploadResponse>(
    "/api/v1/upload/user-content",
    content,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentage = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          onProgress(percentage);
        }
      },
    },
  );
  return response.data;
};
