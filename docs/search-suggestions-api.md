# Search Suggestions API Documentation

## Overview

The Search Suggestions API provides a lightweight, high-performance endpoint for retrieving minimal ad data optimized for search suggestions, autocomplete features, and quick previews. This endpoint returns only essential fields without heavy relations, resulting in significantly faster queries and reduced data transfer.

## Performance Benefits

- **80-90% less data transferred** compared to full search
- **Faster database queries** with minimal selects and no heavy joins
- **Optimized for autocomplete** and search-as-you-type features
- **Reduced server load** with lean response payloads
- **Redis caching** - Search results cached for 5 minutes to reduce database load
- **Smart cache invalidation** - Caches automatically cleared when ads are created/updated/deleted

---

## Endpoints

### 1. POST /ads/search/suggestions

**Dedicated lightweight search endpoint for minimal data.**

#### Request

```http
POST /ads/search/suggestions
Content-Type: application/json
```

#### Request Body

```json
{
  "query": "iPhone",
  "page": 1,
  "limit": 10,
  "categoryIds": ["cat_electronics_123"],
  "cityIds": ["city_accra_456"],
  "priceMin": 100,
  "priceMax": 2000,
  "conditions": ["NEW", "LIKE_NEW"],
  "promotionFilter": "all",
  "sortBy": "promotionPriority",
  "sortOrder": "desc"
}
```

#### Search Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `query` | string | No | - | Search text for title and description |
| `page` | number | No | 1 | Page number for pagination |
| `limit` | number | No | 20 | Items per page (max: 100) |
| `categoryIds` | string[] | No | - | Filter by category IDs |
| `cityIds` | string[] | No | - | Filter by city IDs |
| `priceMin` | number | No | - | Minimum price filter |
| `priceMax` | number | No | - | Maximum price filter |
| `conditions` | string[] | No | - | Filter by condition (NEW, LIKE_NEW, GOOD, FAIR, POOR) |
| `promotionFilter` | string | No | "all" | Filter by promotion status: "all", "promoted_only", "non_promoted_only" |
| `sortBy` | string | No | "promotionPriority" | Sort field: "promotionPriority", "createdAt", "price", "views" |
| `sortOrder` | string | No | "desc" | Sort order: "asc" or "desc" |
| `statuses` | string[] | No | - | Filter by status (admin only) |

#### Response

```json
{
  "data": [
    {
      "id": "ad_123abc",
      "title": "iPhone 13 Pro Max - Excellent Condition",
      "price": 999.99,
      "currency": "USD",
      "thumbnail": "https://cdn.willfind8.com/ads/image1.jpg",
      "cityName": "Accra",
      "categoryName": "Electronics",
      "categoryId": "cat_electronics_123",
      "status": "ACTIVE",
      "isPromoted": true,
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": "ad_456def",
      "title": "iPhone 12 - Like New",
      "price": 749.99,
      "currency": "USD",
      "thumbnail": "https://cdn.willfind8.com/ads/image2.jpg",
      "cityName": "Kumasi",
      "categoryName": "Electronics",
      "categoryId": "cat_electronics_123",
      "status": "ACTIVE",
      "isPromoted": false,
      "createdAt": "2024-01-14T08:20:00.000Z"
    }
  ],
  "meta": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique ad identifier |
| `title` | string | Ad title |
| `price` | number | Ad price |
| `currency` | string | Currency code (e.g., USD, GHS) |
| `thumbnail` | string \| null | First image URL (if available) |
| `cityName` | string \| null | City name (not full location object) |
| `categoryName` | string | Category name |
| `categoryId` | string | Category ID for filtering/navigation |
| `status` | string | Ad status (ACTIVE, SOLD, etc.) |
| `isPromoted` | boolean | Whether ad is currently promoted |
| `createdAt` | string | ISO 8601 timestamp |

---

### 2. POST /ads/search (with minimal flag)

**Use the existing search endpoint with minimal mode enabled.**

#### Request

```http
POST /ads/search
Content-Type: application/json
```

#### Request Body

```json
{
  "search": {
    "query": "laptop",
    "limit": 10,
    "minimal": true
  }
}
```

The `minimal: true` flag tells the main search endpoint to return lightweight data identical to the `/search/suggestions` endpoint.

---

## Use Cases

### 1. Autocomplete / Search-as-you-type

```javascript
// Frontend example
const searchInput = document.getElementById('search');
let debounceTimer;

