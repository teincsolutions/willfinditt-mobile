# Face Verification Modal & Upload Hooks Documentation

## Overview

This documentation covers two new implementations:

1. **FaceVerificationModal** - Full-screen modal for face verification with upload
2. **useUpload hooks** - React Query hooks for all upload operations

---

## 1. FaceVerificationModal Component

### Purpose

A complete face verification flow that:

- Captures face photos using `FaceAutoCapture`
- Uploads captured photos to backend
- Shows upload progress
- Handles success/error states

### Location

`/components/kyc/FaceVerificationModal.tsx`

### Features

✅ Full-screen modal presentation  
✅ Multi-pose face capture (CENTER, LEFT, RIGHT)  
✅ Automatic upload after capture  
✅ Real-time upload progress indicator  
✅ Error handling with retry option  
✅ Confirmation dialogs for closing  
✅ Success callback with uploaded URLs

### Props

| Prop                | Type                       | Default      | Description                             |
| ------------------- | -------------------------- | ------------ | --------------------------------------- |
| `visible`           | `boolean`                  | **required** | Controls modal visibility               |
| `onClose`           | `() => void`               | **required** | Called when modal should close          |
| `onSuccess`         | `(urls: string[]) => void` | optional     | Called with uploaded URLs after success |
| `requireAllPoses`   | `boolean`                  | `true`       | Whether to capture all 3 poses          |
| `countdownSeconds`  | `number`                   | `3`          | Countdown duration before capture       |
| `allowCameraSwitch` | `boolean`                  | `true`       | Allow front/back camera switching       |

### Usage Examples

#### Basic Usage

```tsx
import FaceVerificationModal from "@/components/kyc/FaceVerificationModal";

function MyScreen() {
  const [showModal, setShowModal] = useState(false);

  const handleSuccess = (urls: string[]) => {
    console.log("Uploaded face photos:", urls);
    // Save URLs to your state/backend
  };

  return (
    <>
      <Button onPress={() => setShowModal(true)}>
        Start Face Verification
      </Button>

      <FaceVerificationModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
```

#### Single Pose Capture

```tsx
<FaceVerificationModal
  visible={showModal}
  onClose={() => setShowModal(false)}
  onSuccess={handleSuccess}
  requireAllPoses={false} // Only capture front face
/>
```

#### Custom Countdown

```tsx
<FaceVerificationModal
  visible={showModal}
  onClose={() => setShowModal(false)}
  onSuccess={handleSuccess}
  countdownSeconds={5} // 5 second countdown
/>
```

#### KYC Verification Flow

```tsx
import { useUpdateSellerVerification } from "@/hooks/useUser";

function KYCScreen() {
  const [showFaceModal, setShowFaceModal] = useState(false);
  const { mutate: updateVerification } = useUpdateSellerVerification();

  const handleFacePhotosUploaded = (urls: string[]) => {
    // Update seller verification with face photo URLs
    updateVerification(
      {
        facePhotoUrls: urls,
        status: "PENDING",
      },
      {
        onSuccess: () => {
          toast.success("Verification submitted successfully!");
          router.push("/account");
        },
      }
    );
  };

  return (
    <View>
      <Button onPress={() => setShowFaceModal(true)}>
        Upload Face Verification
      </Button>

      <FaceVerificationModal
        visible={showFaceModal}
        onClose={() => setShowFaceModal(false)}
        onSuccess={handleFacePhotosUploaded}
      />
    </View>
  );
}
```

### Flow Diagram

```
┌─────────────────────────────────────────┐
│  Modal Opens                            │
│  - Shows header with instructions       │
│  - Initializes FaceAutoCapture          │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  User Captures Photos                   │
│  - CENTER pose                          │
│  - LEFT pose                            │
│  - RIGHT pose                           │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Upload Process Starts                  │
│  - Convert photos to FormData           │
│  - Show upload overlay                  │
│  - Display progress percentage          │
└──────────────┬──────────────────────────┘
               │
         ┌─────┴─────┐
         │           │
         ▼           ▼
    ┌────────┐  ┌────────┐
    │SUCCESS │  │ ERROR  │
    └────┬───┘  └───┬────┘
         │          │
         │          ▼
         │     ┌──────────────┐
         │     │ Show Alert   │
         │     │ - Retry?     │
         │     │ - Cancel?    │
         │     └──────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  Success Callback                       │
│  - onSuccess(urls) called               │
│  - Toast notification shown             │
│  - Modal closes after 500ms             │
└─────────────────────────────────────────┘
```

### User Experience

1. **Opening Modal**: User sees header with clear instructions
2. **Capturing Photos**: FaceAutoCapture guides through 3 poses
3. **Upload Phase**:
   - Overlay appears with "Uploading Photos..." message
   - Progress bar shows percentage complete
   - Close button disabled during upload
4. **Success**: Toast notification + callback + modal auto-closes
5. **Error**: Alert with Retry/Cancel options

### Error Handling

#### Upload Failure

- Shows alert with error message
- Provides "Retry" option (resets to capture phase)
- Provides "Cancel" option (closes modal)

