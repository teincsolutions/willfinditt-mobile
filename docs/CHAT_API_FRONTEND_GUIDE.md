# Willfinditt Real-Time APIs Frontend Integration Guide

This guide provides comprehensive documentation for integrating the Willfinditt Chat and Notifications APIs from the frontend. Both systems support REST API endpoints for data management and WebSocket events for real-time messaging.

## Table of Contents

1. [Authentication](#authentication)
2. [Chat API](#chat-api)
   - [Chat REST API Endpoints](#chat-rest-api-endpoints)
   - [Chat WebSocket Integration](#chat-websocket-integration)
   - [Chat Message Types](#chat-message-types)
3. [Notifications API](#notifications-api)
   - [Notifications REST API Endpoints](#notifications-rest-api-endpoints)
   - [Notifications WebSocket Integration](#notifications-websocket-integration)
   - [Notification Types](#notification-types)
4. [General Error Handling](#general-error-handling)
5. [Frontend Implementation Examples](#frontend-implementation-examples)

## Authentication

All chat endpoints require JWT authentication. Include the JWT token in the `Authorization` header:

```javascript
const headers = {
  Authorization: `Bearer ${jwtToken}`,
  'Content-Type': 'application/json',
};
```

## REST API Endpoints

### Base URL

```
https://api.willfind8.com/api/v1
```

### 1. Create a Chat

**Endpoint:** `POST /chat`

**Description:** Creates a new chat conversation between two users.

**Request Body:**

```json
{
  "receiverId": "user-2-id",
  "adId": "ad-1-id" // Optional: for ad-related chats
}
```

**Response (201):**

```json
{
  "id": "chat-1-id",
  "senderId": "user-1-id",
  "receiverId": "user-2-id",
  "adId": "ad-1-id",
  "lastMessage": null,
  "lastMessageAt": null,
  "isActive": true,
  "createdAt": "2025-11-08T18:22:11.471Z",
  "updatedAt": "2025-11-08T18:22:11.471Z",
  "sender": {
    "id": "user-1-id",
    "username": "buyer123",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "https://example.com/avatar.jpg"
  },
  "receiver": {
    "id": "user-2-id",
    "username": "seller456",
    "firstName": "Jane",
    "lastName": "Smith",
    "avatar": "https://example.com/avatar2.jpg"
  },
  "unreadCount": 0
}
```

**Frontend Implementation:**

```javascript
async function createChat(receiverId, adId = null) {
  try {
    const response = await fetch('/api/v1/chat', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        receiverId,
        adId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create chat');
    }

    const chat = await response.json();
    return chat;
  } catch (error) {
    console.error('Error creating chat:', error);
    throw error;
  }
}
```

### 2. Get User Chats

**Endpoint:** `GET /chat`

**Description:** Retrieves paginated list of user's chats.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `search` (optional): Search in usernames/first names/last names
- `adId` (optional): Filter by specific ad

**Response (200):**

```json
{
  "data": [
    {
      "id": "chat-1-id",
      "senderId": "user-1-id",
      "receiverId": "user-2-id",
      "adId": "ad-1-id",
      "lastMessage": "Hello, is this item still available?",
      "lastMessageAt": "2025-11-08T18:22:11.471Z",
      "isActive": true,
      "createdAt": "2025-11-08T18:22:11.471Z",
      "updatedAt": "2025-11-08T18:22:11.471Z",
      "sender": {
        "id": "user-1-id",
        "username": "buyer123",
        "firstName": "John",
        "lastName": "Doe"
      },
      "receiver": {
        "id": "user-2-id",
        "username": "seller456",
        "firstName": "Jane",
        "lastName": "Smith"
      },
      "unreadCount": 2
    }
  ],
  "meta": {
    "total": 5,
    "page": 1,
    "limit": 20,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

**Frontend Implementation:**

```javascript
async function getUserChats(page = 1, limit = 20, search = '', adId = null) {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) params.append('search', search);
    if (adId) params.append('adId', adId);

    const response = await fetch(`/api/v1/chat?${params}`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch chats');
    }

    const chats = await response.json();
    return chats;
  } catch (error) {
    console.error('Error fetching chats:', error);
    throw error;
  }
}
```

### 3. Get Chat Statistics

**Endpoint:** `GET /chat/stats`

**Description:** Get chat statistics for the current user.

**Response (200):**

```json
{
  "totalChats": 5,
  "activeChats": 3,
  "unreadMessages": 7
}
```

### 4. Get Chat by ID

**Endpoint:** `GET /chat/:chatId`

**Description:** Get detailed information about a specific chat.

**Response (200):**

```json
{
  "id": "chat-1-id",
  "senderId": "user-1-id",
  "receiverId": "user-2-id",
  "adId": "ad-1-id",
  "lastMessage": "Hello, is this item still available?",
  "lastMessageAt": "2025-11-08T18:22:11.471Z",
  "isActive": true,
  "createdAt": "2025-11-08T18:22:11.471Z",
  "updatedAt": "2025-11-08T18:22:11.471Z",
  "sender": {
    "id": "user-1-id",
    "username": "buyer123",
    "firstName": "John",
    "lastName": "Doe"
  },
  "receiver": {
    "id": "user-2-id",
    "username": "seller456",
    "firstName": "Jane",
    "lastName": "Smith"
  }
}
```

### 5. Get Chat Messages

**Endpoint:** `GET /chat/:chatId/messages`

**Description:** Get paginated messages for a specific chat.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)
- `type` (optional): Filter by message type (`TEXT`, `IMAGE`, `FILE`, `LOCATION`, `SYSTEM`)
- `search` (optional): Search in message content

**Response (200):**

```json
{
  "data": [
    {
      "id": "message-1-id",
      "chatId": "chat-1-id",
      "senderId": "user-1-id",
      "receiverId": "user-2-id",
      "content": "Hello, is this item still available?",
      "type": "TEXT",
      "attachments": [],
      "isRead": true,
      "readAt": "2025-11-08T18:22:11.471Z",
      "createdAt": "2025-11-08T18:22:11.471Z",
      "updatedAt": "2025-11-08T18:22:11.471Z",
      "sender": {
        "id": "user-1-id",
        "username": "buyer123",
        "firstName": "John",
        "lastName": "Doe"
      }
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 50,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

### 6. Send Message

**Endpoint:** `POST /chat/:chatId/messages`

**Description:** Send a message in a chat (alternative to WebSocket).

**Request Body:**

```json
{
  "receiverId": "user-2-id",
  "content": "Hello, I'm interested in your item",
  "type": "TEXT",
  "attachments": []
}
```

**Response (201):**

```json
{
  "id": "message-1-id",
  "chatId": "chat-1-id",
  "senderId": "user-1-id",
  "receiverId": "user-2-id",
  "content": "Hello, I'm interested in your item",
  "type": "TEXT",
  "attachments": [],
  "isRead": false,
  "readAt": null,
  "createdAt": "2025-11-08T18:22:11.471Z",
  "updatedAt": "2025-11-08T18:22:11.471Z",
  "sender": {
    "id": "user-1-id",
    "username": "buyer123",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### 7. Mark Chat as Read

**Endpoint:** `PATCH /chat/:chatId/read`

**Description:** Mark all messages in a chat as read.

**Response (200):**

```json
{
  "message": "All messages marked as read"
}
```

### 8. Delete Chat

**Endpoint:** `DELETE /chat/:chatId`

**Description:** Delete/deactivate a chat.

**Response (200):**

```json
{
  "message": "Chat deleted successfully"
}
```

### 9. Delete Message

**Endpoint:** `DELETE /chat/messages/:messageId`

**Description:** Delete a message (only by sender).

**Response (200):**

```json
{
  "message": "Message deleted successfully"
}
```

## WebSocket Integration

### Connection Setup

Connect to the WebSocket server using Socket.IO:

```javascript
import io from 'socket.io-client';

// Connect to chat namespace
const socket = io('https://api.willfind8.com/chat', {
  auth: {
    token: jwtToken, // JWT token for authentication
  },
  transports: ['websocket'],
});

// Connection event handlers
socket.on('connect', () => {
  console.log('Connected to chat server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from chat server');
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});
```

### WebSocket Events

#### Outgoing Events (Client → Server)

##### 1. Send Message

```javascript
socket.emit('send_message', {
  chatId: 'chat-1-id',
  receiverId: 'user-2-id',
  content: 'Hello, is this item still available?',
  type: 'TEXT', // Optional: defaults to 'TEXT'
  attachments: [], // Optional: array of file URLs
});
```

##### 2. Mark Message as Read

```javascript
socket.emit('mark_as_read', {
  messageId: 'message-1-id',
});
```

##### 3. Join Chat Room

```javascript
socket.emit('join_chat', {
  chatId: 'chat-1-id',
});
```

##### 4. Leave Chat Room

```javascript
socket.emit('leave_chat', {
  chatId: 'chat-1-id',
});
```

##### 5. Typing Indicators

```javascript
// Start typing
socket.emit('typing_start', {
  chatId: 'chat-1-id',
});

// Stop typing
socket.emit('typing_stop', {
  chatId: 'chat-1-id',
});
```

#### Incoming Events (Server → Client)

##### 1. New Message

```javascript
socket.on('new_message', (message) => {
  console.log('New message received:', message);
  // Update UI with new message
  updateChatUI(message);
});
```

##### 2. Message Delivered

```javascript
socket.on('message_delivered', (data) => {
  console.log('Message delivered:', data.messageId);
  // Update message status to 'delivered'
  updateMessageStatus(data.messageId, 'delivered');
});
```

##### 3. Message Read

```javascript
socket.on('message_read', (data) => {
  console.log('Message read:', data.messageId, 'by user:', data.readBy);
  // Update message status to 'read'
  updateMessageStatus(data.messageId, 'read');
});
```

##### 4. User Online/Offline

```javascript
socket.on('user_online', (data) => {
  console.log('User came online:', data.userId);
  updateUserStatus(data.userId, 'online');
});

socket.on('user_offline', (data) => {
  console.log('User went offline:', data.userId);
  updateUserStatus(data.userId, 'offline');
});
```

##### 5. Typing Indicators

```javascript
socket.on('user_typing', (data) => {
  console.log('User typing:', data);
  if (data.isTyping) {
    showTypingIndicator(data.userId, data.chatId);
  } else {
    hideTypingIndicator(data.userId, data.chatId);
  }
});
```

##### 6. Chat Updates

```javascript
socket.on('chat_update', (data) => {
  console.log('Chat update:', data);
  // Handle chat updates (new participants, settings changes, etc.)
  handleChatUpdate(data);
});
```

##### 7. System Messages

```javascript
socket.on('system_message', (data) => {
  console.log('System message:', data);
  // Display system messages (user joined, left, etc.)
  displaySystemMessage(data);
});
```

##### 8. Join/Leave Confirmation

```javascript
socket.on('joined_chat', (data) => {
  console.log('Successfully joined chat:', data.chatId);
});

socket.on('left_chat', (data) => {
  console.log('Left chat:', data.chatId);
});
```

##### 9. Error Handling

```javascript
socket.on('error', (error) => {
  console.error('Socket error:', error);
  // Handle errors (unauthorized, chat not found, etc.)
  handleSocketError(error);
});
```

## Message Types

The chat system supports different message types:

- `TEXT`: Plain text messages
- `IMAGE`: Image messages (use attachments array)
- `FILE`: File attachments
- `LOCATION`: Location sharing
- `SYSTEM`: System-generated messages

# Notifications API

The Notifications API provides real-time push notifications to users through both WebSocket connections and background push notification delivery. Like chat, it uses JWT authentication and supports both REST endpoints and WebSocket events.

## Notifications REST API Endpoints

### Base URL

```
https://api.willfind8.com/api/v1
```

### 1. Create Notification

**Endpoint:** `POST /notifications`

**Description:** Create a notification (usually handled by the server, but available for testing).

**Request Body:**

```json
{
  "userId": "user-1-id",
  "title": "New Message",
  "message": "You have received a new message",
  "type": "CHAT_MESSAGE",
  "data": {
    "chatId": "chat-1-id",
    "senderId": "user-2-id",
    "messageId": "message-1-id"
  }
}
```

### 2. Get User Notifications

**Endpoint:** `GET /notifications/my-notifications`

**Description:** Get current user's notifications with pagination.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `isRead` (optional): Filter by read status (`true`/`false`)

**Response (200):**

```json
{
  "data": [
    {
      "id": "notification-1-id",
      "userId": "user-1-id",
      "title": "New Message",
      "message": "You have received a new message",
      "type": "CHAT_MESSAGE",
      "data": {
        "chatId": "chat-1-id",
        "senderId": "user-2-id"
      },
      "isRead": false,
      "readAt": null,
      "createdAt": "2025-11-22T04:07:20.000Z"
    }
  ],
  "meta": {
    "total": 5,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

**Frontend Implementation:**

```javascript
async function getUserNotifications(page = 1, limit = 20, isRead = null) {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (isRead !== null) params.append('isRead', isRead.toString());

    const response = await fetch(
      `/api/v1/notifications/my-notifications?${params}`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }

    const notifications = await response.json();
    return notifications;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
}
```

### 3. Get Unread Count

**Endpoint:** `GET /notifications/unread-count`

**Description:** Get count of unread notifications.

**Response (200):**

```json
{
  "count": 3
}
```

**Frontend Implementation:**

```javascript
async function getUnreadNotificationCount() {
  try {
    const response = await fetch('/api/v1/notifications/unread-count', {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch unread count');
    }

    const data = await response.json();
    return data.count;
  } catch (error) {
    console.error('Error fetching unread count:', error);
    throw error;
  }
}
```

### 4. Get Notification Statistics

**Endpoint:** `GET /notifications/stats`

**Description:** Get notification statistics for current user.

**Response (200):**

```json
{
  "total": 15,
  "unread": 3,
  "read": 12
}
```

### 5. Mark Notification as Read

**Endpoint:** `PATCH /notifications/:notificationId/mark-read`

**Description:** Mark a specific notification as read.

**Request Body:**

```json
{
  "isRead": true
}
```

**Response (200):**

```json
{
  "message": "Notification marked as read successfully"
}
```

**Frontend Implementation:**

```javascript
async function markNotificationAsRead(notificationId, isRead = true) {
  try {
    const response = await fetch(
      `/api/v1/notifications/${notificationId}/mark-read`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isRead }),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to mark notification as read');
    }

    return await response.json();
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}
```

### 6. Mark All Notifications as Read

**Endpoint:** `PATCH /notifications/mark-all-read`

**Description:** Mark all user notifications as read.

**Response (200):**

```json
{
  "message": "All notifications marked as read successfully"
}
```

### 7. Register Push Token

**Endpoint:** `POST /notifications/push-tokens`

**Description:** Register a push notification token for current user.

**Request Body:**

```json
{
  "token": "device-push-token-here",
  "platform": "ios"
}
```

**Response (201):**

```json
{
  "message": "Push token registered successfully"
}
```

## Notifications WebSocket Integration

### Connection Setup

Connect to the notifications WebSocket namespace:

```javascript
import io from 'socket.io-client';

// Connect to notifications namespace
const notificationsSocket = io('https://api.willfind8.com/notifications', {
  auth: {
    token: jwtToken, // JWT token for authentication
  },
  transports: ['websocket'],
});

// Connection event handlers
notificationsSocket.on('connect', () => {
  console.log('Connected to notifications server');
  // Automatically receive recent unread notifications
});

notificationsSocket.on('disconnect', () => {
  console.log('Disconnected from notifications server');
});

notificationsSocket.on('connect_error', (error) => {
  console.error('Notifications connection error:', error);
});
```

**Note:** Unlike chat, notifications use a single connection per user (not room-based). Users automatically receive their own notifications.

### WebSocket Events

#### Outgoing Events (Client → Server)

##### 1. Mark Notification as Read

```javascript
notificationsSocket.emit('mark_notification_read', {
  notificationId: 'notification-1-id',
  isRead: true,
});
```

##### 2. Mark All as Read

```javascript
notificationsSocket.emit('mark_all_read');
```

##### 3. Get Notification Statistics

```javascript
notificationsSocket.emit('get_notification_stats');
```

##### 4. Ping/Pong (Keep Alive)

```javascript
notificationsSocket.emit('ping');
```

#### Incoming Events (Server → Client)

##### 1. New Notification

```javascript
notificationsSocket.on('new_notification', (notification) => {
  console.log('New notification received:', notification);
  // Update UI with notification
  addNotificationToUI(notification);

  // Update badge count
  updateNotificationBadge();
});
```

**Notification Object Structure:**

```javascript
{
  title: "New Message",
  message: "You have received a new message from John Doe",
  data: {
    chatId: "chat-1-id",
    senderId: "user-2-id",
    messageId: "message-1-id"
  },
  type: "CHAT_MESSAGE",
  timestamp: "2025-11-22T04:07:20.000Z"
}
```

##### 2. Recent Notifications

When connecting, you'll receive recent unread notifications:

```javascript
notificationsSocket.on('recent_notifications', (data) => {
  console.log('Recent notifications:', data);
  // data.count: number of unread notifications
  // data.notifications: array of notification objects
  updateNotificationsList(data.notifications);
});
```

##### 3. Notification Marked as Read

```javascript
notificationsSocket.on('notification_read', (data) => {
  console.log('Notification marked as read:', data.notificationId);
  // Update UI to mark notification as read
  markNotificationAsReadInUI(data.notificationId, data.isRead);
});
```

##### 4. All Notifications Marked as Read

```javascript
notificationsSocket.on('all_notifications_read', (data) => {
  console.log('All notifications marked as read, count:', data.count);
  // Mark all notifications as read in UI
  markAllNotificationsAsReadInUI();
  updateNotificationBadge();
});
```

##### 5. Notification Statistics

```javascript
notificationsSocket.on('notification_stats', (stats) => {
  console.log('Notification stats:', stats);
  // stats.total, stats.unread, stats.read
  updateNotificationStats(stats);
});
```

##### 6. User Online/Offline (Optional)

```javascript
notificationsSocket.on('user_online', (data) => {
  console.log('Another user came online:', data.userId);
  updateUserOnlineStatus(data.userId, true);
});

notificationsSocket.on('user_offline', (data) => {
  console.log('Another user went offline:', data.userId);
  updateUserOnlineStatus(data.userId, false);
});
```

##### 7. Connection Events

```javascript
notificationsSocket.on('connection_established', (data) => {
  console.log('Notifications connection established:', data);
  // User ID, Socket ID, connection time
});

notificationsSocket.on('pong', (data) => {
  console.log('Pong received:', data.serverTime);
  // Update connection health indicator
});

notificationsSocket.on('stats', (stats) => {
  console.log('Connection stats:', stats);
  // Total connected users, etc.
});
```

##### 8. Error Handling

```javascript
notificationsSocket.on('error', (error) => {
  console.error('Notifications socket error:', error);
  switch (error.message) {
    case 'Authentication token required':
    case 'Invalid authentication token':
      // Redirect to login
      redirectToLogin();
      break;
    case 'Unauthorized':
      // Reconnect with fresh token
      reconnectWithNewToken();
      break;
    default:
      // Show generic error
      showGenericNotificationError(error.message);
  }
});
```

## Notification Types

The notifications system supports different notification types:

- `AD_INTERACTION`: Ad related interactions (views, likes, etc.)
- `CHAT_MESSAGE`: New chat messages
- `PROMOTION`: Promotional offers and updates
- `SYSTEM`: System announcements and maintenance notices
- `SELLER_REVIEW`: New seller reviews
- `AD_COMMENT`: Comments on ads

## Notifications vs Chat: Key Differences

### Connection Style

- **Chat**: Multiple room-based connections per user (one per active chat)
- **Notifications**: Single connection per user (automatic message routing)

### Real-Time Delivery

- **Chat**: Real-time messaging within active chat sessions
- **Notifications**: Real-time alerts for all types of events (messages, promotions, system updates)

### Use Cases

- **Chat**: Direct communication between buyers and sellers
- **Notifications**: System alerts, promotional content, status updates

# General Error Handling

### HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized
- `403`: Forbidden (access denied)
- `404`: Not Found
- `500`: Internal Server Error

### Common Error Responses

```json
{
  "statusCode": 400,
  "message": ["receiverId must be a string", "receiverId should not be empty"],
  "error": "Bad Request"
}
```

```json
{
  "statusCode": 403,
  "message": "Access denied to this chat",
  "error": "Forbidden"
}
```

### WebSocket Error Handling

```javascript
socket.on('error', (error) => {
  switch (error.message) {
    case 'Unauthorized':
      // Redirect to login
      redirectToLogin();
      break;
    case 'Access denied to this chat':
      // Show access denied message
      showAccessDenied();
      break;
    default:
      // Show generic error
      showGenericError(error.message);
  }
});
```
