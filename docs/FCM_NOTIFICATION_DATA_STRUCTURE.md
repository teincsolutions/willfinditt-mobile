# FCM Notification Data Structure Guide

This document outlines the required data structure for each notification type that comes through Firebase Cloud Messaging (FCM) to ensure proper routing in the WillFindIt mobile app.

## Overview

All FCM notifications must include a `data` object with the following structure:

```json
{
  "data": {
    "type": "NOTIFICATION_TYPE",
    // Additional fields based on notification type
  },
  "notification": {
    "title": "Notification Title",
    "body": "Notification Body"
  }
}
```

The `type` field in the `data` object determines how the notification will be routed within the app.

### FCM Topics
In addition to individual notifications, the app supports FCM topic subscriptions for mass messaging. Users can subscribe/unsubscribe from topics like promotions, system announcements, and ad updates. Topics are managed through the one-night-notify service and provide efficient delivery of category-based notifications.

## FCM Topics for Subscription Management

In addition to individual notifications, the app supports FCM topic subscriptions that allow users to opt-in/out of specific categories of notifications. Topics are managed through the one-night-notify service and allow for efficient mass messaging.

### Available Topics

#### 1. PROMOTIONS
**Topic Name:** `promotions`

**Purpose:** Marketing offers, deals, and promotional content

**Default Subscription:** `false` (opt-in required)

**Example Usage:**
```json
{
  "to": "/topics/promotions",
  "notification": {
    "title": "Flash Sale Alert!",
    "body": "50% off on all electronics - limited time offer"
  },
  "data": {
    "type": "PROMOTION",
    "campaignId": "summer_sale_2024",
    "discount": "50%"
  }
}
```

#### 2. SYSTEM
**Topic Name:** `system`

**Purpose:** Important system announcements, maintenance notifications, and critical updates

**Default Subscription:** `false` (opt-in required)

**Example Usage:**
```json
{
  "to": "/topics/system",
  "notification": {
    "title": "Scheduled Maintenance",
    "body": "The app will be unavailable for 2 hours tonight for maintenance"
  },
  "data": {
    "type": "SYSTEM",
    "priority": "high",
    "maintenanceStart": "2024-01-15T22:00:00Z",
    "maintenanceEnd": "2024-01-16T00:00:00Z"
  }
}
```

#### 3. ADS
**Topic Name:** `ads`

**Purpose:** Ad status updates, expiration warnings, and performance notifications

**Default Subscription:** `false` (opt-in required)

**Example Usage:**
```json
{
  "to": "/topics/ads",
  "notification": {
    "title": "Ad Expiring Soon",
    "body": "Your premium ad listing expires in 24 hours"
  },
  "data": {
    "type": "AD_INTERACTION",
    "adId": "ad_123456",
    "action": "expiring_soon",
    "expiresAt": "2024-01-16T10:30:00Z"
  }
}
```

### Topic Subscription Management

#### Backend API Endpoints

**Subscribe to Topic:**
```
POST /v1/topics/subscribe
{
  "userId": "user_123",
  "topic": "promotions"
}
```

**Unsubscribe from Topic:**
```
POST /v1/topics/unsubscribe
{
  "userId": "user_123",
  "topic": "promotions"
}
```

**Get User Subscriptions:**
```
GET /v1/topics/subscriptions/{userId}
```

**Update All Subscriptions:**
```
PUT /v1/topics/subscriptions/{userId}
{
  "promotions": true,
  "system": false,
  "ads": true
}
```

#### Mobile App Integration

The mobile app automatically manages topic subscriptions through the `useNotificationTopics` hook:

```typescript
import { useNotificationTopics, NOTIFICATION_TOPICS } from '@/hooks/useNotificationTopics';

const { topicSubscriptions, toggleTopicSubscription, updateAllTopicSubscriptions } = useNotificationTopics();

// Toggle individual topic subscription
toggleTopicSubscription(NOTIFICATION_TOPICS.PROMOTIONS);

// Update all subscriptions at once
updateAllTopicSubscriptions({
  [NOTIFICATION_TOPICS.PROMOTIONS]: true,
  [NOTIFICATION_TOPICS.SYSTEM]: false,
  [NOTIFICATION_TOPICS.ADS]: true,
});
```

#### Local Storage Persistence

Topic subscriptions are persisted locally using MMKV for fast, reliable storage:

