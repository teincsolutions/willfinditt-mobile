# WillFind8 API - Admin & User Management Endpoints

**Base URL:** `https://api.willfind8.com/api/v1` (Production)  
**Base URL:** `http://localhost:3000/api/v1` (Development)

---

## Table of Contents

- [Authentication](#authentication)
- [User Management](#user-management)
- [Admin Operations](#admin-operations)
- [Password Management](#password-management)
- [Response Codes](#response-codes)
- [Error Handling](#error-handling)

---

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```http
Authorization: Bearer {access_token}
```

### Login

**Endpoint:** `POST /auth/login`  
**Authentication:** None  
**Description:** Authenticate user with email/phone and password

**Request Body:**

```json
{
  "email": "user@example.com", // Optional (use email OR phone)
  "phone": "+233123456789", // Optional (use email OR phone)
  "password": "password123"
}
```

**Success Response (200 OK):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "cyJYbGceOigIUzI1NiIs..",
  "user": {
    "id": "cm1234567890",
    "email": "user@example.com",
    "phone": "+233123456789",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER",
    "isVerified": true,
    "emailVerified": true,
    "phoneVerified": true,
    "twoFactorEnabled": false,
    "forcePasswordChange": false
  }
}
```

**2FA Required Response (200 OK):**

```json
{
  "requires2FA": true,
  "userId": "cm1234567890",
  "phone": "***6789",
  "message": "Please enter the verification code sent to your phone"
}
```

**Error Response (401 Unauthorized):**

```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

**Error Response - Email Not Verified (401 Unauthorized):**

```json
{
  "statusCode": 401,
  "message": "Please verify your email address before logging in. Check your inbox for the verification link.",
  "error": "Unauthorized"
}
```

**Error Response - Force Password Change (200 OK):**

> Note: Login succeeds but `forcePasswordChange: true` in response

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "cyJYbGceOigIUzI1NiIs..",
  "user": {
    "id": "cm1234567890",
    "email": "admin@example.com",
    "forcePasswordChange": true,  // ← User must change password
    ...
  }
}
```

---

### Verify 2FA OTP

**Endpoint:** `POST /auth/verify-2fa-otp`  
**Authentication:** None  
**Description:** Verify 2FA OTP code sent via SMS

**Request Body:**

```json
{
  "userId": "cm1234567890",
  "otpCode": "123456"
}
```

**Success Response (200 OK):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "cyJYbGceOigIUzI1NiIs..",
  "user": {
    "id": "cm1234567890",
    "email": "user@example.com",
    "twoFactorEnabled": true,
    ...
  }
}
```

**Error Response (401 Unauthorized):**

```json
{
  "statusCode": 401,
  "message": "Invalid or expired OTP code",
  "error": "Unauthorized"
}
```

---

### Get Current User Profile

**Endpoint:** `GET /auth/profile`  
**Authentication:** Required (Bearer token)  
**Description:** Get authenticated user's profile

**Success Response (200 OK):**

```json
{
  "id": "cm1234567890",
  "email": "user@example.com",
  "username": "johndoe",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+233123456789",
  "avatar": "https://...",
  "role": "USER",
  "isActive": true,
  "isVerified": true,
  "emailVerified": true,
  "phoneVerified": true,
  "forcePasswordChange": false,
  "twoFactorEnabled": false,
  "createdAt": "2024-12-07T10:00:00.000Z",
  "updatedAt": "2024-12-07T10:00:00.000Z"
}
```

---

### Change Password

**Endpoint:** `POST /auth/change-password`  
**Authentication:** Required (Bearer token)  
**Description:** Change authenticated user's password. **Clears forcePasswordChange flag.**

**Request Body:**

```json
{
  "currentPassword": "OldPassword@123",
  "newPassword": "NewPassword@456"
}
```

**Success Response (200 OK):**

```json
{
  "message": "Password changed successfully"
}
```

**Error Response (401 Unauthorized):**

```json
{
  "statusCode": 401,
  "message": "Current password is incorrect",
  "error": "Unauthorized"
}
```

**Note:** After successful password change:

- `forcePasswordChange` flag is automatically cleared
- Password change notification email sent
- User regains full access to all endpoints

---

### Refresh Token

**Endpoint:** `POST /auth/refresh`  
**Authentication:** Required (Bearer token)  
**Description:** Refresh access token

**Success Response (200 OK):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "cyJYbGceOigIUzI1NiIs..",
  "user": { ... }
}
```

---

## User Management

### Get Current User (Me)

**Endpoint:** `GET /users/me`  
**Authentication:** Required (Bearer token)  
**Description:** Get current authenticated user's profile  
**Note:** This endpoint is **exempt** from forcePasswordChange restriction

**Success Response (200 OK):**

```json
{
  "id": "cm1234567890",
  "email": "user@example.com",
  "username": "johndoe",
  "firstName": "John",
  "lastName": "Doe",
  "role": "USER",
  "forcePasswordChange": false,
  ...
}
```

---

### Update Current User Profile

**Endpoint:** `PATCH /users/me`  
**Authentication:** Required (Bearer token)  
**Description:** Update authenticated user's profile

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+233123456789",
  "avatar": "https://...",
  "countryId": "country-id-123"
}
```

**Success Response (200 OK):**

```json
{
  "id": "cm1234567890",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "updatedAt": "2024-12-07T10:00:00.000Z",
  ...
}
```

**Note:** Users cannot update their own `role`, `isActive`, `isVerified`, or `forcePasswordChange` fields.

---

## Admin Operations

### Create User Account

**Endpoint:** `POST /users`  
**Authentication:** Required (ADMIN role)  
**Description:** Create new user account with any role

**Request Body:**

```json
{
  "email": "newuser@example.com",
  "username": "newuser",
  "password": "TempPassword@123",
  "firstName": "New",
  "lastName": "User",
  "phone": "+233123456789",
  "role": "ADMIN", // USER | ADMIN | MODERATOR | SELLER
  "forcePasswordChange": true, // Optional: Force password change on first login
  "emailVerified": true, // Optional: Pre-verify email
  "phoneVerified": false, // Optional: Pre-verify phone
  "isActive": true, // Optional: Account status
  "countryId": "country-id-123" // Optional
}
```

**Success Response (201 Created):**

```json
{
  "id": "cm1234567890",
  "email": "newuser@example.com",
  "username": "newuser",
  "firstName": "New",
  "lastName": "User",
  "phone": "+233123456789",
  "role": "ADMIN",
  "forcePasswordChange": true,
  "emailVerified": true,
  "phoneVerified": false,
  "isActive": true,
  "createdAt": "2024-12-07T10:00:00.000Z",
  "updatedAt": "2024-12-07T10:00:00.000Z"
}
```

**Important Notes:**

- ✅ Password is **automatically hashed** (bcrypt) - never stored in plain text
- ✅ Password is **never returned** in response
- ✅ Set `forcePasswordChange: true` to require password change on first login
- ✅ User will receive account creation email (if configured)

**Error Response (409 Conflict):**

```json
{
  "statusCode": 409,
  "message": "User with this email or username already exists",
  "error": "Conflict"
}
```

---

### List Users (Paginated)

**Endpoint:** `GET /users`  
**Authentication:** Required (ADMIN or MODERATOR role)  
**Description:** Get paginated list of users with filters

**Query Parameters:**

- `page` (optional, default: 1): Page number
- `limit` (optional, default: 10): Items per page
- `search` (optional): Search in email, username, firstName, lastName
- `role` (optional): Filter by role (USER, ADMIN, MODERATOR, SELLER)
- `isActive` (optional): Filter by active status (true/false)
- `isVerified` (optional): Filter by verification status (true/false)
- `countryId` (optional): Filter by country

**Example Request:**

```http
GET /users?page=1&limit=20&role=ADMIN&isActive=true&search=john
```

**Success Response (200 OK):**

```json
{
  "data": [
    {
      "id": "cm1234567890",
      "email": "admin@example.com",
      "username": "admin",
      "firstName": "Admin",
      "lastName": "User",
      "role": "ADMIN",
      "isActive": true,
      "emailVerified": true,
      "phoneVerified": false,
      "forcePasswordChange": false,
      "twoFactorEnabled": false,
      "lastLoginAt": "2024-12-07T10:00:00.000Z",
      "createdAt": "2024-12-07T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

---

### Get User by ID

**Endpoint:** `GET /users/{id}`  
**Authentication:** Required (ADMIN or MODERATOR role)  
**Description:** Get user details by ID

**Success Response (200 OK):**

```json
{
  "id": "cm1234567890",
  "email": "user@example.com",
  "username": "johndoe",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+233123456789",
  "avatar": "https://...",
  "role": "USER",
  "isActive": true,
  "isVerified": true,
  "emailVerified": true,
  "phoneVerified": true,
  "forcePasswordChange": false,
  "twoFactorEnabled": false,
  "failedLoginAttempts": 0,
  "accountLockedUntil": null,
  "lastLoginAt": "2024-12-07T10:00:00.000Z",
  "lastLoginIp": "192.168.1.1",
  "passwordChangedAt": "2024-12-07T09:00:00.000Z",
  "country": {
    "id": "country-id-123",
    "name": "Ghana",
    "code": "GH"
  },
  "sellerProfile": { ... },
  "createdAt": "2024-12-07T10:00:00.000Z",
  "updatedAt": "2024-12-07T10:00:00.000Z"
}
```

---

### Update User by ID

**Endpoint:** `PATCH /users/{id}`  
**Authentication:** Required (ADMIN role)  
**Description:** Update user by ID (full access for admins)

**Request Body:**

```json
{
  "firstName": "Updated",
  "lastName": "Name",
  "role": "MODERATOR",
  "isActive": true,
  "isVerified": true,
  "emailVerified": true,
  "phoneVerified": true,
  "forcePasswordChange": false
}
```

**Success Response (200 OK):**

```json
{
  "id": "cm1234567890",
  "firstName": "Updated",
  "lastName": "Name",
  "role": "MODERATOR",
  "updatedAt": "2024-12-07T10:00:00.000Z",
  ...
}
```

---

### Activate User Account

**Endpoint:** `PATCH /users/{id}/activate`  
**Authentication:** Required (ADMIN role)  
**Description:** Activate user account (set isActive: true)

**Success Response (200 OK):**

```json
{
  "id": "cm1234567890",
  "isActive": true,
  "updatedAt": "2024-12-07T10:00:00.000Z",
  ...
}
```

---

### Deactivate User Account

**Endpoint:** `PATCH /users/{id}/deactivate`  
**Authentication:** Required (ADMIN role)  
**Description:** Deactivate user account (set isActive: false)

**Success Response (200 OK):**

```json
{
  "id": "cm1234567890",
  "isActive": false,
  "updatedAt": "2024-12-07T10:00:00.000Z",
  ...
}
```

---

### Verify User Account

**Endpoint:** `PATCH /users/{id}/verify`  
**Authentication:** Required (ADMIN or MODERATOR role)  
**Description:** Verify user account (set isVerified: true)

**Success Response (200 OK):**

```json
{
  "id": "cm1234567890",
  "isVerified": true,
  "updatedAt": "2024-12-07T10:00:00.000Z",
  ...
}
```

---

### Get User Statistics

**Endpoint:** `GET /users/stats`  
**Authentication:** Required (ADMIN role)  
**Description:** Get user statistics overview

**Success Response (200 OK):**

```json
{
  "total": 1000,
  "active": 850,
  "inactive": 150,
  "verified": 900,
  "unverified": 100,
  "byRole": {
    "USER": 950,
    "ADMIN": 10,
    "MODERATOR": 20,
    "SELLER": 20
  },
  "registeredToday": 15,
  "registeredThisWeek": 100,
  "registeredThisMonth": 450
}
```

---

### Delete User

**Endpoint:** `DELETE /users/{id}`  
**Authentication:** Required (ADMIN role)  
**Description:** Permanently delete user account

**Success Response (204 No Content)**

**Error Response (404 Not Found):**

```json
{
  "statusCode": 404,
  "message": "User not found",
  "error": "Not Found"
}
```

---

## Password Management

### Force Password Change

**Endpoint:** `PATCH /users/{id}/force-password-change`  
**Authentication:** Required (ADMIN role)  
**Description:** Force user to change password on next login

**Success Response (200 OK):**

```json
{
  "message": "User will be required to change password on next login. Notification email sent if email exists.",
  "user": {
    "id": "cm1234567890",
    "email": "user@example.com",
    "username": "johndoe",
    "forcePasswordChange": true,
    "updatedAt": "2024-12-07T10:00:00.000Z",
    ...
  }
}
```

**What Happens:**

1. Sets `forcePasswordChange: true` in database
2. Sends email notification to user with change password link
3. On next API request, user is blocked from all endpoints except:
   - `/auth/change-password`
   - `/auth/profile`
   - `/auth/refresh`
   - `/users/me`
4. User must change password to regain full access

**Email Sent:**

```
Subject: Password Change Required

Hello [User Name],

An administrator has required you to change your password before
you can continue using your account.

Please log in and change your password at:
{FRONTEND_URL}/change-password

If you did not expect this message, please contact support immediately.
```

---

### Send Password Reset Link

**Endpoint:** `POST /users/{id}/reset-password`  
**Authentication:** Required (ADMIN role)  
**Description:** Send password reset link to user's email

**Success Response (200 OK):**

```json
{
  "message": "Password reset link has been sent to the user email"
}
```

**Error Response (400 Bad Request):**

```json
{
  "statusCode": 400,
  "message": "User does not have an email address to send reset link",
  "error": "Bad Request"
}
```

**Error Response (400 Bad Request - OAuth User):**

```json
{
  "statusCode": 400,
  "message": "User uses GOOGLE authentication and cannot reset password",
  "error": "Bad Request"
}
```

**Email Sent:**

```
Subject: Reset Your Password

Hello [User Name],

You requested to reset your password. Click the link below:

{FRONTEND_URL}/reset-password?token={resetToken}

This link will expire in 1 hour.

If you didn't request this, please ignore this email.
```

---

### Forgot Password (Public)

**Endpoint:** `POST /auth/forgot-password`  
**Authentication:** None  
**Description:** Request password reset (public endpoint)

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Success Response (200 OK):**

```json
{
  "message": "If the account exists, you will receive reset instructions"
}
```

**Note:** Always returns success message for security (doesn't reveal if email exists)

---

### Reset Password (Public)

**Endpoint:** `POST /auth/reset-password`  
**Authentication:** None  
**Description:** Reset password with token from email

**Request Body:**

```json
{
  "token": "reset-token-from-email",
  "newPassword": "NewSecurePassword@123"
}
```

**Success Response (200 OK):**

```json
{
  "message": "Password reset successfully"
}
```

**Error Response (400 Bad Request):**

```json
{
  "statusCode": 400,
  "message": "Invalid or expired reset token",
  "error": "Bad Request"
}
```

---

## Response Codes

| Code | Status                | Description                       |
| ---- | --------------------- | --------------------------------- |
| 200  | OK                    | Request successful                |
| 201  | Created               | Resource created successfully     |
| 204  | No Content            | Resource deleted successfully     |
| 400  | Bad Request           | Invalid request data              |
| 401  | Unauthorized          | Authentication required or failed |
| 403  | Forbidden             | Insufficient permissions          |
| 404  | Not Found             | Resource not found                |
| 409  | Conflict              | Resource already exists           |
| 500  | Internal Server Error | Server error                      |

---

## Error Handling

### Standard Error Response Format

```json
{
  "statusCode": 400,
  "message": "Detailed error message",
  "error": "Bad Request"
}
```

### Validation Error Response

```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than 8 characters"
  ],
  "error": "Bad Request"
}
```

### Force Password Change Error (401)

When user has `forcePasswordChange: true` and tries to access protected endpoints:

```json
{
  "statusCode": 401,
  "message": "You must change your password before accessing this resource. Please update your password at /auth/change-password",
  "error": "Unauthorized"
}
```

**Exempt Endpoints (Always Accessible):**

- `POST /auth/change-password`
- `GET /auth/profile`
- `POST /auth/refresh`
- `GET /users/me`

---

## User Roles & Permissions

### Role Hierarchy

| Role          | Level | Permissions                                    |
| ------------- | ----- | ---------------------------------------------- |
| **USER**      | 1     | Basic user permissions                         |
| **SELLER**    | 2     | Seller-specific permissions + User permissions |
| **MODERATOR** | 3     | Content moderation + User/Seller permissions   |
| **ADMIN**     | 4     | Full system access                             |

### Endpoint Permission Matrix

| Endpoint                                  | USER | SELLER | MODERATOR | ADMIN |
| ----------------------------------------- | ---- | ------ | --------- | ----- |
| `GET /users/me`                           | ✅   | ✅     | ✅        | ✅    |
| `PATCH /users/me`                         | ✅   | ✅     | ✅        | ✅    |
| `POST /auth/change-password`              | ✅   | ✅     | ✅        | ✅    |
| `GET /users`                              | ❌   | ❌     | ✅        | ✅    |
| `GET /users/{id}`                         | ❌   | ❌     | ✅        | ✅    |
| `POST /users`                             | ❌   | ❌     | ❌        | ✅    |
| `PATCH /users/{id}`                       | ❌   | ❌     | ❌        | ✅    |
| `DELETE /users/{id}`                      | ❌   | ❌     | ❌        | ✅    |
| `PATCH /users/{id}/force-password-change` | ❌   | ❌     | ❌        | ✅    |
| `POST /users/{id}/reset-password`         | ❌   | ❌     | ❌        | ✅    |
| `PATCH /users/{id}/activate`              | ❌   | ❌     | ❌        | ✅    |
| `PATCH /users/{id}/deactivate`            | ❌   | ❌     | ❌        | ✅    |
| `PATCH /users/{id}/verify`                | ❌   | ❌     | ✅        | ✅    |
| `GET /users/stats`                        | ❌   | ❌     | ❌        | ✅    |

---

## Common Use Cases

### Use Case 1: Admin Creates New Admin User

```javascript
// 1. Create user with force password change
const response = await fetch(`${API_BASE}/users`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${adminToken}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'newadmin@example.com',
    username: 'newadmin',
    password: 'TempPassword@123',
    firstName: 'New',
    lastName: 'Admin',
    role: 'ADMIN',
    forcePasswordChange: true, // ← Force password change
    emailVerified: true,
  }),
});

