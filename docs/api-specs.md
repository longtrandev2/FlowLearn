# RESTful API Specification - FlowLearn

## Overview

**Base URL:** `https://api.flowlearn.io/api/v1`
> **âš ï¸ Implementation Status:** Backend not yet implemented. Frontend currently uses MSW (Mock Service Worker) for development. The base URL above is the planned production URL.

**Version:** v1

**Authentication:** Bearer JWT (JSON Web Token)
> **âš ï¸ Implementation Status:** JWT authentication designed but not implemented. Frontend uses mock authentication.

**Content-Type:** `application/json` (except for file upload: `multipart/form-data`)

### Rate Limiting

> **âš ï¸ Implementation Status:** Planned feature - not yet implemented

**Planned Implementation:**
- **Free users:** 100 requests/minute
- **Pro users:** 1000 requests/minute
- Rate limit headers included in all responses:
  - `X-RateLimit-Limit`: Request limit per window
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Unix timestamp when limit resets

**Technology:** Redis-based rate limiting (planned)

### Standard Response Format

**Success Response (2xx):**
```json
{
  "success": true,
  "data": {
    // Response data specific to endpoint
  }
}
```

**Error Response (4xx, 5xx):**
```json
{
  "status": 400,
  "error": "BAD_REQUEST",
  "message": "Detailed error message",
  "path": "/api/v1/auth/login",
  "timestamp": "2025-03-13T10:30:00Z"
}
```

### Standard Error Codes

| Status | Error Code | Description |
|--------|------------|-------------|
| 400 | BAD_REQUEST | Invalid request data |
| 401 | UNAUTHORIZED | Missing or invalid token |
| 403 | FORBIDDEN | Valid token but insufficient permissions |
| 404 | NOT_FOUND | Resource not found |
| 409 | CONFLICT | Resource conflict (email exists, etc.) |
| 422 | UNPROCESSABLE_ENTITY | Validation errors |
| 429 | TOO_MANY_REQUESTS | Rate limit exceeded |
| 500 | INTERNAL_SERVER_ERROR | Server error |
| 503 | SERVICE_UNAVAILABLE | Service temporarily unavailable |

---

## Authentication Flow

### JWT Token Lifecycle

1. **User Login/Register** â†’ Returns `accessToken` (short-lived) + `refreshToken` (long-lived)
2. **Client** stores tokens in localStorage/secure storage
3. **API Requests** include `Authorization: Bearer <accessToken>` header
4. **Token Refresh** (401 response) â†’ Client calls `/auth/refresh` with `refreshToken`
5. **Logout** â†’ Client calls `/auth/logout`, invalidates `refreshToken`

### Token Expiration

- **Access Token:** 15 minutes
- **Refresh Token:** 30 days

---

## API Endpoints

### Implementation Status Legend

- ðŸš§ **Frontend Only** - Frontend UI exists with MSW mock handlers, no backend implementation
- âœ… **Implemented** - Both frontend and backend working (currently none)
- ðŸ“‹ **Planned** - Fully specified but not yet implemented
- âŒ **Not Started** - No implementation exists

---

### 1. Authentication APIs
> **Status:** ðŸš§ Frontend Only - Mock implementation in MSW handlers

**Total Endpoints:** 8

#### 1.1 Register

**Endpoint:** `POST /api/v1/users`

**Description:** Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "fullName": "John Doe"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "USER",
      "status": "ACTIVE",
      "avatarUrl": null,
      "plan": {
        "name": "free",
        "displayName": "Free"
      },
      "createdAt": "2025-03-13T10:30:00Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `400 BAD_REQUEST` - Invalid input data
- `409 CONFLICT` - Email already exists
- `422 UNPROCESSABLE_ENTITY` - Validation error (weak password)

---

#### 1.2 Login

**Endpoint:** `POST /api/v1/sessions`

**Description:** Authenticate user with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "USER",
      "status": "ACTIVE",
      "avatarUrl": "https://cdn.flowlearn.io/avatars/...",
      "plan": {
        "name": "pro",
        "displayName": "Pro"
      },
      "lastLoginAt": "2025-03-13T10:30:00Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `400 BAD_REQUEST` - Invalid input
- `401 UNAUTHORIZED` - Invalid credentials
- `403 FORBIDDEN` - Account banned/suspended

---

#### 1.3 Admin Login

**Endpoint:** `POST /api/v1/sessions/admin`

**Description:** Authenticate admin user (MODERATOR or SUPER_ADMIN only).

**Request Body:**
```json
{
  "email": "admin@flowlearn.io",
  "password": "AdminPassword123!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "admin@flowlearn.io",
      "fullName": "Admin User",
      "role": "SUPER_ADMIN",
      "status": "ACTIVE",
      "avatarUrl": "https://cdn.flowlearn.io/avatars/...",
      "plan": {
        "name": "pro",
        "displayName": "Pro"
      },
      "lastLoginAt": "2025-03-13T10:30:00Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `400 BAD_REQUEST` - Invalid input
- `401 UNAUTHORIZED` - Invalid credentials
- `403 FORBIDDEN` - Not an admin account

---

#### 1.4 Refresh Token

**Endpoint:** `POST /api/v1/auth/refresh`

**Description:** Get new access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `401 UNAUTHORIZED` - Invalid/expired refresh token
- `403 FORBIDDEN` - Token revoked

---

#### 1.5 Logout

**Endpoint:** `POST /api/v1/auth/logout`

**Description:** Invalidate refresh token (logout user).

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

**Error Responses:**
- `401 UNAUTHORIZED` - Invalid token

---

#### 1.6 Forgot Password

**Endpoint:** `POST /api/v1/auth/forgot-password`

**Description:** Request password reset email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Password reset email sent"
  }
}
```

