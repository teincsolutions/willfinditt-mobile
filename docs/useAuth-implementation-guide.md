# useAuth Hook - Complete Implementation Guide

## Overview
Complete authentication hook using TanStack Query mutations for all operations, with MMKV for persistent storage. No Zustand dependency - state managed via React Query and MMKV.

## Features Implemented

### ✅ Core Authentication
- **Registration**: Create new user accounts with email/phone
- **Login**: Authenticate users with credentials
- **2FA Support**: Handle two-factor authentication flow
- **Social Auth**: Google/Facebook authentication
- **Logout**: Clear all auth state and tokens

### ✅ Password Management
- **Change Password**: Update password with current password verification
- **Forgot Password**: Request password reset email
- **Reset Password**: Complete password reset with token

### ✅ Email & Phone Verification
- **Verify Email**: Confirm email address with token
- **Verify Phone**: Confirm phone number with OTP
- **Resend Verification**: Request new verification code
- **Phone OTP for Reset**: Send OTP to phone for password reset
- **Verify Phone OTP & Reset**: Complete phone-based password reset

### ✅ Session Management
- **Refresh Token**: Automatically refresh access tokens
- **Get Profile**: Fetch fresh user profile data
- **Check User Status**: Verify user account status and sync changes

## Architecture

### Storage Layer
```typescript
// MMKV native JSON support (no stringify needed)
AUTH_KEYS = {
  USER: "auth_user",
  REQUIRES_2FA: "auth_requires_2fa",
  TWO_FA_USER_ID: "auth_2fa_user_id",
}

// Token storage handled by tokenManager
tokenManager.setTokens(access_token, refresh_token)
tokenManager.getUserId()
tokenManager.clearAllTokens()
```

### State Management
- **React Query**: Mutations for all async operations, automatic error handling
- **MMKV Storage**: Persistent storage with native JSON support
- **No Zustand**: Removed in favor of TanStack Query + MMKV combination

### Mutation Pattern
All operations follow TanStack Query mutation pattern:
```typescript
const operationMutation = useMutation({
  mutationFn: (params) => authService.operation(params),
  onSuccess: (data) => {
    // Update storage
    setStoredUser(data.user);
    // Update React Query cache
    queryClient.setQueryData(["auth", "user"], data.user);
  },
  onError: (error) => {
    // Errors automatically captured by mutation
  }
});
```

## Usage Examples

### Registration
```typescript
const { register, isRegistering, registerError } = useAuth();

// Simple usage
register({
  email: "user@example.com",
  username: "johndoe",
  password: "SecurePass123",
  firstName: "John",
  lastName: "Doe"
});

// Async usage with error handling
try {
  await registerAsync({...});
} catch (error) {
  console.error(registerError);
}
```

### Login with 2FA
```typescript
const { 
  login, 
  isLoggingIn, 
  loginError,
  requires2FA,
  twoFAUserId,
  verify2FA 
} = useAuth();

// Step 1: Login
login({ email, password });

// Step 2: Check if 2FA required
if (requires2FA) {
  // Show OTP input
  verify2FA({ userId: twoFAUserId, otp: "123456" });
}
```

### Password Reset Flow
```typescript
const {
  forgotPassword,
  resetPassword,
  isSendingPasswordReset,
  isResettingPassword
} = useAuth();

// Step 1: Request reset
forgotPassword("user@example.com");

// Step 2: Reset with token
resetPassword({ token: "reset-token", newPassword: "NewPass123" });
```

### Phone Verification
```typescript
const {
  verifyPhone,
  resendVerification,
  isVerifyingPhone,
  isResendingVerification
} = useAuth();

// Verify with OTP
verifyPhone("123456");

// Resend OTP
resendVerification({ phone: "+1234567890" });
```

### Session Management
```typescript
const {
  refreshToken,
  getProfile,
  checkUserStatus,
  isRefreshingToken
} = useAuth();

// Refresh access token
refreshToken();

// Get fresh profile data
getProfile();

// Check if user account status changed
checkUserStatus();
```

## Return Interface

### User State
```typescript
{
  user: User | null,              // Current user object
  isLoading: boolean,             // Initial user load state
  isAuthenticated: boolean,       // !!user
}
```

### Registration
```typescript
{
  register: (data) => void,       // Trigger registration
  registerAsync: (data) => Promise<>,
  isRegistering: boolean,         // Mutation pending state
  registerError: Error | null,    // Mutation error
}
```

### Login
```typescript
{
  login: (credentials) => void,
  loginAsync: (credentials) => Promise<>,
  isLoggingIn: boolean,
  loginError: Error | null,
}
```

### 2FA
```typescript
{
  verify2FA: (data) => void,
  verify2FAAsync: (data) => Promise<>,
  isVerifying2FA: boolean,
  verify2FAError: Error | null,
  requires2FA: boolean,           // From MMKV storage
  twoFAUserId: string | null,     // From MMKV storage
}
```

### Social Auth
```typescript
{
  socialAuth: (data) => void,
  socialAuthAsync: (data) => Promise<>,
  isSocialAuthLoading: boolean,
  socialAuthError: Error | null,
}
```

### Logout
```typescript
{
  logout: () => void,
  logoutAsync: () => Promise<>,
  isLoggingOut: boolean,
}
```

### Password Management
```typescript
{
  changePassword: (data) => void,
  changePasswordAsync: (data) => Promise<>,
  isChangingPassword: boolean,
  changePasswordError: Error | null,

  forgotPassword: (email) => void,
  forgotPasswordAsync: (email) => Promise<>,
  isSendingPasswordReset: boolean,
  forgotPasswordError: Error | null,

  resetPassword: (data) => void,
  resetPasswordAsync: (data) => Promise<>,
  isResettingPassword: boolean,
  resetPasswordError: Error | null,
}
```

