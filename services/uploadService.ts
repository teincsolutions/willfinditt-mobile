/**
 * Upload Service
 *
 * TODO: Add implementation once API endpoints are provided
 *
 * Expected endpoints:
 * - POST /api/upload/image - Upload single image
 * - POST /api/upload/images - Upload multiple images
 * - DELETE /api/upload/image/:id - Delete uploaded image
 */

export interface UploadResponse {
  id: string;
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

/**
 * Upload a single image with progress tracking
 * @param imageUri - Local URI of the image to upload
 * @param onProgress - Callback function to track upload progress (0-100)
 * @returns Promise with upload response
 */
export const uploadImage = async (
  imageUri: string,
  onProgress?: (progress: number) => void
): Promise<UploadResponse> => {
  // TODO: Implement after receiving API endpoint details

  // Example implementation structure:
  // const formData = new FormData();
  // formData.append('file', {
  //   uri: imageUri,
  //   type: 'image/jpeg',
  //   name: 'upload.jpg',
  // } as any);

  // const response = await axios.post('/api/upload/image', formData, {
  //   headers: {
  //     'Content-Type': 'multipart/form-data',
  //   },
  //   onUploadProgress: (progressEvent: AxiosProgressEvent) => {
  //     if (progressEvent.total) {
  //       const percentCompleted = Math.round(
  //         (progressEvent.loaded * 100) / progressEvent.total
  //       );
  //       onProgress?.(percentCompleted);
  //     }
  //   },
  // });

  // return response.data;

  throw new Error("Upload endpoint not implemented yet");
};

/**
 * Upload multiple images with individual progress tracking
 * @param images - Array of image URIs to upload
 * @param onProgress - Callback for each image's progress
 * @returns Promise with array of upload responses
 */
export const uploadImages = async (
  images: string[],
  onProgress?: (imageUri: string, progress: number) => void
): Promise<UploadResponse[]> => {
  // TODO: Implement after receiving API endpoint details

  // Example implementation:
  // const uploadPromises = images.map(async (imageUri) => {
  //   return uploadImage(imageUri, (progress) => {
  //     onProgress?.(imageUri, progress);
  //   });
  // });

  // return Promise.all(uploadPromises);

  throw new Error("Upload endpoint not implemented yet");
};

/**
 * Delete an uploaded image
 * @param imageId - ID of the image to delete
 * @returns Promise<void>
 */
export const deleteUploadedImage = async (imageId: string): Promise<void> => {
  // TODO: Implement after receiving API endpoint details

  // Example implementation:
  // await axios.delete(`/api/upload/image/${imageId}`);

  throw new Error("Delete endpoint not implemented yet");
};
