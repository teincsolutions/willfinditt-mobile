# Ads API Documentation

## Overview

The Ads API provides comprehensive functionality for managing advertisements in the Willfinditt platform. It supports creating, reading, updating, and deleting ads, along with advanced search capabilities, user-specific operations, and administrative controls.

### Base URL

```
https://api.willfind8.com/ads
```

### Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Response Format

All responses follow a consistent JSON structure. Successful responses return data in the `data` field, while errors include detailed error information.

---

## 1. CRUD Operations

### 1.1 Create Ad

**Endpoint:** `POST /ads`

**Description:** Create a new advertisement. The ad will be created with PENDING status by default and requires admin approval to become ACTIVE.

**Authentication:** Required (JWT Bearer token)

**Request Body:**

```json
{
  "title": "iPhone 13 Pro Max - Excellent Condition",
  "description": "Barely used iPhone 13 Pro Max in excellent condition. Comes with original box and accessories.",
  "price": 999.99,
  "currency": "USD",
  "condition": "LIKE_NEW",
  "categoryId": "cat_123",
  "cityId": "city_456",
  "address": "Accra, Ghana",
  "latitude": 5.6037,
  "longitude": -0.187,
  "contactPhone": "+233123456789",
  "contactEmail": "seller@example.com",
  "isNegotiable": true,
  "images": [
    "https://cdn.willfind8.com/uploads/image1.jpg",
    "https://cdn.willfind8.com/uploads/image2.jpg"
  ],
  "videos": ["https://cdn.willfind8.com/uploads/video1.mp4"],
  "namedFieldValues": [
    {
      "fieldName": "brand",
      "value": "Apple",
      "categoryId": "electronics-category-id"
    },
    {
      "fieldName": "storage",
      "value": "256GB"
    }
  ]
}
```

**Response (201 Created):**

```json
{
  "id": "ad_123",
  "title": "iPhone 13 Pro Max - Excellent Condition",
  "description": "Barely used iPhone 13 Pro Max in excellent condition. Comes with original box and accessories.",
  "price": 999.99,
  "currency": "USD",
  "condition": "LIKE_NEW",
  "images": [
    "https://cdn.willfind8.com/uploads/image1.jpg",
    "https://cdn.willfind8.com/uploads/image2.jpg"
  ],
  "videos": ["https://cdn.willfind8.com/uploads/video1.mp4"],
  "status": "PENDING",
  "isPromoted": false,
  "views": 0,
  "address": "Accra, Ghana",
  "latitude": 5.6037,
  "longitude": -0.187,
  "contactPhone": "+233123456789",
  "contactEmail": "seller@example.com",
  "isNegotiable": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z",
  "user": {
    "id": "user_123",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "https://cdn.willfind8.com/avatars/user123.jpg"
  },
  "category": {
    "id": "cat_123",
    "name": "Electronics",
    "slug": "electronics",
    "icon": "https://cdn.willfind8.com/icons/electronics.svg"
  },
  "city": {
    "id": "city_456",
    "name": "Accra",
    "state": {
      "id": "state_789",
      "name": "Greater Accra",
      "country": {
        "id": "country_101",
        "name": "Ghana",
        "code": "GH"
      }
    }
  },
  "fieldValues": [
    {
      "id": "fv_123",
      "categoryFieldId": "field_456",
      "value": "256GB",
      "categoryField": {
        "id": "field_456",
        "name": "storage",
        "label": "Storage Capacity",
        "type": "select"
      }
    }
  ],
  "_count": {
    "savedBy": 0,
    "comments": 0
  }
}
```

**Status Codes:**

- `201` - Ad created successfully
- `400` - Invalid input data
- `401` - Authentication required

**Error Response (400):**

```json
{
  "statusCode": 400,
  "message": [
    "title must be a string",
    "categoryId must be a valid category ID"
  ],
  "error": "ValidationError",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/ads"
}
```

### 1.2 Get Ad by ID

**Endpoint:** `GET /ads/{id}`

**Description:** Retrieve a specific ad by its ID. Increments view count if user is not the owner.

**Authentication:** Optional (JWT Bearer token)

**Parameters:**

- `id` (path) - Ad ID (required)

**Response (200 OK):**