### Email & Phone Verification
```typescript
{
  verifyEmail: (token) => void,
  verifyEmailAsync: (token) => Promise<>,
  isVerifyingEmail: boolean,
  verifyEmailError: Error | null,

  verifyPhone: (otp) => void,
  verifyPhoneAsync: (otp) => Promise<>,
  isVerifyingPhone: boolean,
  verifyPhoneError: Error | null,

  resendVerification: (data) => void,
  resendVerificationAsync: (data) => Promise<>,
  isResendingVerification: boolean,
  resendVerificationError: Error | null,

  sendPhoneOTP: (phone) => void,
  sendPhoneOTPAsync: (phone) => Promise<>,
  isSendingPhoneOTP: boolean,
  sendPhoneOTPError: Error | null,

  verifyPhoneOTPAndReset: (data) => void,
  verifyPhoneOTPAndResetAsync: (data) => Promise<>,
  isVerifyingPhoneOTPAndReset: boolean,
  verifyPhoneOTPAndResetError: Error | null,
}
```

### Session Management
```typescript
{
  refreshToken: () => void,
  refreshTokenAsync: () => Promise<>,
  isRefreshingToken: boolean,
  refreshTokenError: Error | null,

  getProfile: () => void,
  getProfileAsync: () => Promise<>,
  isGettingProfile: boolean,
  getProfileError: Error | null,

  checkUserStatus: () => void,
  checkUserStatusAsync: () => Promise<>,
  isCheckingUserStatus: boolean,
}
```

## Error Handling

All mutations include automatic error capture:
```typescript
const { registerError, loginError } = useAuth();

if (registerError) {
  console.error(registerError.message);
}

// OR use async/await
try {
  await registerAsync(data);
} catch (error) {
  // Handle error
}
```

## Benefits

### 1. **Better Error Handling**
- TanStack Query mutations automatically capture errors
- No need for manual try/catch in hook
- Each operation has dedicated error state

### 2. **Loading States**
- Granular loading states for each operation
- `isRegistering`, `isLoggingIn`, `isChangingPassword`, etc.
- Better UX with precise loading indicators

### 3. **Type Safety**
- Full TypeScript support
- All mutations properly typed
- IntelliSense support for all operations

### 4. **Optimistic Updates**
- Easy to implement with TanStack Query
- Automatic rollback on failure
- Better perceived performance

### 5. **Cache Management**
- Automatic cache invalidation
- Manual cache updates via `queryClient.setQueryData`
- Consistent state across app

### 6. **No State Management Library**
- No Zustand dependency
- MMKV for persistence
- React Query for async state
- Simpler architecture

## Integration

### In Components
```typescript
function LoginScreen() {
  const { login, isLoggingIn, loginError } = useAuth();

  const handleLogin = () => {
    login({ email, password });
  };

  return (
    <>
      {loginError && <ErrorMessage>{loginError.message}</ErrorMessage>}
      <Button 
        onPress={handleLogin} 
        loading={isLoggingIn}
        disabled={isLoggingIn}
      >
        Login
      </Button>
    </>
  );
}
```

### With Navigation
```typescript
function LoginScreen() {
  const { loginAsync, isLoggingIn } = useAuth();
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      await loginAsync({ email, password });
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return <LoginForm onSubmit={handleLogin} loading={isLoggingIn} />;
}
```

## Testing

All mutations are easily testable:
```typescript
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

test("login mutation", async () => {
  const { result } = renderHook(() => useAuth(), { wrapper });

  act(() => {
    result.current.login({ email: "test@test.com", password: "pass" });
  });

  await waitFor(() => {
    expect(result.current.isLoggingIn).toBe(false);
    expect(result.current.user).toBeDefined();
  });
});
```

## Related Files

- `hooks/useAuth.ts` - Main hook implementation
- `services/authService.ts` - Auth API endpoints
- `services/userService.ts` - User profile endpoints
- `utils/tokenManager.ts` - Token storage & management
- `utils/mmkvStorage.ts` - MMKV storage wrapper
- `types/user.ts` - User & auth types
- `lib/query-client.ts` - React Query configuration

## Migration Notes

### From Old useAuth (Zustand)
```typescript
// OLD (Zustand)
const { user, login, isLoading } = useAuth();

// NEW (TanStack Query)
const { user, login, isLoggingIn } = useAuth();
//                     ↑ More specific loading state
```

### Error Handling
```typescript
// OLD (Zustand)
const { error } = useAuth();

// NEW (TanStack Query)
const { loginError, registerError, changePasswordError } = useAuth();
//      ↑ Specific errors for each operation
```

### Async Operations
```typescript
// OLD (Zustand)
await login(credentials); // May not throw

// NEW (TanStack Query)
await loginAsync(credentials); // Properly throws on error
```

## Performance Considerations

1. **Query Stale Time**: User query has `staleTime: Infinity` - never refetches automatically
2. **Manual Refetch**: Use `getProfile()` or `checkUserStatus()` to refresh user data
3. **Token Refresh**: Handled by API interceptor in `services/api.ts`
4. **MMKV Performance**: Native storage, faster than AsyncStorage
5. **React Query Cache**: Persisted to MMKV via `mmkvQueryPersister`

## Future Enhancements

- [ ] Biometric authentication
- [ ] Remember me functionality
- [ ] Session timeout handling
- [ ] Multi-device session management
- [ ] Account deletion
- [ ] Profile update mutations
