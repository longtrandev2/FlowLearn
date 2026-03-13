import { http, HttpResponse } from 'msw';
import { mockUsers, getUserById, searchUsers } from '../data/users';
import type { MockUser, UserStatus, UserRole } from '../data/users';

const API_BASE_URL = 'https://api.flowlearn.io/api/v1';

// Helper to create ApiResponse format
const createApiResponse = <T>(data: T, meta?: any) => ({
  success: true,
  data,
  meta,
});

const createErrorResponse = (code: string, message: string) => ({
  success: false,
  error: {
    code,
    message,
    details: [],
  },
});

export const adminHandlers = [
  // 11.1 GET /admin/users - List all users with filtering, search, sort
  http.get(`${API_BASE_URL}/admin/users`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const search = url.searchParams.get('search') || '';
    const role = url.searchParams.get('role') as UserRole | null;
    const status = url.searchParams.get('status') as UserStatus | null;
    const plan = url.searchParams.get('plan') || '';
    const sort = url.searchParams.get('sort') || 'createdAt';
    const order = url.searchParams.get('order') || 'desc';

    let filteredUsers = [...mockUsers];

    // Apply search
    if (search) {
      filteredUsers = searchUsers(search);
    }

    // Apply role filter
    if (role) {
      filteredUsers = filteredUsers.filter(user => user.role === role);
    }

    // Apply status filter
    if (status) {
      filteredUsers = filteredUsers.filter(user => user.status === status);
    }

    // Apply plan filter
    if (plan) {
      filteredUsers = filteredUsers.filter(user => user.plan === plan);
    }

    // Apply sorting
    filteredUsers.sort((a, b) => {
      let aVal: any = a[sort as keyof MockUser];
      let bVal: any = b[sort as keyof MockUser];

      // Handle date strings
      if (sort === 'createdAt' || sort === 'lastLoginAt') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }

      if (order === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    // Apply pagination
    const total = filteredUsers.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedUsers = filteredUsers.slice(start, end);

    return HttpResponse.json(
      createApiResponse(paginatedUsers, {
        page,
        limit,
        total,
        totalPages,
      })
    );
  }),

  // 11.2 GET /admin/users/:userId - Get user details
  http.get(`${API_BASE_URL}/admin/users/:userId`, ({ params }) => {
    const { userId } = params;
    const user = getUserById(userId as string);

    if (!user) {
      return HttpResponse.json(
        createErrorResponse('NOT_FOUND', 'User not found'),
        { status: 404 }
      );
    }

    // Return full user detail (in production, this would include more data)
    return HttpResponse.json(createApiResponse(user));
  }),

  // 11.3 PUT /admin/users/:userId/role - Change user role
  http.put(`${API_BASE_URL}/admin/users/:userId/role`, async ({ request, params }) => {
    const { userId } = params;
    const body = await request.json() as { role: UserRole; reason: string };
    const user = getUserById(userId as string);

    if (!user) {
      return HttpResponse.json(
        createErrorResponse('NOT_FOUND', 'User not found'),
        { status: 404 }
      );
    }

    // Update role (in-memory only for mock)
    user.role = body.role;

    return HttpResponse.json(createApiResponse(user));
  }),

  // 11.4 POST /admin/users/:userId/warn - Warn user
  http.post(`${API_BASE_URL}/admin/users/:userId/warn`, async ({ request, params }) => {
    const { userId } = params;
    const body = await request.json() as { reason: string; sendEmail: boolean };
    const user = getUserById(userId as string);

    if (!user) {
      return HttpResponse.json(
        createErrorResponse('NOT_FOUND', 'User not found'),
        { status: 404 }
      );
    }

    // Update status to WARNED
    user.status = 'WARNED';

    return HttpResponse.json(createApiResponse(user));
  }),

  // 11.5 POST /admin/users/:userId/ban - Ban user
  http.post(`${API_BASE_URL}/admin/users/:userId/ban`, async ({ request, params }) => {
    const { userId } = params;
    const body = await request.json() as { reason: string; sendEmail: boolean };
    const user = getUserById(userId as string);

    if (!user) {
      return HttpResponse.json(
        createErrorResponse('NOT_FOUND', 'User not found'),
        { status: 404 }
      );
    }

    // Update status to BANNED
    user.status = 'BANNED';

    return HttpResponse.json(createApiResponse(user));
  }),

  // 11.6 POST /admin/users/:userId/unban - Unban user
  http.post(`${API_BASE_URL}/admin/users/:userId/unban`, async ({ request, params }) => {
    const { userId } = params;
    const body = await request.json() as { reason: string };
    const user = getUserById(userId as string);

    if (!user) {
      return HttpResponse.json(
        createErrorResponse('NOT_FOUND', 'User not found'),
        { status: 404 }
      );
    }

    // Update status to ACTIVE
    user.status = 'ACTIVE';

    return HttpResponse.json(createApiResponse(user));
  }),

  // 11.7 POST /admin/users/:userId/suspend - Suspend user
  http.post(`${API_BASE_URL}/admin/users/:userId/suspend`, async ({ request, params }) => {
    const { userId } = params;
    const body = await request.json() as { reason: string; durationDays: number };
    const user = getUserById(userId as string);

    if (!user) {
      return HttpResponse.json(
        createErrorResponse('NOT_FOUND', 'User not found'),
        { status: 404 }
      );
    }

    // Update status to SUSPENDED
    user.status = 'SUSPENDED';

    return HttpResponse.json(createApiResponse(user));
  }),

  // 11.8 DELETE /admin/users/:userId - Delete user permanently
  http.delete(`${API_BASE_URL}/admin/users/:userId`, ({ params }) => {
    const { userId } = params;
    const user = getUserById(userId as string);

    if (!user) {
      return HttpResponse.json(
        createErrorResponse('NOT_FOUND', 'User not found'),
        { status: 404 }
      );
    }

    // In real implementation, would delete from database
    // For mock, we'll just return 204
    return new HttpResponse(null, { status: 204 });
  }),

  // 11.9 PUT /admin/users/:userId/plan - Force change user plan
  http.put(`${API_BASE_URL}/admin/users/:userId/plan`, async ({ request, params }) => {
    const { userId } = params;
    const body = await request.json() as { planId: string; reason: string };
    const user = getUserById(userId as string);

    if (!user) {
      return HttpResponse.json(
        createErrorResponse('NOT_FOUND', 'User not found'),
        { status: 404 }
      );
    }

    // Update plan (simplified - in reality would look up plan by planId)
    user.plan = body.planId.includes('pro') ? 'PRO' : 'FREE';

    return HttpResponse.json(createApiResponse(user));
  }),
];