const user = await response.json();
// user.forcePasswordChange === true
```

### Use Case 2: User Login with Force Password Change

```javascript
// 1. User logs in
const loginResponse = await fetch(`${API_BASE}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'newadmin@example.com',
    password: 'TempPassword@123',
  }),
});

const { access_token, user } = await loginResponse.json();

// 2. Check if password change required
if (user.forcePasswordChange) {
  // Redirect to password change page
  window.location.href = '/change-password';
}

// 3. Try to access protected endpoint
const statsResponse = await fetch(`${API_BASE}/users/stats`, {
  headers: { Authorization: `Bearer ${access_token}` },
});

// Will return 401 with message:
// "You must change your password before accessing this resource"

// 4. Change password
const changeResponse = await fetch(`${API_BASE}/auth/change-password`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${access_token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    currentPassword: 'TempPassword@123',
    newPassword: 'MyNewSecurePass@456',
  }),
});

// 5. Re-login to get updated token
const newLoginResponse = await fetch(`${API_BASE}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'newadmin@example.com',
    password: 'MyNewSecurePass@456',
  }),
});

const { access_token: newToken, user: updatedUser } =
  await newLoginResponse.json();
// updatedUser.forcePasswordChange === false

// 6. Now can access all endpoints
const statsResponse2 = await fetch(`${API_BASE}/users/stats`, {
  headers: { Authorization: `Bearer ${newToken}` },
});
// Success! Returns statistics
```

### Use Case 3: Admin Forces Password Change

```javascript
// Admin forces password change on compromised account
const response = await fetch(
  `${API_BASE}/users/${userId}/force-password-change`,
  {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  },
);

