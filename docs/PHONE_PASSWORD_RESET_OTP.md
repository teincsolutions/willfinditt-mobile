# Phone Password Reset with OTP

## Overview

The phone password reset flow has been updated to use a 6-digit OTP code instead of a long token for better user experience.

## Changes Made

### 1. DTOs Added (`src/modules/auth/dto/auth.dto.ts`)

#### `VerifyResetPhoneOtpDto`

Used to verify the OTP sent via SMS (optional verification step).

```typescript
{
  phone: string; // User's phone number
  otp: string; // 6-digit OTP code
}
```

#### `ResetPasswordWithPhoneDto`

Used to reset password with phone OTP.

```typescript
{
  phone: string; // User's phone number
  otp: string; // 6-digit OTP code
  newPassword: string; // New password (min 6 chars)
}
```

### 2. New Endpoints

#### `POST /auth/verify-reset-phone-otp`

**Optional** endpoint to verify OTP before password reset.

**Request Body:**

```json
{
  "phone": "+233123456789",
  "otp": "123456"
}
```

**Response (200):**

```json
{
  "message": "OTP verified successfully. You can now reset your password.",
  "verified": true
}
```

**Response (400):**

```json
{
  "message": "Invalid verification code"
}
```

---

#### `POST /auth/reset-password-phone`

Reset password using phone OTP.

**Request Body:**

```json
{
  "phone": "+233123456789",
  "otp": "123456",
  "newPassword": "newSecurePassword123"
}
```

**Response (200):**

```json
{
  "message": "Password reset successfully"
}
```

**Response (400):**

```json
{
  "message": "Invalid verification code"
}
```

---

### 3. Updated Endpoints

#### `POST /auth/forgot-password`

Now handles both email and phone differently:

- **Email**: Sends a long token (existing behavior)
- **Phone**: Sends a 6-digit OTP code (NEW)

**Request Body (Phone):**

```json
{
  "phone": "+233123456789"
}
```

**SMS Message:**

```
Your WillFind8 password reset code is: 123456. This code will expire in 10 minutes.
```

**Response:**

```json
{
  "message": "If the account exists, you will receive reset instructions"
}
```

---

## User Flows

### Email Password Reset (Unchanged)

1. User requests password reset with email
2. User receives email with long token link
3. User clicks link and resets password via web form
4. User submits `POST /auth/reset-password` with token

### Phone Password Reset (NEW)

1. User requests password reset with phone number
2. User receives SMS with 6-digit OTP
3. **(Optional)** User verifies OTP via `POST /auth/verify-reset-phone-otp`
4. User submits `POST /auth/reset-password-phone` with phone, OTP, and new password

---

## Implementation Details

### Service Methods (`auth.service.ts`)

#### `forgotPassword()`

- Detects whether email or phone was provided
- **Email**: Generates long token (1 hour expiry)
- **Phone**: Generates 6-digit OTP (10 minutes expiry)

#### `verifyResetPhoneOtp(phone, otp)`

- Validates OTP for given phone number
- Checks expiration (10 minutes)
- Does not reset password (verification only)

#### `resetPasswordWithPhone(phone, otp, newPassword)`

- Validates OTP for given phone number
- Checks expiration (10 minutes)
- Resets password
- Clears reset token
- Sends confirmation email (if user has email)

#### `resetPassword(resetPasswordDto)`

- Existing method for email-based reset
- Now clears reset token after successful reset

---

## Security Notes

1. **OTP Expiry**: Phone OTPs expire in 10 minutes (vs 1 hour for email tokens)
2. **Rate Limiting**: Consider implementing rate limiting on OTP endpoints
3. **No User Enumeration**: Both flows return same message regardless of user existence
4. **Token Cleanup**: Reset tokens are cleared after successful password reset

---

## Testing

### Test Phone Password Reset Flow

1. **Request OTP:**

```bash
curl -X POST http://localhost:3000/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"phone": "+233123456789"}'
```

2. **Verify OTP (Optional):**

```bash
curl -X POST http://localhost:3000/auth/verify-reset-phone-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+233123456789",
    "otp": "123456"
  }'
```

3. **Reset Password:**

```bash
curl -X POST http://localhost:3000/auth/reset-password-phone \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+233123456789",
    "otp": "123456",
    "newPassword": "newSecurePassword123"
  }'
```

---

## Migration Notes

- No database migrations required (uses existing `resetPasswordToken` and `resetPasswordExpires` fields)
- Backward compatible with existing email reset flow
- `setResetPasswordToken` method updated to accept nullable values

---

## Future Improvements

1. Implement rate limiting on OTP endpoints
2. Add SMS delivery tracking
3. Consider adding OTP resend endpoint
4. Add audit logging for password resets
5. Implement CAPTCHA for password reset requests