searchInput.addEventListener('input', (e) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(async () => {
    const response = await fetch('/ads/search/suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: e.target.value,
        limit: 5
      })
    });
    const { data } = await response.json();
    displaySuggestions(data);
  }, 300);
});
```

### 2. Quick Category Preview

```javascript
// Get preview of ads in a category
const response = await fetch('/ads/search/suggestions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    categoryIds: ['cat_electronics_123'],
    limit: 12
  })
});
```

### 3. Mobile App List View

```javascript
// Efficient list rendering on mobile
const response = await fetch('/ads/search/suggestions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    page: currentPage,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })
});
```

### 4. Price Range Filter

```javascript
// Quick price-based filtering
const response = await fetch('/ads/search/suggestions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    priceMin: 500,
    priceMax: 1500,
    categoryIds: ['cat_phones_456']
  })
});
```

---

## Comparison: Full Search vs Suggestions

### Full Search Response (POST /ads/search)

```json
{
  "id": "ad_123",
  "title": "iPhone 13 Pro Max",
  "description": "Long description...",
  "price": 999.99,
  "user": {
    "id": "user_789",
    "username": "seller123",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "...",
    "sellerProfile": { /* ... */ }
  },
  "category": {
    "id": "cat_123",
    "name": "Electronics",
    "slug": "electronics",
    "icon": "..."
  },
  "city": {
    "id": "city_456",
    "name": "Accra",
    "state": {
      "id": "state_789",
      "name": "Greater Accra",
      "country": { /* ... */ }
    }
  },
  "fieldValues": [/* ... */],
  "tagLinks": [/* ... */],
  "_count": { /* ... */ },
  // ... many more fields
}
```

### Suggestions Response (POST /ads/search/suggestions)

```json
{
  "id": "ad_123",
  "title": "iPhone 13 Pro Max",
  "price": 999.99,
  "currency": "USD",
  "thumbnail": "https://cdn.willfind8.com/image.jpg",
  "cityName": "Accra",
  "categoryName": "Electronics",
  "categoryId": "cat_123",
  "status": "ACTIVE",
  "isPromoted": true,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Data Reduction: ~90% smaller response**

---

## Best Practices

### When to Use Suggestions Endpoint

✅ **Use `/ads/search/suggestions` for:**
- Search autocomplete/typeahead
- Quick category previews
- Mobile app list views
- Map markers with basic info
- "Related items" carousels
- Any UI showing multiple ads in a compact format

❌ **Use full `/ads/search` for:**
- Detailed search results pages
- When you need seller information
- When displaying category-specific fields
- When showing comment counts and saves
- Admin dashboards requiring full ad details

### Optimization Tips

1. **Keep limits reasonable**: For autocomplete, use `limit: 5-10`
2. **Debounce search input**: Wait 250-300ms before querying
3. **Cache results**: Cache suggestions for popular queries
4. **Prefetch on hover**: Load full details when user hovers over suggestion
5. **Progressive enhancement**: Load minimal data first, fetch full details on click

---

## Error Responses

### 400 Bad Request - Validation Errors

Invalid or missing parameters will return a 400 error:

```json
{
  "statusCode": 400,
  "message": ["limit must not be greater than 100"],
  "error": "Bad Request"
}
```

**Common validation errors:**
- `limit must not be greater than 100`
- `page must be a positive number`
- `Search parameters are required`
- `Invalid search parameters. Please check your request.`

### 400 Bad Request - Missing Body

```json
{
  "statusCode": 400,
  "message": "Search parameters are required",
  "error": "Bad Request"
}
```

### 401 Unauthorized (if endpoint requires auth)

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

---

## Authentication

The search suggestions endpoint is **public** and does not require authentication. However, authentication can be provided via Bearer token for personalized results:

```http
POST /ads/search/suggestions
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

When authenticated:
- Results may be personalized based on user preferences
- Admin users can filter by additional statuses
- User-specific permissions apply

---

## Rate Limiting

To ensure fair usage and system stability:

- **Public users**: 100 requests per minute
- **Authenticated users**: 200 requests per minute
- **Premium users**: 500 requests per minute

Exceeded rate limits return `429 Too Many Requests`.

---

## Related Endpoints

- **POST /ads/search** - Full search with complete ad data
- **GET /ads** - List all ads with basic filtering
- **GET /ads/:id** - Get single ad with full details
- **POST /ads** - Create new ad
- **GET /ads/saved** - Get user's saved ads

---

## Changelog

### Version 1.0.0 (December 2025)
- Initial release of search suggestions endpoint
- Added `minimal` flag to main search endpoint
- Optimized query performance with selective field loading
- Added `categoryId` to response for easier navigation

---

## Support

For questions or issues related to this API:
- **Email**: support@willfind8.com
- **Documentation**: https://docs.willfind8.com
- **GitHub Issues**: https://github.com/teincsolutions/willfind8-api/issues