```typescript
// Storage key for topic settings
const TOPIC_SETTINGS_KEY = 'notification_topic_settings';

// Default settings (all topics start unsubscribed)
const DEFAULT_TOPIC_SETTINGS = {
  [NOTIFICATION_TOPICS.PROMOTIONS]: false,
  [NOTIFICATION_TOPICS.SYSTEM]: false,
  [NOTIFICATION_TOPICS.ADS]: false,
};
```

#### Synchronization Strategy

The app implements a sync strategy to keep local preferences and FCM subscriptions aligned:

1. **Local Storage**: User preferences stored in MMKV
2. **FCM Registration**: Device automatically subscribes to selected topics
3. **Backend Sync**: Topic preferences synced with user profile (optional)
4. **Conflict Resolution**: Local settings take precedence, with backend as backup

### Topic-Based Notification Flow

1. **User Registration:** When a user registers their FCM token, they can specify topic preferences
2. **Topic Subscription:** The app subscribes the user's device to selected FCM topics
3. **Mass Messaging:** Backend can send notifications to entire topic groups using `/topics/{topicName}`
4. **User Control:** Users can opt-in/out of topics through the app's notification settings
5. **Automatic Management:** Subscriptions are persisted locally and synced with FCM

### Best Practices for Topic Notifications

#### Topic Naming Convention
- Use lowercase, descriptive names
- Avoid special characters
- Keep names consistent across platforms

#### Content Guidelines
- Topic notifications should be relevant to the topic category
- Include clear call-to-action when appropriate
- Respect user preferences and opt-in status

#### Performance Considerations
- Use topics for broad messaging rather than individual notifications
- Monitor topic subscription counts for large-scale campaigns
- Consider geographic or demographic segmentation for better targeting

#### Error Handling
- Handle subscription failures gracefully
- Provide user feedback for subscription status changes
- Log topic-related errors for debugging

### Testing Topic Notifications

#### Firebase Console Testing
```json
{
  "message": {
    "topic": "promotions",
    "notification": {
      "title": "Test Promotion",
      "body": "This is a test promotional notification"
    },
    "data": {
      "type": "PROMOTION",
      "test": "true"
    }
  }
}
```

#### API Testing
```bash
# Subscribe to topic
curl -X POST https://api.one-night-notify.com/v1/topics/subscribe \
  -H "Content-Type: application/json" \
  -d '{"userId": "test_user", "topic": "promotions"}'

# Send topic notification
curl -X POST https://fcm.googleapis.com/fcm/send \
  -H "Authorization: key=YOUR_SERVER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "/topics/promotions",
    "notification": {
      "title": "Topic Test",
      "body": "Testing topic notifications"
    }
  }'
```

## Notification Types and Required Data

### 1. AD_INTERACTION
Routes to: `/ads/[adId]`

**Required Data Fields:**
- `adId` (string): The ID of the advertisement

**Example:**
```json
{
  "data": {
    "type": "AD_INTERACTION",
    "adId": "ad_123456"
  },
  "notification": {
    "title": "Someone interacted with your ad",
    "body": "Check out the latest activity on your listing"
  }
}
```

### 2. CHAT_MESSAGE
Routes to: `/chats/[chatId]`

**Required Data Fields:**
- `chatId` (string): The ID of the chat conversation

**Example:**
```json
{
  "data": {
    "type": "CHAT_MESSAGE",
    "chatId": "chat_789012"
  },
  "notification": {
    "title": "New message",
    "body": "You have a new message in your conversation"
  }
}
```

### 3. SELLER_REVIEW
Routes to: `/account/reviews`

**Required Data Fields:**
- None

**Example:**
```json
{
  "data": {
    "type": "SELLER_REVIEW"
  },
  "notification": {
    "title": "New review received",
    "body": "Someone left a review for your service"
  }
}
```

### 4. AD_COMMENT
Routes to: `/ads/[adId]`

**Required Data Fields:**
- `adId` (string): The ID of the advertisement that received the comment

**Example:**
```json
{
  "data": {
    "type": "AD_COMMENT",
    "adId": "ad_345678"
  },
  "notification": {
    "title": "New comment on your ad",
    "body": "Someone commented on your listing"
  }
}
```

### 5. PROMOTION
Routes to: `/(drawers)/notifications`

**Required Data Fields:**
- None

**Example:**
```json
{
  "data": {
    "type": "PROMOTION"
  },
  "notification": {
    "title": "Promotional offer",
    "body": "Check out our latest promotional deals"
  }
}
```

