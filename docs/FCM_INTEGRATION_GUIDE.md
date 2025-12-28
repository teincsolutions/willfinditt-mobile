# FCM Integration Guide

This document explains how Firebase Cloud Messaging (FCM) is integrated with the one-night-notify API in the WillFindIt mobile app.

## Overview

The FCM integration provides:
- Device token management and registration
- Push notification permissions handling
- Background and foreground message handling
- Automatic notification routing based on notification type
- Integration with one-night-notify API

## Architecture

### Core Components

1. **FCMService** (`services/fcmService.ts`)
   - Handles FCM token retrieval and management
   - Manages notification permissions
   - Displays notifications using Notifee
   - Handles message routing

2. **Background Handler** (`services/fcmBackgroundHandler.ts`)
   - Processes messages when app is in background/terminated
   - Must be imported before any Firebase operations

3. **React Hooks** (`hooks/useOneNightNotifications.ts`)
   - `useFCMInitialization`: Initializes FCM and registers device
   - `useRegisterDevice`: Manual device registration
   - `usePushNotifications`: Fetch notification history

4. **Notification Routing** (`utils/notificationRouting.ts`)
   - Routes notifications based on type and data
   - Handles fallback scenarios

## Setup

### Automatic Setup
FCM is automatically initialized when the app starts via the `FCMInitializer` component in `_layout.tsx`. This handles:
- Permission requests
- Token retrieval and registration
- Message handler setup
- Initial notification handling

### Manual Setup
If you need to manually register a device:

```typescript
import { useRegisterDevice } from '@/hooks/useOneNightNotifications';

const { mutate: registerDevice } = useRegisterDevice(userId);

// Register device
registerDevice();
```

## Notification Types

The system supports these notification types (see `FCM_NOTIFICATION_DATA_STRUCTURE.md` for details):

- `AD_INTERACTION`: Routes to `/ads/[adId]`
- `CHAT_MESSAGE`: Routes to `/chats/[chatId]`
- `SELLER_REVIEW`: Routes to `/account/reviews`
- `AD_COMMENT`: Routes to `/ads/[adId]`
- `PROMOTION`: Routes to notifications screen
- `SYSTEM`: Routes to notifications screen

## FCM Message Structure

All FCM messages should follow this structure:

```json
{
  "data": {
    "type": "NOTIFICATION_TYPE",
    "adId": "ad_123456",     // For AD_INTERACTION and AD_COMMENT
    "chatId": "chat_789"     // For CHAT_MESSAGE
  },
  "notification": {
    "title": "Notification Title",
    "body": "Notification Body"
  }
}
```

## Message Handling

### Foreground Messages
- Automatically displayed using Notifee
- No routing (user is already in app)

### Background/Terminated Messages
- Displayed by background handler
- When tapped, routes to appropriate screen

### Initial Notifications
- Handled when app is opened from notification
- Automatically routes after 1 second delay

## Permissions

Permissions are automatically requested on app start. If denied:
- User can manually grant permissions in device settings
- App will show toast messages for registration failures

## Token Management

### Automatic Token Refresh
- FCM tokens are automatically refreshed by Firebase
- New tokens are re-registered with the backend
- No manual intervention required

### Manual Token Operations
```typescript
import { fcmService } from '@/services/fcmService';

// Get current token
const token = fcmService.getCurrentToken();

// Delete token
await fcmService.deleteToken();
```

## Testing

### Test Notifications
Send test notifications via Firebase Console or one-night-notify API:

```json
{
  "message": {
    "token": "device_fcm_token",
    "data": {
      "type": "CHAT_MESSAGE",
      "chatId": "chat_123"
    },
    "notification": {
      "title": "New Message",
      "body": "You have a new message"
    }
  }
}
```

### Debug Logging
Check console logs for:
- Token registration success/failure
- Permission status
- Message receipt
- Routing decisions

## Error Handling

The system includes comprehensive error handling:
- Permission denied scenarios
- Token retrieval failures
- Registration failures
- Invalid notification data
- Routing failures

All errors are logged and user-friendly toasts are shown.

## Backend Integration

### Device Registration
Devices are automatically registered with the one-night-notify API when FCM initializes.

### Notification Sending
Use the one-night-notify API to send notifications. The FCM integration handles the rest.

### User Management
When users log in/out, FCM tokens are automatically associated/disassociated with user accounts.

## Troubleshooting

### Notifications Not Received
1. Check device permissions in settings
2. Verify FCM token is registered
3. Check console for error messages
4. Test with Firebase Console

### Routing Issues
1. Verify notification `data.type` matches supported types
2. Check required parameters are present
3. Review console logs for routing decisions

### Token Issues
1. Check Firebase configuration files
2. Verify internet connectivity
3. Check Firebase project settings</content>
<parameter name="filePath">/Users/ericmensah/Projects/willfinditt-mobile/docs/FCM_INTEGRATION_GUIDE.md