import { convertS3UrlToSignedRequest } from "@/lib/convertS3UrlsToSignedRequest";
import { AxiosProgressEvent } from "axios";
import api from "./api";

export interface UploadResponse {
  urls?: string[];
  url?: string;
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
  expiresIn: number = 259200
): Promise<string> => {
  const requestUrl = convertS3UrlToSignedRequest(url);
  const path = `/api/v1/signed-url?url=${encodeURIComponent(requestUrl)}`;
  const signedUrl = await api.get<SignedUrlResponse>(path, {
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
  onProgress?: UploadProgressCallback
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
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentage);
        }
      },
    }
  );
  return response.data;
};

/**
 * Upload user avatar
 */
export const uploadAvatar = async (
  avatar: FormData,
  onProgress?: UploadProgressCallback
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
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentage);
        }
      },
    }
  );
  return response.data;
};

/**
 * Upload documents (max 3) with progress callback
 */
export const uploadDocuments = async (
  documents: FormData,
  onProgress?: UploadProgressCallback
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
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentage);
        }
      },
    }
  );
  return response.data;
};

/**
 * Upload face photos with progress callback
 */
export const uploadFacePhotos = async (
  images: FormData,
  onProgress?: UploadProgressCallback
): Promise<UploadResponse> => {
  const response = await api.post<UploadResponse>(
    "/api/v1/upload/face-photos",
    images,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentage = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentage);
        }
      },
    }
  );
  return response.data;
};
