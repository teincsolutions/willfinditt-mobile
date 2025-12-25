# Threads API Documentation

This guide provides detailed information for developers on how to use the Threads API endpoints defined in `src/modules/threads/threads.controller.ts`. The Threads API allows managing support threads, notifications, and system communications between users and administrators.

## Authentication

All endpoints require Bearer token authentication. Include the token in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

## WebSocket Real-Time Notifications

The Threads API provides real-time notifications via WebSocket using Socket.IO.

### WebSocket Connection

**Endpoint:** `ws://your-api-url/notifications` (or `wss://` for secure connections)

**Namespace:** `/notifications`

**Authentication Methods:**

1. Via Socket.IO `auth` option (recommended):
   - Property: `auth.token`
   - Value: Your JWT token

2. Via `extraHeaders`:
   - Property: `Authorization`
   - Value: `Bearer {your-jwt-token}`

### WebSocket Events to Listen For

#### 1. `thread.created`

Emitted when a new thread is created. **Broadcast to all admins only.**

**Event Data Structure:**

```json
{
  "thread": {
    "id": "string",
    "userId": "string",
    "title": "string",
    "type": "SUPPORT | NOTIFICATION | SYSTEM",
    "status": "OPEN | CLOSED | PENDING",
    "priority": "LOW | NORMAL | HIGH | URGENT",
    "createdAt": "ISO date string",
    "updatedAt": "ISO date string",
    "user": {
      "id": "string",
      "username": "string",
      "email": "string"
    }
  },
  "user": {
    "id": "string",
    "username": "string",
    "email": "string"
  }
}
```

#### 2. `thread.message`

Emitted when a new message is added to a thread.

- **If a user posts:** Broadcast to all admins
- **If an admin posts:** Sent to the thread creator only

**Event Data Structure:**

```json
{
  "thread": {
    "id": "string",
    "title": "string",
    "type": "string",
    "status": "string",
    "userId": "string"
  },
  "message": {
    "id": "string",
    "threadId": "string",
    "userId": "string",
    "content": "string",
    "isSystem": false,
    "createdAt": "ISO date string"
  },
  "user": {
    "id": "string",
    "username": "string",
    "email": "string"
  }
}
```

#### 3. `thread.closed`

Emitted when a thread is closed. **Sent to the thread creator only.**

**Event Data Structure:**

```json
{
  "thread": {
    "id": "string",
    "userId": "string",
    "title": "string",
    "status": "CLOSED",
    "type": "string",
    "priority": "string",
    "createdAt": "ISO date string",
    "updatedAt": "ISO date string"
  },
  "newStatus": "CLOSED"
}
```

#### 4. `thread.status_changed`

Emitted when a thread status is updated (but not closed). **Sent to the thread creator only.**

**Event Data Structure:**

```json
{
  "thread": {
    "id": "string",
    "userId": "string",
    "title": "string",
    "status": "OPEN | PENDING",
    "type": "string",
    "priority": "string",
    "createdAt": "ISO date string",
    "updatedAt": "ISO date string"
  },
  "newStatus": "OPEN | PENDING"
}
```

### Socket.IO Rooms

Users are automatically joined to rooms upon connection:

- **`user_{userId}`** - Personal room for user-specific notifications
- **`admins`** - Room for all admin users (requires ADMIN role)
- **`moderators`** - Room for moderators (requires ADMIN or MODERATOR role)

**Event Broadcasting Logic:**

- Thread creation → All admins (broadcast)
- User message → All admins (broadcast)
- Admin reply → Thread creator only (room: `user:{userId}`)
- Status change → Thread creator only (room: `user:{userId}`)

### In-App Notifications

In addition to WebSocket events, the API creates in-app notifications in the database:

- `THREAD_CREATED` - New thread created
- `THREAD_MESSAGE` - New message posted
- `THREAD_UPDATED` - Thread status updated
- `THREAD_CLOSED` - Thread closed

These can be fetched via `/api/v1/notifications` endpoints.

## Thread Types

- `SUPPORT`: User support requests
- `NOTIFICATION`: System notifications
- `SYSTEM`: Internal system communications

