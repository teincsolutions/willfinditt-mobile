# Ads Approval System API Documentation

## Overview

The Ads Approval System provides comprehensive ad management with automated approval, admin oversight, audit trails, and seller experience features. The system ensures quality control while providing efficient workflows for both sellers and administrators.

**Current Implementation Status:**
- ✅ **Core ad operations** (create, read, update, delete)
- ✅ **Automated approval system** with trust scoring
- ✅ **Admin approval/rejection** with bulk operations
- ✅ **Search and filtering** capabilities
- ✅ **User ad management** (save/unsave favorites)
- ✅ **Seller experience tools** (statistics, resubmission workflow, guidelines)
- ✅ **Admin dashboard** (performance metrics, workload management, escalation)
- ✅ **Audit & compliance reporting** (approval history, performance analytics)
yuiop
## Core Features

- **Automated Approval**: Trusted sellers with quality content get instant approval
- **Admin Dashboard**: Queue management, bulk operations, and performance tracking
- **Audit Compliance**: Complete approval history and compliance reporting
- **Seller Tools**: Submission guidelines, resubmission workflow, and statistics
- **Content Validation**: Spam detection, quality scoring, and category rules

## API Endpoints

### Ad Creation & Auto-Approval

#### POST /ads
Create a new ad with automatic approval checking.

**Request Body:**
```json
{
  "title": "iPhone 15 Pro Max",
  "description": "Latest iPhone in excellent condition",
  "price": 1200.00,
  "currency": "USD",
  "condition": "EXCELLENT",
  "images": ["https://example.com/image1.jpg"],
  "categoryId": "category-uuid",
  "contactPhone": "+1234567890",
  "contactEmail": "seller@example.com",
  "address": "123 Main St",
  "cityId": "city-uuid"
}
```

**Response (Auto-Approved):**
```json
{
  "id": "ad-uuid",
  "title": "iPhone 15 Pro Max",
  "status": "ACTIVE",
  "user": { "username": "seller123" },
  "category": { "name": "Electronics" },
  "createdAt": "2025-12-27T10:00:00Z"
}
```

**Response (Pending Review):**
```json
{
  "id": "ad-uuid",
  "title": "iPhone 15 Pro Max",
  "status": "PENDING",
  "user": { "username": "newseller" },
  "category": { "name": "Electronics" },
  "createdAt": "2025-12-27T10:00:00Z"
}
```

### Ad Listing & Search

#### GET /ads
Get all ads with filtering and pagination.

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `categoryId`
- `cityId`
- `minPrice`, `maxPrice`
- `condition`
- `search` (search terms)
- `status` (admins can use DELETED)

#### POST /ads/search/suggestions
Get search suggestions based on query.

#### POST /ads/search
Advanced search with facets.

### User Ad Management

#### GET /ads/my-ads
Get current user's ads.

#### GET /ads/saved
Get user's saved ads.

#### POST /ads/{id}/save
Save an ad to favorites.

#### DELETE /ads/{id}/save
Remove ad from favorites.

### Individual Ad Operations

#### GET /ads/{id}
Get single ad details.

#### GET /ads/{id}/admin
Get single ad details (Admin only).

#### PATCH /ads/{id}
Update an ad.

#### DELETE /ads/{id}
Delete an ad.

### Statistics

#### GET /ads/stats/overview
Get overview statistics.

### Admin Approval Actions

#### GET /ads/admin/pending
Get all PENDING ads (Admin only).

#### GET /ads/admin/queue
Get pending ads queue with priority ordering (Admin only).

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 50)
- `assignedTo` (optional admin ID filter)

