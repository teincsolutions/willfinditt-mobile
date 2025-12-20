# File Upload API Documentation

## Overview

The File Upload API provides endpoints for uploading various types of files to different S3/MinIO buckets based on use case. All endpoints require JWT authentication.

**Base URL:** `/api/v1/upload`

**Authentication:** Bearer Token (JWT)

---

## Table of Contents

1. [Bucket Types](#bucket-types)
2. [General Endpoints](#general-endpoints)
   - [Upload Single File](#1-upload-single-file)
   - [Upload Multiple Files](#2-upload-multiple-files)
3. [Specialized Endpoints](#specialized-endpoints)
   - [Upload Avatar](#3-upload-avatar)
   - [Upload Ad Images](#4-upload-ad-images)
   - [Upload KYC Documents](#5-upload-kyc-documents)
   - [Upload Face Photos](#6-upload-face-photos)
   - [Upload User Content](#7-upload-user-content)
4. [Access Control](#access-control)
   - [Get Signed URL](#8-get-signed-url)
5. [Error Responses](#error-responses)
6. [Best Practices](#best-practices)

---

## Bucket Types

The API uses different buckets to organize files based on their purpose:

| Bucket Type        | Description              | Access Level | Use Case                               |
| ------------------ | ------------------------ | ------------ | -------------------------------------- |
| `PUBLIC_ASSETS`    | Public images and assets | Public       | Icons, logos, static images            |
| `ADS_MEDIA`        | Advertisement media      | Public       | Ad images, product photos              |
| `USER_CONTENT`     | User-generated content   | Private      | Profile images, user uploads           |
| `CHAT_ATTACHMENTS` | Chat file attachments    | Private      | Files sent in chats                    |
| `KYC_DOCUMENTS`    | Verification documents   | Private      | Identity documents, verification files |
| `ADMIN_FILES`      | Admin-only files         | Private      | Internal admin documents               |

> **Note:** The `LOGS` bucket is reserved for system use and cannot be used for uploads.

---

## General Endpoints

### 1. Upload Single File

Upload a single file to any specified bucket.

**Endpoint:** `POST /upload/single`

**Content-Type:** `multipart/form-data`

**Request Parameters:**

| Field        | Type   | Required | Description                               |
| ------------ | ------ | -------- | ----------------------------------------- |
| `file`       | File   | Yes      | The file to upload                        |
| `bucketType` | String | No       | Target bucket (default: `ADS_MEDIA`)      |
| `folder`     | String | No       | Folder within bucket (default: `general`) |

**Valid Bucket Types:**

- `PUBLIC_ASSETS`
- `ADS_MEDIA`
- `USER_CONTENT`
- `CHAT_ATTACHMENTS`
- `KYC_DOCUMENTS`
- `ADMIN_FILES`

**Request Example:**

```http
POST /api/v1/upload/single
Host: api.willfind8.com
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data

--boundary
Content-Disposition: form-data; name="file"; filename="example.jpg"
Content-Type: image/jpeg

[file binary data]
--boundary
Content-Disposition: form-data; name="bucketType"

USER_CONTENT
--boundary
Content-Disposition: form-data; name="folder"

avatars
--boundary--
```

**Success Response (201 Created):**

```json
{
  "url": "https://cdn.willfind8.com/willfind8-user-content/avatars/user-123/filename.jpg",
  "bucketType": "USER_CONTENT",
  "folder": "avatars",
  "message": "File uploaded successfully"
}
```

**Error Response (400 Bad Request):**

```json
{
  "statusCode": 400,
  "message": "No file provided",
  "error": "Bad Request"
}
```

---

### 2. Upload Multiple Files

Upload up to 10 files at once to the same bucket and folder.

**Endpoint:** `POST /upload/multiple`

**Content-Type:** `multipart/form-data`

**Request Parameters:**

| Field        | Type   | Required | Description                               |
| ------------ | ------ | -------- | ----------------------------------------- |
| `files`      | File[] | Yes      | Array of files (max 10)                   |
| `bucketType` | String | No       | Target bucket (default: `ADS_MEDIA`)      |
| `folder`     | String | No       | Folder within bucket (default: `general`) |

**Request Example:**

```http
POST /api/v1/upload/multiple
Host: api.willfind8.com
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data

--boundary
Content-Disposition: form-data; name="files"; filename="file1.jpg"
Content-Type: image/jpeg

[file1 binary data]
--boundary
Content-Disposition: form-data; name="files"; filename="file2.jpg"
Content-Type: image/jpeg

[file2 binary data]
--boundary
Content-Disposition: form-data; name="files"; filename="file3.jpg"
Content-Type: image/jpeg

[file3 binary data]
--boundary
Content-Disposition: form-data; name="bucketType"

ADS_MEDIA
--boundary
Content-Disposition: form-data; name="folder"

products
--boundary--
```

**Success Response (201 Created):**

```json
{
  "urls": [
    "https://cdn.willfind8.com/willfind8-ads-media/products/user-123/file1.jpg",
    "https://cdn.willfind8.com/willfind8-ads-media/products/user-123/file2.jpg",
    "https://cdn.willfind8.com/willfind8-ads-media/products/user-123/file3.jpg"
  ],
  "bucketType": "ADS_MEDIA",
  "folder": "products",
  "message": "3 files uploaded successfully"
}
```

**Error Response (400 Bad Request):**

```json
{
  "statusCode": 400,
  "message": "Maximum 10 files allowed",
  "error": "Bad Request"
}
```

---

## Specialized Endpoints

### 3. Upload Avatar

Upload a user avatar image. Automatically uploaded to `USER_CONTENT` bucket in the `avatars` folder.

**Endpoint:** `POST /upload/avatar`

**Content-Type:** `multipart/form-data`

**Request Parameters:**

| Field    | Type | Required | Description       |
| -------- | ---- | -------- | ----------------- |
| `avatar` | File | Yes      | Avatar image file |

**Supported Formats:** JPG, PNG, GIF, WebP

**Request Example:**

```http
POST /api/v1/upload/avatar
Host: api.willfind8.com
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data

--boundary
Content-Disposition: form-data; name="avatar"; filename="avatar.jpg"
Content-Type: image/jpeg

[file binary data]
--boundary--
```

**Success Response (201 Created):**

```json
{
  "url": "https://cdn.willfind8.com/willfind8-user-content/avatars/user-123/avatar-1234567890.jpg",
  "message": "Avatar uploaded successfully"
}
```

**Error Response (400 Bad Request):**

```json
{
  "statusCode": 400,
  "message": "Avatar must be an image file",
  "error": "Bad Request"
}
```

---

### 4. Upload Ad Images

Upload images for advertisements (max 5 images per upload). Automatically uploaded to `ADS_MEDIA` bucket.

**Endpoint:** `POST /upload/ad-images`

**Content-Type:** `multipart/form-data`

**Request Parameters:**

| Field    | Type   | Required | Description         |
| -------- | ------ | -------- | ------------------- |
| `images` | File[] | Yes      | Image files (max 5) |

**Supported Formats:** JPG, PNG, WebP

**Request Example:**

```http
POST /api/v1/upload/ad-images
Host: api.willfind8.com
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data

--boundary
Content-Disposition: form-data; name="images"; filename="image1.jpg"
Content-Type: image/jpeg

[file binary data]
--boundary
Content-Disposition: form-data; name="images"; filename="image2.jpg"
Content-Type: image/jpeg

[file binary data]
--boundary
Content-Disposition: form-data; name="images"; filename="image3.jpg"
Content-Type: image/jpeg

[file binary data]
--boundary--
```

**Success Response (201 Created):**

```json
{
  "urls": [
    "https://cdn.willfind8.com/willfind8-ads-media/ads/user-123/image1.jpg",
    "https://cdn.willfind8.com/willfind8-ads-media/ads/user-123/image2.jpg",
    "https://cdn.willfind8.com/willfind8-ads-media/ads/user-123/image3.jpg"
  ],
  "message": "3 ad images uploaded successfully"
}
```

**Error Response (400 Bad Request):**

```json
{
  "statusCode": 400,
  "message": "Maximum 5 images allowed per ad",
  "error": "Bad Request"
}
```

---

### 5. Upload KYC Documents

Upload KYC (Know Your Customer) documents for seller verification. Supports up to 5 documents per upload.

**Endpoint:** `POST /upload/kyc-documents`

**Content-Type:** `multipart/form-data`

**Request Parameters:**

| Field          | Type   | Required | Description                |
| -------------- | ------ | -------- | -------------------------- |
| `documents`    | File[] | Yes      | Document files (1-5 files) |
| `documentType` | String | Yes      | Type of documents          |
| `notes`        | String | No       | Additional notes           |

**Document Types:**

- `NATIONAL_ID` - National ID card
- `PASSPORT` - Passport
- `DRIVERS_LICENSE` - Driver's license
- `BUSINESS_REGISTRATION` - Business registration documents
- `TAX_CERTIFICATE` - Tax certificate
- `UTILITY_BILL` - Utility bill for address verification
- `OTHER` - Other supporting documents

**Supported Formats:** PDF, DOC, DOCX, JPG, PNG

**Request Example:**

```http
POST /api/v1/upload/kyc-documents
Host: api.willfind8.com
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data

--boundary
Content-Disposition: form-data; name="documents"; filename="id-front.jpg"
Content-Type: image/jpeg

[file binary data]
--boundary
Content-Disposition: form-data; name="documents"; filename="id-back.jpg"
Content-Type: image/jpeg

[file binary data]
--boundary
Content-Disposition: form-data; name="documentType"

NATIONAL_ID
--boundary
Content-Disposition: form-data; name="notes"

Front and back side of national ID
--boundary--
```

**Success Response (201 Created):**

```json
{
  "urls": [
    "https://cdn.willfind8.com/willfind8-kyc-documents/national_id/user-123/doc1.jpg",
    "https://cdn.willfind8.com/willfind8-kyc-documents/national_id/user-123/doc2.jpg"
  ],
  "documentType": "NATIONAL_ID",
  "notes": "Front and back side of national ID",
  "message": "2 KYC documents uploaded successfully"
}
```

**Error Response (400 Bad Request):**

```json
{
  "statusCode": 400,
  "message": "Invalid document type. Allowed: PDF, DOC, DOCX, JPG, PNG",
  "error": "Bad Request"
}
```

---

### 6. Upload Face Photos

Upload face photos for seller verification (max 3 photos).

**Endpoint:** `POST /upload/face-photos`

**Content-Type:** `multipart/form-data`

**Request Parameters:**

| Field    | Type   | Required | Description              |
| -------- | ------ | -------- | ------------------------ |
| `photos` | File[] | Yes      | Face photo files (max 3) |
| `notes`  | String | No       | Additional notes         |

**Supported Formats:** JPG, PNG

**Request Example:**

```http
POST /api/v1/upload/face-photos
Host: api.willfind8.com
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data

--boundary
Content-Disposition: form-data; name="photos"; filename="face1.jpg"
Content-Type: image/jpeg

[file binary data]
--boundary
Content-Disposition: form-data; name="photos"; filename="face2.jpg"
Content-Type: image/jpeg

[file binary data]
--boundary
Content-Disposition: form-data; name="notes"

Clear face photos for verification
--boundary--
```

**Success Response (201 Created):**

```json
{
  "urls": [
    "https://cdn.willfind8.com/willfind8-kyc-documents/face-photos/user-123/photo1.jpg",
    "https://cdn.willfind8.com/willfind8-kyc-documents/face-photos/user-123/photo2.jpg",
    "https://cdn.willfind8.com/willfind8-kyc-documents/face-photos/user-123/photo3.jpg"
  ],
  "notes": "Clear face photos for verification",
  "message": "3 face photos uploaded successfully"
}
```

**Error Response (400 Bad Request):**

```json
{
  "statusCode": 400,
  "message": "Maximum 3 face photos allowed",
  "error": "Bad Request"
}
```

---

### 7. Upload User Content

Upload general user-generated content with custom categorization.

**Endpoint:** `POST /upload/user-content`

**Content-Type:** `multipart/form-data`

**Request Parameters:**

| Field         | Type   | Required | Description                           |
| ------------- | ------ | -------- | ------------------------------------- |
| `content`     | File   | Yes      | User content file                     |
| `category`    | String | No       | Content category (default: `general`) |
| `description` | String | No       | Description of content                |

**Supported Formats:** All file types

**Request Example:**

```http
POST /api/v1/upload/user-content
Host: api.willfind8.com
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data

--boundary
Content-Disposition: form-data; name="content"; filename="background.jpg"
Content-Type: image/jpeg

[file binary data]
--boundary
Content-Disposition: form-data; name="category"

profile-images
--boundary
Content-Disposition: form-data; name="description"

User profile background image
--boundary--
```

**Success Response (201 Created):**

```json
{
  "url": "https://cdn.willfind8.com/willfind8-user-content/profile-images/user-123/content.jpg",
  "thumbnail": "https://cdn.willfind8.com/willfind8-user-content/profile-images/user-123/content-thumb.jpg",
  "category": "profile-images",
  "description": "User profile background image",
  "message": "User content uploaded successfully"
}
```

> **Note:** Thumbnails are automatically generated for image files.

---

## Access Control

### 8. Get Signed URL

Generate a time-limited signed URL to access private files.

**Endpoint:** `GET /upload/signed-url/:bucketType/*path`

**Query Parameters:**

| Parameter   | Type   | Required | Description                |
| ----------- | ------ | -------- | -------------------------- |
| `expiresIn` | Number | No       | Expiration time in seconds |

**Default Expiration Times:**

- `KYC_DOCUMENTS`: 300 seconds (5 minutes)
- `CHAT_ATTACHMENTS`: 3600 seconds (1 hour)
- `USER_CONTENT`: 3600 seconds (1 hour)
- `ADMIN_FILES`: 3600 seconds (1 hour)

**Request Example:**

```http
GET /api/v1/upload/signed-url/KYC_DOCUMENTS/face-photos,user-123,photo1.jpg?expiresIn=600
Host: api.willfind8.com
Authorization: Bearer YOUR_JWT_TOKEN
```

> **Note:** The path separator `/` is replaced with `,` in the URL. The API automatically converts it back.
>
> **Path Conversion Example:**
>
> - Original: `face-photos/user-123/photo1.jpg`
> - URL: `face-photos,user-123,photo1.jpg`

**Success Response (200 OK):**

```json
{
  "url": "https://minio.willfind8.com/willfind8-kyc-documents/face-photos/user-123/photo1.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=...",
  "expiresIn": 600,
  "bucketType": "KYC_DOCUMENTS",
  "key": "face-photos/user-123/photo1.jpg"
}
```

**Error Response (400 Bad Request):**

```json
{
  "statusCode": 400,
  "message": "File not found or access denied",
  "error": "Bad Request"
}
```

---

## Error Responses

### Common Error Codes

| Status Code | Error                  | Description                                          |
| ----------- | ---------------------- | ---------------------------------------------------- |
| 400         | Bad Request            | Invalid request, missing file, or invalid parameters |
| 401         | Unauthorized           | Missing or invalid JWT token                         |
| 403         | Forbidden              | Insufficient permissions for the bucket              |
| 413         | Payload Too Large      | File size exceeds limit                              |
| 415         | Unsupported Media Type | Invalid file type                                    |
| 500         | Internal Server Error  | Server error during upload                           |

### Error Response Format

```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request"
}
```

### Common Error Messages

**No file provided:**

```json
{
  "statusCode": 400,
  "message": "No file provided",
  "error": "Bad Request"
}
```

**Invalid bucket type:**

```json
{
  "statusCode": 400,
  "message": "Invalid bucket type. Allowed types: PUBLIC_ASSETS, ADS_MEDIA, USER_CONTENT, CHAT_ATTACHMENTS, KYC_DOCUMENTS, ADMIN_FILES",
  "error": "Bad Request"
}
```

**File too large:**

```json
{
  "statusCode": 413,
  "message": "File size exceeds maximum allowed",
  "error": "Payload Too Large"
}
```

**Invalid file type:**

```json
{
  "statusCode": 400,
  "message": "Invalid file type. Allowed: PDF, DOC, DOCX, JPG, PNG",
  "error": "Bad Request"
}
```

**Authentication required:**

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

---

## Best Practices

### 1. File Size Limits

- Keep files under 10MB for optimal performance
- For larger files, consider chunked uploads or compression

### 2. File Naming

- Files are automatically renamed with timestamps to prevent conflicts
- Original filenames are preserved but sanitized

### 3. Security

- Always use HTTPS for uploads
- Never expose JWT tokens in client-side code
- Use signed URLs for accessing private files

### 4. Error Handling

Always implement proper error handling based on status codes:

```
if status === 401:
  - Redirect to login or refresh token
else if status === 413:
  - Show "File too large" message
else if status === 400:
  - Check request parameters and file format
else:
  - Show generic error message
```

### 5. Progress Tracking

For better user experience, implement upload progress tracking:

```
Monitor upload progress events
Calculate percentage: (loaded / total) * 100
Update progress bar or percentage display
```

### 6. Bucket Selection Guide

| Content Type           | Recommended Bucket | Reason                     |
| ---------------------- | ------------------ | -------------------------- |
| Product images for ads | `ADS_MEDIA`        | Public, CDN-enabled        |
| User profile pictures  | `USER_CONTENT`     | Private, user-specific     |
| Chat attachments       | `CHAT_ATTACHMENTS` | Private, organized by chat |
| Identity documents     | `KYC_DOCUMENTS`    | Private, secure            |
| App icons, logos       | `PUBLIC_ASSETS`    | Public, static             |

### 7. Multipart Form Data Structure

When building multipart requests:

1. **Set proper headers:**
   - `Content-Type: multipart/form-data`
   - `Authorization: Bearer YOUR_TOKEN`

2. **Add files with field names:**
   - Single file: use field name from endpoint docs (e.g., `file`, `avatar`, `content`)
   - Multiple files: use array field name (e.g., `files`, `images`, `documents`, `photos`)

3. **Add optional parameters:**
   - Include `bucketType` for custom bucket selection
   - Include `folder` for custom folder organization
   - Include `documentType` for KYC documents
   - Include `notes` for additional information

---

## Rate Limits

- **Uploads per minute:** 30 requests
- **Uploads per hour:** 500 requests
- **Max file size:** 10 MB per file
- **Max files per request (multiple):** 10 files

Rate limit headers are included in responses:

```http
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 25
X-RateLimit-Reset: 1640000000
```

---

## Support

For additional support or questions:

- **Email:** support@teincsolutions.com
- **Documentation:** https://docs.willfind8.com
- **API Status:** https://status.willfind8.com

---

## Changelog

### v1.0.0 (Current)

- Initial release with all upload endpoints
- Support for 6 bucket types
- Signed URL generation
- Automatic thumbnail generation for images

---

**Last Updated:** December 20, 2025