## Thread Status

- `OPEN`: Active thread
- `CLOSED`: Resolved/completed thread
- `PENDING`: Awaiting response

## Thread Priority

- `LOW`: Low priority
- `NORMAL`: Normal priority (default)
- `HIGH`: High priority
- `URGENT`: Urgent priority

## Endpoints

### 1. Create a Thread

**POST** `/threads`

Creates a new thread for the authenticated user.

**Request Body (CreateThreadDto):**

```json
{
  "title": "string",
  "type": "SUPPORT | NOTIFICATION | SYSTEM",
  "priority": "LOW | NORMAL | HIGH | URGENT" // optional, defaults to NORMAL
}
```

**Response (201): ThreadResponseDto**

```json
{
  "id": "string",
  "userId": "string",
  "title": "string",
  "type": "SUPPORT | NOTIFICATION | SYSTEM",
  "status": "OPEN | CLOSED | PENDING",
  "priority": "LOW | NORMAL | HIGH | URGENT",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string" // optional
  }
}
```

**Error Responses:**

- 400: Bad request (validation error)

### 2. Get All Threads (Admin/Moderator Only)

**GET** `/threads`

Retrieves all threads with optional filters. Requires ADMIN or MODERATOR role.

**Query Parameters (ThreadQueryDto):**

- `userId`: Filter by user ID (optional)
- `type`: Filter by thread type (optional)
- `status`: Filter by thread status (optional)
- `priority`: Filter by thread priority (optional)

**Response (200): Array of ThreadResponseDto**

**Authorization:** ADMIN or MODERATOR only

### 3. Get Current User's Threads

**GET** `/threads/my-threads`

Retrieves all threads created by the authenticated user.

**Response (200): Array of ThreadResponseDto**

### 4. Get Threads by Status (Admin/Moderator Only)

**GET** `/threads/status/:status`

Retrieves threads filtered by status. Requires ADMIN or MODERATOR role.

**Path Parameters:**

- `status`: One of `OPEN | CLOSED | PENDING`

**Response (200): Array of ThreadResponseDto**

**Authorization:** ADMIN or MODERATOR only

### 5. Get Threads by Type (Admin/Moderator Only)

**GET** `/threads/type/:type`

Retrieves threads filtered by type. Requires ADMIN or MODERATOR role.

**Path Parameters:**

- `type`: One of `SUPPORT | NOTIFICATION | SYSTEM`

**Response (200): Array of ThreadResponseDto**

**Authorization:** ADMIN or MODERATOR only

### 6. Get Thread by ID

**GET** `/threads/:id`

Retrieves a specific thread by ID. Users can only access their own threads unless they have ADMIN or MODERATOR role.

**Path Parameters:**

- `id`: Thread ID (string)

**Response (200): ThreadResponseDto**

**Error Responses:**

- 404: Thread not found
- 403: Access denied

### 7. Update Thread

**PATCH** `/threads/:id`

Updates an existing thread. Users can only update their own threads unless they have ADMIN or MODERATOR role.

**Path Parameters:**

- `id`: Thread ID (string)

**Request Body (UpdateThreadDto - optional fields):**

```json
{
  "title": "string", // optional
  "type": "SUPPORT | NOTIFICATION | SYSTEM", // optional
  "priority": "LOW | NORMAL | HIGH | URGENT", // optional
  "status": "OPEN | CLOSED | PENDING" // optional
}
```

**Response (200): ThreadResponseDto**

**Error Responses:**

- 404: Thread not found
- 403: Access denied

### 8. Delete Thread (Admin Only)

**DELETE** `/threads/:id`

Deletes a thread. Requires ADMIN role.

**Path Parameters:**

- `id`: Thread ID (string)

**Response (200):**

```json
{
  "message": "Thread deleted successfully"
}
```

**Error Responses:**

- 404: Thread not found

**Authorization:** ADMIN only

### 9. Add Message to Thread

**POST** `/threads/:id/messages`

Adds a new message to a thread. Users can only add messages to their own threads unless they have ADMIN or MODERATOR role.