### 6. SYSTEM
Routes to: `/(drawers)/notifications`

**Required Data Fields:**
- None

**Example:**
```json
{
  "data": {
    "type": "SYSTEM"
  },
  "notification": {
    "title": "System notification",
    "body": "Important system update information"
  }
}
```

## Routing Behavior

### Successful Routing
- If all required parameters are present in the `data` object, the app will navigate to the specified route
- Parameters are passed as route parameters (e.g., `/ads/[adId]` becomes `/ads/ad_123456`)

### Fallback Behavior
- If required parameters are missing, the app will use the fallback path defined for each notification type
- If no fallback path is defined, notifications default to `/(drawers)/notifications`
- Invalid notification types also default to `/(drawers)/notifications`

### Topic-Based Notifications
Notifications sent to FCM topics (e.g., `/topics/promotions`) are delivered to all subscribed devices automatically. These notifications still follow the same data structure requirements but are intended for broadcast messaging rather than individual user targeting.

**Key Differences:**
- Topic notifications are sent to multiple devices simultaneously
- Users must opt-in to topics through the app settings
- Topic subscriptions are managed separately from individual notifications
- Better for announcements, promotions, and system-wide messages

### Relationship Between Notification Types and Topics

While notification types determine routing behavior, FCM topics control delivery scope:

- **Individual Notifications**: Sent to specific users with routing based on notification type
- **Topic Notifications**: Broadcast to all subscribers of a topic, using appropriate notification types
- **Hybrid Approach**: Topics can use specific notification types for proper routing (e.g., a promotion topic notification that routes to a specific ad)

**Example:** A promotional campaign might send a topic notification to `/topics/promotions` with `type: "AD_INTERACTION"` to route users to a specific promoted ad.

## Additional Data Fields

While not required for routing, you can include additional fields in the `data` object for enhanced functionality:

```json
{
  "data": {
    "type": "AD_INTERACTION",
    "adId": "ad_123456",
    "userId": "user_789",
    "action": "viewed",
    "timestamp": "2024-01-15T10:30:00Z",
    "metadata": {
      "source": "search_results",
      "category": "electronics"
    }
  }
}
```

## Error Handling

The app includes comprehensive error handling for:
- Missing notification types
- Missing required parameters
- Invalid route configurations
- Navigation failures

All errors are logged to the console and fall back to the notifications screen.

## Testing

When testing FCM notifications, ensure:
1. The `data.type` field matches one of the supported notification types
2. All required parameters are included and properly formatted
3. The app is built and running to test routing behavior
4. Check console logs for any routing errors or warnings

## Backend Integration Notes

When sending notifications from your backend:

### Device and Topic Management
- Use the one-night-notify API endpoints for device registration and topic subscription management
- Ensure FCM tokens are properly registered for each device
- Implement topic subscription endpoints to allow users to manage their preferences
- Sync topic subscriptions between your user database and FCM

### Notification Delivery
- Include proper error handling for failed deliveries
- Consider user preferences for notification types they want to receive
- Use appropriate FCM topics for mass messaging instead of individual notifications when possible
- Implement rate limiting and spam protection for topic-based notifications

### Topic Subscription API
The one-night-notify service should provide the following topic management endpoints:

```
POST   /v1/topics/subscribe          # Subscribe user to topic
POST   /v1/topics/unsubscribe        # Unsubscribe user from topic
GET    /v1/topics/subscriptions/:userId  # Get user's topic subscriptions
PUT    /v1/topics/subscriptions/:userId  # Update all user subscriptions
GET    /v1/topics/stats/:topic       # Get topic subscription statistics
```

### Database Schema Considerations
Consider adding topic subscription tracking to your user database:

```sql
-- User topic subscriptions table
CREATE TABLE user_topic_subscriptions (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  topic VARCHAR(50) NOT NULL,
  subscribed BOOLEAN DEFAULT false,
  subscribed_at TIMESTAMP,
  unsubscribed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, topic)
);
```

### Monitoring and Analytics
- Track topic subscription rates and notification engagement
- Monitor FCM delivery success rates by topic
- Implement A/B testing for different notification strategies
- Provide analytics on topic performance and user engagement</content>
<parameter name="filePath">/Users/ericmensah/Projects/willfinditt-mobile/docs/FCM_NOTIFICATION_DATA_STRUCTURE.md