**Response:**
```json
{
  "data": [
    {
      "id": "ad-uuid",
      "title": "Urgent Product",
      "sellerName": "Trusted Seller",
      "sellerTrustScore": 95,
      "category": "Electronics",
      "submittedAt": "2025-12-27T08:00:00Z",
      "hoursPending": 6,
      "priority": "urgent",
      "flags": ["Overdue", "Trusted Seller"]
    }
  ],
  "meta": {
    "total": 45,
    "page": 1,
    "limit": 50,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

#### POST /ads/{id}/admin/approve
Approve a pending ad (Admin only).

**Response:**
```json
{
  "id": "ad-uuid",
  "status": "ACTIVE",
  "approvedAt": "2025-12-27T10:30:00Z"
}
```

#### POST /ads/{id}/admin/reject
Reject a pending ad with reason (Admin only).

**Request Body:**
```json
{
  "reason": "Inappropriate content",
  "recommendations": "Please remove prohibited items\nEnsure clear product images"
}
```

**Response:**
```json
{
  "id": "ad-uuid",
  "status": "REJECTED",
  "rejectionReason": "Inappropriate content",
  "rejectedAt": "2025-12-27T10:30:00Z"
}
```

#### POST /ads/admin/bulk-approve
Bulk approve multiple ads (Admin only).

**Request Body:**
```json
{
  "adIds": ["ad-uuid-1", "ad-uuid-2", "ad-uuid-3"]
}
```

**Response:**
```json
{
  "success": ["ad-uuid-1", "ad-uuid-2"],
  "failed": [
    {
      "id": "ad-uuid-3",
      "error": "Ad not found"
    }
  ]
}
```

#### POST /ads/admin/bulk-reject
Bulk reject multiple ads (Admin only).

**Request Body:**
```json
{
  "adIds": ["ad-uuid-1", "ad-uuid-2"],
  "reason": "Bulk rejection reason",
  "recommendations": "General recommendations"
}
```

**Response:**
```json
{
  "success": ["ad-uuid-1"],
  "failed": [
    {
      "id": "ad-uuid-2",
      "error": "Ad already processed"
    }
  ]
}
```

#### POST /ads/{id}/admin/suspend
Suspend an active ad with reason (Admin only).

**Request Body:**
```json
{
  "reason": "Violation of terms",
  "recommendations": "Please review community guidelines\nContact support for reinstatement"
}
```

**Response:**
```json
{
  "id": "ad-uuid",
  "status": "SUSPENDED",
  "suspensionReason": "Violation of terms",
  "suspendedAt": "2025-12-27T10:30:00Z"
}
```

#### POST /ads/{id}/admin/activate
Activate a suspended ad (Admin only).

**Response:**
```json
{
  "id": "ad-uuid",
  "status": "ACTIVE",
  "activatedAt": "2025-12-27T10:30:00Z"
}
```

#### POST /ads/admin/bulk-suspend
Bulk suspend multiple ads (Admin only).

**Request Body:**
```json
{
  "adIds": ["ad-uuid-1", "ad-uuid-2"],
  "reason": "Bulk suspension reason",
  "recommendations": "General recommendations"
}
```

**Response:**
```json
{
  "success": ["ad-uuid-1"],
  "failed": [
    {
      "id": "ad-uuid-2",
      "error": "Ad already suspended"
    }
  ]
}
```

#### POST /ads/admin/bulk-activate
Bulk activate multiple suspended ads (Admin only).

**Request Body:**
```json
{
  "adIds": ["ad-uuid-1", "ad-uuid-2", "ad-uuid-3"]
}
```

**Response:**
```json
{
  "success": ["ad-uuid-1", "ad-uuid-2"],
  "failed": [
    {
      "id": "ad-uuid-3",
      "error": "Ad not suspended"
    }
  ]
}
```

#### GET /ads/admin/pending/stats
Get pending ads statistics (Admin only).

#### GET /ads/admin/all
Get all ads for admin management (Admin only).

## Seller Experience Endpoints

### GET /ads/seller/stats
Get seller's ad statistics and approval rates.

**Response:**
```json
{
  "totalAds": 25,
  "activeAds": 20,
  "pendingAds": 2,
  "rejectedAds": 3,
  "suspendedAds": 0,
  "expiredAds": 0,
  "approvalRate": 80.0,
  "averageApprovalTime": 4.5
}
```

### GET /ads/seller/pending
Get seller's pending ads with status updates.

**Response:**
```json
{
  "data": [
    {
      "id": "ad-uuid",
      "title": "Product Title",
      "submittedAt": "2025-12-27T10:00:00Z",
      "estimatedApprovalTime": "2-6 hours",
      "status": "Under review",
      "priority": "normal"
    }
  ]
}
```

### GET /ads/seller/rejected
Get seller's rejected ads with resubmission options.

**Response:**
```json
{
  "data": [
    {
      "id": "ad-uuid",
      "title": "Product Title",
      "rejectedAt": "2025-12-27T09:00:00Z",
      "rejectionReason": "Poor image quality",
      "recommendations": ["Use better lighting", "Show multiple angles"],
      "canResubmit": true,
      "resubmissionDeadline": "2026-01-10T09:00:00Z",
      "resubmissionCount": 0
    }
  ]
}
```

### GET /ads/seller/guidelines/{categoryId}
Get submission guidelines for a category.

**Response:**
```json
{
  "category": "Electronics",
  "requirements": [
    "Clear, high-quality images (at least 3)",
    "Accurate specifications",
    "Valid warranty information"
  ],
  "tips": [
    "Use natural lighting for photos",
    "Include serial numbers when possible"
  ],
  "commonRejectionReasons": [
    "Blurry images",
    "Missing specifications",
    "Prohibited items"
  ],
  "estimatedApprovalTime": "2-6 hours"
}
```

### POST /ads/seller/resubmit/{adId}
Resubmit a rejected ad for review.

**Request Body:**
```json
{
  "title": "Updated Product Title",
  "description": "Improved description",
  "price": 1100.00,
  "images": ["https://example.com/new-image1.jpg"]
}
```

**Response:**
```json
{
  "id": "ad-uuid",
  "status": "PENDING",
  "resubmissionCount": 1,
  "submittedAt": "2025-12-27T11:00:00Z"
}
```

## Admin Dashboard Endpoints

### GET /ads/admin/dashboard
Get admin dashboard statistics.

**Response:**
```json
{
  "pendingAds": {
    "total": 45,
    "urgent": 12,
    "high": 18,
    "normal": 15
  },
  "recentActivity": {
    "approvedToday": 23,
    "rejectedToday": 5,
    "autoApprovedToday": 15
  },
  "adminWorkload": [
    {
      "adminId": "admin-uuid",
      "adminName": "John Admin",
      "pendingAssigned": 8,
      "completedToday": 12,
      "averageProcessingTime": 2.5
    }
  ],
  "systemHealth": {
    "averageApprovalTime": 3.2,
    "rejectionRate": 15.5,
    "autoApprovalRate": 65.0
  }
}
```

### PUT /ads/admin/assign/{adId}
Assign ad to admin for review.

**Request Body:**
```json
{
  "adminId": "admin-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "assignedAt": "2025-12-27T10:00:00Z"
}
```

### PUT /ads/admin/unassign/{adId}
Unassign ad from admin.

**Response:**
```json
{
  "success": true
}
```

### POST /ads/admin/bulk-assign
Bulk assign ads to admins for load balancing.

**Response:**
```json
{
  "assigned": 25,
  "adminAssignments": {
    "admin-uuid-1": 8,
    "admin-uuid-2": 9,
    "admin-uuid-3": 8
  }
}
```

### POST /ads/admin/escalate-overdue
Escalate overdue pending ads to super admins.

**Response:**
```json
{
  "escalated": 12,
  "notifiedAdmins": ["admin1@example.com", "admin2@example.com"]
}
```

## Audit & Compliance Endpoints

### GET /ads/audit/{adId}/history
Get complete approval history for an ad.

**Response:**
```json
{
  "data": [
    {
      "id": "audit-uuid",
      "action": "APPROVED",
      "adminId": "admin-uuid",
      "adminName": "John Admin",
      "timestamp": "2025-12-27T10:30:00Z",
      "previousStatus": "PENDING",
      "newStatus": "ACTIVE"
    },
    {
      "id": "audit-uuid-2",
      "action": "REJECTED",
      "adminId": "admin-uuid",
      "adminName": "John Admin",
      "reason": "Poor quality images",
      "recommendations": "Use higher resolution images",
      "timestamp": "2025-12-26T15:20:00Z",
      "previousStatus": "PENDING",
      "newStatus": "REJECTED"
    },
    {
      "id": "audit-uuid-3",
      "action": "SUSPENDED",
      "adminId": "admin-uuid",
      "adminName": "John Admin",
      "reason": "Violation of terms",
      "recommendations": "Review community guidelines",
      "timestamp": "2025-12-25T12:00:00Z",
      "previousStatus": "ACTIVE",
      "newStatus": "SUSPENDED"
    }
  ]
}
```

### GET /ads/audit/seller/{sellerId}/history
Get approval history for a seller.

**Response:**
```json
{
  "data": [
    {
      "id": "audit-uuid",
      "adId": "ad-uuid",
      "action": "AUTO_APPROVED",
      "timestamp": "2025-12-27T10:00:00Z",
      "previousStatus": "PENDING",
      "newStatus": "ACTIVE"
    }
  ]
}
```

### GET /ads/audit/compliance
Generate compliance report for date range.

**Query Parameters:**
- `startDate` (ISO date)
- `endDate` (ISO date)

**Response:**
```json
{
  "period": {
    "start": "2025-12-01T00:00:00Z",
    "end": "2025-12-27T23:59:59Z"
  },
  "summary": {
    "totalAds": 1250,
    "approvedAds": 1050,
    "rejectedAds": 150,
    "autoApprovedAds": 750,
    "averageApprovalTime": 3.2,
    "rejectionRate": 12.0
  },
  "adminStats": [
    {
      "adminId": "admin-uuid",
      "adminName": "John Admin",
      "approvedCount": 45,
      "rejectedCount": 8,
      "averageProcessingTime": 2.1
    }
  ],
  "categoryStats": [
    {
      "categoryId": "electronics-uuid",
      "categoryName": "Electronics",
      "approvalRate": 92.0,
      "averageApprovalTime": 2.8
    }
  ],
  "violations": [
    {
      "adId": "ad-uuid",
      "title": "Prohibited Item",
      "violation": "Contains prohibited content",
      "timestamp": "2025-12-25T14:30:00Z"
    }
  ]
}
```

### GET /ads/audit/admin/{adminId}/performance
Get admin performance metrics.

**Query Parameters:**
- `days` (default: 30)

**Response:**
```json
{
  "totalProcessed": 53,
  "approvedCount": 45,
  "rejectedCount": 8,
  "averageProcessingTime": 2.1,
  "approvalRate": 84.9
}
```

## Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden (Admin only)
- `404`: Not Found
- `422`: Validation Error

## Rate Limits

- Standard users: 100 requests/hour
- Premium sellers: 500 requests/hour
- Admins: 1000 requests/hour

## Webhook Events

The system sends webhook events for:
- `ad.approved`
- `ad.rejected`
- `ad.suspended`
- `ad.activated`
- `ad.auto_approved`
- `ad.pending_review`
- `ad.escalated`

## Implementation Status

### ✅ Implemented Endpoints

**Core Ad Operations:**
- `POST /ads` - Create ad with auto-approval
- `GET /ads` - List ads with filtering
- `GET /ads/:id` - Get single ad
- `PATCH /ads/:id` - Update ad
- `DELETE /ads/:id` - Delete ad

**Search & Discovery:**
- `POST /ads/search/suggestions` - Search suggestions
- `POST /ads/search` - Advanced search

**User Interactions:**
- `GET /ads/my-ads` - User's ads
- `GET /ads/saved` - Saved ads
- `POST /ads/:id/save` - Save ad
- `DELETE /ads/:id/save` - Unsave ad

**Admin Operations:**
- `GET /ads/:id/admin` - Admin view of ad
- `GET /ads/admin/pending` - Pending ads
- `GET /ads/admin/queue` - Pending ads queue
- `POST /ads/:id/admin/approve` - Approve ad
- `POST /ads/:id/admin/reject` - Reject ad
- `POST /ads/admin/bulk-approve` - Bulk approve
- `POST /ads/admin/bulk-reject` - Bulk reject
- `POST /ads/:id/admin/suspend` - Suspend ad
- `POST /ads/:id/admin/activate` - Activate ad
- `POST /ads/admin/bulk-suspend` - Bulk suspend
- `POST /ads/admin/bulk-activate` - Bulk activate
- `GET /ads/admin/pending/stats` - Pending stats
- `GET /ads/admin/all` - All ads for admin

**Seller Experience:**
- `GET /ads/seller/stats` - Seller statistics
- `GET /ads/seller/pending` - Seller's pending ads
- `GET /ads/seller/rejected` - Seller's rejected ads
- `GET /ads/seller/guidelines/{categoryId}` - Category guidelines
- `POST /ads/seller/resubmit/{adId}` - Resubmit rejected ad

**Admin Dashboard:**
- `GET /ads/admin/dashboard` - Admin dashboard stats
- `PUT /ads/admin/assign/{adId}` - Assign ad to admin
- `PUT /ads/admin/unassign/{adId}` - Unassign ad
- `POST /ads/admin/bulk-assign` - Bulk assign ads
- `POST /ads/admin/escalate-overdue` - Escalate overdue ads

**Audit & Compliance:**
- `GET /ads/audit/{adId}/history` - Ad approval history
- `GET /ads/audit/seller/{sellerId}/history` - Seller approval history
- `GET /ads/audit/compliance` - Compliance report
- `GET /ads/audit/admin/{adminId}/performance` - Admin performance

**Statistics:**
- `GET /ads/stats/overview` - Overview stats</content>
<parameter name="filePath">/Users/ericmensah/Projects/willfind8-api/docs/ADS_APPROVAL_SYSTEM_API.md