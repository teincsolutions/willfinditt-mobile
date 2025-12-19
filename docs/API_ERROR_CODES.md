# API Error Response Codes - Authentication

## Overview

The API provides distinct error codes to help frontend applications differentiate between various authentication failures:

- **Token Expired** - Refresh the token automatically
- **Invalid Token** - Redirect to login
- **Invalid User** - Redirect to login
- **Forbidden** - Show "Access Denied" message
- **Unauthorized** - Generic auth failure

---

## Error Response Structure

All authentication errors follow this structure:

```typescript
{
  statusCode: number,      // HTTP status code (401 or 403)
  message: string,         // Human-readable error message
  error: string,           // Error type
  code: string             // Machine-readable error code
}
```

---

## Error Codes

### 1. TOKEN_EXPIRED (401)

**When it occurs:**

- Access token has expired
- Refresh token has expired

**Response:**

```json
{
  "statusCode": 401,
  "message": "Access token has expired",
  "error": "TokenExpired",
  "code": "TOKEN_EXPIRED"
}
```

**Frontend Action:**

```typescript
if (error.code === 'TOKEN_EXPIRED') {
  // Attempt to refresh the token
  await refreshAccessToken();
  // Retry the original request
}
```

---

### 2. INVALID_TOKEN (401)

**When it occurs:**

- Token format is invalid (malformed JWT)
- Token signature is invalid
- Token is corrupted

**Response:**

```json
{
  "statusCode": 401,
  "message": "Invalid access token",
  "error": "InvalidToken",
  "code": "INVALID_TOKEN"
}
```

**Frontend Action:**

```typescript
if (error.code === 'INVALID_TOKEN') {
  // Token is corrupted, redirect to login
  clearTokens();
  redirectToLogin();
}
```

---

### 3. INVALID_USER (401)

**When it occurs:**

- User account doesn't exist
- User account is deactivated
- User was deleted

**Response:**

```json
{
  "statusCode": 401,
  "message": "User account not found or inactive",
  "error": "InvalidUser",
  "code": "INVALID_USER"
}
```

**Frontend Action:**

```typescript
if (error.code === 'INVALID_USER') {
  // User account issue, redirect to login
  clearTokens();
  redirectToLogin();
  showMessage('Your account is no longer active');
}
```

---

### 4. FORBIDDEN (403)

**When it occurs:**

- User doesn't have permission for the resource
- Role-based access control denial
- Resource access denied

**Response:**

```json
{
  "statusCode": 403,
  "message": "You do not have permission to access this resource",
  "error": "Forbidden",
  "code": "FORBIDDEN"
}
```

**Frontend Action:**

```typescript
if (error.code === 'FORBIDDEN') {
  // Show access denied message
  showMessage('You do not have permission to access this resource');
  // Optionally redirect to dashboard
}
```

---

### 5. UNAUTHORIZED (401)

**When it occurs:**

- Generic authentication failure
- No token provided
- Unknown auth error

**Response:**

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized",
  "code": "UNAUTHORIZED"
}
```

**Frontend Action:**

```typescript
if (error.code === 'UNAUTHORIZED') {
  // Generic auth failure, redirect to login
  clearTokens();
  redirectToLogin();
}
```

---

## Frontend Implementation

### Axios Interceptor

```typescript
import axios from 'axios';
import { authService } from './auth-service';

// Response interceptor for handling auth errors
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error response has our custom error code
    const errorCode = error.response?.data?.code;
    const statusCode = error.response?.status;

    // Handle different error codes
    switch (errorCode) {
      case 'TOKEN_EXPIRED':
        // Only attempt refresh once per request
        if (!originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Attempt to refresh the token
            const newToken = await authService.refreshAccessToken();

            // Update the request with new token
            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            // Retry the original request
            return axios(originalRequest);
          } catch (refreshError) {
            // Refresh failed, redirect to login
            authService.logout();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }
        break;

      case 'INVALID_TOKEN':
      case 'INVALID_USER':
      case 'UNAUTHORIZED':
        // Clear tokens and redirect to login
        authService.logout();
        window.location.href = '/login';
        break;

      case 'FORBIDDEN':
        // Show access denied message
        // Don't redirect, just show error
        console.error('Access forbidden:', error.response.data.message);
        break;

      default:
        // Handle other errors normally
        break;
    }

    return Promise.reject(error);
  },
);
```

### React Hook

```typescript
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export function useAuthErrorHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthError = (error: any) => {
      const errorCode = error.response?.data?.code;
      const message = error.response?.data?.message;

      switch (errorCode) {
        case 'TOKEN_EXPIRED':
          // Handled by axios interceptor
          break;

        case 'INVALID_TOKEN':
        case 'INVALID_USER':
          toast.error(message || 'Session expired. Please login again.');
          navigate('/login');
          break;

        case 'UNAUTHORIZED':
          toast.error('Please login to continue');
          navigate('/login');
          break;

        case 'FORBIDDEN':
          toast.error(message || 'You do not have permission');
          // Stay on current page but show error
          break;

        default:
          if (error.response?.status === 401) {
            navigate('/login');
          }
          break;
      }
    };

    // Add global error handler
    window.addEventListener('authError', handleAuthError as any);

    return () => {
      window.removeEventListener('authError', handleAuthError as any);
    };
  }, [navigate]);
}
```

### Auth Service

```typescript
class AuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  async refreshAccessToken(): Promise<string> {
    // Prevent multiple simultaneous refresh attempts
    if (this.isRefreshing) {
      return new Promise((resolve) => {
        this.refreshSubscribers.push((token: string) => {
          resolve(token);
        });
      });
    }

