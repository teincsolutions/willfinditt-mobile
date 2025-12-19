# Logout Usage Guide - useAuth Hook

## Overview

The `useAuth` hook now includes comprehensive logout and session management functionality based on the backend implementation.

---

## Available Functions

### 1. Logout (Current Device)

Logs out the user from the current device only.

```typescript
const { logout, logoutAsync, isLoggingOut, logoutError } = useAuth();

// Simple logout
logout();

// With custom refresh token
logout("custom_refresh_token");

// Async logout with error handling
try {
  await logoutAsync();
  // Navigate to login
} catch (error) {
  console.error("Logout failed:", error);
}
```

### 2. Logout All Devices

Logs out the user from ALL devices.

```typescript
const { logoutAll, logoutAllAsync, isLoggingOutAll, logoutAllError } =
  useAuth();

// Simple logout all
logoutAll();

// Async with confirmation
const handleLogoutAll = async () => {
  Alert.alert(
    "Logout All Devices",
    "This will log you out from all devices. Continue?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout All",
        style: "destructive",
        onPress: async () => {
          try {
            await logoutAllAsync();
            toast.success("Logged out from all devices");
          } catch (error) {
            toast.error("Failed to logout from all devices");
          }
        },
      },
    ]
  );
};
```

### 3. Get Active Sessions

Retrieve all active sessions for the user.

```typescript
const { activeSessions, isLoadingSessions, refetchSessions, sessionsError } =
  useAuth();

// Sessions are auto-loaded when authenticated
useEffect(() => {
  if (activeSessions) {
    console.log("Active sessions:", activeSessions);
  }
}, [activeSessions]);

// Manual refetch
const handleRefresh = async () => {
  await refetchSessions();
};
```

### 4. Revoke Specific Session

Revoke a single session (logout from specific device).

```typescript
const { revokeSession, revokeSessionAsync, isRevokingSession } = useAuth();

// Simple revoke
revokeSession(sessionId);

// With confirmation
const handleRevokeSession = async (sessionId: string, deviceInfo: string) => {
  Alert.alert("Revoke Session", `Logout from ${deviceInfo}?`, [
    { text: "Cancel", style: "cancel" },
    {
      text: "Logout",
      style: "destructive",
      onPress: async () => {
        try {
          await revokeSessionAsync(sessionId);
          toast.success("Session revoked");
        } catch (error) {
          toast.error("Failed to revoke session");
        }
      },
    },
  ]);
};
```

---

## Complete Examples

### Example 1: Simple Logout Button

```tsx
import { useAuth } from "@/hooks/useAuth";
import { Button, ActivityIndicator } from "react-native";

export function LogoutButton() {
  const { logout, isLoggingOut } = useAuth();

  return (
    <Button
      title={isLoggingOut ? "Logging out..." : "Logout"}
      onPress={() => logout()}
      disabled={isLoggingOut}
    />
  );
}
```

### Example 2: Session Manager Screen