**Error Responses:**
- `400 BAD_REQUEST` - Invalid email
- `404 NOT_FOUND` - Email not found

---

#### 1.7 Reset Password

**Endpoint:** `POST /api/v1/auth/reset-password`

**Description:** Reset password with token from email.

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePassword123!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Password reset successfully"
  }
}
```

**Error Responses:**
- `400 BAD_REQUEST` - Invalid token or weak password
- `422 UNPROCESSABLE_ENTITY` - Token expired

---

#### 1.8 Verify Email

**Endpoint:** `POST /api/v1/auth/verify-email`

**Description:** Verify email address with token from email.

**Request Body:**
```json
{
  "token": "verification_token_from_email"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Email verified successfully"
  }
}
```

**Error Responses:**
- `400 BAD_REQUEST` - Invalid token
- `422 UNPROCESSABLE_ENTITY` - Token expired

---

### 2. Document Management APIs
> **Status:** ðŸ“‹ Planned - Fully specified, no implementation

**Total Endpoints:** 6

#### 2.1 Upload Document

**Endpoint:** `POST /api/v1/documents/upload`

**Description:** Upload a new document (PDF/DOCX/TXT/PPTX/XLSX).

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data
```

**Request Body (multipart/form-data):**
```
file: <binary>
folderId: "550e8400-e29b-41d4-a716-446655440000" (optional)
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "folderId": "550e8400-e29b-41d4-a716-446655440000",
    "name": "lecture_notes.pdf",
    "type": "PDF",
    "size": "2.4 MB",
    "fileSizeBytes": 2516582,
    "status": "processing",
    "uploadedAt": "2025-03-13T10:30:00Z",
    "updatedAt": "2025-03-13T10:30:00Z"
  }
}
```

**Error Responses:**
- `400 BAD_REQUEST` - Invalid file type or size exceeded
- `401 UNAUTHORIZED` - Invalid token
- `413 PAYLOAD_TOO_LARGE` - File size exceeds storage limit
- `422 UNPROCESSABLE_ENTITY` - Validation error

---

#### 2.2 List Documents

**Endpoint:** `GET /api/v1/documents`

**Description:** Get user's documents with pagination and filtering.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Query Parameters:**
- `folderId` (optional): Filter by folder ID
- `status` (optional): Filter by status (`uploading`, `processing`, `ready`, `error`)
- `type` (optional): Filter by file type (`PDF`, `DOCX`, `TXT`, `PPTX`, `XLSX`)
- `search` (optional): Search in document name
- `sort` (optional): Sort field (`name`, `uploadedAt`, `size`)
- `order` (optional): Sort order (`asc`, `desc`) - default: `desc`
- `page` (optional): Page number - default: `1`
- `limit` (optional): Items per page - default: `20`, max: `100`

**Example Request:**
```
GET /api/v1/documents?folderId=xxx&status=ready&page=1&limit=20
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "folderId": "550e8400-e29b-41d4-a716-446655440000",
      "name": "lecture_notes.pdf",
      "type": "PDF",
      "size": "2.4 MB",
      "status": "ready",
      "uploadedAt": "2025-03-13T10:30:00Z",
      "updatedAt": "2025-03-13T10:30:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

**Error Responses:**
- `401 UNAUTHORIZED` - Invalid token
- `400 BAD_REQUEST` - Invalid query parameters

---

#### 2.3 Get Document

**Endpoint:** `GET /api/v1/documents/:id`

**Description:** Get document details by ID.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "folderId": "550e8400-e29b-41d4-a716-446655440000",
    "name": "lecture_notes.pdf",
    "type": "PDF",
    "fileSizeBytes": 2516582,
    "size": "2.4 MB",
    "r2Key": "documents/550e8400-e29b-41d4-a716-446655440000.pdf",
    "r2Bucket": "flowlearn-documents",
    "status": "ready",
    "errorMessage": null,
    "pageCount": 42,
    "uploadedAt": "2025-03-13T10:30:00Z",
    "updatedAt": "2025-03-13T10:35:00Z"
  }
}
```

**Error Responses:**
- `401 UNAUTHORIZED` - Invalid token
- `403 FORBIDDEN` - Not document owner
- `404 NOT_FOUND` - Document not found

---

#### 2.4 Get Document Status

**Endpoint:** `GET /api/v1/documents/:id/status`