**Path Parameters:**

- `id`: Thread ID (string)

**Request Body (Omit<CreateThreadMessageDto, 'threadId'>):**

```json
{
  "content": "string",
  "isSystem": false // optional, defaults to false
}
```

**Response (201): ThreadMessageResponseDto**

```json
{
  "id": "string",
  "threadId": "string",
  "userId": "string",
  "content": "string",
  "isSystem": false,
  "createdAt": "ISO date string",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string" // optional
  }
}
```

**Error Responses:**

- 404: Thread not found
- 403: Access denied

### 10. Get Thread Messages

**GET** `/threads/:id/messages`

Retrieves all messages for a thread. Users can only view messages from their own threads unless they have ADMIN or MODERATOR role.

**Path Parameters:**

- `id`: Thread ID (string)

**Response (200): Array of ThreadMessageResponseDto**

**Error Responses:**

- 404: Thread not found
- 403: Access denied

### 11. Update Thread Message

**PATCH** `/threads/messages/:messageId`

Updates a thread message. Users can only update their own messages unless they have ADMIN or MODERATOR role.

**Path Parameters:**

- `messageId`: Message ID (string)

**Request Body (UpdateThreadMessageDto - optional fields):**

```json
{
  "content": "string", // optional
  "isSystem": false // optional
}
```

**Response (200): ThreadMessageResponseDto**

**Authorization:** Users can update their own messages; ADMIN/MODERATOR can update any message

### 12. Delete Thread Message (Admin/Moderator Only)

**DELETE** `/threads/messages/:messageId`

Deletes a thread message. Requires ADMIN or MODERATOR role.

**Path Parameters:**

- `messageId`: Message ID (string)

**Response (200):**

```json
{
  "message": "Message deleted successfully"
}
```

**Authorization:** ADMIN or MODERATOR only

## Error Handling

All endpoints return standardized error responses:

- 400: Bad Request - Invalid input data
- 401: Unauthorized - Missing or invalid JWT token
- 403: Forbidden - Insufficient permissions
- 404: Not Found - Resource not found
- 500: Internal Server Error - Unexpected server error (includes specific error details for debugging)

Error responses include a `message` field with details about the error.

## WebSocket Troubleshooting

### Not Receiving Events?

**1. Check Connection:**

Verify the WebSocket connection is established successfully by listening to the `connect` event.

**2. Verify Authentication:**

Ensure your JWT token is valid and not expired. The WebSocket will reject connections with invalid or expired tokens.

**3. Check Room Subscriptions:**

- Regular users only receive events in their personal room (`user:{userId}`)
- Admins receive broadcast events for new threads and user messages
- If you're not an admin, you won't see other users' threads

**4. Check Event Names:**

Ensure you're listening to the correct event names:

- `thread.created`
- `thread.message`
- `thread.closed`
- `thread.status_changed`

**5. CORS Issues:**

If connecting from a different domain, ensure CORS is properly configured on the server.

**6. Network Issues:**

- Verify the WebSocket port is accessible
- Check for firewall or proxy blocking WebSocket connections
- Check browser console for WebSocket connection errors

### Common Issues:

**Issue:** Connection rejected with "Authentication token required"

- **Solution:** Make sure you're passing the JWT token in `auth.token` or headers

**Issue:** Not receiving `thread.message` events as a user

- **Solution:** Users only receive admin replies to their own threads. They don't see messages in other threads.

**Issue:** Not receiving `thread.created` events as a user

- **Solution:** `thread.created` events are only broadcast to admins. Regular users don't receive these events.

**Issue:** Connection works but no events received

- **Solution:** Make sure you have the correct role (ADMIN) to receive broadcast events, or check if you're the thread creator for targeted events.

## Message Validation

For message creation and updates, the following validations are performed:

- User must exist
- Thread must exist
- User must have permission to add/update messages on the thread
- Content must be a non-empty string (trimmed)
- For updates, users can only modify their own messages unless they have ADMIN or MODERATOR role

These validations help prevent internal server errors by ensuring data integrity before database operations.
