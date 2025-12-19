# API Error Handling Implementation

## Overview

The API service has been updated to properly handle different authentication error codes from the backend, with React Native-compatible event handling for automatic logout scenarios.

---

## Changes Made

### 1. Created Event Emitter (`utils/eventEmitter.ts`)

A React Native-compatible event system for cross-module communication.

**Features:**

- Node.js EventEmitter for React Native
- Type-safe event payloads
- Helper functions for emitting and listening to events
- Automatic cleanup support

**Usage:**

```typescript
import { onLogout, emitLogout } from "@/utils/eventEmitter";

// Listen for logout events
const cleanup = onLogout((payload) => {
  console.log("Logout reason:", payload.reason);
});

// Clean up listener
cleanup();

// Emit logout event
emitLogout({ reason: "invalid_token", message: "Token expired" });
```

---

### 2. Updated API Service (`services/api.ts`)

Enhanced the Axios interceptor to handle all error codes from the backend.

**Error Codes Handled:**

| Error Code      | Status | Action                   | Description                            |
| --------------- | ------ | ------------------------ | -------------------------------------- |
| `TOKEN_EXPIRED` | 401    | Auto-refresh token       | Access token expired, attempt refresh  |
| `INVALID_TOKEN` | 401    | Clear auth & emit logout | Token is corrupted or malformed        |
| `INVALID_USER`  | 401    | Clear auth & emit logout | User account doesn't exist or inactive |
| `FORBIDDEN`     | 403    | Reject (no logout)       | User doesn't have permission           |
| `UNAUTHORIZED`  | 401    | Clear auth & emit logout | Generic auth failure                   |

**Flow Diagram:**

```
API Request → Error Response
    ↓
Check Error Code
    ↓
┌─────────────────────────────────────────────┐
│ TOKEN_EXPIRED?                              │
│  ├─ Yes → Attempt token refresh             │
│  │    ├─ Success → Retry original request   │
│  │    └─ Failed → Clear auth & emit logout  │
│  └─ No → Continue                           │
└─────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────┐
│ INVALID_TOKEN / INVALID_USER?               │
│  └─ Yes → Clear tokens & emit logout        │
└─────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────┐
│ FORBIDDEN?                                  │
│  └─ Yes → Reject (let UI show message)     │
└─────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────┐
│ UNAUTHORIZED (no code)?                     │
│  └─ Yes → Clear tokens & emit logout        │
└─────────────────────────────────────────────┘
```

**Key Features:**

- ✅ Automatic token refresh on expiration
- ✅ Request queueing during refresh
- ✅ Proper error code detection
- ✅ React Native event emission (no `window` object)
- ✅ Token cleanup on auth failures
- ✅ Prevents infinite refresh loops

---

### 3. Updated useAuth Hook (`hooks/useAuth.ts`)

Added automatic logout listener that responds to API errors.

**Changes:**

- Added `useEffect` to listen for logout events
- Automatic auth state cleanup on logout events
- User-friendly error messages based on logout reason
- Toast notifications for different logout scenarios

**Logout Messages:**

```typescript
{
  invalid_token: "Your session is invalid. Please login again.",
  invalid_user: "Your account is no longer active.",
  no_refresh_token: "Session expired. Please login again.",
  refresh_failed: "Session expired. Please login again.",
  unauthorized: "Please login to continue.",
  manual: "Logged out successfully.",
}
```

---

## How It Works

### Scenario 1: Access Token Expires

```
User makes API request
    ↓
API returns 401 with code: TOKEN_EXPIRED
    ↓
api.ts intercepts error
    ↓
Attempts to refresh token with refresh token
    ↓
┌─ Refresh Success ───────────────────┐
│  1. Store new tokens                │
│  2. Retry original request           │
│  3. Return response to user          │
└──────────────────────────────────────┘
    OR
┌─ Refresh Failed ────────────────────┐
│  1. Clear tokens                     │
│  2. Emit logout event                │
│  3. useAuth receives event           │
│  4. Clear auth state                 │
│  5. Show "Session expired" message   │
│  6. User redirected to login         │
└──────────────────────────────────────┘
```

### Scenario 2: Invalid Token

```
User makes API request
    ↓
API returns 401 with code: INVALID_TOKEN
    ↓
api.ts intercepts error
    ↓
1. Clear tokens immediately
2. Emit logout event with reason: "invalid_token"
    ↓
useAuth receives event
    ↓
1. Clear all auth state
2. Show message: "Your session is invalid"
3. User redirected to login
```