**Description:** Poll document processing status.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "ready",
    "progress": 100,
    "errorMessage": null
  }
}
```

**Status values:**
- `uploading` (0-30%)
- `processing` (30-100%)
- `ready` (100%)
- `error` (with errorMessage)

**Error Responses:**
- `401 UNAUTHORIZED` - Invalid token
- `404 NOT_FOUND` - Document not found

---

#### 2.5 Update Document

**Endpoint:** `PUT /api/v1/documents/:id`

**Description:** Update document name or move to different folder.

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "new_document_name.pdf",
  "folderId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "new_document_name.pdf",
    "folderId": "550e8400-e29b-41d4-a716-446655440000",
    "type": "PDF",
    "size": "2.4 MB",
    "status": "ready",
    "uploadedAt": "2025-03-13T10:30:00Z",
    "updatedAt": "2025-03-13T11:00:00Z"
  }
}
```

**Error Responses:**
- `400 BAD_REQUEST` - Invalid input
- `401 UNAUTHORIZED` - Invalid token
- `403 FORBIDDEN` - Not document owner
- `404 NOT_FOUND` - Document or folder not found

---

#### 2.6 Delete Document

**Endpoint:** `DELETE /api/v1/documents/:id`

**Description:** Delete a document (and associated R2 file).

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Success Response (204):** No content

**Error Responses:**
- `401 UNAUTHORIZED` - Invalid token
- `403 FORBIDDEN` - Not document owner
- `404 NOT_FOUND` - Document not found

---

### 3. Folder Management APIs
> **Status:** ðŸ“‹ Planned - Frontend types exist, no API calls

**Total Endpoints:** 6

#### 3.1 Create Folder

**Endpoint:** `POST /api/v1/folders`

**Description:** Create a new folder.

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**
```json
{
  "parentId": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Math Courses",
  "description": "All math-related course materials",
  "coverImage": "https://example.com/cover.jpg",
  "color": "ocean"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "parentId": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Math Courses",
    "description": "All math-related course materials",
    "coverImage": "https://example.com/cover.jpg",
    "color": "ocean",
    "subfolderCount": 0,
    "fileCount": 0,
    "createdAt": "2025-03-13T10:30:00Z",
    "updatedAt": "2025-03-13T10:30:00Z"
  }
}
```

**Error Responses:**
- `400 BAD_REQUEST` - Invalid input
- `401 UNAUTHORIZED` - Invalid token
- `404 NOT_FOUND` - Parent folder not found

---

#### 3.2 List Folders

**Endpoint:** `GET /api/v1/folders`

**Description:** Get user's folders (nested structure).

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Query Parameters:**
- `parentId` (optional): Filter by parent folder (null = root level)
- `search` (optional): Search in folder name

**Example Request:**
```
GET /api/v1/folders?parentId=null
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "parentId": null,
      "name": "Math Courses",
      "description": "All math-related course materials",
      "coverImage": null,
      "color": "ocean",
      "subfolderCount": 2,
      "fileCount": 5,
      "createdAt": "2025-03-13T10:30:00Z",
      "updatedAt": "2025-03-13T10:30:00Z"
    }
  ]
}
```

**Error Responses:**
- `401 UNAUTHORIZED` - Invalid token

---

#### 3.3 Get Folder

**Endpoint:** `GET /api/v1/folders/:id`

**Description:** Get folder details.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "parentId": null,
    "name": "Math Courses",
    "description": "All math-related course materials",
    "coverImage": null,
    "color": "ocean",
    "subfolderCount": 2,
    "fileCount": 5,
    "createdAt": "2025-03-13T10:30:00Z",
    "updatedAt": "2025-03-13T10:30:00Z"
  }
}
```

**Error Responses:**
- `401 UNAUTHORIZED` - Invalid token
- `403 FORBIDDEN` - Not folder owner
- `404 NOT_FOUND` - Folder not found

---

#### 3.4 Get Folder Contents

**Endpoint:** `GET /api/v1/folders/:id/contents`

**Description:** Get all documents and subfolders within a folder.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Query Parameters:**
- `search` (optional): Search in name
- `sort` (optional): Sort field (`name`, `createdAt`, `size`)
- `order` (optional): Sort order (`asc`, `desc`)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "folder": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Math Courses",
      "description": "All math-related course materials",
      "color": "ocean"
    },
    "subfolders": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "parentId": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Calculus",
        "description": null,
        "coverImage": null,
        "color": "indigo",
        "subfolderCount": 0,
        "fileCount": 3,
        "createdAt": "2025-03-13T10:35:00Z",
        "updatedAt": "2025-03-13T10:35:00Z"
      }
    ],
    "documents": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "folderId": "550e8400-e29b-41d4-a716-446655440000",
        "name": "lecture_notes.pdf",
        "type": "PDF",
        "size": "2.4 MB",
        "status": "ready",
        "uploadedAt": "2025-03-13T10:30:00Z",
        "updatedAt": "2025-03-13T10:30:00Z"
      }
    ],
    "breadcrumbs": [
      { "id": null, "name": "My Library" },
      { "id": "550e8400-e29b-41d4-a716-446655440000", "name": "Math Courses" }
    ]
  }
}
```

**Error Responses:**
- `401 UNAUTHORIZED` - Invalid token
- `403 FORBIDDEN` - Not folder owner
- `404 NOT_FOUND` - Folder not found

---

#### 3.5 Update Folder

**Endpoint:** `PUT /api/v1/folders/:id`