#### User Closes During Upload

- Prevents closing with alert
- Message: "Please wait while we upload your photos"

#### User Closes After Capture

- Confirmation alert
- Message: "Your captured photos will be lost"
- Options: Cancel or Discard

---

## 2. useUpload Hooks

### Purpose

React Query hooks for all upload operations with progress tracking.

### Location

`/hooks/useUpload.ts`

### Available Hooks

#### 1. useUploadAdImages

Upload ad images (max 5) to ADS_MEDIA bucket.

```tsx
const { mutate, mutateAsync, progress, isPending, isError, isSuccess } =
  useUploadAdImages();

// Usage
const formData = new FormData();
formData.append("images", {
  uri: imageUri,
  type: "image/jpeg",
  name: "ad-photo.jpg",
} as any);

mutate(formData, {
  onSuccess: (response) => {
    console.log("Uploaded URLs:", response.urls);
  },
  onError: (error) => {
    console.error("Upload failed:", error);
  },
});

// Access progress
console.log(`Upload progress: ${progress.percentage}%`);
```

#### 2. useUploadAvatar

Upload user avatar image.

```tsx
const { mutateAsync, progress } = useUploadAvatar();

const uploadAvatar = async (imageUri: string) => {
  const formData = new FormData();
  formData.append("avatar", {
    uri: imageUri,
    type: "image/jpeg",
    name: "avatar.jpg",
  } as any);

  const response = await mutateAsync(formData);
  return response.url; // Single URL
};
```

#### 3. useUploadDocuments

Upload KYC documents (max 3).

```tsx
const { mutate, progress } = useUploadDocuments();

const formData = new FormData();
documentUris.forEach((uri, index) => {
  formData.append("documents", {
    uri,
    type: "application/pdf",
    name: `document-${index}.pdf`,
  } as any);
});

mutate(formData);
```

#### 4. useUploadFacePhotos

Upload face verification photos for KYC.

```tsx
const { mutateAsync, progress } = useUploadFacePhotos();

const uploadFaces = async (photos: CapturedPhoto[]) => {
  const formData = new FormData();

  photos.forEach((photo) => {
    formData.append("images", {
      uri: photo.uri,
      type: "image/jpeg",
      name: `face-${photo.pose.toLowerCase()}.jpg`,
    } as any);
  });

  const response = await mutateAsync(formData);
  return response.urls; // Array of URLs
};
```

#### 5. useGetSignedUrl

Get temporary signed URL for S3 object.

```tsx
const { mutateAsync } = useGetSignedUrl();

const signedUrl = await mutateAsync({
  url: "s3://bucket/key/image.jpg",
  expiresIn: 3600, // 1 hour (optional, default: 3 days)
});

console.log("Signed URL:", signedUrl);
```

### Progress Tracking

All upload hooks provide `progress` object:

```tsx
interface UploadProgress {
  percentage: number; // 0-100
  loaded: number; // Bytes uploaded
  total: number; // Total bytes
}
```

Example progress UI:

```tsx
const { mutate, progress } = useUploadAdImages();

return (
  <View>
    <ProgressBar value={progress.percentage} />
    <Text>{progress.percentage}%</Text>
    <Text>
      {progress.loaded} / {progress.total} bytes
    </Text>
  </View>
);
```

### Complete Upload Example with Progress

```tsx
import { useUploadAdImages } from "@/hooks/useUpload";
import { useState } from "react";

function UploadScreen() {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const { mutate, progress, isPending } = useUploadAdImages();

  const handleUpload = () => {
    const formData = new FormData();

    selectedImages.forEach((uri, index) => {
      formData.append("images", {
        uri,
        type: "image/jpeg",
        name: `image-${index}.jpg`,
      } as any);
    });

    mutate(formData, {
      onSuccess: (response) => {
        console.log("Upload complete:", response.urls);
        toast.success(`Uploaded ${response.urls?.length} images`);
      },
      onError: (error) => {
        toast.error("Upload failed: " + error.message);
      },
    });
  };

  return (
    <View>
      {/* Image picker UI */}

      <Button onPress={handleUpload} disabled={isPending}>
        {isPending ? "Uploading..." : "Upload Images"}
      </Button>

      {isPending && (
        <View>
          <ProgressBar progress={progress.percentage / 100} />
          <Text>{progress.percentage}% complete</Text>
        </View>
      )}
    </View>
  );
}
```

---

## Integration Examples

### Complete KYC Flow with All Uploads