### Scenario 3: Forbidden Access

```
User makes API request
    ↓
API returns 403 with code: FORBIDDEN
    ↓
api.ts intercepts error
    ↓
1. Log warning
2. Reject promise (NO logout)
    ↓
UI component handles error
    ↓
Show "You don't have permission" message
(User stays on current screen)
```

---

## Testing

### Test TOKEN_EXPIRED

```typescript
// 1. Login and get tokens
const { access_token } = await authService.login({
  email: "test@example.com",
  password: "password123",
});

// 2. Wait for token to expire or mock expired token
// 3. Make API request
const profile = await authService.getProfile();

// Expected: Token refreshed automatically, request succeeds
```

### Test INVALID_TOKEN

```typescript
// 1. Set invalid token
tokenManager.setTokens("invalid_token_here", "refresh_token");

// 2. Make API request
try {
  await authService.getProfile();
} catch (error) {
  // Expected: Error thrown, logout event emitted, user logged out
}
```

### Test FORBIDDEN

```typescript
// 1. Login as regular user
// 2. Try to access admin endpoint
try {
  await api.get("/api/v1/admin/users");
} catch (error) {
  // Expected: 403 error, NO logout, user stays authenticated
  console.log(error.response.data.code); // "FORBIDDEN"
}
```

---

## Error Response Examples

### TOKEN_EXPIRED

```json
{
  "statusCode": 401,
  "message": "Access token has expired",
  "error": "TokenExpired",
  "code": "TOKEN_EXPIRED"
}
```

### INVALID_TOKEN

```json
{
  "statusCode": 401,
  "message": "Invalid access token",
  "error": "InvalidToken",
  "code": "INVALID_TOKEN"
}
```

### INVALID_USER

```json
{
  "statusCode": 401,
  "message": "User account not found or inactive",
  "error": "InvalidUser",
  "code": "INVALID_USER"
}
```

### FORBIDDEN

```json
{
  "statusCode": 403,
  "message": "You do not have permission to access this resource",
  "error": "Forbidden",
  "code": "FORBIDDEN"
}
```

---

## Benefits

### ✅ Better User Experience

- Automatic token refresh (seamless)
- Clear error messages
- No unnecessary logouts for permission errors

### ✅ Improved Security

- Immediate token cleanup on auth failures
- Proper handling of invalid/expired tokens
- Detection of refresh token expiration

### ✅ Better Error Handling

- Distinct handling for different error types
- Type-safe error codes
- Proper error propagation

### ✅ React Native Compatible

- No browser-specific APIs (no `window`)
- Uses Node.js EventEmitter
- Works on iOS and Android

---

## Migration Notes

### No Breaking Changes!

All existing code continues to work:

```typescript
// Old code still works
const { logout } = useAuth();
logout();

// New automatic logout from API errors
// No code changes needed - it just works!
```

### What's New

- Automatic logout on token expiration (after refresh fails)
- Automatic logout on invalid token
- Automatic logout on invalid user
- Better error messages
- No manual error handling needed in most cases

---

## Troubleshooting

### Issue: Still getting 401 errors after token refresh

**Cause:** Refresh token might also be expired

**Solution:** Check console logs for "Refresh token expired or invalid"

```typescript
// api.ts logs this automatically
console.error("Refresh token expired or invalid, clearing auth state");
```

### Issue: User logged out unexpectedly

**Check:** Console logs will show the logout reason

```typescript
// In useAuth hook
console.log("Logout event received:", payload);
// payload.reason will show: invalid_token, invalid_user, etc.
```

### Issue: Logout event not triggering

**Verify:**

1. Event emitter is imported correctly
2. useAuth hook is mounted
3. useEffect cleanup is not being called prematurely

---

## API Constants Export

The error codes are exported for use in error handling:

```typescript
import { API_ERROR_CODES } from "@/services/api";

if (error.response?.data?.code === API_ERROR_CODES.FORBIDDEN) {
  // Handle forbidden access
}
```

---

## Summary

✅ **Implemented:**

- React Native-compatible event system
- Automatic error code detection
- Smart token refresh logic
- Automatic logout on auth failures
- User-friendly error messages
- FORBIDDEN vs UNAUTHORIZED distinction

✅ **Benefits:**

- Seamless user experience
- Better security
- Proper error handling
- No breaking changes

All authentication error handling is now **production-ready** and **React Native compatible**! 🎉
