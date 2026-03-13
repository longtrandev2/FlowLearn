import { http, HttpResponse } from 'msw';
import { getUserById } from '../data/users';

const API_BASE_URL = 'https://api.flowlearn.io/api/v1';

// Mock tokens
const MOCK_ACCESS_TOKEN = 'mock_access_token_admin_12345';
const MOCK_REFRESH_TOKEN = 'mock_refresh_token_admin_67890';

// Helper to create ApiResponse format
const createApiResponse = <T>(data: T) => ({
  success: true,
  data,
});

const createErrorResponse = (code: string, message: string) => ({
  success: false,
  error: {
    code,
    message,
    details: [],
  },
});

export const authHandlers = [
  // 2.1 POST /auth/register
  http.post(`${API_BASE_URL}/auth/register`, async ({ request }) => {
    const body = await request.json() as {
      email: string;
      password: string;
      fullName: string;
    };

    // Check if email already exists (simplified check)
    if (body.email === 'admin@flowlearn.io') {
      return HttpResponse.json(
        createErrorResponse('CONFLICT', 'Email already exists'),
        { status: 409 }
      );
    }

    // Create new user (mock)
    const newUser = {
      id: `user_${Date.now()}`,
      email: body.email,
      fullName: body.fullName,
      role: 'USER',
      plan: 'FREE',
    };

    return HttpResponse.json(
      createApiResponse({
        user: newUser,
        accessToken: MOCK_ACCESS_TOKEN,
        refreshToken: MOCK_REFRESH_TOKEN,
        expiresIn: 900,
      }),
      { status: 201 }
    );
  }),

  // 2.2 POST /auth/login
  http.post(`${API_BASE_URL}/auth/login`, async ({ request }) => {
    const body = await request.json() as {
      email: string;
      password: string;
    };

    // Simple mock validation - accept any email/password for demo
    // In production, would validate credentials
    const mockUser = {
      id: 'user_1',
      email: body.email,
      fullName: 'Test User',
      role: 'USER',
      status: 'ACTIVE',
      avatarUrl: null,
      plan: {
        name: 'FREE',
        displayName: 'Free',
      },
    };

    return HttpResponse.json(
      createApiResponse({
        user: mockUser,
        accessToken: MOCK_ACCESS_TOKEN,
        refreshToken: MOCK_REFRESH_TOKEN,
        expiresIn: 900,
      })
    );
  }),

  // 2.3 POST /auth/admin/login
  http.post(`${API_BASE_URL}/auth/admin/login`, async ({ request }) => {
    const body = await request.json() as {
      email: string;
      password: string;
    };

    // Check for admin credentials
    // For demo: admin@flowlearn.io / any password
    if (body.email !== 'admin@flowlearn.io' && body.email !== 'moderator@flowlearn.io') {
      return HttpResponse.json(
        createErrorResponse('FORBIDDEN', 'Not an admin account'),
        { status: 403 }
      );
    }

    const adminUser = getUserById(body.email === 'admin@flowlearn.io' ? '1' : '2');

    if (!adminUser) {
      return HttpResponse.json(
        createErrorResponse('UNAUTHORIZED', 'Invalid credentials'),
        { status: 401 }
      );
    }

    return HttpResponse.json(
      createApiResponse({
        user: {
          id: adminUser.id,
          email: adminUser.email,
          fullName: adminUser.fullName,
          role: adminUser.role,
          status: adminUser.status,
          avatarUrl: adminUser.avatarUrl,
          plan: {
            name: adminUser.plan,
            displayName: adminUser.plan === 'PRO' ? 'Pro' : 'Free',
          },
        },
        accessToken: MOCK_ACCESS_TOKEN,
        refreshToken: MOCK_REFRESH_TOKEN,
        expiresIn: 900,
      })
    );
  }),

  // 2.4 POST /auth/refresh
  http.post(`${API_BASE_URL}/auth/refresh`, async ({ request }) => {
    const body = await request.json() as {
      refreshToken: string;
    };

    if (!body.refreshToken) {
      return HttpResponse.json(
        createErrorResponse('UNAUTHORIZED', 'Invalid refresh token'),
        { status: 401 }
      );
    }

    return HttpResponse.json(
      createApiResponse({
        accessToken: MOCK_ACCESS_TOKEN,
        refreshToken: MOCK_REFRESH_TOKEN,
        expiresIn: 900,
      })
    );
  }),

  // 2.5 POST /auth/logout
  http.post(`${API_BASE_URL}/auth/logout`, async ({ request }) => {
    const body = await request.json() as {
      refreshToken: string;
    };

    // Just return 204 No Content
    return new HttpResponse(null, { status: 204 });
  }),

  // 2.6 POST /auth/forgot-password
  http.post(`${API_BASE_URL}/auth/forgot-password`, async ({ request }) => {
    const body = await request.json() as {
      email: string;
    };

    return HttpResponse.json(
      createApiResponse({
        message: 'If the email exists, a reset link has been sent',
      })
    );
  }),

  // 2.7 POST /auth/reset-password
  http.post(`${API_BASE_URL}/auth/reset-password`, async ({ request }) => {
    const body = await request.json() as {
      token: string;
      newPassword: string;
    };

    return HttpResponse.json(
      createApiResponse({
        message: 'Password has been reset successfully',
      })
    );
  }),

  // 2.8 POST /auth/verify-email
  http.post(`${API_BASE_URL}/auth/verify-email`, async ({ request }) => {
    const body = await request.json() as {
      token: string;
    };

    return HttpResponse.json(
      createApiResponse({
        message: 'Email verified successfully',
      })
    );
  }),
];