const result = await response.json();
console.log(result.message);
// "User will be required to change password on next login.
//  Notification email sent if email exists."

// User receives email notification
// User's next request will be blocked until password changed
```

---

## Frontend Integration Notes

### 1. Login Flow with Force Password Change

```javascript
async function handleLogin(email, password) {
  const response = await login(email, password);

  if (response.user.forcePasswordChange) {
    // Show warning modal
    showModal({
      title: 'Password Change Required',
      message: 'You must change your password before continuing',
      onConfirm: () => router.push('/change-password'),
    });
    return;
  }

  // Normal login flow
  router.push('/dashboard');
}
```

### 2. Global API Error Handler

```javascript
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const message = error.response.data.message;

      if (message.includes('change your password')) {
        // Redirect to password change page
        router.push('/change-password');
        showNotification({
          type: 'warning',
          message: 'Please change your password to continue',
        });
      }
    }
    return Promise.reject(error);
  },
);
```

### 3. Protected Route Guard

```javascript
function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (user?.forcePasswordChange && !isExemptRoute()) {
    return <Redirect to="/change-password" />;
  }

  return children;
}

function isExemptRoute() {
  const exemptPaths = ['/change-password', '/profile', '/logout'];
  return exemptPaths.some((path) => location.pathname.includes(path));
}
```

---

## Testing

### Example with cURL

```bash
# 1. Admin login
ADMIN_TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}' \
  | jq -r '.access_token')

