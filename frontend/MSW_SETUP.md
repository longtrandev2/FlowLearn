# MSW (Mock Service Worker) Setup Documentation

## 📋 Tổng quan

Mock Service Worker đã được cài đặt và cấu hình hoàn chỉnh để giả lập backend API của FlowLearn.

## 🎯 Mục đích

- Mock API để phát triển frontend độc lập không cần backend
- Test các tính năng Admin User Management
- Có sẵn 25 users với đầy đủ trạng thái: ACTIVE, BANNED, WARNED, SUSPENDED

## 📁 Cấu trúc thư mục

```
frontend/src/mocks/
├── browser.ts              # MSW worker setup
├── handlers.ts             # Combined handlers
├── data/
│   └── users.ts           # Mock users data (25 users)
└── handlers/
    ├── auth.ts            # Authentication endpoints (Section 2)
    └── admin.ts           # Admin User Management endpoints (Section 11)
```

## 🔧 API Endpoints đã mock

### Authentication (Section 2)
- ✅ `POST /auth/register` - Đăng ký
- ✅ `POST /auth/login` - Đăng nhập user
- ✅ `POST /auth/admin/login` - Đăng nhập admin
- ✅ `POST /auth/refresh` - Refresh token
- ✅ `POST /auth/logout` - Đăng xuất
- ✅ `POST /auth/forgot-password` - Quên mật khẩu
- ✅ `POST /auth/reset-password` - Reset mật khẩu
- ✅ `POST /auth/verify-email` - Xác thực email

### Admin User Management (Section 11)
- ✅ `GET /admin/users` - Danh sách users (có filter, search, sort, pagination)
- ✅ `GET /admin/users/:userId` - Chi tiết user
- ✅ `PUT /admin/users/:userId/role` - Thay đổi role
- ✅ `POST /admin/users/:userId/warn` - Cảnh cáo user
- ✅ `POST /admin/users/:userId/ban` - Ban user
- ✅ `POST /admin/users/:userId/unban` - Unban user
- ✅ `POST /admin/users/:userId/suspend` - Tạm khóa user
- ✅ `DELETE /admin/users/:userId` - Xóa user vĩnh viễn
- ✅ `PUT /admin/users/:userId/plan` - Force thay đổi plan

## 👥 Mock Users (25 users)

### Phân loại theo Status:
- **ACTIVE**: 18 users (bao gồm admin, moderator, và regular users)
- **WARNED**: 3 users (id: 6, 13, 19)
- **BANNED**: 3 users (id: 5, 10, 22)
- **SUSPENDED**: 1 user (id: 16)

### Phân loại theo Role:
- **SUPER_ADMIN**: 1 user (admin@flowlearn.io)
- **MODERATOR**: 1 user (moderator@flowlearn.io)
- **USER**: 23 users

### Phân loại theo Plan:
- **PRO**: 11 users
- **FREE**: 14 users

### Admin Test Accounts:
```javascript
// Super Admin
Email: admin@flowlearn.io
Password: any (mock accepts all)

// Moderator
Email: moderator@flowlearn.io
Password: any (mock accepts all)
```

## 🚀 Cách sử dụng

### 1. Start Development Server
```bash
cd frontend
npm run dev
```

MSW sẽ tự động start và intercept các API calls.

### 2. Test API với fetch/axios

```typescript
// Example: Login admin
const response = await fetch('https://api.flowlearn.io/api/v1/auth/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@flowlearn.io',
    password: 'test123',
  }),
});

const data = await response.json();
console.log(data);
// { success: true, data: { user: {...}, accessToken: "...", ... } }
```

```typescript
// Example: Get users list
const response = await fetch('https://api.flowlearn.io/api/v1/admin/users?page=1&limit=10&status=ACTIVE');
const data = await response.json();
console.log(data);
// { success: true, data: [...], meta: { page: 1, limit: 10, total: 18, totalPages: 2 } }
```

```typescript
// Example: Ban a user
const response = await fetch('https://api.flowlearn.io/api/v1/admin/users/4/ban', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    reason: 'Spam content',
    sendEmail: true,
  }),
});

const data = await response.json();
// User status changed to BANNED
```

### 3. Query Parameters Support

**GET /admin/users** supports:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `search` - Search by email or fullName
- `role` - Filter by USER/MODERATOR/SUPER_ADMIN
- `status` - Filter by ACTIVE/WARNED/BANNED/SUSPENDED
- `plan` - Filter by FREE/PRO
- `sort` - Sort field (default: createdAt)
- `order` - Sort order: asc/desc (default: desc)

Example:
```
GET /admin/users?search=nguyen&status=ACTIVE&plan=PRO&page=1&limit=5
```

## 📦 Response Format

All responses follow the standard ApiResponse format:

```typescript
// Success Response
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}

// Error Response
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "User not found",
    "details": []
  }
}
```

## 🔍 Debugging

MSW sẽ log các intercepted requests trong browser console:

```
[MSW] Mock Service Worker started successfully
[MSW] GET https://api.flowlearn.io/api/v1/admin/users (200 OK)
```

## ⚙️ Configuration

### Disable MSW (if needed)
Comment out MSW initialization trong `main.tsx`:

```typescript
// if (import.meta.env.DEV) {
//   startMockServer()
// }
```

### Add more endpoints
1. Tạo handler trong `src/mocks/handlers/`
2. Export handler từ `src/mocks/handlers.ts`
3. MSW sẽ tự động intercept requests

## 📝 Notes

- MSW chỉ chạy trong **development mode** (`npm run dev`)
- MSW **không** được bundle vào production build
- Service Worker file: `public/mockServiceWorker.js`
- Mock data được lưu trong memory, refresh page sẽ reset data

## 🎨 Integration với Admin Pages

Các trang Admin đã sẵn sàng sử dụng MSW:
- `AdminUsersPage` - Hiển thị danh sách users từ mock API
- `AdminDashboardPage` - Có thể extend để fetch stats từ mock API

Example integration trong component:

```typescript
import { useEffect, useState } from 'react';

function AdminUsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('https://api.flowlearn.io/api/v1/admin/users')
      .then(res => res.json())
      .then(data => setUsers(data.data));
  }, []);

  return <div>{/* Render users */}</div>;
}
```

## ✨ Tính năng đặc biệt

1. **Persistent State**: User status changes (ban/warn/suspend) được lưu trong memory session
2. **Search & Filter**: Full-text search và multi-filter support
3. **Pagination**: Automatic pagination với meta information
4. **Realistic Data**: 25 users với tên tiếng Việt và data thực tế
5. **Error Handling**: Proper error responses (404, 403, 409, etc.)

## 🧪 Testing Scenarios

1. **Test pagination**: Change page/limit params
2. **Test search**: Search "nguyen" hoặc "gmail"
3. **Test filters**: Filter by status=BANNED, plan=PRO, role=USER
4. **Test user actions**: Ban/Warn/Unban users
5. **Test edge cases**: Non-existent user ID (404 error)
