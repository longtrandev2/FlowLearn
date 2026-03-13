import { create } from 'zustand';
import { getAuthHeader } from './useAuthStore.new';

const API_BASE_URL = 'https://api.flowlearn.io/api/v1';

export type UserRole = 'USER' | 'MODERATOR' | 'SUPER_ADMIN';
export type UserStatus = 'ACTIVE' | 'WARNED' | 'BANNED' | 'SUSPENDED';
export type UserPlan = 'FREE' | 'PRO';

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  role: UserRole;
  status: UserStatus;
  plan: UserPlan;
  documentsCount: number;
  foldersCount: number;
  storageUsedMb: number;
  lastLoginAt: string;
  createdAt: string;
}

export interface UsersFilters {
  search?: string;
  role?: UserRole;
  status?: UserStatus;
  plan?: UserPlan;
  sort?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

interface UsersResponse {
  data: AdminUser[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface AdminUsersState {
  users: AdminUser[];
  currentUser: AdminUser | null;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchUsers: (filters?: UsersFilters) => Promise<void>;
  fetchUserById: (userId: string) => Promise<void>;
  warnUser: (userId: string, reason: string, sendEmail?: boolean) => Promise<void>;
  banUser: (userId: string, reason: string, sendEmail?: boolean) => Promise<void>;
  unbanUser: (userId: string, reason: string) => Promise<void>;
  suspendUser: (userId: string, reason: string, durationDays: number) => Promise<void>;
  changeUserRole: (userId: string, role: UserRole, reason: string) => Promise<void>;
  changeUserPlan: (userId: string, planId: string, reason: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  clearError: () => void;
}

export const useAdminUsersStore = create<AdminUsersState>((set, get) => ({
  users: [],
  currentUser: null,
  meta: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  isLoading: false,
  error: null,

  // Fetch Users with filters
  fetchUsers: async (filters?: UsersFilters) => {
    set({ isLoading: true, error: null });

    try {
      // Build query string
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.role) params.append('role', filters.role);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.plan) params.append('plan', filters.plan);
      if (filters?.sort) params.append('sort', filters.sort);
      if (filters?.order) params.append('order', filters.order);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await fetch(
        `${API_BASE_URL}/admin/users?${params.toString()}`,
        {
          headers: getAuthHeader(),
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch users');
      }

      set({
        users: result.data,
        meta: result.meta,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch users',
      });
      throw error;
    }
  },

  // Fetch User By ID
  fetchUserById: async (userId: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        headers: getAuthHeader(),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'User not found');
      }

      set({
        currentUser: result.data,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch user',
      });
      throw error;
    }
  },

  // Warn User
  warnUser: async (userId: string, reason: string, sendEmail = true) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/warn`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ reason, sendEmail }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to warn user');
      }

      // Update user in list
      set((state) => ({
        users: state.users.map((u) =>
          u.id === userId ? { ...u, status: 'WARNED' as UserStatus } : u
        ),
        currentUser:
          state.currentUser?.id === userId
            ? { ...state.currentUser, status: 'WARNED' as UserStatus }
            : state.currentUser,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to warn user',
      });
      throw error;
    }
  },

  // Ban User
  banUser: async (userId: string, reason: string, sendEmail = true) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/ban`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ reason, sendEmail }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to ban user');
      }

      // Update user in list
      set((state) => ({
        users: state.users.map((u) =>
          u.id === userId ? { ...u, status: 'BANNED' as UserStatus } : u
        ),
        currentUser:
          state.currentUser?.id === userId
            ? { ...state.currentUser, status: 'BANNED' as UserStatus }
            : state.currentUser,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to ban user',
      });
      throw error;
    }
  },

  // Unban User
  unbanUser: async (userId: string, reason: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/unban`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ reason }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to unban user');
      }

      // Update user in list
      set((state) => ({
        users: state.users.map((u) =>
          u.id === userId ? { ...u, status: 'ACTIVE' as UserStatus } : u
        ),
        currentUser:
          state.currentUser?.id === userId
            ? { ...state.currentUser, status: 'ACTIVE' as UserStatus }
            : state.currentUser,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to unban user',
      });
      throw error;
    }
  },

  // Suspend User
  suspendUser: async (userId: string, reason: string, durationDays: number) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/suspend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ reason, durationDays }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to suspend user');
      }

      // Update user in list
      set((state) => ({
        users: state.users.map((u) =>
          u.id === userId ? { ...u, status: 'SUSPENDED' as UserStatus } : u
        ),
        currentUser:
          state.currentUser?.id === userId
            ? { ...state.currentUser, status: 'SUSPENDED' as UserStatus }
            : state.currentUser,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to suspend user',
      });
      throw error;
    }
  },

  // Change User Role
  changeUserRole: async (userId: string, role: UserRole, reason: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ role, reason }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to change user role');
      }

      // Update user in list
      set((state) => ({
        users: state.users.map((u) => (u.id === userId ? { ...u, role } : u)),
        currentUser:
          state.currentUser?.id === userId
            ? { ...state.currentUser, role }
            : state.currentUser,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to change user role',
      });
      throw error;
    }
  },

  // Change User Plan
  changeUserPlan: async (userId: string, planId: string, reason: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/plan`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ planId, reason }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to change user plan');
      }

      const newPlan = planId.includes('pro') ? 'PRO' : 'FREE';

      // Update user in list
      set((state) => ({
        users: state.users.map((u) =>
          u.id === userId ? { ...u, plan: newPlan as UserPlan } : u
        ),
        currentUser:
          state.currentUser?.id === userId
            ? { ...state.currentUser, plan: newPlan as UserPlan }
            : state.currentUser,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to change user plan',
      });
      throw error;
    }
  },

  // Delete User
  deleteUser: async (userId: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });

      if (response.status !== 204) {
        const result = await response.json();
        throw new Error(result.error?.message || 'Failed to delete user');
      }

      // Remove user from list
      set((state) => ({
        users: state.users.filter((u) => u.id !== userId),
        currentUser: state.currentUser?.id === userId ? null : state.currentUser,
        meta: {
          ...state.meta,
          total: state.meta.total - 1,
        },
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to delete user',
      });
      throw error;
    }
  },

  // Clear Error
  clearError: () => set({ error: null }),
}));