```tsx
import { useUploadDocuments, useUploadFacePhotos } from "@/hooks/useUpload";
import FaceVerificationModal from "@/components/kyc/FaceVerificationModal";

function KYCVerificationScreen() {
  const [step, setStep] = useState<"documents" | "face">("documents");
  const [documentUrls, setDocumentUrls] = useState<string[]>([]);
  const [faceUrls, setFaceUrls] = useState<string[]>([]);
  const [showFaceModal, setShowFaceModal] = useState(false);

  const { mutateAsync: uploadDocs, progress: docsProgress } =
    useUploadDocuments();

  const handleDocumentsSubmit = async (selectedDocs: string[]) => {
    const formData = new FormData();
    selectedDocs.forEach((uri, index) => {
      formData.append("documents", {
        uri,
        type: "application/pdf",
        name: `document-${index}.pdf`,
      } as any);
    });

    const response = await uploadDocs(formData);
    setDocumentUrls(response.urls || []);
    setStep("face");
  };

  const handleFacePhotosSubmit = (urls: string[]) => {
    setFaceUrls(urls);
    // Submit verification to backend
    submitVerification({
      documentUrls,
      faceUrls: urls,
    });
  };

  return (
    <View>
      {step === "documents" && (
        <View>
          <Text>Upload Documents</Text>
          {/* Document picker UI */}
          <ProgressBar progress={docsProgress.percentage / 100} />
        </View>
      )}

      {step === "face" && (
        <View>
          <Button onPress={() => setShowFaceModal(true)}>
            Capture Face Photos
          </Button>

          <FaceVerificationModal
            visible={showFaceModal}
            onClose={() => setShowFaceModal(false)}
            onSuccess={handleFacePhotosSubmit}
          />
        </View>
      )}
    </View>
  );
}
```

---

## API Endpoints Reference

### Face Photos Upload

```
POST /api/v1/upload/face-photos
Content-Type: multipart/form-data

Body:
- images: File[] (jpeg images)

Response:
{
  urls: string[],
  message: string
}
```

### Ad Images Upload

```
POST /api/v1/upload/ad-images
Content-Type: multipart/form-data

Body:
- images: File[] (max 5)

Response:
{
  urls: string[],
  message: string
}
```

### Avatar Upload

```
POST /api/v1/upload/avatar
Content-Type: multipart/form-data

Body:
- avatar: File

Response:
{
  url: string,
  message: string
}
```

### Documents Upload

```
POST /api/v1/upload/kyc-documents
Content-Type: multipart/form-data

Body:
- documents: File[] (max 3)

Response:
{
  urls: string[],
  message: string
}
```

### Signed URL

```
GET /api/v1/signed-url?url={s3Url}&expiresIn={seconds}

Response:
{
  url: string,
  expiresIn: number,
  bucketType: string,
  key: string
}
```

---

## Best Practices

### 1. Error Handling

Always handle upload errors gracefully:

```tsx
mutate(formData, {
  onError: (error: any) => {
    const message =
      error?.response?.data?.message || error?.message || "Upload failed";
    toast.error(message);
  },
});
```

### 2. Progress Feedback

Show progress for better UX:

```tsx
{
  isPending && (
    <View>
      <ActivityIndicator />
      <Text>{progress.percentage}% uploaded</Text>
    </View>
  );
}
```

### 3. File Validation

Validate files before upload:

```tsx
const validateImages = (uris: string[]) => {
  if (uris.length > 5) {
    throw new Error("Maximum 5 images allowed");
  }
  // Check file sizes, types, etc.
};
```

### 4. Async/Await Pattern

Use async/await for sequential uploads:

```tsx
const uploadAllFiles = async () => {
  const docs = await uploadDocuments(docFormData);
  const faces = await uploadFacePhotos(faceFormData);
  return { docs, faces };
};
```

---

## Testing Checklist

### FaceVerificationModal

- [ ] Modal opens/closes correctly
- [ ] All 3 poses captured successfully
- [ ] Upload progress displays correctly
- [ ] Success callback receives URLs
- [ ] Error handling shows alerts
- [ ] Close confirmation works
- [ ] Upload blocking prevents premature close

### Upload Hooks

- [ ] Progress tracking updates
- [ ] Success callbacks fire
- [ ] Error callbacks fire
- [ ] Multiple files upload
- [ ] Large file handling
- [ ] Network error handling

---

## Troubleshooting

### Issue: "No URLs returned from upload"

**Solution**: Check backend response format matches `UploadResponse` interface.

### Issue: Progress stays at 0%

**Solution**: Ensure backend supports upload progress events.

### Issue: FormData not working

**Solution**: Verify file object structure matches React Native requirements:

```tsx
{
  uri: string,
  type: string,
  name: string
}
```

### Issue: Upload timeout

**Solution**: Increase axios timeout in api.ts or compress images before upload.

---

## Future Enhancements

1. **Image Compression**: Add automatic image compression before upload
2. **Retry Logic**: Implement automatic retry on network errors
3. **Offline Queue**: Queue uploads when offline, retry when online
4. **Batch Uploads**: Support uploading multiple sets of photos
5. **Preview Mode**: Show captured photos before uploading
6. **Edit Photos**: Allow cropping/rotating before upload

---

## Related Documentation

- [FaceAutoCapture Component](./MULTI_POSE_FACE_CAPTURE.md)
- [KYC Verification Flow](../API_ENDPOINTS_USER_MANAGEMENT.md)
- [Upload Service](../services/uploadService.ts)
- [React Query Docs](https://tanstack.com/query/latest)