**Description:** Update folder details.

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Advanced Math Courses",
  "description": "Advanced mathematics materials",
  "coverImage": "https://example.com/new-cover.jpg",
  "color": "indigo",
  "parentId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "parentId": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Advanced Math Courses",
    "description": "Advanced mathematics materials",
    "coverImage": "https://example.com/new-cover.jpg",
    "color": "indigo",
    "subfolderCount": 2,
    "fileCount": 5,
    "updatedAt": "2025-03-13T11:00:00Z"
  }
}
```

**Error Responses:**
- `400 BAD_REQUEST` - Invalid input (circular reference, etc.)
- `401 UNAUTHORIZED` - Invalid token
- `403 FORBIDDEN` - Not folder owner
- `404 NOT_FOUND` - Folder or parent not found

---

#### 3.6 Delete Folder

**Endpoint:** `DELETE /api/v1/folders/:id`

**Description:** Delete a folder and all contents (cascade delete).

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Success Response (204):** No content

**Error Responses:**
- `401 UNAUTHORIZED` - Invalid token
- `403 FORBIDDEN` - Not folder owner
- `404 NOT_FOUND` - Folder not found

---

### 4. Study Session APIs
> **Status:** ðŸ“‹ Planned - Frontend pages exist, no API integration

**Total Endpoints:** 6

#### 4.1 Start Study Session

**Endpoint:** `POST /api/v1/study-sessions`

**Description:** Start a new study session for a document or folder.

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**
```json
{
  "scope": "file",
  "scopeId": "550e8400-e29b-41d4-a716-446655440000",
  "goalId": "deep-understanding"
}
```

**Scope options:**
- `file`: Study a single document
- `folder`: Study all documents in a folder

**GoalId options:**
- `exam-prep`: Exam preparation
- `deep-understanding`: Deep learning
- `quick-review`: Quick review
- `eli5`: Simplified explanation
- `memorize`: Memorization focus

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "scope": "file",
    "scopeId": "550e8400-e29b-41d4-a716-446655440000",
    "scopeInfo": {
      "scope": "file",
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "lecture_notes.pdf",
      "fileCount": 1
    },
    "goalId": "deep-understanding",
    "startedAt": "2025-03-13T10:30:00Z",
    "completedAt": null,
    "totalTimeSeconds": 0
  }
}
```

**Error Responses:**
- `400 BAD_REQUEST` - Invalid input
- `401 UNAUTHORIZED` - Invalid token
- `404 NOT_FOUND` - Document/folder not found

---

#### 4.2 Get Study Session

**Endpoint:** `GET /api/v1/study-sessions/:id`

**Description:** Get study session details.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "scope": "file",
    "scopeId": "550e8400-e29b-41d4-a716-446655440000",
    "goalId": "deep-understanding",
    "startedAt": "2025-03-13T10:30:00Z",
    "completedAt": "2025-03-13T11:00:00Z",
    "totalTimeSeconds": 1800
  }
}
```

**Error Responses:**
- `401 UNAUTHORIZED` - Invalid token
- `403 FORBIDDEN` - Not session owner
- `404 NOT_FOUND` - Session not found

---

#### 4.3 Complete Study Session

**Endpoint:** `PUT /api/v1/study-sessions/:id/complete`

**Description:** Mark study session as completed.

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**
```json
{
  "totalTimeSeconds": 1800
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "scope": "file",
    "scopeId": "550e8400-e29b-41d4-a716-446655440000",
    "goalId": "deep-understanding",
    "startedAt": "2025-03-13T10:30:00Z",
    "completedAt": "2025-03-13T11:00:00Z",
    "totalTimeSeconds": 1800
  }
}
```

**Error Responses:**
- `400 BAD_REQUEST` - Session already completed
- `401 UNAUTHORIZED` - Invalid token
- `403 FORBIDDEN` - Not session owner
- `404 NOT_FOUND` - Session not found

---

#### 4.4 Get Session Summary

**Endpoint:** `GET /api/v1/study-sessions/:id/summary`

**Description:** Get AI-generated summary for the study session.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Query Parameters:**
- `goalId` (optional): Override learning goal for summary

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "studySessionId": "550e8400-e29b-41d4-a716-446655440000",
    "goalId": "deep-understanding",
    "content": "# Summary\n\nThis document covers...",
    "wordCount": 342,
    "createdAt": "2025-03-13T10:35:00Z"
  }
}
```

**Error Responses:**
- `401 UNAUTHORIZED` - Invalid token
- `403 FORBIDDEN` - Not session owner
- `404 NOT_FOUND` - Session not found
- `503 SERVICE_UNAVAILABLE` - AI service unavailable

---

#### 4.5 Get Session Flashcards

**Endpoint:** `GET /api/v1/study-sessions/:id/flashcards`

