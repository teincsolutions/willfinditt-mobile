# Content Moderation & User Safety API

Complete API documentation for content reporting, user blocking, and admin moderation features to comply with Apple App Store Review Guideline 1.2.

## Table of Contents

- [Overview](#overview)
- [Content Reporting](#content-reporting)
- [User Blocking](#user-blocking)
- [Admin Moderation](#admin-moderation)
- [Terms & Privacy Acceptance](#terms--privacy-acceptance)

---

## Overview

This system provides comprehensive user-generated content (UGC) moderation tools:

- ✅ **User reporting** - Flag inappropriate content across all content types
- ✅ **User blocking** - One-way blocking to prevent harassment
- ✅ **Auto-hiding** - Content auto-hides after 5 reports pending admin review
- ✅ **Admin dashboard** - Review reports and take action within 24 hours
- ✅ **Terms acceptance** - Users must accept ToS and Privacy Policy to register

---

## Content Reporting

### Report Categories

- `INAPPROPRIATE` - Offensive or objectionable content
- `SPAM` - Unsolicited promotional content
- `HARASSMENT` - Abusive or threatening behavior
- `OTHER` - Other policy violations

### Report an Ad

```http
POST /content-reports/ads/:adId
Authorization: Bearer <token>
Content-Type: application/json

{
  "category": "INAPPROPRIATE",
  "description": "This ad contains inappropriate language"
}
```

**Response:**

```json
{
  "id": "report_id",
  "reporterId": "user_id",
  "reportedUserId": "ad_owner_id",
  "contentType": "AD",
  "contentId": "ad_id",
  "category": "INAPPROPRIATE",
  "description": "This ad contains inappropriate language",
  "status": "PENDING",
  "createdAt": "2026-02-11T01:30:00.000Z"
}
```

**Status Codes:**

- `201` - Report created successfully
- `400` - Already reported or self-report attempt
- `404` - Content not found

### Report a Comment

```http
POST /content-reports/comments/:commentId
Authorization: Bearer <token>

{
  "category": "SPAM",
  "description": "Spam link in comment"
}
```

### Report a Chat Message

```http
POST /content-reports/chat-messages/:messageId
Authorization: Bearer <token>

{
  "category": "HARASSMENT",
  "description": "Threatening message"
}
```

**Note:** Only participants in the chat can report messages.

### Report a Seller Review

```http
POST /content-reports/reviews/:reviewId
Authorization: Bearer <token>

{
  "category": "OTHER",
  "description": "Fake review"
}
```

### Get My Reports

```http
GET /content-reports/me
Authorization: Bearer <token>
```

**Response:**

```json
[
  {
    "id": "report_id",
    "contentType": "AD",
    "contentId": "ad_id",
    "category": "INAPPROPRIATE",
    "status": "REVIEWED",
    "reportedUser": {
      "id": "user_id",
      "username": "johndoe"
    },
    "createdAt": "2026-02-11T01:00:00.000Z"
  }
]
```

---

## User Blocking

One-way blocking system where the blocker will not see content from the blocked user.

### Block a User

```http
POST /blocking/users/:userId/block
Authorization: Bearer <token>

{
  "reason": "Inappropriate messages"
}
```

_Note: `reason` is optional._

````

**Response:**

```json
{
  "id": "block_id",
  "blockerId": "your_user_id",
  "blockedId": "blocked_user_id",
  "reason": "Inappropriate messages",
  "createdAt": "2026-02-11T01:30:00.000Z",
  "blocked": {
    "id": "blocked_user_id",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe"
  }
}
````

**Status Codes:**

- `201` - User blocked successfully
- `400` - Cannot block yourself or already blocked
- `404` - User not found

**Effects of Blocking:**

- Blocker cannot see blocked user's comments
- Blocker cannot receive chat messages from blocked user
- Blocker cannot see blocked user in chat list
- Blocked user can still see blocker's public content (one-way)

### Unblock a User

```http
DELETE /blocking/users/:userId/block
Authorization: Bearer <token>
```

**Response:**

```json
{
  "message": "User unblocked successfully"
}
```

### Get Blocked Users

```http
GET /blocking/blocked-users
Authorization: Bearer <token>
```

**Response:**

```json
[
  {
    "id": "block_id",
    "blockedId": "user_id",
    "reason": "Spam messages",
    "createdAt": "2026-02-10T12:00:00.000Z",
    "blocked": {
      "id": "user_id",
      "username": "spammer",
      "firstName": "Spam",
      "lastName": "User",
      "avatar": "https://..."
    }
  }
]
```

### Check if User is Blocked

```http
GET /blocking/users/:userId/is-blocked
Authorization: Bearer <token>
```

**Response:**

```json
{
  "isBlocked": true
}
```

---

## Admin Moderation

Admin and Moderator endpoints for reviewing reports and taking action.

### Get Pending Reports

```http
GET /admin/reports?status=PENDING&page=1&limit=20&contentType=AD
Authorization: Bearer <admin_token>
```

**Query Parameters:**

- `status` - Filter by status: `PENDING`, `REVIEWED`, `DISMISSED`, `ACTION_TAKEN` (default: PENDING)
- `contentType` - Filter by type: `AD`, `COMMENT`, `CHAT_MESSAGE`, `REVIEW`
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

**Response:**

```json
{
  "reports": [
    {
      "id": "report_id",
      "contentType": "AD",
      "contentId": "ad_id",
      "category": "INAPPROPRIATE",
      "description": "Contains offensive language",
      "status": "PENDING",
      "reporter": {
        "id": "reporter_id",
        "username": "reporter",
        "email": "reporter@example.com"
      },
      "reportedUser": {
        "id": "reported_id",
        "username": "reported",
        "email": "reported@example.com"
      },
      "createdAt": "2026-02-11T01:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

### Review a Report

```http
POST /admin/reports/:reportId/review
Authorization: Bearer <admin_token>

{
  "action": "HIDE_CONTENT"
}
```

**Action Types:**

- `DISMISS` - Report is invalid, no action taken
- `HIDE_CONTENT` - Hide the reported content (ads set to SUSPENDED status)
- `SUSPEND_USER` - 7-day account suspension for the content owner
- `BAN_USER` - Permanent ban (account deactivated)

**Response:**

```json
{
  "message": "Report reviewed successfully"
}
```

**Note:** `note` field is currently not supported in the database but may be added in future versions.

**Notifications Sent:**

- Reporter receives notification that their report was reviewed
- Reported user receives notification if action was taken (not for DISMISS)

### Get Reports for Specific Content

```http
GET /admin/content/:contentType/:contentId/reports
Authorization: Bearer <admin_token>
```

**Example:**

```http
GET /admin/content/AD/ad_12345/reports
```

**Response:**

```json
[
  {
    "id": "report_id",
    "category": "INAPPROPRIATE",
    "description": "Offensive content",
    "status": "PENDING",
    "reporter": {
      "id": "user_id",
      "username": "reporter",
      "email": "reporter@example.com"
    },
    "createdAt": "2026-02-11T01:00:00.000Z"
  }
]
```

### Restore Hidden Content

```http
POST /admin/content/:contentType/:contentId/restore
Authorization: Bearer <admin_token>
```

**Example:**

```http
POST /admin/content/AD/ad_12345/restore
```

**Response:**

```json
{
  "message": "Content restored successfully"
}
```

**Effects:**

- Sets `hiddenByReports: false`
- Resets `reportCount: 0`
- For ads: sets status back to `ACTIVE`

### Delete Content Permanently

```http
DELETE /admin/content/:contentType/:contentId
Authorization: Bearer <admin_token>
```

**Response:**

```json
{
  "message": "Content deleted successfully"
}
```

**Note:** This is permanent and cannot be undone. For ads, status is set to `DELETED`.

### Ban User

```http
POST /admin/users/:userId/ban
Authorization: Bearer <admin_token>

{
  "reason": "Multiple content policy violations"
}
```

**Response:**

```json
{
  "message": "User banned successfully"
}
```

**Effects:**

- User account is deactivated (`isActive: false`)
- User cannot log in
- Audit log created
- User receives notification

---

## Terms & Privacy Acceptance

### Register with Terms Acceptance

```http
POST /auth/register

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "termsAccepted": true,
  "privacyPolicyAccepted": true
}
```

**Required Fields:**

- `termsAccepted` - Must be `true`
- `privacyPolicyAccepted` - Must be `true`

If either is `false` or missing, registration will fail with:

```json
{
  "statusCode": 400,
  "message": "You must accept the Terms of Service to register"
}
```

### Accept Terms (Existing Users)

```http
POST /auth/accept-terms
Authorization: Bearer <token>

{
  "termsAccepted": true,
  "privacyPolicyAccepted": true
}
```

**Response:**

```json
{
  "message": "Terms and Privacy Policy accepted successfully",
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "termsAcceptedAt": "2026-02-11T01:30:00.000Z",
    "privacyPolicyAcceptedAt": "2026-02-11T01:30:00.000Z"
  }
}
```

---

## Auto-Hide Mechanism

Content is automatically hidden when it reaches **5 reports**:

1. Each report increments the `reportCount` field
2. When `reportCount >= 5`:
   - Content is immediately hidden (`hiddenByReports: true`)
   - Timestamp recorded (`hiddenAt`)
   - Content owner receives notification
3. Content remains hidden until admin reviews
4. Admin can:
   - Restore content (if reports were invalid)
   - Keep hidden (if valid)
   - Permanently delete (for severe violations)

**Hidden Content Behavior:**

- Not shown in public listings
- Not returned in search results
- Comments and reviews show as hidden
- Ads status changed to SUSPENDED
- Chat messages display "[This message has been hidden]"

---

## Error Handling

All endpoints return standard error responses:

```json
{
  "statusCode": 400,
  "message": "You have already reported this content",
  "error": "Bad Request"
}
```

**Common Status Codes:**

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error, duplicate action)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)

---

## 24-Hour Response Policy

**Admin Commitment:**

- Pending reports are reviewed within 24 hours
- Action is taken on valid reports
- Users are notified of outcomes
- Severe violations (harassment, illegal content) are prioritized

**Tracking:**

- Reports include `createdAt` timestamp
- Admin dashboard shows report age
- Automated alerts for reports > 24 hours old

---

## Apple Guidelines Compliance

This API fully addresses Apple App Store Review Guideline 1.2 requirements:

1. ✅ **Terms Agreement** - Users must accept ToS/Privacy Policy (tracked with timestamps)
2. ✅ **Content Filtering** - Auto-hide mechanism + manual admin review
3. ✅ **Reporting Mechanism** - Users can report all content types
4. ✅ **Blocking Mechanism** - Users can block abusive users (blocker notified, instant removal from feed)
5. ✅ **24-Hour Response** - Reports reviewed and actioned within 24 hours

---

## Testing Endpoints

### Example: Full Report Flow

1. **User reports inappropriate ad:**

```bash
curl -X POST https://api.yourapp.com/content-reports/ads/ad_12345 \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"category": "INAPPROPRIATE", "description": "Offensive language"}'
```

2. **Admin views pending reports:**

```bash
curl -X GET "https://api.yourapp.com/admin/reports?status=PENDING" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

3. **Admin takes action:**

```bash
curl -X POST https://api.yourapp.com/admin/reports/report_12345/review \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action": "HIDE_CONTENT", "note": "Content violates guidelines"}'
```

4. **User blocks the ad owner:**

```bash
curl -X POST https://api.yourapp.com/blocking/users/user_12345/block \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Ongoing spam"}'
```

---

## Frontend Integration Notes

### Mobile App Implementation

**Registration Screen:**

```swift
// iOS Example
struct RegistrationView {
    @State var termsAccepted = false
    @State var privacyAccepted = false

    var body: some View {
        VStack {
            // ... other fields

            Toggle("I accept the Terms of Service", isOn: $termsAccepted)
                .disabled(false)
            Toggle("I accept the Privacy Policy", isOn: $privacyAccepted)
                .disabled(false)

            Button("Register") {
                // Both must be true to enable registration
                guard termsAccepted && privacyAccepted else { return }
                register()
            }
            .disabled(!termsAccepted || !privacyAccepted)
        }
    }
}
```

**Report Button:**

- Add "Report" button/menu option on all user-generated content
- Show report category selection dialog
- Optional description field
- Confirm submission
- Show success message

**Block User:**

- Add "Block User" option in user profile menu
- Confirm action with dialog explaining blocking behavior
- Update UI to remove blocked user's content immediately

---

## Support

For questions or issues with the moderation API:

- Check server logs at `/logs/app.log`
- Review Prisma migrations at `/prisma/migrations/`
- Contact: admin@yourapp.com
