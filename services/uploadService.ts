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
  // TODO: Implement convertS3UrlToSignedRequest utility
  // const path = convertS3UrlToSignedRequest(url);
  const path = `/api/v1/signed-url?url=${encodeURIComponent(url)}`;
  const signedUrl = await api.get<SignedUrlResponse>(path, {
    params: {
      expiresIn,
    },
  });
  return signedUrl.data.url;
};

/**
 * Upload single file with bucket type
 */
export const uploadSingle = async (
  file: FormData,
  bucketType: string = "PUBLIC_ASSETS",
  onProgress?: UploadProgressCallback
): Promise<UploadResponse> => {
  file.append("bucketType", bucketType);
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
 * Upload multiple files (max 10) with bucket type
 */
export const uploadMultiple = async (
  files: FormData,
  bucketType: string = "PUBLIC_ASSETS",
  onProgress?: UploadProgressCallback
): Promise<UploadResponse> => {
  files.append("bucketType", bucketType);
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

/**
 * Helper function to upload a single image (alias for uploadSingle)
 */
export const uploadImage = async (
  imageUri: string,
  onProgress?: UploadProgressCallback
): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("file", {
    uri: imageUri,
    type: "image/jpeg",
    name: `image_${Date.now()}.jpg`,
  } as any);

  return uploadSingle(formData, "PUBLIC_ASSETS", onProgress);
};