    this.isRefreshing = true;

    try {
      const response = await axios.post('/auth/refresh', null, {
        headers: {
          Authorization: `Bearer ${this.refreshToken}`,
        },
      });

      const newAccessToken = response.data.access_token;
      const newRefreshToken = response.data.refresh_token;

      this.accessToken = newAccessToken;
      this.refreshToken = newRefreshToken;

      // Notify all subscribers
      this.refreshSubscribers.forEach((callback) => callback(newAccessToken));
      this.refreshSubscribers = [];

      return newAccessToken;
    } catch (error) {
      this.refreshSubscribers = [];
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  logout() {
    this.accessToken = null;
    this.refreshToken = null;
    sessionStorage.clear();
    localStorage.removeItem('user');
  }
}

export const authService = new AuthService();
```

---

## Testing Error Responses

### Test Token Expiration

```bash
# 1. Login and get token
LOGIN_RESPONSE=$(curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.access_token')

# 2. Wait for token to expire (or use a short-lived token in .env)
# JWT_EXPIRES_IN="10s" in .env for testing

# 3. Try to use expired token
curl -X GET http://localhost:3000/api/v1/auth/profile \
  -H "Authorization: Bearer $TOKEN"

# Response:
# {
#   "statusCode": 401,
#   "message": "Access token has expired",
#   "error": "TokenExpired",
#   "code": "TOKEN_EXPIRED"
# }
```

### Test Invalid Token

```bash
# Use malformed token
curl -X GET http://localhost:3000/api/v1/auth/profile \
  -H "Authorization: Bearer invalid_token_here"

# Response:
# {
#   "statusCode": 401,
#   "message": "Invalid access token",
#   "error": "InvalidToken",
#   "code": "INVALID_TOKEN"
# }
```

### Test Forbidden Access

```bash
# Try to access admin endpoint as regular user
curl -X GET http://localhost:3000/api/v1/admin/users \
  -H "Authorization: Bearer $USER_TOKEN"

# Response:
# {
#   "statusCode": 403,
#   "message": "You do not have permission to access this resource",
#   "error": "Forbidden",
#   "code": "FORBIDDEN"
# }
```

---

## Error Code Decision Tree

```
API Request with Token
    ↓
Is token present?
    No → UNAUTHORIZED (401)
    Yes → Parse token
        ↓
    Is token format valid?
        No → INVALID_TOKEN (401)
        Yes → Verify signature
            ↓
        Is signature valid?
            No → INVALID_TOKEN (401)
            Yes → Check expiration
                ↓
            Is token expired?
                Yes → TOKEN_EXPIRED (401)
                No → Load user
                    ↓
                Does user exist & active?
                    No → INVALID_USER (401)
                    Yes → Check permissions
                        ↓
                    Has permission?
                        No → FORBIDDEN (403)
                        Yes → ✅ Allow request
```

---

## Best Practices

### 1. Always Check Error Code

```typescript
// ❌ Bad
if (error.response?.status === 401) {
  redirectToLogin();
}

// ✅ Good
const errorCode = error.response?.data?.code;
if (errorCode === 'TOKEN_EXPIRED') {
  await refreshToken();
} else if (
  ['INVALID_TOKEN', 'INVALID_USER', 'UNAUTHORIZED'].includes(errorCode)
) {
  redirectToLogin();
}
```

### 2. Handle Refresh Token Expiration

```typescript
try {
  await refreshAccessToken();
} catch (error) {
  if (error.response?.data?.code === 'TOKEN_EXPIRED') {
    // Refresh token also expired
    toast.error('Session expired. Please login again.');
    redirectToLogin();
  }
}
```

### 3. Show Appropriate User Messages

```typescript
const errorMessages = {
  TOKEN_EXPIRED: 'Refreshing session...',
  INVALID_TOKEN: 'Invalid session. Please login again.',
  INVALID_USER: 'Your account is no longer active.',
  FORBIDDEN: 'You do not have permission for this action.',
  UNAUTHORIZED: 'Please login to continue.',
};

const message = errorMessages[errorCode] || 'An error occurred';
toast.error(message);
```

### 4. Prevent Token Refresh Loops

```typescript
let isRefreshing = false;

async function refreshAccessToken() {
  if (isRefreshing) {
    throw new Error('Already refreshing');
  }

  isRefreshing = true;
  try {
    // Refresh logic
  } finally {
    isRefreshing = false;
  }
}
```

---

## Summary

| Error Code      | Status | Action             | User Message            |
| --------------- | ------ | ------------------ | ----------------------- |
| `TOKEN_EXPIRED` | 401    | Auto-refresh token | "Refreshing session..." |
| `INVALID_TOKEN` | 401    | Redirect to login  | "Please login again"    |
| `INVALID_USER`  | 401    | Redirect to login  | "Account inactive"      |
| `FORBIDDEN`     | 403    | Show error message | "Access denied"         |
| `UNAUTHORIZED`  | 401    | Redirect to login  | "Login required"        |

**All authentication errors now provide clear, machine-readable error codes for frontend handling!** 🎯