```json
{
  "id": "ad_123",
  "title": "iPhone 13 Pro Max - Excellent Condition",
  "description": "Barely used iPhone 13 Pro Max in excellent condition...",
  "price": 999.99,
  "currency": "USD",
  "condition": "LIKE_NEW",
  "images": ["https://cdn.willfind8.com/ads/image1.jpg"],
  "videos": [],
  "status": "ACTIVE",
  "isPromoted": false,
  "views": 157,
  "address": "Accra, Ghana",
  "latitude": 5.6037,
  "longitude": -0.187,
  "contactPhone": "+233123456789",
  "contactEmail": "seller@example.com",
  "isNegotiable": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z",
  "user": {
    "id": "user_123",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe"
  },
  "category": {
    "id": "cat_123",
    "name": "Electronics",
    "slug": "electronics"
  },
  "city": {
    "id": "city_456",
    "name": "Accra",
    "state": {
      "id": "state_789",
      "name": "Greater Accra",
      "country": {
        "id": "country_101",
        "name": "Ghana",
        "code": "GH"
      }
    }
  },
  "fieldValues": [],
  "_count": {
    "savedBy": 5,
    "comments": 2
  },
  "isSaved": false
}
```

**Status Codes:**

- `200` - Ad retrieved successfully
- `404` - Ad not found

### 1.3 Update Ad

**Endpoint:** `PATCH /ads/{id}`

**Description:** Update an existing ad. Only the ad owner can update their ads.

**Authentication:** Required (JWT Bearer token)

**Parameters:**

- `id` (path) - Ad ID (required)

**Request Body:**

```json
{
  "title": "iPhone 13 Pro Max - Updated Title",
  "price": 899.99,
  "description": "Updated description...",
  "isNegotiable": false
}
```

**Response (200 OK):** Same as create response

**Status Codes:**

- `200` - Ad updated successfully
- `400` - Invalid input data
- `401` - Authentication required
- `403` - Not authorized (not ad owner)
- `404` - Ad not found

### 1.4 Delete Ad

**Endpoint:** `DELETE /ads/{id}`

**Description:** Soft delete an ad (sets status to DELETED). Only the ad owner can delete their ads.

**Authentication:** Required (JWT Bearer token)

**Parameters:**

- `id` (path) - Ad ID (required)

**Response (200 OK):**

```json
{
  "message": "Ad deleted successfully"
}
```

**Status Codes:**

- `200` - Ad deleted successfully
- `401` - Authentication required
- `403` - Not authorized (not ad owner)
- `404` - Ad not found

### 1.5 Close Ad

**Endpoint:** `PATCH /ads/{id}/close`

**Description:** Mark an ad as closed (no longer available). This is different from marking as sold. Only the ad owner can close their ads.

**Authentication:** Required (JWT Bearer token)

**Parameters:**

- `id` (path) - Ad ID (required)

**Request Body:**

```json
{
  "reason": "Sold elsewhere" // Optional
}
```

**Response (200 OK):**

