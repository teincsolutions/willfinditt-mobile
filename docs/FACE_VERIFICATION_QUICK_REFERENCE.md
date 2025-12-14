# Face Verification & Upload - Quick Reference

## 🚀 Quick Start

### 1. Import Components

```tsx
import FaceVerificationModal from "@/components/kyc/FaceVerificationModal";
import { useUploadFacePhotos } from "@/hooks/useUpload";
```

### 2. Add State

```tsx
const [showModal, setShowModal] = useState(false);
const [faceUrls, setFaceUrls] = useState<string[]>([]);
```

### 3. Use Modal

```tsx
<FaceVerificationModal
  visible={showModal}
  onClose={() => setShowModal(false)}
  onSuccess={(urls) => {
    setFaceUrls(urls);
    // Save to backend
  }}
/>
```

---

## 📦 All Upload Hooks

| Hook                    | Purpose           | Max Files |
| ----------------------- | ----------------- | --------- |
| `useUploadFacePhotos()` | Face verification | 3         |
| `useUploadAdImages()`   | Ad photos         | 5         |
| `useUploadAvatar()`     | User avatar       | 1         |
| `useUploadDocuments()`  | KYC documents     | 3         |
| `useGetSignedUrl()`     | S3 signed URLs    | N/A       |

---

## 🎯 Common Patterns

### Upload with Progress

```tsx
const { mutate, progress, isPending } = useUploadFacePhotos();

mutate(formData, {
  onSuccess: (res) => console.log(res.urls),
  onError: (err) => console.error(err),
});

// Show progress
<Text>{progress.percentage}%</Text>;
```

### Upload Multiple Images

```tsx
const formData = new FormData();
imageUris.forEach((uri, i) => {
  formData.append("images", {
    uri,
    type: "image/jpeg",
    name: `image-${i}.jpg`,
  } as any);
});
mutate(formData);
```

### Async/Await Pattern

```tsx
const uploadFaces = async (photos) => {
  try {
    const response = await mutateAsync(formData);
    return response.urls;
  } catch (error) {
    console.error(error);
  }
};
```

---

## 🎨 Modal Props

```tsx
<FaceVerificationModal
  visible={boolean}              // Required
  onClose={() => void}           // Required
  onSuccess={(urls) => void}     // Optional
  requireAllPoses={true}         // 3 poses vs 1
  countdownSeconds={3}           // Capture delay
  allowCameraSwitch={true}       // Camera toggle
/>
```

---

## ⚡ Examples

### Basic Face Verification

```tsx
function MyScreen() {
  const [show, setShow] = useState(false);

  return (
    <>
      <Button onPress={() => setShow(true)}>Verify</Button>
      <FaceVerificationModal
        visible={show}
        onClose={() => setShow(false)}
        onSuccess={(urls) => console.log(urls)}
      />
    </>
  );
}
```

### With Backend Integration

```tsx
const { mutate: updateKYC } = useUpdateKYC();

<FaceVerificationModal
  visible={show}
  onClose={() => setShow(false)}
  onSuccess={(urls) => {
    updateKYC({ facePhotoUrls: urls });
  }}
/>;
```

### Single Pose Only

```tsx
<FaceVerificationModal
  visible={show}
  onClose={() => setShow(false)}
  onSuccess={(urls) => console.log(urls)}
  requireAllPoses={false}
/>
```

---

## 🔧 Upload Hook Return Values

```tsx
const {
  mutate, // Trigger upload
  mutateAsync, // Async upload
  progress, // { percentage, loaded, total }
  isPending, // Upload in progress
  isSuccess, // Upload succeeded
  isError, // Upload failed
  error, // Error object
  data, // Response data
} = useUploadFacePhotos();
```

---

## 📊 Progress Object

```tsx
progress.percentage; // 0-100
progress.loaded; // Bytes uploaded
progress.total; // Total bytes
```

---

## ⚠️ Error Handling

```tsx
mutate(formData, {
  onError: (error: any) => {
    const message =
      error?.response?.data?.message || error?.message || "Upload failed";

    Alert.alert("Error", message);
  },
});
```

---

## 🎯 API Endpoints

| Endpoint                | Method | Body                  | Response             |
| ----------------------- | ------ | --------------------- | -------------------- |
| `/upload/face-photos`   | POST   | FormData(images)      | `{ urls: string[] }` |
| `/upload/ad-images`     | POST   | FormData(images)      | `{ urls: string[] }` |
| `/upload/avatar`        | POST   | FormData(avatar)      | `{ url: string }`    |
| `/upload/kyc-documents` | POST   | FormData(documents)   | `{ urls: string[] }` |
| `/signed-url`           | GET    | Query(url, expiresIn) | `{ url: string }`    |

---

## 📁 File Structure

```
hooks/
  useUpload.ts              → All upload hooks

components/kyc/
  FaceVerificationModal.tsx → Face verification modal
  FaceAutoCapture.tsx       → Camera capture component

services/
  uploadService.ts          → Upload API functions

docs/
  FACE_VERIFICATION_MODAL_AND_UPLOAD_HOOKS.md → Full docs
  FACE_VERIFICATION_IMPLEMENTATION_SUMMARY.md → Summary
```

---

## ✅ Testing Checklist

- [ ] Modal opens/closes
- [ ] 3 poses captured
- [ ] Upload shows progress
- [ ] Success callback fires
- [ ] Error handling works
- [ ] Close confirmation works
- [ ] Prevent close during upload

---

## 💡 Pro Tips

1. **Always show progress** - Better UX
2. **Compress images** - Faster uploads
3. **Validate files first** - Save bandwidth
4. **Handle errors gracefully** - Retry options
5. **Use async/await** - Sequential uploads

---

## 🔗 Related Docs

- [Full Documentation](./FACE_VERIFICATION_MODAL_AND_UPLOAD_HOOKS.md)
- [Implementation Summary](./FACE_VERIFICATION_IMPLEMENTATION_SUMMARY.md)
- [Multi-Pose Face Capture](./MULTI_POSE_FACE_CAPTURE.md)

---

**Need help? Check the full documentation! 📚**
