# Ads API Endpoints - Complete Guide

This guide provides detailed documentation on how to use the Ads API endpoints, with special focus on creating, retrieving, and updating ads, including handling category fields with different field types.

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Creating an Ad](#creating-an-ad)
4. [Retrieving Ads](#retrieving-ads)
5. [Updating an Ad](#updating-an-ad)
6. [Category Fields Explained](#category-fields-explained)
7. [Complete Examples](#complete-examples)
8. [Error Handling](#error-handling)

---

## Overview

The Ads API allows users to create, retrieve, update, and delete classified advertisements. Each ad can have:

- Basic information (title, description, price, images, etc.)
- Location data (city, address, coordinates)
- Category-specific fields (dynamic fields defined by the category)

**Base URL**: `/ads`

---

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

---

## Creating an Ad

### Endpoint

```http
POST /ads
```

**Authentication**: Required  
**Role**: Any authenticated user

### Request Body Structure

```typescript
{
  // Basic Information (Required)
  "title": string,
  "description": string,
  "categoryId": string,

  // Optional Basic Fields
  "price": number,
  "currency": string,  // Default: "USD"
  "condition": "NEW" | "LIKE_NEW" | "GOOD" | "FAIR" | "POOR",
  "images": string[],
  "videos": string[],
  "status": "DRAFT" | "PENDING" | "ACTIVE" | "SOLD" | "EXPIRED" | "SUSPENDED" | "DELETED",

  // Location (Optional)
  "cityId": string,
  "address": string,
  "latitude": number,    // -90 to 90
  "longitude": number,   // -180 to 180

  // Contact (Optional)
  "contactPhone": string,
  "contactEmail": string,

  // Other Options
  "isNegotiable": boolean,  // Default: false
  "expiresAt": string,      // ISO 8601 date string

  // Category Fields (Choose ONE method)
  // Method 1: Using field IDs (if you already have them)
  "fieldValues": [
    {
      "categoryFieldId": string,
      "value": string
    }
  ],

  // Method 2: Using field names (RECOMMENDED)
  "namedFieldValues": [
    {
      "fieldName": string,
      "value": any,  // Can be string, number, boolean, array, or object
      "categoryId": string  // Optional, for disambiguation
    }
  ]
}
```

### Category Fields - Value Format by Field Type

When using `namedFieldValues`, the `value` format depends on the field type:

#### 1. TEXT Field

```json
{
  "fieldName": "model",
  "value": "Camry"
}
```

#### 2. NUMBER Field

```json
{
  "fieldName": "year",
  "value": "2020"
}
```

_Note: Even for NUMBER fields, send as string for consistency_

#### 3. SELECT Field (Single Selection)

```json
{
  "fieldName": "transmission",
  "value": "automatic"
}
```

_Send the option's value property, not the label_

#### 4. RADIO Field (Single Selection)

```json
{
  "fieldName": "fuel_type",
  "value": "petrol"
}
```

_Similar to SELECT - send the option value_

#### 5. CHECKBOX Field (Multiple Selection)

```json
{
  "fieldName": "features",
  "value": ["air_conditioning", "power_windows", "bluetooth"]
}
```

_Send as array of option values. The backend will automatically convert it to a stringified JSON array for storage._

**Important**: When you retrieve the ad, this value will be returned as a **stringified JSON string**, not an array:

- Stored as: `"[\"air_conditioning\",\"power_windows\",\"bluetooth\"]"`
- You must use `JSON.parse(value)` to get the actual array when displaying

#### 6. TEXTAREA Field

```json
{
  "fieldName": "detailed_description",
  "value": "Long text content here..."
}
```

#### 7. DATE Field

```json
{
  "fieldName": "manufacture_date",
  "value": "2020-06-15"
}
```

_Use ISO 8601 date format (YYYY-MM-DD)_

#### 8. BOOLEAN Field

```json
{
  "fieldName": "has_warranty",
  "value": "true"
}
```

_Can send as string "true"/"false" or boolean true/false_

---

### Complete Create Ad Examples

#### Example 1: Simple Ad Without Category Fields

```http
POST /ads
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "iPhone 13 Pro - Excellent Condition",
  "description": "Selling my iPhone 13 Pro, barely used, includes original box and accessories.",
  "price": 899.99,
  "currency": "USD",
  "condition": "LIKE_NEW",
  "categoryId": "clx123xyz",
  "cityId": "city_456",
  "images": [
    "https://s3.bucket.com/img1.jpg",
    "https://s3.bucket.com/img2.jpg"
  ],
  "contactPhone": "+1234567890",
  "isNegotiable": true,
  "status": "PENDING"
}
```

#### Example 2: Car Ad With Category Fields (TEXT, SELECT, NUMBER)

Assume the "Cars" category has these fields:

- `brand` (TEXT)
- `model` (TEXT)
- `year` (NUMBER)
- `transmission` (SELECT: automatic, manual)
- `fuel_type` (RADIO: petrol, diesel, electric, hybrid)
- `mileage` (NUMBER)

```http
POST /ads
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "2020 Toyota Camry - Low Mileage",
  "description": "Well maintained, single owner, full service history.",
  "price": 18500,
  "currency": "USD",
  "condition": "GOOD",
  "categoryId": "cars_category_id",
  "cityId": "new_york_id",
  "address": "123 Main St, Brooklyn",
  "latitude": 40.6782,
  "longitude": -73.9442,
  "images": [
    "https://s3.bucket.com/car-front.jpg",
    "https://s3.bucket.com/car-interior.jpg"
  ],
  "contactPhone": "+1234567890",
  "isNegotiable": true,
  "namedFieldValues": [
    {
      "fieldName": "brand",
      "value": "Toyota"
    },
    {
      "fieldName": "model",
      "value": "Camry"
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
      "fieldName": "mileage",
      "value": "25000"
    }
  ]
}
```

#### Example 3: Property Ad With CHECKBOX (Multiple Values)

Assume "Real Estate" category has:

- `property_type` (SELECT: apartment, house, condo)
- `bedrooms` (NUMBER)
- `bathrooms` (NUMBER)
- `amenities` (CHECKBOX: pool, gym, parking, security, garden, balcony)
- `furnished` (BOOLEAN)

```http
POST /ads
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Luxury 3BR Apartment with Pool",
  "description": "Beautiful apartment in prime location with modern amenities.",
  "price": 2500,
  "currency": "USD",
  "categoryId": "real_estate_category_id",
  "cityId": "los_angeles_id",
  "address": "456 Sunset Blvd",
  "latitude": 34.0522,
  "longitude": -118.2437,
  "images": [
    "https://s3.bucket.com/apt-living.jpg",
    "https://s3.bucket.com/apt-bedroom.jpg",
    "https://s3.bucket.com/apt-pool.jpg"
  ],
  "contactEmail": "owner@example.com",
  "contactPhone": "+1987654321",
  "namedFieldValues": [
    {
      "fieldName": "property_type",
      "value": "apartment"
    },
    {
      "fieldName": "bedrooms",
      "value": "3"
    },
    {
      "fieldName": "bathrooms",
      "value": "2"
    },
    {
      "fieldName": "amenities",
      "value": ["pool", "gym", "parking", "security"]
    },
    {
      "fieldName": "furnished",
      "value": "true"
    }
  ]
}
```

#### Example 4: Using Field IDs Instead of Names

If you already have the field IDs:

```http
POST /ads
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Gaming Laptop - High Performance",
  "description": "Perfect for gaming and content creation",
  "price": 1299.99,
  "categoryId": "electronics_laptops_id",
  "cityId": "chicago_id",
  "fieldValues": [
    {
      "categoryFieldId": "field_abc123",
      "value": "Dell"
    },
    {
      "categoryFieldId": "field_def456",
      "value": "Alienware M15"
    },
    {
      "categoryFieldId": "field_ghi789",
      "value": "16"
    }
  ]
}
```

### Response Format (201 Created)

```json
{
  "id": "ad_xyz789",
  "title": "2020 Toyota Camry - Low Mileage",
  "description": "Well maintained, single owner, full service history.",
  "price": "18500.00",
  "currency": "USD",
  "condition": "GOOD",
  "images": [
    "https://s3.bucket.com/car-front.jpg",
    "https://s3.bucket.com/car-interior.jpg"
  ],
  "videos": [],
  "status": "PENDING",
  "isPromoted": false,
  "promotionEnds": null,
  "views": 0,
  "userId": "user_123",
  "categoryId": "cars_category_id",
  "cityId": "new_york_id",
  "address": "123 Main St, Brooklyn",
  "latitude": 40.6782,
  "longitude": -73.9442,
  "contactPhone": "+1234567890",
  "contactEmail": null,
  "isNegotiable": true,
  "expiresAt": null,
  "createdAt": "2025-11-29T10:00:00.000Z",
  "updatedAt": "2025-11-29T10:00:00.000Z",
  "user": {
    "id": "user_123",
    "username": "john_doe",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "https://s3.bucket.com/avatar.jpg",
    "sellerProfile": {
      "id": "seller_123",
      "rating": 4.5,
      "totalReviews": 10,
      "isVerified": true
    }
  },
  "category": {
    "id": "cars_category_id",
    "name": "Cars",
    "slug": "cars",
    "description": "Buy and sell cars",
    "icon": "car-icon.svg",
    "parentId": "vehicles_id",
    "isActive": true,
    "sortOrder": 1
  },
  "city": {
    "id": "new_york_id",
    "name": "Brooklyn",
    "state": {
      "id": "ny_state_id",
      "name": "New York",
      "code": "NY",
      "country": {
        "id": "usa_id",
        "name": "United States",
        "code": "US"
      }
    }
  },
  "fieldValues": [
    {
      "id": "fv_001",
      "adId": "ad_xyz789",
      "categoryFieldId": "field_brand",
      "value": "Toyota",
      "createdAt": "2025-11-29T10:00:00.000Z",
      "categoryField": {
        "id": "field_brand",
        "categoryId": "cars_category_id",
        "name": "brand",
        "label": "Brand",
        "type": "TEXT",
        "isRequired": true,
        "options": null,
        "validation": null,
        "sortOrder": 1
      }
    },
    {
      "id": "fv_002",
      "adId": "ad_xyz789",
      "categoryFieldId": "field_model",
      "value": "Camry",
      "createdAt": "2025-11-29T10:00:00.000Z",
      "categoryField": {
        "id": "field_model",
        "categoryId": "cars_category_id",
        "name": "model",
        "label": "Model",
        "type": "TEXT",
        "isRequired": true,
        "options": null,
        "validation": null,
        "sortOrder": 2
      }
    },
    {
      "id": "fv_003",
      "adId": "ad_xyz789",
      "categoryFieldId": "field_year",
      "value": "2020",
      "createdAt": "2025-11-29T10:00:00.000Z",
      "categoryField": {
        "id": "field_year",
        "categoryId": "cars_category_id",
        "name": "year",
        "label": "Year",
        "type": "NUMBER",
        "isRequired": true,
        "options": null,
        "validation": {
          "minLength": 4,
          "maxLength": 4
        },
        "sortOrder": 3
      }
    },
    {
      "id": "fv_004",
      "adId": "ad_xyz789",
      "categoryFieldId": "field_transmission",
      "value": "automatic",
      "createdAt": "2025-11-29T10:00:00.000Z",
      "categoryField": {
        "id": "field_transmission",
        "categoryId": "cars_category_id",
        "name": "transmission",
        "label": "Transmission",
        "type": "SELECT",
        "isRequired": true,
        "options": [
          {
            "label": "Automatic",
            "value": "automatic"
          },
          {
            "label": "Manual",
            "value": "manual"
          }
        ],
        "validation": null,
        "sortOrder": 4
      }
    },
    {
      "id": "fv_005",
      "adId": "ad_xyz789",
      "categoryFieldId": "field_fuel",
      "value": "petrol",
      "createdAt": "2025-11-29T10:00:00.000Z",
      "categoryField": {
        "id": "field_fuel",
        "categoryId": "cars_category_id",
        "name": "fuel_type",
        "label": "Fuel Type",
        "type": "RADIO",
        "isRequired": false,
        "options": [
          {
            "label": "Petrol",
            "value": "petrol"
          },
          {
            "label": "Diesel",
            "value": "diesel"
          },
          {
            "label": "Electric",
            "value": "electric"
          },
          {
            "label": "Hybrid",
            "value": "hybrid"
          }
        ],
        "validation": null,
        "sortOrder": 5
      }
    },
    {
      "id": "fv_006",
      "adId": "ad_xyz789",
      "categoryFieldId": "field_mileage",
      "value": "25000",
      "createdAt": "2025-11-29T10:00:00.000Z",
      "categoryField": {
        "id": "field_mileage",
        "categoryId": "cars_category_id",
        "name": "mileage",
        "label": "Mileage (km)",
        "type": "NUMBER",
        "isRequired": false,
        "options": null,
        "validation": null,
        "sortOrder": 6
      }
    }
  ],
  "tagLinks": [],
  "_count": {
    "savedBy": 0,
    "comments": 0
  }
}
```

**Note on CHECKBOX Fields**: If the ad included a CHECKBOX field (like amenities from Example 3), the response would look like this:

```json
{
  "id": "fv_007",
  "adId": "apt_xyz123",
  "categoryFieldId": "field_amenities",
  "value": "[\"pool\",\"gym\",\"parking\",\"security\"]", // ← Stringified JSON array, NOT a real array
  "createdAt": "2025-11-29T10:00:00.000Z",
  "categoryField": {
    "id": "field_amenities",
    "categoryId": "real_estate_category_id",
    "name": "amenities",
    "label": "Amenities",
    "type": "CHECKBOX",
    "isRequired": false,
    "options": [
      { "label": "Swimming Pool", "value": "pool" },
      { "label": "Gym", "value": "gym" },
      { "label": "Parking", "value": "parking" },
      { "label": "Security", "value": "security" },
      { "label": "Garden", "value": "garden" },
      { "label": "Balcony", "value": "balcony" }
    ],
    "validation": null,
    "sortOrder": 4
  }
}
```

**Important**: Notice the `value` field is a **string** `"[\"pool\",\"gym\",\"parking\",\"security\"]"`, not an array. You must parse it: `JSON.parse(fv.value)` to get `["pool", "gym", "parking", "security"]`.

---

## Retrieving Ads

### Get All Ads (Public)

```http
GET /ads?page=1&limit=20&categoryId=cars_category_id&minPrice=10000&maxPrice=30000
```

**Authentication**: Optional (if authenticated, includes `isSaved` field)

#### Query Parameters

| Parameter        | Type        | Description                         | Example            |
| ---------------- | ----------- | ----------------------------------- | ------------------ |
| `page`           | number      | Page number (default: 1)            | `1`                |
| `limit`          | number      | Items per page (1-100, default: 20) | `20`               |
| `categoryId`     | string      | Filter by category                  | `cars_category_id` |
| `cityId`         | string      | Filter by city                      | `new_york_id`      |
| `minPrice`       | number      | Minimum price                       | `10000`            |
| `maxPrice`       | number      | Maximum price                       | `30000`            |
| `condition`      | enum        | NEW, LIKE_NEW, GOOD, FAIR, POOR     | `GOOD`             |
| `status`         | enum        | Ad status (default: ACTIVE)         | `ACTIVE`           |
| `search`         | string      | Search in title/description         | `Toyota Camry`     |
| `sortBy`         | string      | Sort field (default: createdAt)     | `price`            |
| `sortOrder`      | enum        | asc or desc (default: desc)         | `asc`              |
| `categoryFields` | JSON string | Filter by category fields           | See below          |

#### Filtering by Category Fields

To filter by category fields, pass a URL-encoded JSON string:

**Example 1: Filter cars by brand**

```javascript
// JavaScript
const filters = [
  {
    fieldName: 'brand',
    value: 'Toyota',
    categoryId: 'cars_category_id', // Optional
  },
];

const encoded = encodeURIComponent(JSON.stringify(filters));
// URL: /ads?categoryFields=%5B%7B%22fieldName%22%3A%22brand%22...
```

**Example 2: Multiple field filters (brand AND transmission)**

```javascript
const filters = [
  {
    fieldName: 'brand',
    value: 'Toyota',
  },
  {
    fieldName: 'transmission',
    value: 'automatic',
  },
];

const encoded = encodeURIComponent(JSON.stringify(filters));
```

**Full URL Example:**

```
GET /ads?page=1&limit=20&categoryId=cars_category_id&categoryFields=%5B%7B%22fieldName%22%3A%22brand%22%2C%22value%22%3A%22Toyota%22%7D%2C%7B%22fieldName%22%3A%22transmission%22%2C%22value%22%3A%22automatic%22%7D%5D
```

#### Response Format

```json
{
  "data": [
    {
      "id": "ad_xyz789",
      "title": "2020 Toyota Camry - Low Mileage",
      // ... full ad object with fieldValues as shown in create response
      "isSaved": false // Only present if user is authenticated
    }
  ],
  "meta": {
    "total": 156,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

### Get Single Ad

```http
GET /ads/:id
```

**Authentication**: Optional (if authenticated, increments view count and includes `isSaved`)

#### Response Format

Same as create response, but includes comments:

```json
{
  "id": "ad_xyz789",
  "title": "2020 Toyota Camry - Low Mileage",
  // ... all fields
  "fieldValues": [
    // ... as shown above
  ],
  "comments": [
    {
      "id": "comment_001",
      "adId": "ad_xyz789",
      "userId": "user_456",
      "content": "Is this still available?",
      "parentId": null,
      "createdAt": "2025-11-29T12:00:00.000Z",
      "updatedAt": "2025-11-29T12:00:00.000Z",
      "user": {
        "id": "user_456",
        "username": "jane_smith",
        "firstName": "Jane",
        "lastName": "Smith",
        "avatar": "https://s3.bucket.com/jane-avatar.jpg"
      },
      "replies": [
        {
          "id": "comment_002",
          "adId": "ad_xyz789",
          "userId": "user_123",
          "content": "Yes, still available!",
          "parentId": "comment_001",
          "createdAt": "2025-11-29T12:30:00.000Z",
          "updatedAt": "2025-11-29T12:30:00.000Z",
          "user": {
            "id": "user_123",
            "username": "john_doe",
            "firstName": "John",
            "lastName": "Doe",
            "avatar": "https://s3.bucket.com/avatar.jpg"
          }
        }
      ]
    }
  ],
  "isSaved": true,
  "_count": {
    "savedBy": 5,
    "comments": 2
  }
}
```

### Advanced Search

```http
POST /ads/search
Content-Type: application/json

{
  "search": {
    "query": "Toyota",
    "categoryIds": ["cars_category_id"],
    "cityIds": ["new_york_id"],
    "userIds": ["user_id"],
    "priceMin": 15000,
    "priceMax": 25000,
    "conditions": ["GOOD", "LIKE_NEW"],
    "hasImages": true,
    "isNegotiable": true,
    "sortBy": "price",
    "sortOrder": "asc",
    "page": 1,
    "limit": 20,
    "categoryFields": [
      {
        "fieldName": "transmission",
        "value": "automatic"
      },
      {
        "fieldName": "fuel_type",
        "value": "petrol"
      }
    ]
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

#### Response with Facets

```json
{
  "data": [
    // ... array of ads
  ],
  "meta": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  },
  "facets": {
    "categories": [
      {
        "id": "cars_category_id",
        "name": "Cars",
        "count": 45
      }
    ],
    "cities": [
      {
        "id": "new_york_id",
        "name": "New York",
        "count": 30
      },
      {
        "id": "los_angeles_id",
        "name": "Los Angeles",
        "count": 15
      }
    ],
    "conditions": [
      {
        "condition": "LIKE_NEW",
        "count": 20
      },
      {
        "condition": "GOOD",
        "count": 25
      }
    ],
    "priceRanges": [
      {
        "min": 15000,
        "max": 20000,
        "count": 30
      },
      {
        "min": 20000,
        "max": 25000,
        "count": 15
      }
    ],
    "promotions": {
      "promoted": 10,
      "notPromoted": 35
    }
  }
}
```

### Get User's Ads

```http
GET /ads/my-ads?page=1&limit=20&status=ACTIVE
```

**Authentication**: Required

Returns all ads created by the authenticated user.

### Get Saved/Bookmarked Ads

```http
GET /ads/saved?page=1&limit=20
```

**Authentication**: Required

Returns all ads saved by the authenticated user.

---

## Updating an Ad

### Endpoint

```http
PATCH /ads/:id
Authorization: Bearer <token>
Content-Type: application/json
```

**Authentication**: Required  
**Authorization**: Only ad owner or admin

### Request Body

All fields are optional. Only include fields you want to update:

```json
{
  "title": "Updated Title",
  "price": 17500,
  "status": "ACTIVE",
  "namedFieldValues": [
    {
      "fieldName": "mileage",
      "value": "26000"
    }
  ]
}
```

### Complete Update Examples

#### Example 1: Update Basic Info Only

```http
PATCH /ads/ad_xyz789
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "2020 Toyota Camry - Low Mileage - PRICE REDUCED!",
  "price": 17000,
  "isNegotiable": false
}
```

#### Example 2: Update Category Fields Only

```http
PATCH /ads/ad_xyz789
Authorization: Bearer <token>
Content-Type: application/json

{
  "namedFieldValues": [
    {
      "fieldName": "mileage",
      "value": "27000"
    },
    {
      "fieldName": "transmission",
      "value": "manual"
    }
  ]
}
```

**Important**: When updating field values:

- You can update individual fields without affecting others
- Existing field values not mentioned in the update remain unchanged
- To remove a field value, you need to explicitly set it to an empty string or null

#### Example 3: Update Images and Add New Field

```http
PATCH /ads/ad_xyz789
Authorization: Bearer <token>
Content-Type: application/json

{
  "images": [
    "https://s3.bucket.com/car-front-new.jpg",
    "https://s3.bucket.com/car-interior-new.jpg",
    "https://s3.bucket.com/car-engine.jpg"
  ],
  "namedFieldValues": [
    {
      "fieldName": "service_history",
      "value": "Full service history available"
    }
  ]
}
```

#### Example 4: Update Multiple Selection Field (CHECKBOX)

Assume you're updating apartment amenities:

```http
PATCH /ads/apt_xyz123
Authorization: Bearer <token>
Content-Type: application/json

{
  "namedFieldValues": [
    {
      "fieldName": "amenities",
      "value": ["pool", "gym", "parking", "security", "concierge"]
    }
  ]
}
```

#### Example 5: Change Status to SOLD

```http
PATCH /ads/ad_xyz789
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "SOLD"
}
```

### Response Format

Returns the updated ad in the same format as the create response, with all field values included.

---

## Category Fields Explained

### Field Types Overview

| Type       | Description                   | Value Format (Sending) | Value Format (Receiving)   | Example Use Case           |
| ---------- | ----------------------------- | ---------------------- | -------------------------- | -------------------------- |
| `TEXT`     | Single-line text input        | String                 | String                     | Brand, Model, Name         |
| `TEXTAREA` | Multi-line text input         | String                 | String                     | Detailed description       |
| `NUMBER`   | Numeric input                 | String (numeric)       | String (numeric)           | Year, Price, Quantity      |
| `SELECT`   | Dropdown (single choice)      | String (option value)  | String (option value)      | Transmission, Size         |
| `RADIO`    | Radio buttons (single choice) | String (option value)  | String (option value)      | Fuel type, Condition       |
| `CHECKBOX` | Multiple checkboxes           | Array of strings       | **Stringified JSON array** | Features, Amenities        |
| `DATE`     | Date picker                   | ISO 8601 date string   | ISO 8601 date string       | Manufacture date, Expiry   |
| `BOOLEAN`  | Yes/No toggle                 | String "true"/"false"  | String "true"/"false"      | Has warranty, Pet-friendly |

### How Category Fields Work

1. **Category Creation**: Admin creates a category (e.g., "Cars")
2. **Field Definition**: Admin defines custom fields for that category:
   - Field name: `transmission`
   - Field label: `Transmission Type`
   - Field type: `SELECT`
   - Options: `[{label: "Automatic", value: "automatic"}, {label: "Manual", value: "manual"}]`
3. **Ad Creation**: User posts an ad in "Cars" category and provides field values
4. **Ad Display**: Frontend displays the ad with all category field values

### Best Practices

#### When Creating/Updating Ads:

1. **Always use `namedFieldValues`** instead of `fieldValues` when possible
   - More readable and maintainable
   - Doesn't require field ID lookups
   - Better for frontend development

2. **For SELECT/RADIO fields**:
   - Send the `value` from the option object, not the `label`
   - Example: Send `"automatic"` not `"Automatic"`

3. **For CHECKBOX fields**:
   - Send as array: `["option1", "option2", "option3"]`
   - Backend stores it as stringified JSON
   - **When retrieving**: The value will be a string, not an array - you must parse it with `JSON.parse()`

4. **For NUMBER fields**:
   - Send as string: `"2020"` not `2020`
   - Backend handles conversion

5. **For DATE fields**:
   - Use ISO 8601 format: `"2020-06-15"`
   - Or full datetime: `"2020-06-15T00:00:00.000Z"`

6. **For BOOLEAN fields**:
   - Send as string: `"true"` or `"false"`
   - Or as boolean: `true` or `false`

#### When Displaying Ads:

1. **Check field type** before rendering
2. **For SELECT/RADIO**: Match `fieldValues.value` with `categoryField.options[].value` to display the label
3. **For CHECKBOX**: **IMPORTANT** - The value is stored as a stringified JSON array:
   - First, parse it: `JSON.parse(fv.value)` to get the actual array
   - Then iterate the array to match with option labels
   - Example: `"[\"pool\",\"gym\"]"` → `["pool", "gym"]`
4. **For NUMBER**: Format appropriately (commas, decimals, etc.)
5. **For DATE**: Format to user's locale

---

## Complete Examples

### Frontend Integration Example (React/TypeScript)

#### Creating an Ad with Category Fields

```typescript
// 1. Fetch category fields when user selects a category
const fetchCategoryFields = async (categoryId: string) => {
  const response = await fetch(`/api/category-fields?categoryId=${categoryId}`);
  const { data } = await response.json();
  return data;
};

// 2. Build dynamic form based on field types
const renderFieldInput = (field: CategoryField) => {
  switch (field.type) {
    case 'TEXT':
      return <input type="text" name={field.name} />;

    case 'NUMBER':
      return <input type="number" name={field.name} />;

    case 'SELECT':
      return (
        <select name={field.name}>
          {field.options?.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );

    case 'RADIO':
      return (
        <div>
          {field.options?.map(opt => (
            <label key={opt.value}>
              <input type="radio" name={field.name} value={opt.value} />
              {opt.label}
            </label>
          ))}
        </div>
      );

    case 'CHECKBOX':
      return (
        <div>
          {field.options?.map(opt => (
            <label key={opt.value}>
              <input type="checkbox" name={field.name} value={opt.value} />
              {opt.label}
            </label>
          ))}
        </div>
      );

    case 'TEXTAREA':
      return <textarea name={field.name} />;

    case 'DATE':
      return <input type="date" name={field.name} />;

    case 'BOOLEAN':
      return <input type="checkbox" name={field.name} />;

    default:
      return <input type="text" name={field.name} />;
  }
};

// 3. Submit ad with field values
const createAd = async (formData: any) => {
  const namedFieldValues = categoryFields.map(field => {
    let value = formData[field.name];

    // Handle CHECKBOX - collect all checked values
    if (field.type === 'CHECKBOX') {
      value = Array.from(
        document.querySelectorAll(`input[name="${field.name}"]:checked`)
      ).map((input: any) => input.value);
    }

    // Handle BOOLEAN
    if (field.type === 'BOOLEAN') {
      value = formData[field.name] ? 'true' : 'false';
    }

    return {
      fieldName: field.name,
      value: value
    };
  });

  const adData = {
    title: formData.title,
    description: formData.description,
    price: formData.price,
    categoryId: formData.categoryId,
    // ... other fields
    namedFieldValues: namedFieldValues
  };

  const response = await fetch('/api/ads', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(adData)
  });

  return response.json();
};
```

#### Displaying Ad with Category Fields

```typescript
const DisplayAd = ({ ad }: { ad: Ad }) => {
  return (
    <div>
      <h1>{ad.title}</h1>
      <p>{ad.description}</p>
      <p>Price: ${ad.price}</p>

      {/* Display category fields */}
      <div className="category-fields">
        <h3>Specifications</h3>
        {ad.fieldValues?.map(fv => {
          const field = fv.categoryField;
          let displayValue = fv.value;

          // For SELECT/RADIO, show the label instead of value
          if (field.type === 'SELECT' || field.type === 'RADIO') {
            const option = field.options?.find(opt => opt.value === fv.value);
            displayValue = option?.label || fv.value;
          }

          // For CHECKBOX, show comma-separated labels
          // IMPORTANT: The value is stored as stringified JSON, must parse it first
          if (field.type === 'CHECKBOX') {
            try {
              // Parse the stringified JSON array
              const values = JSON.parse(fv.value);

              const labels = values
                .map(v => field.options?.find(opt => opt.value === v)?.label)
                .filter(Boolean)
                .join(', ');

              displayValue = labels;
            } catch (e) {
              // Fallback if parsing fails
              displayValue = fv.value;
            }
          }

          // For BOOLEAN, show Yes/No
          if (field.type === 'BOOLEAN') {
            displayValue = fv.value === 'true' ? 'Yes' : 'No';
          }

          // For DATE, format nicely
          if (field.type === 'DATE') {
            displayValue = new Date(fv.value).toLocaleDateString();
          }

          return (
            <div key={fv.id} className="field-row">
              <strong>{field.label}:</strong>
              <span>{displayValue}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
```

---

## Error Handling

### Common Error Responses

#### 400 Bad Request - Validation Error

```json
{
  "statusCode": 400,
  "message": [
    "title should not be empty",
    "categoryId must be a valid category"
  ],
  "error": "Bad Request"
}
```

#### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

#### 403 Forbidden

```json
{
  "statusCode": 403,
  "message": "You don't have permission to update this ad",
  "error": "Forbidden"
}
```

#### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Ad not found",
  "error": "Not Found"
}
```

### Validation Rules

1. **Required Fields**:
   - `title` (minimum 3 characters)
   - `description` (minimum 10 characters)
   - `categoryId` (must be valid category)

2. **Optional Fields**:
   - `price` must be positive number
   - `latitude` must be between -90 and 90
   - `longitude` must be between -180 and 180
   - `images` and `videos` must be arrays of valid URLs

3. **Category Fields**:
   - Required fields (marked as `isRequired: true`) must be provided
   - Values must match field type expectations
   - SELECT/RADIO values must be in the options list
   - CHECKBOX values must all be in the options list

---

## Additional Endpoints

### Save/Bookmark an Ad

```http
POST /ads/:id/save
Authorization: Bearer <token>
```

### Unsave/Remove Bookmark

```http
DELETE /ads/:id/save
Authorization: Bearer <token>
```

### Delete an Ad (Soft Delete)

```http
DELETE /ads/:id
Authorization: Bearer <token>
```

Only the ad owner can delete their ad. Sets status to `DELETED`.

---

## Admin Endpoints

### Get All Ads (Admin)

```http
GET /ads/admin/all?page=1&limit=20&status=PENDING
Authorization: Bearer <admin-token>
```

### Get Pending Ads

```http
GET /ads/admin/pending?page=1&limit=20
Authorization: Bearer <admin-token>
```

### Approve Ad

```http
POST /ads/:id/admin/approve
Authorization: Bearer <admin-token>
```

Changes status from `PENDING` to `ACTIVE`.

### Reject Ad

```http
POST /ads/:id/admin/reject
Authorization: Bearer <admin-token>
```

Changes status from `PENDING` to `DRAFT`.

### Update Ad Status

```http
PATCH /ads/:id/admin/status
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "status": "SUSPENDED"
}
```

Allows admin to set any status.

### Get Deleted Ads

```http
GET /ads/deleted?page=1&limit=20
Authorization: Bearer <admin-token>
```

---

## Summary

### Key Takeaways

1. **Use `namedFieldValues`** for better developer experience
2. **Category fields are flexible** - each category can have unique fields
3. **Field types determine how values are stored** - always send as strings except arrays for CHECKBOX
4. **SELECT/RADIO store values**, not labels - match with options to display
5. **CHECKBOX fields are special**:
   - Send as array: `["option1", "option2"]`
   - Received as stringified JSON: `"[\"option1\",\"option2\"]"`
   - **Must use `JSON.parse()`** when displaying
6. **All updates are partial** - only modified fields need to be sent
7. **Authentication is optional for reading**, but required for creating/updating/deleting
8. **isSaved field** only appears when user is authenticated

### Quick Reference

| Action        | Endpoint        | Auth     | Method |
| ------------- | --------------- | -------- | ------ |
| Create Ad     | `/ads`          | Required | POST   |
| Get All Ads   | `/ads`          | Optional | GET    |
| Get Single Ad | `/ads/:id`      | Optional | GET    |
| Update Ad     | `/ads/:id`      | Required | PATCH  |
| Delete Ad     | `/ads/:id`      | Required | DELETE |
| Search Ads    | `/ads/search`   | Optional | POST   |
| My Ads        | `/ads/my-ads`   | Required | GET    |
| Saved Ads     | `/ads/saved`    | Required | GET    |
| Save Ad       | `/ads/:id/save` | Required | POST   |
| Unsave Ad     | `/ads/:id/save` | Required | DELETE |

---

## Support

For more information:

- Check the Swagger/OpenAPI documentation at `/api/docs`
- Review category fields documentation in `/docs/CATEGORY_FIELDS_FILTER_README.md`
- Contact API support team

---

**Last Updated**: November 29, 2025  
**API Version**: 1.0
