# Seller Module API Documentation

Complete API documentation for the Seller ecosystem including Seller Profiles, Seller Reviews, and Seller Verification.

---

## Table of Contents

1. [Seller Profiles API](#seller-profiles-api)
2. [Seller Reviews API](#seller-reviews-api)
3. [Seller Verification API](#seller-verification-api)
4. [Authentication Requirements](#authentication-requirements)
5. [Response Formats](#response-formats)
6. [Error Handling](#error-handling)

---

## Seller Profiles API

Base URL: `/api/v1/sellers`

### 1. Create Seller Profile

Creates a new seller profile for the authenticated user.

**Endpoint:** `POST /api/v1/sellers`

**Authentication:** Required (JWT Bearer Token)

**Request Body:**

```json
{
  "businessName": "Tech Solutions Ltd",
  "businessType": "Technology",
  "description": "We provide cutting-edge tech solutions",
  "website": "https://techsolutions.com",
  "socialMedia": {
    "facebook": "https://facebook.com/techsolutions",
    "twitter": "@techsolutions",
    "instagram": "techsolutions"
  }
}
```

**Request Body Schema:**

| Field        | Type         | Required | Description               |
| ------------ | ------------ | -------- | ------------------------- |
| businessName | string       | No       | Name of the business      |
| businessType | string       | No       | Type/category of business |
| description  | string       | No       | Business description      |
| website      | string (URL) | No       | Business website URL      |
| socialMedia  | object       | No       | Social media links        |

**Response (201 Created):**

```json
{
  "id": "cm1abc123",
  "userId": "cm1user456",
  "businessName": "Tech Solutions Ltd",
  "businessType": "Technology",
  "description": "We provide cutting-edge tech solutions",
  "website": "https://techsolutions.com",
  "socialMedia": {
    "facebook": "https://facebook.com/techsolutions",
    "twitter": "@techsolutions",
    "instagram": "techsolutions"
  },
  "rating": 0,
  "totalReviews": 0,
  "verified": false,
  "createdAt": "2025-12-07T10:00:00.000Z",
  "updatedAt": "2025-12-07T10:00:00.000Z",
  "user": {
    "id": "cm1user456",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "avatar": "https://example.com/avatar.jpg"
  }
}
```

**Error Responses:**

- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Missing or invalid JWT token
- `409 Conflict` - Seller profile already exists for this user

---

### 2. Get All Sellers

Retrieves a paginated list of all seller profiles with filtering and sorting.

**Endpoint:** `GET /api/v1/sellers`

**Authentication:** Not required

**Query Parameters:**

| Parameter | Type   | Default   | Description                            |
| --------- | ------ | --------- | -------------------------------------- |
| page      | number | 1         | Page number                            |
| limit     | number | 20        | Items per page (max 100)               |
| search    | string | -         | Search in business name or description |
| sortBy    | string | createdAt | Field to sort by                       |
| sortOrder | enum   | desc      | Sort order: 'asc' or 'desc'            |

**Example Request:**

```
GET /api/v1/sellers?page=1&limit=20&search=tech&sortBy=rating&sortOrder=desc
```

**Response (200 OK):**

```json
{
  "data": [
    {
      "id": "cm1abc123",
      "businessName": "Tech Solutions Ltd",
      "businessType": "Technology",
      "description": "We provide cutting-edge tech solutions",
      "website": "https://techsolutions.com",
      "rating": 4.8,
      "totalReviews": 150,
      "verified": true,
      "createdAt": "2025-12-07T10:00:00.000Z",
      "user": {
        "id": "cm1user456",
        "username": "johndoe",
        "firstName": "John",
        "lastName": "Doe",
        "avatar": "https://example.com/avatar.jpg"
      }
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

---

### 3. Get My Seller Profile

Retrieves the seller profile for the currently authenticated user.

**Endpoint:** `GET /api/v1/sellers/my-profile`

**Authentication:** Required (JWT Bearer Token)

**Response (200 OK):**

```json
{
  "id": "cm1abc123",
  "userId": "cm1user456",
  "businessName": "Tech Solutions Ltd",
  "businessType": "Technology",
  "description": "We provide cutting-edge tech solutions",
  "website": "https://techsolutions.com",
  "socialMedia": {
    "facebook": "https://facebook.com/techsolutions"
  },
  "rating": 4.8,
  "totalReviews": 150,
  "verified": true,
  "createdAt": "2025-12-07T10:00:00.000Z",
  "updatedAt": "2025-12-07T10:00:00.000Z",
  "user": {
    "id": "cm1user456",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "avatar": "https://example.com/avatar.jpg"
  }
}
```

**Error Responses:**

- `401 Unauthorized` - Missing or invalid JWT token
- `404 Not Found` - Seller profile not found for this user

---

### 4. Get Seller by ID

Retrieves a specific seller profile by ID.

**Endpoint:** `GET /api/v1/sellers/:id`

**Authentication:** Not required

**Path Parameters:**

| Parameter | Type   | Description       |
| --------- | ------ | ----------------- |
| id        | string | Seller profile ID |

**Example Request:**

```
GET /api/v1/sellers/cm1abc123
```

**Response (200 OK):**

```json
{
  "id": "cm1abc123",
  "businessName": "Tech Solutions Ltd",
  "businessType": "Technology",
  "description": "We provide cutting-edge tech solutions",
  "website": "https://techsolutions.com",
  "socialMedia": {
    "facebook": "https://facebook.com/techsolutions"
  },
  "rating": 4.8,
  "totalReviews": 150,
  "verified": true,
  "createdAt": "2025-12-07T10:00:00.000Z",
  "updatedAt": "2025-12-07T10:00:00.000Z",
  "user": {
    "id": "cm1user456",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "https://example.com/avatar.jpg"
  }
}
```

**Error Responses:**

- `404 Not Found` - Seller profile not found

---

### 5. Get Seller Statistics

Retrieves detailed statistics for a specific seller.

**Endpoint:** `GET /api/v1/sellers/:id/stats`

**Authentication:** Not required

**Path Parameters:**

| Parameter | Type   | Description       |
| --------- | ------ | ----------------- |
| id        | string | Seller profile ID |

**Response (200 OK):**

```json
{
  "sellerId": "cm1abc123",
  "totalAds": 45,
  "activeAds": 32,
  "soldAds": 89,
  "totalViews": 15420,
  "totalSaves": 892,
  "averageRating": 4.8,
  "totalReviews": 150,
  "ratingDistribution": {
    "5": 120,
    "4": 25,
    "3": 3,
    "2": 1,
    "1": 1
  },
  "responseRate": 95.5,
  "averageResponseTime": "2 hours",
  "memberSince": "2025-01-15T10:00:00.000Z",
  "lastActive": "2025-12-07T09:30:00.000Z"
}
```

**Error Responses:**

- `404 Not Found` - Seller profile not found

---

### 6. Update Seller Profile

Updates the seller profile information.

**Endpoint:** `PATCH /api/v1/sellers/:id`

**Authentication:** Required (JWT Bearer Token)

**Path Parameters:**

| Parameter | Type   | Description       |
| --------- | ------ | ----------------- |
| id        | string | Seller profile ID |

**Request Body:**

```json
{
  "businessName": "Tech Solutions International",
  "description": "Updated description",
  "website": "https://newsiteurl.com",
  "socialMedia": {
    "facebook": "https://facebook.com/newpage"
  }
}
```

**Request Body Schema:**

All fields are optional. Only include fields you want to update.

| Field        | Type         | Description               |
| ------------ | ------------ | ------------------------- |
| businessName | string       | Name of the business      |
| businessType | string       | Type/category of business |
| description  | string       | Business description      |
| website      | string (URL) | Business website URL      |
| socialMedia  | object       | Social media links        |

**Response (200 OK):**

```json
{
  "id": "cm1abc123",
  "userId": "cm1user456",
  "businessName": "Tech Solutions International",
  "businessType": "Technology",
  "description": "Updated description",
  "website": "https://newsiteurl.com",
  "socialMedia": {
    "facebook": "https://facebook.com/newpage"
  },
  "rating": 4.8,
  "totalReviews": 150,
  "verified": true,
  "createdAt": "2025-12-07T10:00:00.000Z",
  "updatedAt": "2025-12-07T15:30:00.000Z"
}
```

**Error Responses:**

- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Missing or invalid JWT token
- `403 Forbidden` - Not authorized to update this seller profile
- `404 Not Found` - Seller profile not found

---

### 7. Delete Seller Profile

Deletes a seller profile.

**Endpoint:** `DELETE /api/v1/sellers/:id`

**Authentication:** Required (JWT Bearer Token)

**Path Parameters:**

| Parameter | Type   | Description       |
| --------- | ------ | ----------------- |
| id        | string | Seller profile ID |

**Response (200 OK):**

```json
{
  "message": "Seller profile deleted successfully",
  "deletedId": "cm1abc123"
}
```

**Error Responses:**

- `401 Unauthorized` - Missing or invalid JWT token
- `403 Forbidden` - Not authorized to delete this seller profile
- `404 Not Found` - Seller profile not found

---

## Seller Reviews API

Base URL: `/api/v1/seller-reviews`

### 1. Create Seller Review

Creates a new review for a seller. Users can only create one review per seller.

**Endpoint:** `POST /api/v1/seller-reviews`

**Authentication:** Required (JWT Bearer Token)

**Request Body:**

```json
{
  "sellerId": "cm1seller123",
  "rating": 5,
  "comment": "Excellent seller, fast delivery and great communication!"
}
```

**Request Body Schema:**

| Field    | Type    | Required | Description                     |
| -------- | ------- | -------- | ------------------------------- |
| sellerId | string  | Yes      | ID of the seller being reviewed |
| rating   | integer | Yes      | Rating from 1-5                 |
| comment  | string  | No       | Review comment/text             |

**Response (201 Created):**

```json
{
  "id": "cm1review789",
  "sellerId": "cm1seller123",
  "reviewerId": "cm1user456",
  "rating": 5,
  "comment": "Excellent seller, fast delivery and great communication!",
  "createdAt": "2025-12-07T14:00:00.000Z",
  "updatedAt": "2025-12-07T14:00:00.000Z",
  "reviewer": {
    "id": "cm1user456",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "https://example.com/avatar.jpg"
  },
  "seller": {
    "id": "cm1seller123",
    "businessName": "Tech Solutions Ltd"
  }
}
```

**Error Responses:**

- `400 Bad Request` - Invalid input data (rating must be 1-5)
- `401 Unauthorized` - Missing or invalid JWT token
- `403 Forbidden` - Already reviewed this seller
- `404 Not Found` - Seller not found

---

### 2. Get All Reviews

Retrieves a paginated list of all seller reviews with filtering.

**Endpoint:** `GET /api/v1/seller-reviews`

**Authentication:** Required (JWT Bearer Token)

**Query Parameters:**

| Parameter  | Type   | Default | Description           |
| ---------- | ------ | ------- | --------------------- |
| page       | number | 1       | Page number           |
| limit      | number | 20      | Items per page        |
| sellerId   | string | -       | Filter by seller ID   |
| reviewerId | string | -       | Filter by reviewer ID |

**Example Request:**

```
GET /api/v1/seller-reviews?page=1&limit=20&sellerId=cm1seller123
```

**Response (200 OK):**

```json
{
  "data": [
    {
      "id": "cm1review789",
      "sellerId": "cm1seller123",
      "reviewerId": "cm1user456",
      "rating": 5,
      "comment": "Excellent seller!",
      "createdAt": "2025-12-07T14:00:00.000Z",
      "reviewer": {
        "id": "cm1user456",
        "username": "johndoe",
        "firstName": "John",
        "lastName": "Doe",
        "avatar": "https://example.com/avatar.jpg"
      }
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

---

### 3. Get Reviews for a Seller

Retrieves all reviews for a specific seller.

**Endpoint:** `GET /api/v1/seller-reviews/seller/:sellerId`

**Authentication:** Required (JWT Bearer Token)

**Path Parameters:**

| Parameter | Type   | Description       |
| --------- | ------ | ----------------- |
| sellerId  | string | Seller profile ID |

**Query Parameters:**

| Parameter | Type   | Default | Description    |
| --------- | ------ | ------- | -------------- |
| page      | number | 1       | Page number    |
| limit     | number | 20      | Items per page |

**Response (200 OK):**

```json
{
  "data": [
    {
      "id": "cm1review789",
      "rating": 5,
      "comment": "Excellent seller!",
      "createdAt": "2025-12-07T14:00:00.000Z",
      "reviewer": {
        "id": "cm1user456",
        "username": "johndoe",
        "firstName": "John",
        "lastName": "Doe",
        "avatar": "https://example.com/avatar.jpg"
      }
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

---

### 4. Get Review by ID

Retrieves a specific review by ID.

**Endpoint:** `GET /api/v1/seller-reviews/:id`

**Authentication:** Required (JWT Bearer Token)

**Path Parameters:**

| Parameter | Type   | Description |
| --------- | ------ | ----------- |
| id        | string | Review ID   |

**Response (200 OK):**

```json
{
  "id": "cm1review789",
  "sellerId": "cm1seller123",
  "reviewerId": "cm1user456",
  "rating": 5,
  "comment": "Excellent seller, fast delivery and great communication!",
  "createdAt": "2025-12-07T14:00:00.000Z",
  "updatedAt": "2025-12-07T14:00:00.000Z",
  "reviewer": {
    "id": "cm1user456",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "https://example.com/avatar.jpg"
  },
  "seller": {
    "id": "cm1seller123",
    "businessName": "Tech Solutions Ltd"
  }
}
```

**Error Responses:**

- `401 Unauthorized` - Missing or invalid JWT token
- `404 Not Found` - Review not found

---

### 5. Update Review

Updates an existing review. Only the reviewer can update their own review.

**Endpoint:** `PATCH /api/v1/seller-reviews/:id`

**Authentication:** Required (JWT Bearer Token)

**Path Parameters:**

| Parameter | Type   | Description |
| --------- | ------ | ----------- |
| id        | string | Review ID   |

**Request Body:**

```json
{
  "rating": 4,
  "comment": "Updated review comment"
}
```

**Request Body Schema:**

| Field   | Type    | Required | Description          |
| ------- | ------- | -------- | -------------------- |
| rating  | integer | No       | Updated rating (1-5) |
| comment | string  | No       | Updated comment      |

**Response (200 OK):**

```json
{
  "id": "cm1review789",
  "sellerId": "cm1seller123",
  "reviewerId": "cm1user456",
  "rating": 4,
  "comment": "Updated review comment",
  "createdAt": "2025-12-07T14:00:00.000Z",
  "updatedAt": "2025-12-07T16:30:00.000Z"
}
```

**Error Responses:**

- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Missing or invalid JWT token
- `403 Forbidden` - Not authorized to update this review
- `404 Not Found` - Review not found

---

### 6. Delete Review

Deletes a review. Only the reviewer can delete their own review.

**Endpoint:** `DELETE /api/v1/seller-reviews/:id`

**Authentication:** Required (JWT Bearer Token)

**Path Parameters:**

| Parameter | Type   | Description |
| --------- | ------ | ----------- |
| id        | string | Review ID   |

**Response (200 OK):**

```json
{
  "message": "Review deleted successfully",
  "deletedId": "cm1review789"
}
```

**Error Responses:**

- `401 Unauthorized` - Missing or invalid JWT token
- `403 Forbidden` - Not authorized to delete this review
- `404 Not Found` - Review not found

---

### 7. Get Seller Stats

Retrieves review statistics for a specific seller.

**Endpoint:** `GET /api/v1/seller-reviews/stats/:sellerId`

**Authentication:** Required (JWT Bearer Token)

**Path Parameters:**

| Parameter | Type   | Description       |
| --------- | ------ | ----------------- |
| sellerId  | string | Seller profile ID |

**Response (200 OK):**

```json
{
  "averageRating": 4.8,
  "totalReviews": 150,
  "ratingDistribution": [
    {
      "rating": 5,
      "count": 120
    },
    {
      "rating": 4,
      "count": 25
    },
    {
      "rating": 3,
      "count": 3
    },
    {
      "rating": 2,
      "count": 1
    },
    {
      "rating": 1,
      "count": 1
    }
  ]
}
```

---

## Seller Verification API

Base URL: `/api/v1/seller-verification`

### 1. Submit Verification Request

Submits a new seller verification request with KYC documents.

**Endpoint:** `POST /api/v1/seller-verification`

**Authentication:** Required (JWT Bearer Token)

**Request Body:**

```json
{
  "sellerProfileId": "cm1seller123",
  "documentType": "NATIONAL_ID",
  "documentNumber": "AB1234567",
  "fullName": "John Doe",
  "documentIssueDate": "2020-01-15",
  "documentExpiryDate": "2030-01-15",
  "address": "123 Main St, Accra, Ghana",
  "documents": [
    "https://s3.example.com/kyc/id-front.jpg",
    "https://s3.example.com/kyc/id-back.jpg"
  ],
  "facePhoto": [
    "https://s3.example.com/kyc/selfie-1.jpg",
    "https://s3.example.com/kyc/selfie-2.jpg",
    "https://s3.example.com/kyc/selfie-3.jpg"
  ],
  "additionalNotes": "Please verify my identity for business purposes"
}
```

**Request Body Schema:**

| Field              | Type              | Required | Description                                  |
| ------------------ | ----------------- | -------- | -------------------------------------------- |
| sellerProfileId    | string            | Yes      | Seller profile ID                            |
| documentType       | enum              | Yes      | NATIONAL_ID, DRIVERS_LICENSE, or PASSPORT    |
| documentNumber     | string            | Yes      | Document identification number               |
| fullName           | string            | No       | Full name as on document                     |
| documentIssueDate  | string (ISO date) | No       | Date document was issued                     |
| documentExpiryDate | string (ISO date) | No       | Date document expires                        |
| address            | string            | Yes      | Physical address                             |
| documents          | array[string]     | No       | URLs of uploaded document images (min 1)     |
| facePhoto          | array[string]     | Yes      | URLs of face verification photos (exactly 3) |
| additionalNotes    | string            | No       | Additional notes for admin                   |

**Response (201 Created):**

```json
{
  "id": "cm1verify123",
  "sellerProfileId": "cm1seller123",
  "status": "PENDING",
  "documentType": "NATIONAL_ID",
  "documentNumber": "AB1234567",
  "fullName": "John Doe",
  "address": "123 Main St, Accra, Ghana",
  "documents": [
    {
      "url": "https://s3.example.com/kyc/id-front.jpg",
      "thumbnail": "https://s3.example.com/kyc/thumbnails/id-front.jpg"
    }
  ],
  "facePhoto": [
    {
      "url": "https://s3.example.com/kyc/selfie-1.jpg",
      "thumbnail": "https://s3.example.com/kyc/thumbnails/selfie-1.jpg"
    }
  ],
  "submittedAt": "2025-12-07T10:00:00.000Z",
  "createdAt": "2025-12-07T10:00:00.000Z",
  "updatedAt": "2025-12-07T10:00:00.000Z"
}
```

**Error Responses:**

- `400 Bad Request` - Invalid input data or missing required documents
- `401 Unauthorized` - Missing or invalid JWT token
- `403 Forbidden` - Not authorized (not the seller profile owner)
- `404 Not Found` - Seller profile not found
- `409 Conflict` - Verification request already exists

---

### 2. Get All Verification Requests (Admin/Moderator)

Retrieves a paginated list of all verification requests.

**Endpoint:** `GET /api/v1/seller-verification`

**Authentication:** Required (JWT Bearer Token)

**Authorization:** ADMIN or MODERATOR role required

**Query Parameters:**

| Parameter | Type   | Default | Description                                            |
| --------- | ------ | ------- | ------------------------------------------------------ |
| page      | number | 1       | Page number                                            |
| limit     | number | 20      | Items per page                                         |
| status    | enum   | -       | Filter by status: PENDING, APPROVED, REJECTED, EXPIRED |
| search    | string | -       | Search in seller name or document number               |

**Example Request:**

```
GET /api/v1/seller-verification?page=1&limit=20&status=PENDING
```

**Response (200 OK):**

```json
{
  "data": [
    {
      "id": "cm1verify123",
      "sellerProfileId": "cm1seller123",
      "status": "PENDING",
      "documentType": "NATIONAL_ID",
      "documentNumber": "AB1234567",
      "submittedAt": "2025-12-07T10:00:00.000Z",
      "sellerProfile": {
        "id": "cm1seller123",
        "businessName": "Tech Solutions Ltd",
        "user": {
          "id": "cm1user456",
          "username": "johndoe",
          "email": "john@example.com"
        }
      }
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

**Error Responses:**

- `401 Unauthorized` - Missing or invalid JWT token
- `403 Forbidden` - Insufficient permissions (not admin/moderator)

---

### 3. Get My Verification

Retrieves the verification request for the current user's seller profile.

**Endpoint:** `GET /api/v1/seller-verification/my-verification`

**Authentication:** Required (JWT Bearer Token)

**Response (200 OK):**

```json
{
  "id": "cm1verify123",
  "sellerProfileId": "cm1seller123",
  "status": "APPROVED",
  "documentType": "NATIONAL_ID",
  "documentNumber": "AB1234567",
  "fullName": "John Doe",
  "address": "123 Main St, Accra, Ghana",
  "documents": [
    {
      "url": "https://s3.example.com/kyc/id-front.jpg",
      "thumbnail": "https://s3.example.com/kyc/thumbnails/id-front.jpg"
    }
  ],
  "facePhoto": [
    {
      "url": "https://s3.example.com/kyc/selfie-1.jpg",
      "thumbnail": "https://s3.example.com/kyc/thumbnails/selfie-1.jpg"
    }
  ],
  "submittedAt": "2025-12-07T10:00:00.000Z",
  "reviewedAt": "2025-12-07T12:00:00.000Z",
  "reviewedBy": "cm1admin789",
  "reviewNotes": "All documents verified successfully",
  "createdAt": "2025-12-07T10:00:00.000Z",
  "updatedAt": "2025-12-07T12:00:00.000Z"
}
```

**Error Responses:**

- `401 Unauthorized` - Missing or invalid JWT token
- `404 Not Found` - Verification request not found

---

### 4. Get Verification by ID (Admin/Moderator)

Retrieves a specific verification request by ID.

**Endpoint:** `GET /api/v1/seller-verification/:id`

**Authentication:** Required (JWT Bearer Token)

**Authorization:** ADMIN or MODERATOR role required

**Path Parameters:**

| Parameter | Type   | Description             |
| --------- | ------ | ----------------------- |
| id        | string | Verification request ID |

**Response (200 OK):**

```json
{
  "id": "cm1verify123",
  "sellerProfileId": "cm1seller123",
  "status": "PENDING",
  "documentType": "NATIONAL_ID",
  "documentNumber": "AB1234567",
  "fullName": "John Doe",
  "documentIssueDate": "2020-01-15T00:00:00.000Z",
  "documentExpiryDate": "2030-01-15T00:00:00.000Z",
  "address": "123 Main St, Accra, Ghana",
  "documents": [
    {
      "url": "https://s3.example.com/kyc/id-front.jpg",
      "thumbnail": "https://s3.example.com/kyc/thumbnails/id-front.jpg",
      "filename": "id-front.jpg",
      "mimeType": "image/jpeg",
      "size": "2.5MB"
    }
  ],
  "facePhoto": [
    {
      "url": "https://s3.example.com/kyc/selfie-1.jpg",
      "thumbnail": "https://s3.example.com/kyc/thumbnails/selfie-1.jpg",
      "filename": "selfie-1.jpg",
      "mimeType": "image/jpeg",
      "size": "1.8MB"
    }
  ],
  "additionalNotes": "Please verify my identity for business purposes",
  "submittedAt": "2025-12-07T10:00:00.000Z",
  "sellerProfile": {
    "id": "cm1seller123",
    "businessName": "Tech Solutions Ltd",
    "user": {
      "id": "cm1user456",
      "username": "johndoe",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+233241234567"
    }
  }
}
```

**Error Responses:**

- `401 Unauthorized` - Missing or invalid JWT token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Verification request not found

---

### 5. Update Verification Request

Updates an existing verification request. Only the submitter can update.

**Endpoint:** `PATCH /api/v1/seller-verification/:id`

**Authentication:** Required (JWT Bearer Token)

**Path Parameters:**

| Parameter | Type   | Description             |
| --------- | ------ | ----------------------- |
| id        | string | Verification request ID |

**Request Body:**

```json
{
  "documentNumber": "AB9876543",
  "address": "456 New St, Accra, Ghana",
  "additionalNotes": "Updated address information"
}
```

**Request Body Schema:**

All fields are optional. Only include fields you want to update.

| Field              | Type          | Description                               |
| ------------------ | ------------- | ----------------------------------------- |
| documentType       | enum          | NATIONAL_ID, DRIVERS_LICENSE, or PASSPORT |
| documentNumber     | string        | Document identification number            |
| fullName           | string        | Full name as on document                  |
| documentIssueDate  | string        | Date document was issued                  |
| documentExpiryDate | string        | Date document expires                     |
| address            | string        | Physical address                          |
| documents          | array[string] | URLs of uploaded document images          |
| facePhoto          | array[string] | URLs of face verification photos          |
| additionalNotes    | string        | Additional notes                          |

**Response (200 OK):**

```json
{
  "id": "cm1verify123",
  "status": "PENDING",
  "documentNumber": "AB9876543",
  "address": "456 New St, Accra, Ghana",
  "additionalNotes": "Updated address information",
  "updatedAt": "2025-12-07T14:30:00.000Z"
}
```

**Error Responses:**

- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Missing or invalid JWT token
- `403 Forbidden` - Cannot update approved/rejected verification
- `404 Not Found` - Verification request not found

---

### 6. Review Verification (Admin/Moderator)

Approves or rejects a verification request.

**Endpoint:** `PATCH /api/v1/seller-verification/:id/review`

**Authentication:** Required (JWT Bearer Token)

**Authorization:** ADMIN or MODERATOR role required

**Path Parameters:**

| Parameter | Type   | Description             |
| --------- | ------ | ----------------------- |
| id        | string | Verification request ID |

**Request Body:**

```json
{
  "status": "APPROVED",
  "reviewNotes": "All documents verified successfully. Identity confirmed.",
  "expiresAt": "2026-12-07T00:00:00.000Z"
}
```

**Request Body Schema:**

| Field       | Type              | Required | Description                             |
| ----------- | ----------------- | -------- | --------------------------------------- |
| status      | enum              | Yes      | APPROVED or REJECTED                    |
| reviewNotes | string            | Yes      | Admin notes about the decision          |
| expiresAt   | string (ISO date) | No       | Verification expiry date (for approved) |

**Response (200 OK):**

```json
{
  "id": "cm1verify123",
  "sellerProfileId": "cm1seller123",
  "status": "APPROVED",
  "reviewedAt": "2025-12-07T15:00:00.000Z",
  "reviewedBy": "cm1admin789",
  "reviewNotes": "All documents verified successfully. Identity confirmed.",
  "expiresAt": "2026-12-07T00:00:00.000Z",
  "updatedAt": "2025-12-07T15:00:00.000Z",
  "sellerProfile": {
    "id": "cm1seller123",
    "verified": true,
    "businessName": "Tech Solutions Ltd"
  }
}
```

**Rejection Example:**

```json
{
  "status": "REJECTED",
  "reviewNotes": "Documents are not clear. Please resubmit with better quality images."
}
```

**Error Responses:**

- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Missing or invalid JWT token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Verification request not found

---

### 7. Delete Verification Request

Deletes a verification request. Only pending requests can be deleted.

**Endpoint:** `DELETE /api/v1/seller-verification/:id`

**Authentication:** Required (JWT Bearer Token)

**Path Parameters:**

| Parameter | Type   | Description             |
| --------- | ------ | ----------------------- |
| id        | string | Verification request ID |

**Response (200 OK):**

```json
{
  "message": "Verification request deleted successfully",
  "deletedId": "cm1verify123"
}
```

**Error Responses:**

- `401 Unauthorized` - Missing or invalid JWT token
- `403 Forbidden` - Cannot delete approved/rejected verification
- `404 Not Found` - Verification request not found

---

### 8. Get Verification Statistics (Admin/Moderator)

Retrieves overall verification statistics.

**Endpoint:** `GET /api/v1/seller-verification/stats/overview`

**Authentication:** Required (JWT Bearer Token)

**Authorization:** ADMIN or MODERATOR role required

**Response (200 OK):**

```json
{
  "total": 250,
  "pending": 45,
  "approved": 180,
  "rejected": 20,
  "expired": 5,
  "averageProcessingTime": "2.5 days",
  "approvalRate": 90.0,
  "recentActivity": {
    "last24Hours": {
      "submitted": 8,
      "approved": 5,
      "rejected": 1
    },
    "last7Days": {
      "submitted": 52,
      "approved": 38,
      "rejected": 6
    },
    "last30Days": {
      "submitted": 185,
      "approved": 145,
      "rejected": 18
    }
  },
  "documentTypeDistribution": {
    "NATIONAL_ID": 150,
    "DRIVERS_LICENSE": 60,
    "PASSPORT": 40
  }
}
```

**Error Responses:**

- `401 Unauthorized` - Missing or invalid JWT token
- `403 Forbidden` - Insufficient permissions

---

## Authentication Requirements

### JWT Bearer Token

Most endpoints require authentication using a JWT Bearer token. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### User Roles

Some endpoints require specific user roles:

- **ADMIN** - Full access to all endpoints
- **MODERATOR** - Can review and manage verification requests
- **USER** - Standard user access (can manage own seller profile and reviews)

### Getting a Token

Obtain a JWT token by authenticating through the Auth API:

```bash
POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "your_password"
}
```

Response includes `accessToken` which should be used for authentication.

---

## Response Formats

### Success Response

All successful responses follow this format:

```json
{
  "data": {
    /* response data */
  },
  "message": "Success message (optional)"
}
```

For paginated endpoints:

```json
{
  "data": [
    /* array of items */
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

### Pagination

Pagination metadata includes:

| Field      | Description           |
| ---------- | --------------------- |
| total      | Total number of items |
| page       | Current page number   |
| limit      | Items per page        |
| totalPages | Total number of pages |

---

## Error Handling

### Error Response Format

All error responses follow this format:

```json
{
  "statusCode": 400,
  "message": "Error message describing what went wrong",
  "error": "Bad Request"
}
```

For validation errors:

```json
{
  "statusCode": 400,
  "message": ["rating must be between 1 and 5", "sellerId should not be empty"],
  "error": "Bad Request"
}
```

### HTTP Status Codes

| Code | Meaning               | Description                         |
| ---- | --------------------- | ----------------------------------- |
| 200  | OK                    | Request succeeded                   |
| 201  | Created               | Resource created successfully       |
| 400  | Bad Request           | Invalid request data                |
| 401  | Unauthorized          | Missing or invalid authentication   |
| 403  | Forbidden             | Insufficient permissions            |
| 404  | Not Found             | Resource not found                  |
| 409  | Conflict              | Resource already exists or conflict |
| 500  | Internal Server Error | Server error                        |

### Common Error Messages

| Error                         | Cause                    | Solution                                        |
| ----------------------------- | ------------------------ | ----------------------------------------------- |
| "Unauthorized"                | Missing JWT token        | Include valid JWT token in Authorization header |
| "Forbidden"                   | Insufficient permissions | Request access or use account with proper role  |
| "Not Found"                   | Resource doesn't exist   | Verify the ID and ensure resource exists        |
| "Already reviewed"            | Duplicate review         | Users can only review a seller once             |
| "Verification already exists" | Duplicate verification   | Update existing verification instead            |

---

## Testing the Endpoints

### Using cURL

**Create Seller Profile:**

```bash
curl -X POST http://localhost:3000/api/v1/sellers \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "Tech Solutions Ltd",
    "businessType": "Technology",
    "description": "We provide cutting-edge tech solutions"
  }'
```

**Get All Sellers:**

```bash
curl -X GET "http://localhost:3000/api/v1/sellers?page=1&limit=20"
```

**Create Review:**

```bash
curl -X POST http://localhost:3000/api/v1/seller-reviews \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sellerId": "cm1seller123",
    "rating": 5,
    "comment": "Excellent seller!"
  }'
```

**Submit Verification:**

```bash
curl -X POST http://localhost:3000/api/v1/seller-verification \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sellerProfileId": "cm1seller123",
    "documentType": "NATIONAL_ID",
    "documentNumber": "AB1234567",
    "address": "123 Main St, Accra, Ghana",
    "documents": ["https://example.com/id-front.jpg"],
    "facePhoto": [
      "https://example.com/selfie-1.jpg",
      "https://example.com/selfie-2.jpg",
      "https://example.com/selfie-3.jpg"
    ]
  }'
```

### Using Postman

1. Import the Willfinditt API Collection
2. Set up environment variables:
   - `base_url`: http://localhost:3000/api/v1
   - `jwt_token`: Your authentication token
3. Navigate to the "Sellers" folder
4. Run requests with pre-configured examples

### Swagger Documentation

Access interactive API documentation at:

```
http://localhost:3000/api/docs
```

Swagger UI allows you to:

- Browse all available endpoints
- View request/response schemas
- Test endpoints directly in the browser
- Authenticate using JWT token

---

## Notes

1. **File Uploads**: Document and face photo URLs should be obtained by first uploading files to the `/api/v1/upload/kyc-documents` and `/api/v1/upload/face-photos` endpoints.

2. **Rate Limiting**: API endpoints are rate-limited to prevent abuse. Current limits:
   - 3 requests per second
   - 20 requests per 10 seconds
   - 100 requests per minute

3. **Verification Process**:
   - Sellers submit verification with KYC documents
   - Admin/Moderator reviews the submission
   - Upon approval, seller profile is marked as verified
   - Verification may expire and require renewal

4. **Review Restrictions**:
   - Users can only review a seller once
   - Only the reviewer can update/delete their own review
   - Ratings must be between 1-5

5. **Data Privacy**:
   - Sensitive verification documents are only visible to admins/moderators and the seller who submitted them
   - Email and phone numbers are only shown to authorized users

---

## Support

For issues, questions, or feature requests:

- Email: support@willfind8.com
- Documentation: https://docs.willfind8.com
- API Status: https://status.willfind8.com

---

**Last Updated:** December 7, 2025  
**API Version:** 1.0.0  
**Base URL:** http://localhost:3000/api/v1 (development)