**Description:** Get AI-generated flashcards for the study session.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "documentId": "550e8400-e29b-41d4-a716-446655440000",
      "studySessionId": "550e8400-e29b-41d4-a716-446655440000",
      "front": "What is the derivative of sin(x)?",
      "back": "cos(x)",
      "importance": "core",
      "createdAt": "2025-03-13T10:35:00Z"
    }
  ]
}
```

**Error Responses:**
- `401 UNAUTHORIZED` - Invalid token
- `403 FORBIDDEN` - Not session owner
- `404 NOT_FOUND` - Session not found

---

#### 4.6 Get Session Quiz

**Endpoint:** `GET /api/v1/study-sessions/:id/quiz`

**Description:** Get AI-generated quiz for the study session.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Query Parameters:**
- `cognitiveLevel` (optional): `recall`, `understand`, `apply` - default: `understand`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "studySessionId": "550e8400-e29b-41d4-a716-446655440000",
    "cognitiveLevel": "understand",
    "totalQuestions": 10,
    "questions": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "quizId": "550e8400-e29b-41d4-a716-446655440000",
        "question": "What is the primary function of mitochondria?",
        "options": {
          "A": "Protein synthesis",
          "B": "Energy production",
          "C": "DNA replication",
          "D": "Cell division"
        },
        "correctKey": "B",
        "explanation": "Mitochondria are known as the powerhouse of the cell because they produce ATP through cellular respiration.",
        "questionIndex": 0,
        "cognitiveLevel": "understand"
      }
    ],
    "createdAt": "2025-03-13T10:35:00Z"
  }
}
```

**Error Responses:**
- `401 UNAUTHORIZED` - Invalid token
- `403 FORBIDDEN` - Not session owner
- `404 NOT_FOUND` - Session not found
- `503 SERVICE_UNAVAILABLE` - AI service unavailable

---

### 5. Flashcard & SRS APIs
> **Status:** ðŸ“‹ Planned - Frontend types exist, no API calls

**Total Endpoints:** 4

#### 5.1 Get Due Flashcards

**Endpoint:** `GET /api/v1/flashcards/due`

**Description:** Get flashcards due for review today (SRS algorithm).

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Query Parameters:**
- `documentId` (optional): Filter by document
- `limit` (optional): Max cards to return - default: `20`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "dueCount": 15,
    "flashcards": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "flashcardId": "550e8400-e29b-41d4-a716-446655440000",
        "documentId": "550e8400-e29b-41d4-a716-446655440000",
        "front": "What is the derivative of sin(x)?",
        "back": "cos(x)",
        "importance": "core",
        "progress": {
          "repetitions": 3,
          "intervalDays": 7,
          "easeFactor": 2.6,
          "nextReviewDate": "2025-03-13",
          "lastReviewedAt": "2025-03-06T10:30:00Z",
          "lastQuality": 5
        }
      }
    ]
  }
}
```

**Error Responses:**
- `401 UNAUTHORIZED` - Invalid token

---

#### 5.2 Review Flashcard

**Endpoint:** `POST /api/v1/flashcards/:id/review`

**Description:** Submit flashcard review grade (updates SRS progress).

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**
```json
{
  "quality": 5
}
```

**Quality rating (SM-2 algorithm):**
- `5`: Perfect response - complete recall
- `4`: Correct response - with hesitation
- `3`: Correct response - difficult
- `2`: Incorrect - but familiar
- `1`: Incorrect - barely familiar
- `0`: Complete blackout

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "flashcardId": "550e8400-e29b-41d4-a716-446655440000",
    "progress": {
      "repetitions": 4,
      "intervalDays": 14,
      "easeFactor": 2.6,
      "nextReviewDate": "2025-03-27",
      "lastReviewedAt": "2025-03-13T10:30:00Z",
      "lastQuality": 5
    }
  }
}
```

**Error Responses:**
- `400 BAD_REQUEST` - Invalid quality rating
- `401 UNAUTHORIZED` - Invalid token
- `404 NOT_FOUND` - Flashcard not found

---

#### 5.3 Get Flashcard Stats

**Endpoint:** `GET /api/v1/flashcards/stats`

**Description:** Get SRS statistics for the user.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "totalCards": 150,
    "cardsReviewed": 87,
    "cardsDueToday": 15,
    "cardsLearned": 72,
    "averageEaseFactor": 2.45,
    "longestInterval": 45,
    "totalReviews": 245,
    "streak": {
      "currentStreak": 7,
      "longestStreak": 14
    },
    "distribution": {
      "new": 15,
      "learning": 23,
      "review": 87,
      "mature": 25
    }
  }
}
```

**Error Responses:**
- `401 UNAUTHORIZED` - Invalid token

---

#### 5.4 List All Flashcards

**Endpoint:** `GET /api/v1/flashcards`

**Description:** Get all user flashcards with pagination.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Query Parameters:**
- `documentId` (optional): Filter by document
- `importance` (optional): Filter by importance (`core`, `support`, `advanced`)
- `search` (optional): Search in front/back text
- `page` (optional): Page number - default: `1`
- `limit` (optional): Items per page - default: `20`

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "documentId": "550e8400-e29b-41d4-a716-446655440000",
      "studySessionId": "550e8400-e29b-41d4-a716-446655440000",
      "front": "What is the derivative of sin(x)?",
      "back": "cos(x)",
      "importance": "core",
      "createdAt": "2025-03-13T10:35:00Z",
      "progress": {
        "repetitions": 3,
        "intervalDays": 7,
        "easeFactor": 2.6,
        "nextReviewDate": "2025-03-13",
        "lastReviewedAt": "2025-03-06T10:30:00Z"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

**Error Responses:**
- `401 UNAUTHORIZED` - Invalid token

---

### 6. Dashboard & Statistics APIs
> **Status:** ðŸš§ Frontend Only - Dashboard UI with mock data

**Total Endpoints:** 4

#### 6.1 Get Dashboard Stats

**Endpoint:** `GET /api/v1/dashboard/stats`

**Description:** Get overview statistics for the dashboard.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "documentsCount": 45,
    "foldersCount": 8,
    "flashcardsCount": 150,
    "studySessionsCount": 23,
    "totalStudyHours": 42.5,
    "currentStreak": 7,
    "longestStreak": 14,
    "storageUsed": 234.5,
    "storageLimit": 500,
    "storagePercent": 46.9,
    "plan": "FREE"
  }
}
```