```json
{
  "id": "ad_123",
  "status": "CLOSED",
  "closedAt": "2024-01-15T10:30:00.000Z",
  "closureReason": "Sold elsewhere",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 1.6 Reactivate Ad

**Endpoint:** `PATCH /ads/{id}/reactivate`

**Description:** Reactivate a closed, expired, or sold ad. The ad will be set to PENDING status and requires admin approval to become ACTIVE again. Only the ad owner can reactivate their ads.

**Authentication:** Required (JWT Bearer token)

**Parameters:**

- `id` (path) - Ad ID (required)

**Response (200 OK):**

```json
{
  "id": "ad_123",
  "status": "PENDING",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

## 2. Search and Filtering

### 2.1 Get All Ads with Filtering

**Endpoint:** `GET /ads`

**Description:** Retrieve a paginated list of active ads with comprehensive filtering options.

**Authentication:** Optional

**Query Parameters:**

- `page` (number, default: 1) - Page number
- `limit` (number, default: 20, max: 100) - Items per page
- `categoryId` (string) - Filter by category ID
- `cityId` (string) - Filter by city ID
- `minPrice` (number) - Minimum price filter
- `maxPrice` (number) - Maximum price filter
- `condition` (enum: NEW, LIKE_NEW, GOOD, FAIR, POOR) - Filter by condition
- `search` (string) - Search in title and description
- `sortBy` (string, default: createdAt) - Sort field
- `sortOrder` (enum: asc, desc, default: desc) - Sort order
- `status` (enum) - Filter by ad status (admin only)
- `categoryFields` (string) - URL-encoded JSON string for category field filters

#### Category Fields Filtering

The `categoryFields` parameter allows dynamic filtering based on custom category fields. Pass a URL-encoded JSON array of field filters.

**Format:**

```json
[
  {
    "fieldName": "brand",
    "value": "toyota",
    "categoryId": "cat_vehicles_123"
  },
  {
    "fieldName": "transmission",
    "value": "automatic"
  }
]
```

**URL-Encoded Example:**

```
GET /ads?categoryFields=%5B%7B%22categoryFieldId%22%3A%22cmgf3wlg50001ms07yi05qb35%22%2C%22value%22%3A%22toyota%22%7D%5D
```

**Field Filter Object:**

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `categoryFieldId` | string | Yes | ID of the category field (from CategoryField table) |
| `value` | string \| string[] | Yes | Value(s) to filter by. Use array for multi-select (OR logic) |

**Real-World Examples:**

1. **Filter by Brand:**

```
GET /ads?categoryFields=[{"categoryFieldId":"cmgf3wlg50001ms07yi05qb35","value":"toyota"}]
```

2. **Filter by Multiple Fields:**

```
GET /ads?categoryFields=[{"categoryFieldId":"cmgf3wlg50001ms07yi05qb35","value":"toyota"},{"categoryFieldId":"cmgf3wlg50002ms07abc12xyz","value":"automatic"}]
```

3. **Filter with Multiple Values (OR Logic):**

```
GET /ads?categoryFields=[{"categoryFieldId":"cmgf3wlg50001ms07yi05qb35","value":["toyota","honda","nissan"]}]
```

This returns ads where brand is "toyota" OR "honda" OR "nissan".

4. **Filter Checkbox Fields (comma-separated values):**

For ads with checkbox values stored as `"air_condition,spare_tire"`:

```
GET /ads?categoryFields=[{"categoryFieldId":"cmgf3wlg50003ms07features","value":"air_condition"}]
```

**Note:** Matching is **case-insensitive** and uses `contains` to handle comma-separated checkbox values. Multiple fields use AND logic (all conditions must match).

**Example Request:**

```
GET /ads?page=1&limit=10&categoryId=cat_123&minPrice=100&maxPrice=1000&search=iphone&sortBy=price&sortOrder=asc
```

**Response (200 OK):**

```json
{
  "data": [
    {
      "id": "ad_123",
      "title": "iPhone 13 Pro Max",
      "price": 999.99,
      "currency": "USD",
      "condition": "LIKE_NEW",
      "images": ["https://cdn.willfind8.com/ads/image1.jpg"],
      "status": "ACTIVE",
      "isPromoted": true,
      "views": 156,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "user": {
        "id": "user_123",
        "username": "johndoe"
      },
      "category": {
        "id": "cat_123",
        "name": "Electronics"
      },
      "city": {
        "id": "city_456",
        "name": "Accra"
      },
      "fieldValues": [],
      "_count": {
        "savedBy": 5,
        "comments": 2
      }
    }
  ],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 10,
    "totalPages": 15
  }
}
```

### 2.2 Advanced Search

**Endpoint:** `POST /ads/search`

**Description:** Advanced search with promotion-aware sorting, location-based search, faceted results, and dynamic category field filtering.

**Authentication:** Optional

**Request Body:**

```json
{
  "search": {
    "query": "iPhone 13",
    "categoryIds": ["cat_123"],
    "cityIds": ["city_456"],
    "conditions": ["LIKE_NEW", "NEW"],
    "priceMin": 500,
    "priceMax": 1500,
    "latitude": 5.6037,
    "longitude": -0.187,
    "radius": 50,
    "promotionFilter": "all",
    "categoryFields": [
      {
        "categoryFieldId": "cmgf3wlg50001ms07yi05qb35",
        "value": "apple"
      },
      {
        "categoryFieldId": "cmgf3wlg50002ms07storage",
        "value": "256gb"
      }
    ],
    "sortBy": "promotionPriority",
    "sortOrder": "desc",
    "page": 1,
    "limit": 20
  },
  "facets": {
    "categories": true,
    "cities": true,
    "conditions": true,
    "priceRanges": true,
    "promotions": true
  }
}
```

#### Category Fields in Advanced Search

The `categoryFields` array in the search body allows filtering by custom category-specific attributes using their unique `categoryFieldId`.

**Field Filter Structure:**

```json
{
  "categoryFieldId": "cmgf3wlg50001ms07yi05qb35",
  "value": "toyota"
}
```

**Multi-Value Filter Structure (OR Logic):**

```json
{
  "categoryFieldId": "cmgf3wlg50001ms07yi05qb35",
  "value": ["toyota", "honda", "nissan"]
}
```

**Real-World Search Examples:**

**1. Search for Toyota Cars:**

```json
{
  "search": {
    "query": "sedan",
    "categoryIds": ["cat_vehicles_123"],
    "categoryFields": [
      { "categoryFieldId": "cmgf3brand123", "value": "toyota" },
      { "categoryFieldId": "cmgf3trans456", "value": "automatic" }
    ]
  }
}
```

**2. Search for 3-Bedroom Apartments:**

```json
{
  "search": {
    "categoryIds": ["cat_apartments_456"],
    "priceMax": 3000,
    "categoryFields": [
      { "categoryFieldId": "cmgf3beds789", "value": "3" },
      { "categoryFieldId": "cmgf3amenities", "value": "pool" }
    ]
  }
}
```

**3. Search for Phones by Multiple Attributes:**

```json
{
  "search": {
    "query": "smartphone",
    "categoryIds": ["cat_phones_789"],
    "categoryFields": [
      { "categoryFieldId": "cmgf3brand123", "value": "samsung" },
      { "categoryFieldId": "cmgf3storage456", "value": "128gb" }
    ]
  }
}
```

**4. Search for Phones from Multiple Brands:**

```json
{
  "search": {
    "query": "smartphone",
    "categoryIds": ["cat_phones_789"],
    "categoryFields": [
      { "categoryFieldId": "cmgf3brand123", "value": ["samsung", "apple", "google"] },
      { "categoryFieldId": "cmgf3storage456", "value": ["128gb", "256gb"] }
    ]
  }
}
```

This returns phones where brand is Samsung, Apple, or Google AND storage is 128GB or 256GB.

**Field Matching Behavior:**

| Field Type | Matching Logic | Example |
|------------|----------------|---------|
| TEXT | Case-insensitive contains match | `"air"` matches `"air_condition,spare_tire"` |
| NUMBER | Case-insensitive contains match | `"2020"` |
| SELECT | Case-insensitive contains match | `"toyota"` or `["toyota", "honda"]` |
| RADIO | Case-insensitive contains match | `"automatic"` matches `"AUTOMATIC"` |
| CHECKBOX | Case-insensitive contains match on comma-separated values | `"pool"` matches `"pool,gym,parking"` |
| BOOLEAN | String boolean match (case-insensitive) | `"true"` or `"false"` |

**Multi-Value Filtering:**

When you pass an array of values, the system uses OR logic within the field:

```json
{
  "categoryFieldId": "cmgf3brand123",
  "value": ["apple", "samsung", "google"]
}
```

This matches ads where brand is "apple" OR "samsung" OR "google".

Multiple fields use AND logic:

```json
[
  { "categoryFieldId": "cmgf3brand123", "value": ["apple", "samsung"] },
  { "categoryFieldId": "cmgf3storage456", "value": "256gb" }
]
```

This matches ads where (brand is "apple" OR "samsung") AND (storage is "256gb").

**Response (200 OK):**

```json
{
  "data": [...],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 20,
    "totalPages": 2
  },
  "facets": {
    "categories": [
      {
        "id": "cat_123",
        "name": "Electronics",
        "count": 15
      }
    ],
    "cities": [
      {
        "id": "city_456",
        "name": "Accra",
        "count": 20
      }
    ],
    "conditions": [
      {
        "condition": "LIKE_NEW",
        "count": 12
      }
    ],
    "priceRanges": [
      {
        "min": 500,
        "max": 1000,
        "count": 18
      }
    ],
    "promotions": {
      "promoted": 5,
      "notPromoted": 20
    }
  }
}
```

---

## 3. User-Specific Operations

### 3.1 Get User's Ads

**Endpoint:** `GET /ads/my-ads`

**Description:** Retrieve all ads created by the authenticated user.

**Authentication:** Required (JWT Bearer token)

**Query Parameters:** Same as GET /ads (pagination, filtering)

**Response (200 OK):** Same as GET /ads response

### 3.2 Get Saved Ads

**Endpoint:** `GET /ads/saved`

**Description:** Retrieve all ads saved/bookmarked by the authenticated user.

**Authentication:** Required (JWT Bearer token)

**Query Parameters:** Same as GET /ads (pagination, filtering)

**Response (200 OK):** Same as GET /ads response

### 3.3 Save Ad

**Endpoint:** `POST /ads/{id}/save`

**Description:** Add an ad to the user's saved/bookmarked list.

**Authentication:** Required (JWT Bearer token)

**Parameters:**

- `id` (path) - Ad ID (required)

**Response (200 OK):**

```json
{
  "message": "Ad saved successfully"
}
```

### 3.4 Unsave Ad

**Endpoint:** `DELETE /ads/{id}/save`

**Description:** Remove an ad from the user's saved/bookmarked list.

**Authentication:** Required (JWT Bearer token)

**Parameters:**

- `id` (path) - Ad ID (required)

**Response (200 OK):**

```json
{
  "message": "Ad removed from favorites successfully"
}
```

---

## 4. Admin Operations

### 4.1 Get Single Ad (Admin)

**Endpoint:** `GET /ads/{id}/admin`

**Description:** Admin endpoint to retrieve any single ad by ID, except deleted ones.

**Authentication:** Required (JWT Bearer token, Admin role)

**Parameters:**

- `id` (path) - Ad ID (required)

**Response (200 OK):** Same as GET /ads/{id} response

### 4.2 Get Pending Ads

**Endpoint:** `GET /ads/admin/pending`

**Description:** Admin endpoint to retrieve all ads pending approval.

**Authentication:** Required (JWT Bearer token, Admin role)

**Query Parameters:** Standard pagination parameters

**Response (200 OK):** Same as GET /ads response

### 4.3 Approve Ad

**Endpoint:** `POST /ads/{id}/admin/approve`

**Description:** Admin endpoint to approve a pending ad.

**Authentication:** Required (JWT Bearer token, Admin role)

**Parameters:**

- `id` (path) - Ad ID (required)

**Response (200 OK):** Updated ad object with ACTIVE status

### 4.4 Reject Ad

**Endpoint:** `POST /ads/{id}/admin/reject`

**Description:** Admin endpoint to reject a pending ad (sets to DRAFT).

**Authentication:** Required (JWT Bearer token, Admin role)

**Parameters:**

- `id` (path) - Ad ID (required)

**Response (200 OK):** Updated ad object with DRAFT status

### 4.5 Get All Ads (Admin)

**Endpoint:** `GET /ads/admin/all`

**Description:** Admin endpoint to retrieve all ads regardless of status.

**Authentication:** Required (JWT Bearer token, Admin role)

**Query Parameters:**

- Standard pagination parameters
- `status` (enum) - Filter by specific status
- `userId` (string) - Filter by user ID

**Response (200 OK):** Same as GET /ads response

### 4.6 Update Ad Status (Admin)

**Endpoint:** `PATCH /ads/{id}/admin/status`

**Description:** Admin endpoint to update any ad's status.

**Authentication:** Required (JWT Bearer token, Admin role)

**Parameters:**

- `id` (path) - Ad ID (required)

**Request Body:**

```json
{
  "status": "ACTIVE"
}
```

**Response (200 OK):** Updated ad object

### 4.7 Get Deleted Ads

**Endpoint:** `GET /ads/deleted`

**Description:** Admin endpoint to retrieve all deleted ads.

**Authentication:** Required (JWT Bearer token, Admin role)

**Query Parameters:** Standard pagination and filtering parameters

**Response (200 OK):** Same as GET /ads response

### 4.8 Get Deleted Ad by ID

**Endpoint:** `GET /ads/deleted/{id}`

**Description:** Admin endpoint to retrieve a specific deleted ad.

**Authentication:** Required (JWT Bearer token, Admin role)

**Parameters:**

- `id` (path) - Ad ID (required)

**Response (200 OK):** Same as GET /ads/{id} response

---

## 5. Statistics

### 5.1 Get Overview Statistics

**Endpoint:** `GET /ads/stats/overview`

**Description:** Get basic overview statistics for dashboard (Admin only).

**Authentication:** Required (JWT Bearer token, Admin role)

**Response (200 OK):**

```json
{
  "totalAds": 1250,
  "activeAds": 1100,
  "draftAds": 50,
  "soldAds": 100,
  "totalViews": 45680,
  "totalSaved": 2340,
  "totalUsers": 450,
  "avgViewsPerAd": 36.5,
  "adsCreatedToday": 12,
  "adsCreatedThisWeek": 85,
  "adsCreatedThisMonth": 320
}
```

---

## 6. Error Responses

All error responses follow this structure:

```json
{
  "statusCode": 400,
  "message": "Error message or array of validation errors",
  "error": "ErrorType",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/ads"
}
```

### Common Error Codes:

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

### Validation Error Example:

```json
{
  "statusCode": 400,
  "message": [
    "title must be a string",
    "price must be a positive number",
    "categoryId must be a valid category ID"
  ],
  "error": "ValidationError",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/ads"
}
```

### Authentication Error Example:

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/ads"
}
```

### Permission Error Example:

```json
{
  "statusCode": 403,
  "message": "Access denied - Admin only",
  "error": "Forbidden",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/ads/admin/pending"
}
```

---

## 7. Data Types and Enums

### AdStatus Enum:

- `DRAFT` - Ad is in draft state
- `PENDING` - Ad is pending admin approval
- `ACTIVE` - Ad is live and visible
- `SOLD` - Ad has been sold
- `CLOSED` - Ad has been closed by the user
- `EXPIRED` - Ad has reached its expiration date
- `ARCHIVED` - Ad has been moved to long-term storage
- `SUSPENDED` - Ad has been suspended by an admin
- `DELETED` - Ad has been soft deleted

### AdCondition Enum:

- `NEW` - Brand new item
- `LIKE_NEW` - Used but in excellent condition
- `GOOD` - Used but in good condition
- `FAIR` - Used with some wear
- `POOR` - Used with significant wear

### Sort Options:

- `relevance` - Search relevance
- `createdAt` - Creation date
- `updatedAt` - Last update date
- `price` - Price
- `views` - View count
- `distance` - Distance (location-based)
- `promotionPriority` - Promotion priority

### Promotion Filter:

- `all` - All ads
- `promoted_only` - Only promoted ads
- `non_promoted_only` - Only non-promoted ads

---

## 8. Rate Limiting

API endpoints are subject to rate limiting:

- Standard endpoints: 100 requests per minute
- Search endpoints: 50 requests per minute
- Admin endpoints: 200 requests per minute

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

## 9. Pagination

All list endpoints support pagination with the following parameters:

- `page` (default: 1) - Page number
- `limit` (default: 20, max: 100) - Items per page

Response includes pagination metadata:

```json
{
  "data": [...],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

---

## 10. Filtering Examples

### Category Field Filtering:

```javascript
// URL-encoded JSON string
const categoryFields = encodeURIComponent(
  JSON.stringify([
    {
      fieldName: 'brand',
      value: 'Toyota',
      categoryId: 'car-category-id',
    },
    {
      fieldName: 'transmission',
      value: 'automatic',
    },
  ]),
);

// Result: %5B%7B%22fieldName%22%3A%22brand%22%2C%22value%22%3A%22Toyota%22%2C%22categoryId%22%3A%22car-category-id%22%7D%2C%7B%22fieldName%22%3A%22transmission%22%2C%22value%22%3A%22automatic%22%7D%5D
```

### Location-based Search:

```json
{
  "search": {
    "latitude": 5.6037,
    "longitude": -0.187,
    "radius": 50
  }
}
```

### Date Range Filtering:

```json
{
  "search": {
    "dateRange": "this_week"
  }
}
```

### Custom Date Range:

```json
{
  "search": {
    "dateFrom": "2024-01-01T00:00:00.000Z",
    "dateTo": "2024-01-31T23:59:59.999Z"
  }
}
```
---

## Category Fields Integration

### Overview

Category fields allow ads to have dynamic, category-specific attributes. For example, vehicles can have fields like "brand", "transmission", while real estate can have "bedrooms", "amenities".

### Setting Category Field Values in Ads

When creating or updating an ad, use the `namedFieldValues` array:

```json
{
  "title": "2020 Toyota Camry",
  "categoryId": "cat_vehicles_123",
  "namedFieldValues": [
    {
      "fieldName": "brand",
      "value": "toyota",
      "categoryId": "cat_vehicles_123"
    },
    {
      "fieldName": "year",
      "value": "2020"
    },
    {
      "fieldName": "transmission",
      "value": "automatic"
    },
    {
      "fieldName": "fuel_type",
      "value": "petrol"
    },
    {
      "fieldName": "features",
      "value": "ac,nav,sunroof"
    }
  ]
}
```

### Field Value Formats by Type

| Field Type | Format | Example Value | Notes |
|------------|--------|---------------|-------|
| TEXT | String | `"ABC123"` | Plain text |
| TEXTAREA | String | `"Long description..."` | Multi-line text |
| NUMBER | String (numeric) or Range object | `"2020"`, `"45000"` or `{"min": 2015, "max": 2020}` | For filtering: string for exact, object for range |
| SELECT | String (option value) | `"toyota"`, `"automatic"` | Must match option value |
| RADIO | String (option value) | `"manual"`, `"new"` | Must match option value |
| CHECKBOX | Comma-separated string | `"pool,gym,parking"` | Multiple values separated by commas |
| DATE | ISO date string | `"2020-01-15"` | YYYY-MM-DD format |
| BOOLEAN | String boolean | `"true"`, `"false"` | Lowercase string |

### Filtering Ads by Category Fields

#### In GET Requests (Query Parameters)

Use the `categoryFields` query parameter with URL-encoded JSON:

```
GET /ads?categoryFields=[{"fieldName":"brand","value":"toyota"},{"fieldName":"transmission","value":"automatic"}]
```

**URL-Encoded:**

```
GET /ads?categoryFields=%5B%7B%22fieldName%22%3A%22brand%22%2C%22value%22%3A%22toyota%22%7D%5D
```

#### In POST Search Requests

Include `categoryFields` array in the search body:

```json
{
  "search": {
    "categoryIds": ["cat_vehicles_123"],
    "categoryFields": [
      { "fieldName": "brand", "value": "toyota" },
      { "fieldName": "transmission", "value": "automatic" }
    ]
  }
}
```

### Complete Examples by Category

#### Example 1: Vehicles/Cars

**Category Fields Setup:**

- `brand` (SELECT): Toyota, Honda, Ford, BMW, etc.
- `year` (NUMBER): Manufacturing year
- `mileage` (NUMBER): Kilometers driven
- `transmission` (RADIO): Automatic, Manual
- `fuel_type` (SELECT): Petrol, Diesel, Hybrid, Electric
- `features` (CHECKBOX): AC, Navigation, Sunroof, Leather Seats

**Creating Car Ad:**

```json
{
  "title": "2019 Honda Accord - Excellent Condition",
  "description": "Well-maintained sedan with full service history",
  "price": 22000,
  "categoryId": "cat_vehicles_123",
  "namedFieldValues": [
    { "fieldName": "brand", "value": "honda" },
    { "fieldName": "year", "value": "2019" },
    { "fieldName": "mileage", "value": "45000" },
    { "fieldName": "transmission", "value": "automatic" },
    { "fieldName": "fuel_type", "value": "petrol" },
    { "fieldName": "features", "value": "ac,nav,leather" }
  ]
}
```

**Searching for Cars:**

```json
{
  "search": {
    "query": "sedan",
    "categoryIds": ["cat_vehicles_123"],
    "priceMin": 15000,
    "priceMax": 30000,
    "categoryFields": [
      { "fieldName": "brand", "value": "honda" },
      { "fieldName": "year", "value": {"min": 2018, "max": 2022} },
      { "fieldName": "mileage", "value": {"max": 60000} },
      { "fieldName": "transmission", "value": "automatic" },
      { "fieldName": "fuel_type", "value": "petrol" }
    ]
  }
}
```

#### Example 2: Real Estate/Apartments

**Category Fields Setup:**

- `bedrooms` (NUMBER): Number of bedrooms
- `bathrooms` (NUMBER): Number of bathrooms
- `square_feet` (NUMBER): Property size
- `furnishing` (RADIO): Fully, Semi, Unfurnished
- `amenities` (CHECKBOX): Pool, Gym, Parking, Security, Garden
- `available_from` (DATE): Availability date

**Creating Apartment Ad:**

```json
{
  "title": "Luxury 3BR Apartment in Cantonments",
  "description": "Modern apartment with stunning city views",
  "price": 2500,
  "categoryId": "cat_apartments_456",
  "namedFieldValues": [
    { "fieldName": "bedrooms", "value": "3" },
    { "fieldName": "bathrooms", "value": "2" },
    { "fieldName": "square_feet", "value": "1500" },
    { "fieldName": "furnishing", "value": "fully" },
    { "fieldName": "amenities", "value": "pool,gym,parking,security" },
    { "fieldName": "available_from", "value": "2026-02-01" }
  ]
}
```

**Searching for Apartments:**

```json
{
  "search": {
    "categoryIds": ["cat_apartments_456"],
    "priceMax": 3000,
    "categoryFields": [
      { "fieldName": "bedrooms", "value": {"min": 2, "max": 4} },
      { "fieldName": "square_feet", "value": {"min": 1200} },
      { "fieldName": "amenities", "value": "pool" },
      { "fieldName": "furnishing", "value": "fully" }
    ]
  }
}
```

#### Example 3: Electronics/Phones

**Category Fields Setup:**

- `brand` (SELECT): Apple, Samsung, Google, Xiaomi
- `storage` (SELECT): 64GB, 128GB, 256GB, 512GB
- `ram` (SELECT): 4GB, 6GB, 8GB, 12GB
- `screen_size` (NUMBER): Screen size in inches
- `condition` (RADIO): New, Like New, Good, Fair
- `has_warranty` (BOOLEAN): Active warranty status

**Creating Phone Ad:**

```json
{
  "title": "iPhone 15 Pro Max 256GB",
  "description": "Brand new, sealed in box",
  "price": 1200,
  "categoryId": "cat_phones_789",
  "namedFieldValues": [
    { "fieldName": "brand", "value": "apple" },
    { "fieldName": "storage", "value": "256gb" },
    { "fieldName": "ram", "value": "8gb" },
    { "fieldName": "screen_size", "value": "6.7" },
    { "fieldName": "condition", "value": "new" },
    { "fieldName": "has_warranty", "value": "true" }
  ]
}
```

**Searching for Phones:**

```json
{
  "search": {
    "query": "smartphone",
    "categoryIds": ["cat_phones_789"],
    "priceMax": 1500,
    "categoryFields": [
      { "fieldName": "brand", "value": "apple" },
      { "fieldName": "storage", "value": "256gb" },
      { "fieldName": "has_warranty", "value": "true" }
    ]
  }
}
```

### Best Practices

1. **Always provide categoryId in field values** when multiple categories share the same field name
2. **Use exact option values** for SELECT, RADIO fields (e.g., "toyota" not "Toyota")
3. **Format CHECKBOX values** as comma-separated strings without spaces
4. **Use range filtering for NUMBER fields** when searching by min/max (e.g., year range, price range, size range)
5. **Validate NUMBER fields** to ensure they're within acceptable ranges defined in field validation
6. **Use ISO date format** for DATE fields (YYYY-MM-DD)
7. **Store BOOLEAN as strings** ("true"/"false") not actual booleans

### Error Handling

**Invalid Field Name:**

```json
{
  "statusCode": 400,
  "message": "Category field 'invalid_field' not found for category",
  "error": "Bad Request"
}
```

**Invalid Field Value:**

```json
{
  "statusCode": 400,
  "message": "Invalid value 'xyz' for SELECT field 'brand'. Must be one of: toyota, honda, ford",
  "error": "Bad Request"
}
```

**Missing Required Field:**

```json
{
  "statusCode": 400,
  "message": "Required field 'brand' is missing",
  "error": "Bad Request"
}
```

### Query Performance Tips

- Filter by `categoryId` first before applying `categoryFields` filters
- Limit the number of category field filters in a single query (max 5 recommended)
- Use specific category IDs in field filters to improve query performance
- Combine price and location filters with category fields for optimal results

For detailed information about creating and managing category fields, see [Categories and Category Fields API Documentation](./CATEGORIES_AND_FIELDS_API.md).