# 2. Create user with force password change
curl -X POST http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email":"testadmin@example.com",
    "username":"testadmin",
    "password":"TempPass@123",
    "role":"ADMIN",
    "forcePasswordChange":true,
    "emailVerified":true
  }'

# 3. Login as new user
USER_TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testadmin@example.com","password":"TempPass@123"}' \
  | jq -r '.access_token')

# 4. Try accessing protected endpoint (will fail)
curl -X GET http://localhost:3000/api/v1/users/stats \
  -H "Authorization: Bearer $USER_TOKEN"

# 5. Change password
curl -X POST http://localhost:3000/api/v1/auth/change-password \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword":"TempPass@123",
    "newPassword":"NewPass@456"
  }'

# 6. Try again (will succeed)
curl -X GET http://localhost:3000/api/v1/users/stats \
  -H "Authorization: Bearer $USER_TOKEN"
```

---

## Additional Resources

- **Complete Implementation Guide:** `docs/ADMIN_USER_MANAGEMENT.md`
- **Authentication Testing:** `docs/AUTHENTICATION_TESTING_RESULTS.md`
- **API Base URL Configuration:** Check your `.env` file for `FRONTEND_URL`
- **Test Script:** `test-admin-user-management.py`

---

**Last Updated:** December 7, 2024  
**API Version:** v1  
**Documentation Version:** 1.0.0