**Error Responses:**
- `401 UNAUTHORIZED` - Invalid token

---

#### 6.2 Get Weekly Activity

**Endpoint:** `GET /api/v1/dashboard/activity/weekly`

**Description:** Get study activity for the last 7 days.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "day": "Mon",
      "hours": 2.5,
      "label": "2.5h"
    },
    {
      "day": "Tue",
      "hours": 3.0,
      "label": "3.0h"
    },
    {
      "day": "Wed",
      "hours": 0,
      "label": "0h"
    },
    {
      "day": "Thu",
      "hours": 1.5,
      "label": "1.5h"
    },
    {
      "day": "Fri",
      "hours": 4.0,
      "label": "4.0h"
    },
    {
      "day": "Sat",
      "hours": 5.5,
      "label": "5.5h"
    },
    {
      "day": "Sun",
      "hours": 3.0,
      "label": "3.0h"
    }
  ],
  "totalHours": 19.5,
  "averageHours": 2.79
}
```

**Error Responses:**
- `401 UNAUTHORIZED` - Invalid token

---

#### 6.3 Get Streak Data

**Endpoint:** `GET /api/v1/dashboard/streak`

**Description:** Get current streak and weekly completion status.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "currentStreak": 7,
    "longestStreak": 14,
    "percentile": 85,
    "weekDays": [
      { "day": "Mon", "completed": true },
      { "day": "Tue", "completed": true },
      { "day": "Wed", "completed": false },
      { "day": "Thu", "completed": true },
      { "day": "Fri", "completed": true },
      { "day": "Sat", "completed": true },
      { "day": "Sun", "completed": true }
    ]
  }
}
```

**Error Responses:**
- `401 UNAUTHORIZED` - Invalid token

---

#### 6.4 Get Recent Activity

**Endpoint:** `GET /api/v1/dashboard/recent-activity`

**Description:** Get recent study sessions and activities.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Query Parameters:**
- `limit` (optional): Number of items - default: `10`

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "type": "study_session",
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Calculus - Chapter 5",
      "goal": "deep-understanding",
      "duration": 1800,
      "completedAt": "2025-03-13T10:30:00Z"
    },
    {
      "type": "quiz_complete",
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Physics Quiz",
      "score": 85,
      "totalQuestions": 10,
      "completedAt": "2025-03-13T09:15:00Z"
    },
    {
      "type": "flashcard_review",
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Biology Flashcards",
      "cardsReviewed": 20,
      "completedAt": "2025-03-12T20:30:00Z"
    }
  ]
}
```

**Error Responses:**
- `401 UNAUTHORIZED` - Invalid token

---

### 7. Chat with Documents APIs
> **Status:** ðŸ”„ **Architecture Change** - Originally designed as backend endpoint, now implemented as direct Gemini API calls from frontend

**Total Endpoints:** 2

**âš ï¸ Important Implementation Note:**
The chat functionality is currently implemented differently than originally designed:
- **Original Design:** Backend RAG system with vector database and streaming responses
- **Current Implementation:** Frontend makes direct calls to Google Gemini API
- **Frontend Location:** `frontend/src/features/chat/hooks/useGeminiChat.ts`
- **API Used:** Google Gemini API (not backend endpoints)

**Why This Approach:**
- Faster development for MVP
- No backend infrastructure needed
- Direct API integration with Gemini
- Document context passed to Gemini in prompt

**Migration Path:**
When backend is implemented, can migrate to:
1. Backend RAG system with vector embeddings (Qdrant/Weaviate)
2. Server-Sent Events (SSE) for streaming
3. Better context management with document chunks

#### 7.1 Get Chat Messages

**Endpoint:** `GET /api/v1/documents/:documentId/chat/messages`

**Description:** Get chat history for a document.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Query Parameters:**
- `limit` (optional): Number of messages - default: `50`
- `before` (optional): Get messages before this timestamp (pagination)

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "documentId": "550e8400-e29b-41d4-a716-446655440000",
      "role": "user",
      "content": "What is the main topic of this document?",
      "createdAt": "2025-03-13T10:30:00Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "documentId": "550e8400-e29b-41d4-a716-446655440000",
      "role": "model",
      "content": "The main topic of this document is...",
      "createdAt": "2025-03-13T10:30:05Z"
    }
  ]
}
```

**Error Responses:**
- `401 UNAUTHORIZED` - Invalid token
- `403 FORBIDDEN` - Not document owner
- `404 NOT_FOUND` - Document not found

