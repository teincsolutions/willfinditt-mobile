# Logout Implementation Documentation

## Overview

Complete logout functionality has been implemented with support for:

- ✅ Single device logout
- ✅ All devices logout
- ✅ Session management
- ✅ Refresh token revocation
- ✅ Active sessions listing

---

## API Endpoints

### 1. Logout (Current Device)

Logs out the user from the current device by revoking the current session and optional refresh token.

**Endpoint:** `POST /auth/logout`

**Authentication:** Required (Bearer Token)

**Request:**

```typescript
Headers:
  Authorization: Bearer <access_token>

Body (optional):
{
  "refreshToken": "abc123..." // Optional: provide to revoke refresh token
}
```

**Response:**

```json
{
  "message": "Logged out successfully"
}
```

**Usage:**

```bash
curl -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "YOUR_REFRESH_TOKEN"}'
```

---

### 2. Logout All Devices

Logs out the user from ALL devices by revoking all sessions and refresh tokens.

**Endpoint:** `POST /auth/logout-all`

**Authentication:** Required (Bearer Token)

**Request:**

```typescript
Headers: Authorization: Bearer<access_token>;
```

**Response:**

```json
{
  "message": "Logged out from all devices successfully"
}
```

**Usage:**

```bash
curl -X POST http://localhost:3000/auth/logout-all \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 3. Get Active Sessions

Retrieves all active sessions for the current user.

**Endpoint:** `GET /auth/sessions`

**Authentication:** Required (Bearer Token)

**Request:**

```typescript
Headers: Authorization: Bearer<access_token>;
```

**Response:**

```json
[
  {
    "id": "session_id_1",
    "deviceInfo": "Chrome on MacOS",
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0...",
    "lastActive": "2025-12-19T10:30:00.000Z",
    "createdAt": "2025-12-19T08:00:00.000Z",
    "expiresAt": "2025-12-20T08:00:00.000Z"
  },
  {
    "id": "session_id_2",
    "deviceInfo": "Safari on iPhone",
    "ipAddress": "192.168.1.5",
    "userAgent": "Mozilla/5.0...",
    "lastActive": "2025-12-19T09:15:00.000Z",
    "createdAt": "2025-12-18T20:00:00.000Z",
    "expiresAt": "2025-12-19T20:00:00.000Z"
  }
]
```

**Usage:**

```bash
curl -X GET http://localhost:3000/auth/sessions \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 4. Revoke Specific Session

Revoke a specific session by its ID (useful for "logout this device" from settings).

**Endpoint:** `DELETE /auth/sessions/:sessionId`

**Authentication:** Required (Bearer Token)

**Request:**

```typescript
Headers:
  Authorization: Bearer <access_token>

Path Parameters:
  sessionId: string // The session ID to revoke
```

**Response:**

```json
{
  "message": "Session revoked successfully"
}
```

**Usage:**

```bash
curl -X DELETE http://localhost:3000/auth/sessions/session_id_1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Implementation Details

### Architecture

```
AuthController
    ↓
AuthService
    ↓
├── SessionService (manages access token sessions)
└── RefreshTokenService (manages refresh tokens)
    ↓