```tsx
import { useAuth } from "@/hooks/useAuth";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useState } from "react";

export function SessionManagerScreen() {
  const {
    activeSessions,
    isLoadingSessions,
    refetchSessions,
    revokeSession,
    isRevokingSession,
    logoutAll,
    isLoggingOutAll,
  } = useAuth();

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchSessions();
    setRefreshing(false);
  };

  const handleRevokeSession = (sessionId: string, deviceInfo: string) => {
    Alert.alert("Revoke Session", `Logout from ${deviceInfo}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => revokeSession(sessionId),
      },
    ]);
  };

  const handleLogoutAll = () => {
    Alert.alert(
      "Logout All Devices",
      "This will log you out from all devices. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout All",
          style: "destructive",
          onPress: () => logoutAll(),
        },
      ]
    );
  };

  if (isLoadingSessions) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
        Active Sessions
      </Text>

      <FlatList
        data={activeSessions || []}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        renderItem={({ item }) => (
          <View
            style={{
              padding: 16,
              marginBottom: 12,
              backgroundColor: "#f5f5f5",
              borderRadius: 8,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 4 }}>
              {item.deviceInfo}
            </Text>
            <Text style={{ fontSize: 14, color: "#666", marginBottom: 2 }}>
              IP: {item.ipAddress}
            </Text>
            <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
              Last active: {new Date(item.lastActive).toLocaleString()}
            </Text>
            <TouchableOpacity
              onPress={() => handleRevokeSession(item.id, item.deviceInfo)}
              disabled={isRevokingSession}
              style={{
                backgroundColor: "#ff4444",
                padding: 8,
                borderRadius: 4,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>
                Logout This Device
              </Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 32, color: "#666" }}>
            No active sessions
          </Text>
        }
      />

      <TouchableOpacity
        onPress={handleLogoutAll}
        disabled={isLoggingOutAll}
        style={{
          backgroundColor: "#ff0000",
          padding: 16,
          borderRadius: 8,
          alignItems: "center",
          marginTop: 16,
        }}
      >
        <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
          {isLoggingOutAll ? "Logging out..." : "Logout All Devices"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
```

### Example 3: Settings Screen with Logout Options

```tsx
import { useAuth } from "@/hooks/useAuth";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";

export function SettingsScreen() {
  const router = useRouter();
  const { logout, logoutAll, isLoggingOut, isLoggingOutAll, activeSessions } =
    useAuth();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => logout(),
      },
    ]);
  };

  const handleLogoutAll = () => {
    Alert.alert(
      "Logout All Devices",
      "This will log you out from all devices. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout All",
          style: "destructive",
          onPress: () => logoutAll(),
        },
      ]
    );
  };

  const sessionCount = activeSessions?.length || 0;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* Other settings items */}

      <View style={{ marginTop: 32 }}>
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 16 }}>
          Security
        </Text>

        {/* Session Manager */}
        <TouchableOpacity
          onPress={() => router.push("/settings/sessions")}
          style={{
            padding: 16,
            backgroundColor: "#f5f5f5",
            borderRadius: 8,
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "500" }}>
            Manage Sessions
          </Text>
          <Text style={{ fontSize: 14, color: "#666", marginTop: 4 }}>
            {sessionCount} active {sessionCount === 1 ? "device" : "devices"}
          </Text>
        </TouchableOpacity>

        {/* Logout Current Device */}
        <TouchableOpacity
          onPress={handleLogout}
          disabled={isLoggingOut}
          style={{
            padding: 16,
            backgroundColor: "#ff6b6b",
            borderRadius: 8,
            marginBottom: 12,
            opacity: isLoggingOut ? 0.5 : 1,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Text>
        </TouchableOpacity>

        {/* Logout All Devices */}
        <TouchableOpacity
          onPress={handleLogoutAll}
          disabled={isLoggingOutAll}
          style={{
            padding: 16,
            backgroundColor: "#ff0000",
            borderRadius: 8,
            opacity: isLoggingOutAll ? 0.5 : 1,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            {isLoggingOutAll ? "Logging out..." : "Logout All Devices"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
```

---

## Hook Return Values

### Logout (Current Device)

| Property     | Type                                | Description                   |
| ------------ | ----------------------------------- | ----------------------------- |
| logout       | `(token?: string) => void`          | Logout mutation function      |
| logoutAsync  | `(token?: string) => Promise<void>` | Async logout function         |
| isLoggingOut | `boolean`                           | Loading state                 |
| logoutError  | `Error \| null`                     | Error object if logout failed |

### Logout All Devices

| Property        | Type                  | Description                  |
| --------------- | --------------------- | ---------------------------- |
| logoutAll       | `() => void`          | Logout all mutation function |
| logoutAllAsync  | `() => Promise<void>` | Async logout all function    |
| isLoggingOutAll | `boolean`             | Loading state                |
| logoutAllError  | `Error \| null`       | Error object if failed       |

### Active Sessions

| Property          | Type                     | Description                  |
| ----------------- | ------------------------ | ---------------------------- |
| activeSessions    | `Session[] \| undefined` | Array of active sessions     |
| isLoadingSessions | `boolean`                | Loading state                |
| refetchSessions   | `() => Promise<void>`    | Refetch sessions manually    |
| sessionsError     | `Error \| null`          | Error object if fetch failed |

### Revoke Session

| Property           | Type                            | Description                   |
| ------------------ | ------------------------------- | ----------------------------- |
| revokeSession      | `(id: string) => void`          | Revoke mutation function      |
| revokeSessionAsync | `(id: string) => Promise<void>` | Async revoke function         |
| isRevokingSession  | `boolean`                       | Loading state                 |
| revokeSessionError | `Error \| null`                 | Error object if revoke failed |

---

## Session Object Structure

```typescript
interface Session {
  id: string;
  deviceInfo: string;
  ipAddress: string;
  userAgent: string;
  lastActive: string; // ISO date string
  createdAt: string; // ISO date string
  expiresAt: string; // ISO date string
}
```

---

## Best Practices

1. **Always handle errors gracefully**

   ```typescript
   try {
     await logoutAsync();
   } catch (error) {
     // Show user-friendly error message
     toast.error("Logout failed. Please try again.");
   }
   ```

2. **Provide user confirmations for destructive actions**

   ```typescript
   Alert.alert("Confirm", "Are you sure?", [
     { text: "Cancel", style: "cancel" },
     { text: "Yes", onPress: () => logoutAll() },
   ]);
   ```

3. **Show loading states during logout**

   ```typescript
   if (isLoggingOut) {
     return <ActivityIndicator />;
   }
   ```

4. **Clear local state after logout**

   - The hook automatically clears tokens and cache
   - Navigation to login is handled by your app's auth flow

5. **Refresh sessions when needed**
   ```typescript
   useEffect(() => {
     if (isAuthenticated) {
       refetchSessions();
     }
   }, [isAuthenticated]);
   ```

---

## Notes

- Logout functions **always clear local tokens**, even if the API call fails
- Sessions are automatically invalidated on the backend
- Refresh tokens are revoked during logout
- The `clearAuthState()` function handles all cleanup automatically
- Toast notifications are shown for success/error states

---

## Testing

### Test Current Device Logout

```typescript
import { renderHook, act } from "@testing-library/react-hooks";
import { useAuth } from "@/hooks/useAuth";

test("should logout current device", async () => {
  const { result } = renderHook(() => useAuth());

  await act(async () => {
    await result.current.logoutAsync();
  });

  expect(result.current.isAuthenticated).toBe(false);
  expect(result.current.user).toBeNull();
});
```

### Test Logout All Devices

```typescript
test("should logout all devices", async () => {
  const { result } = renderHook(() => useAuth());

  await act(async () => {
    await result.current.logoutAllAsync();
  });

  expect(result.current.isAuthenticated).toBe(false);
  expect(result.current.activeSessions).toHaveLength(0);
});
```

---

## Troubleshooting

### Issue: Sessions not loading

**Solution:** Ensure user is authenticated and refetch manually:

```typescript
if (isAuthenticated && !activeSessions) {
  refetchSessions();
}
```

### Issue: Logout doesn't clear state

**Solution:** The hook automatically clears state. If issues persist, check:

- Token manager implementation
- MMKV storage
- React Query cache

### Issue: Can still access API after logout

**Solution:** This shouldn't happen. The hook clears tokens. If it does:

- Check API interceptors
- Verify token is removed from storage
- Clear app cache/data

---

## Migration from Old Implementation

If you're using the old logout:

```typescript
// Old
const { logout } = useAuth();
logout();

// New (same API!)
const { logout } = useAuth();
logout(); // Works the same!

// New features
logoutAll(); // Logout from all devices
revokeSession(sessionId); // Logout specific device
```

No breaking changes! All existing logout calls work as before, with new features available.