---

#### 7.2 Send Chat Message (Streaming)

**Endpoint:** `POST /api/v1/documents/:documentId/chat/messages`

**Description:** Send a message and stream AI response (Server-Sent Events).

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**
```json
{
  "content": "What is the main topic of this document?"
}
```

**Success Response (200):** Stream with `text/event-stream`

```
data: {"id":"550e8400-e29b-41d4-a716-446655440001","role":"model","content":"The","done":false}

data: {"id":"550e8400-e29b-41d4-a716-446655440001","role":"model","content":"main","done":false}

data: {"id":"550e8400-e29b-41d4-a716-446655440001","role":"model","content":"topic","done":false}

...

data: {"id":"550e8400-e29b-41d4-a716-446655440001","role":"model","content":".","done":true}
```

**Error Responses:**
- `400 BAD_REQUEST` - Empty message
- `401 UNAUTHORIZED` - Invalid token
- `403 FORBIDDEN` - Not document owner
- `404 NOT_FOUND` - Document not found
- `503 SERVICE_UNAVAILABLE` - AI service unavailable

---

### 8. Quiz APIs
> **Status:** ðŸ“‹ Planned - Quiz UI exists, no backend integration

**Total Endpoints:** 4

#### 8.1 Get Quiz

**Endpoint:** `GET /api/v1/quizzes/:id`

**Description:** Get quiz metadata.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "studySessionId": "550e8400-e29b-41d4-a716-446655440000",
    "cognitiveLevel": "understand",
    "totalQuestions": 10,
    "createdAt": "2025-03-13T10:35:00Z",
    "hasResults": false
  }
}
```

**Error Responses:**
- `401 UNAUTHORIZED` - Invalid token
- `403 FORBIDDEN` - Not quiz owner
- `404 NOT_FOUND` - Quiz not found

---

#### 8.2 Get Quiz Questions

**Endpoint:** `GET /api/v1/quizzes/:id/questions`

**Description:** Get all questions for a quiz (without correct answers).

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "quizId": "550e8400-e29b-41d4-a716-446655440000",
      "question": "What is the primary function of mitochondria?",
      "options": {
        "A": "Protein synthesis",
        "B": "Energy production",
        "C": "DNA replication",
        "D": "Cell division"
      },
      "questionIndex": 0,
      "cognitiveLevel": "understand"
    }
  ]
}
```

**Error Responses:**
- `401 UNAUTHORIZED` - Invalid token
- `403 FORBIDDEN` - Not quiz owner
- `404 NOT_FOUND` - Quiz not found

---

#### 8.3 Submit Quiz Answers

**Endpoint:** `POST /api/v1/quizzes/:id/submit`

**Description:** Submit quiz answers and get results.

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**
```json
{
  "answers": [
    {
      "questionId": "550e8400-e29b-41d4-a716-446655440000",
      "selectedKey": "B"
    },
    {
      "questionId": "550e8400-e29b-41d4-a716-446655440001",
      "selectedKey": "A"
    }
  ],
  "timeSpentSeconds": 300
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "quizResultId": "550e8400-e29b-41d4-a716-446655440000",
    "quizId": "550e8400-e29b-41d4-a716-446655440000",
    "totalQuestions": 10,
    "correctCount": 8,
    "score": 80.0,
    "timeSpentSeconds": 300,
    "completedAt": "2025-03-13T11:00:00Z",
    "answers": [
      {
        "questionId": "550e8400-e29b-41d4-a716-446655440000",
        "selectedKey": "B",
        "isCorrect": true,
        "correctKey": "B",
        "explanation": "Mitochondria are known as the powerhouse of the cell..."
      }
    ]
  }
}
```

**Error Responses:**
- `400 BAD_REQUEST` - Already submitted, invalid answers
- `401 UNAUTHORIZED` - Invalid token
- `403 FORBIDDEN` - Not quiz owner
- `404 NOT_FOUND` - Quiz not found

---

#### 8.4 Get Quiz Results

**Endpoint:** `GET /api/v1/quizzes/:id/results`

**Description:** Get quiz results (if previously submitted).

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "quizId": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "score": 80.0,
    "correctCount": 8,
    "timeSpentSeconds": 300,
    "answers": [
      {
        "questionId": "550e8400-e29b-41d4-a716-446655440000",
        "selectedKey": "B",
        "isCorrect": true
      }
    ],
    "completedAt": "2025-03-13T11:00:00Z"
  }
}
```

**Error Responses:**
- `401 UNAUTHORIZED` - Invalid token
- `403 FORBIDDEN` - Not quiz owner
- `404 NOT_FOUND` - Quiz or results not found

---

### 9. Subscription APIs
> **Status:** âŒ Not Started - No implementation

**Total Endpoints:** 4

#### 9.1 Get Current Subscription

**Endpoint:** `GET /api/v1/subscription/current`

**Description:** Get user's current subscription details.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "plan": "PRO",
    "status": "active",
    "stripeSubscriptionId": "sub_1234567890",
    "stripeCustomerId": "cus_1234567890",
    "currentPeriodStart": "2025-03-01T00:00:00Z",
    "currentPeriodEnd": "2025-04-01T00:00:00Z",
    "cancelAtPeriodEnd": false,
    "createdAt": "2025-02-01T10:30:00Z",
    "benefits": {
      "storageLimitMb": 10000,
      "maxDocuments": -1,
      "aiGenerationsPerDay": -1,
      "prioritySupport": true
    }
  }
}
```