Prisma (Database)
```

### Services Added

#### SessionService

Located: `src/modules/auth/services/session.service.ts`

**Methods:**

- `createSession()` - Create new session
- `validateSession()` - Check if session is valid
- `getUserSessions()` - Get all user sessions
- `revokeSession()` - Revoke specific session
- `revokeAllUserSessions()` - Revoke all user sessions
- `updateSessionActivity()` - Update last active time
- `cleanupExpiredSessions()` - Remove expired sessions

#### RefreshTokenService

Located: `src/modules/auth/services/refresh-token.service.ts`

**Methods:**

- `createRefreshToken()` - Generate and store refresh token
- `validateRefreshToken()` - Validate refresh token
- `rotateRefreshToken()` - Create new, revoke old
- `revokeRefreshToken()` - Revoke specific token
- `revokeAllUserTokens()` - Revoke all user tokens
- `getUserRefreshTokens()` - Get active tokens
- `cleanupExpiredTokens()` - Remove expired tokens

### Database Models

#### Session Model

```prisma
model Session {
  id         String    @id @default(cuid())
  userId     String
  token      String    @unique // Hashed access token
  deviceInfo String?
  ipAddress  String?
  userAgent  String?
  lastActive DateTime  @default(now())
  expiresAt  DateTime
  createdAt  DateTime  @default(now())
  revokedAt  DateTime?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

#### RefreshToken Model

```prisma
model RefreshToken {
  id         String    @id @default(cuid())
  token      String    @unique
  userId     String
  expiresAt  DateTime
  createdAt  DateTime  @default(now())
  revokedAt  DateTime?
  replacedBy String? // For token rotation
  deviceInfo String?
  ipAddress  String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

## Security Features

### Token Storage

- **Access tokens**: Hashed (SHA-256) before storing in sessions
- **Refresh tokens**: Stored as unique strings
- **Revoked tokens**: Marked with `revokedAt` timestamp

### Token Reuse Detection

When a revoked refresh token is reused:

1. Detects potential token theft
2. Automatically revokes ALL user tokens
3. Logs security warning
4. Forces user to login again

### Automatic Cleanup

Both services have cleanup methods to remove:

- Expired tokens/sessions
- Old revoked tokens (30 days for refresh, 7 days for sessions)

---

## Frontend Integration

### Logout Flow

```typescript
class AuthService {
  async logout() {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();

    try {
      await fetch('/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // Clear tokens regardless of API response
      this.clearTokens();
      this.redirectToLogin();
    }
  }

  async logoutAllDevices() {
    const accessToken = this.getAccessToken();

    try {
      await fetch('/auth/logout-all', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error('Logout all failed:', error);
    } finally {
      this.clearTokens();
      this.redirectToLogin();
    }
  }

  private clearTokens() {
    // Clear from memory
    this.accessToken = null;
    this.refreshToken = null;

    // Clear from storage (if using)
    sessionStorage.clear();
    localStorage.removeItem('user');
  }
}
```

### Session Management UI

```typescript
// Get active sessions
async getActiveSessions() {
  const response = await fetch('/auth/sessions', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  return await response.json();
}

// Revoke specific session
async revokeSession(sessionId: string) {
  await fetch(`/auth/sessions/${sessionId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
}
```

### React Example

```tsx
function SessionManager() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    const data = await authService.getActiveSessions();
    setSessions(data);
  }

  async function handleRevokeSession(sessionId: string) {
    await authService.revokeSession(sessionId);
    loadSessions(); // Reload list
  }

  async function handleLogoutAll() {
    if (confirm('Logout from all devices?')) {
      await authService.logoutAllDevices();
    }
  }

  return (
    <div>
      <h2>Active Sessions</h2>
      {sessions.map((session) => (
        <div key={session.id}>
          <p>{session.deviceInfo}</p>
          <p>IP: {session.ipAddress}</p>
          <p>Last active: {new Date(session.lastActive).toLocaleString()}</p>
          <button onClick={() => handleRevokeSession(session.id)}>
            Logout this device
          </button>
        </div>
      ))}
      <button onClick={handleLogoutAll}>Logout All Devices</button>
    </div>
  );
}
```

---

## Testing

### Test Logout

```bash
# 1. Login
LOGIN_RESPONSE=$(curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}')

ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.access_token')
REFRESH_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.refresh_token')

# 2. Verify token works
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# 3. Logout
curl -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$REFRESH_TOKEN\"}"

# 4. Try to use token (should fail with 401)
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

### Test Logout All

```bash
# 1. Login from multiple "devices" (just multiple logins)
TOKEN1=$(curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | jq -r '.access_token')

TOKEN2=$(curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | jq -r '.access_token')

# 2. Check sessions
curl -X GET http://localhost:3000/auth/sessions \
  -H "Authorization: Bearer $TOKEN1"

# 3. Logout all from first device
curl -X POST http://localhost:3000/auth/logout-all \
  -H "Authorization: Bearer $TOKEN1"

# 4. Both tokens should now be invalid
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer $TOKEN1"  # 401

curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer $TOKEN2"  # 401
```

---

## Best Practices

### Client-Side

1. **Always Clear Tokens on Logout**

   ```typescript
   // Even if API call fails, clear local tokens
   try {
     await api.logout();
   } finally {
     clearTokens();
     redirect('/login');
   }
   ```

2. **Handle 401 Responses**

   ```typescript
   axios.interceptors.response.use(
     (response) => response,
     (error) => {
       if (error.response?.status === 401) {
         clearTokens();
         redirect('/login');
       }
       return Promise.reject(error);
     },
   );
   ```

3. **Provide Session Management UI**
   - Show active sessions to users
   - Allow revoking individual sessions
   - Show device info and last active time

### Server-Side

1. **Cleanup Jobs**

   ```typescript
   // Schedule cleanup (e.g., using cron)
   @Cron('0 0 * * *') // Daily at midnight
   async handleCleanup() {
     await this.sessionService.cleanupExpiredSessions();
     await this.refreshTokenService.cleanupExpiredTokens();
   }
   ```

2. **Monitor Token Reuse**

   ```typescript
   // Log and alert on token reuse detection
   if (refreshToken.revokedAt) {
     this.logger.warn(`Token reuse detected for user ${userId}`);
     // Send email/notification to user
     // Trigger security alert
   }
   ```

3. **Rate Limiting**
   ```typescript
   // Add rate limiting to logout endpoints
   @Throttle({ default: { limit: 10, ttl: 60000 } })
   async logout() { ... }
   ```

---

## Troubleshooting

### Issue: Logout doesn't revoke session

**Cause:** Access token not properly extracted from headers

**Solution:**

```typescript
// In controller
const accessToken = req.headers.authorization?.replace('Bearer ', '');
```

### Issue: Can still access API after logout

**Causes:**

1. Client still sending old token (clear client cache)
2. Session not properly revoked (check database)
3. JwtAuthGuard not validating sessions

**Solution:**

- Verify token is removed from client
- Check `revokedAt` field in database
- Ensure guard checks session validity

### Issue: Logout all doesn't work

**Cause:** Sessions/tokens not created during login

**Solution:**
Ensure login flow creates both:

- Session (via SessionService)
- Refresh token (via RefreshTokenService)

---

## Summary

✅ **Implemented:**

- Single device logout
- All devices logout
- Active sessions listing
- Session revocation
- Refresh token revocation
- Token reuse detection
- Automatic cleanup

✅ **Security:**

- Tokens hashed before storage
- Revocation timestamps
- Token rotation support
- Reuse detection

✅ **Ready for Production:**

- Complete API documentation
- Frontend integration examples
- Testing guide
- Best practices

All logout functionality is now **fully implemented and production-ready**! 🚀