**Error Responses:**
- `401 UNAUTHORIZED` - Invalid token

---

#### 9.2 Create Checkout Session

**Endpoint:** `POST /api/v1/subscription/checkout`

**Description:** Create Stripe checkout session for plan upgrade.

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**
```json
{
  "plan": "PRO",
  "successUrl": "https://flowlearn.io/settings?checkout=success",
  "cancelUrl": "https://flowlearn.io/settings?checkout=canceled"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "checkoutUrl": "https://checkout.stripe.com/pay/..."
  }
}
```

**Error Responses:**
- `400 BAD_REQUEST` - Invalid plan or already subscribed
- `401 UNAUTHORIZED` - Invalid token
- `409 CONFLICT` - Already has active subscription

---

#### 9.3 Cancel Subscription

**Endpoint:** `POST /api/v1/subscription/cancel`

**Description:** Cancel subscription at end of current period.

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**
```json
{
  "reason": "Too expensive"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Subscription will be canceled at the end of the current period",
    "currentPeriodEnd": "2025-04-01T00:00:00Z"
  }
}
```

**Error Responses:**
- `400 BAD_REQUEST` - No active subscription
- `401 UNAUTHORIZED` - Invalid token

---

#### 9.4 Stripe Webhook

**Endpoint:** `POST /api/v1/webhooks/stripe`

**Description:** Handle Stripe webhook events (server-to-server).

**Headers:**
```
Stripe-Signature: <signature>
Content-Type: application/json
```

**Request Body:** Stripe event payload

**Supported Events:**
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Webhook processed"
  }
}
```

**Error Responses:**
- `400 BAD_REQUEST` - Invalid signature
- `422 UNPROCESSABLE_ENTITY` - Invalid event

---

## Data Models Reference

### User Model

```typescript
interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  role: 'USER' | 'MODERATOR' | 'SUPER_ADMIN';
  status: 'ACTIVE' | 'WARNED' | 'BANNED' | 'SUSPENDED';
  plan: {
    name: string;
    displayName: string;
  };
  lastLoginAt: string;
  createdAt: string;
}
```

### Document Model

```typescript
interface Document {
  id: string;
  userId: string;
  folderId: string | null;
  name: string;
  type: 'PDF' | 'DOCX' | 'TXT' | 'PPTX' | 'XLSX';
  fileSizeBytes: number;
  size: string; // Formatted: "2.4 MB"
  r2Key: string;
  r2Bucket: string;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  errorMessage: string | null;
  pageCount: number | null;
  uploadedAt: string;
  updatedAt: string;
}
```

### Folder Model

```typescript
interface Folder {
  id: string;
  userId: string;
  parentId: string | null;
  name: string;
  description: string;
  coverImage: string | null;
  color: 'ocean' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'violet';
  subfolderCount: number;
  fileCount: number;
  createdAt: string;
  updatedAt: string;
}
```

### Flashcard Progress Model (SM-2)

```typescript
interface FlashcardProgress {
  id: string;
  userId: string;
  flashcardId: string;
  repetitions: number;
  intervalDays: number;
  easeFactor: number;
  nextReviewDate: string;
  lastReviewedAt: string;
  lastQuality: number;
  createdAt: string;
  updatedAt: string;
}
```

### Quiz Result Model

```typescript
interface QuizResult {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  answers: {
    questionId: string;
    selectedKey: string;
    isCorrect: boolean;
  }[];
  completedAt: string;
}
```

---

## Pagination Convention

All list endpoints follow this pagination format:

**Request:**
```
GET /api/v1/resource?page=1&limit=20
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

## Date/Time Format

All timestamps use **ISO 8601** format with UTC timezone:
```
2025-03-13T10:30:00Z
```

---

## Rate Limiting Headers

All API responses include rate limit information:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 995
X-RateLimit-Reset: 1647214800
```

---

## Versioning

API version is included in the URL path: `/api/v1/`

Future versions will follow: `/api/v2/`, etc.

Major version changes will be announced with a migration period.

---

## Notes

1. **Storage Tracking**: Update `users.storage_used_mb` on document upload/delete
2. **Streak Calculation**: Update `study_activities.is_streak_day` daily via scheduled job
3. **Stats Refresh**: Trigger `user_stats` updates on relevant CRUD operations
4. **SRS Algorithm**: Use SuperMemo-2 (SM-2) algorithm for flashcard scheduling
5. **AI Integration**: All AI-generated content (summaries, flashcards, quizzes) should handle service unavailability gracefully
6. **File Upload**: Files stored in Cloudflare R2, database only stores metadata
7. **Nested Folders**: Folder hierarchy is unlimited depth, use recursive queries or adjacency list pattern
8. **Soft Deletes**: Consider using soft deletes for subscriptions (add `deleted_at` column)
9. **Webhook Security**: Validate Stripe webhook signatures before processing
10. **Error Logging**: Log all 5xx errors for monitoring and debugging
