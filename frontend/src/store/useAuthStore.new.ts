import { create } from 'zustand';

const API_BASE_URL = 'https://api.flowlearn.io/api/v1';

type User = {
  id: string;
  email: string;
  fullName: string;
  role: 'USER' | 'MODERATOR' | 'SUPER_ADMIN';
  status: 'ACTIVE' | 'WARNED' | 'BANNED' | 'SUSPENDED';
  avatarUrl?: string | null;
  plan: {
    name: string;
    displayName: string;
  };
};

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  clearError: () => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isLoading: false,
  error: null,

  // User Login
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_BASE_URL}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Login failed');
      }

      const { user, accessToken, refreshToken } = result.data;

      // Save to localStorage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      set({
        isAuthenticated: true,
        user,
        accessToken,
        refreshToken,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      });
      throw error;
    }
  },

  // Admin Login
  adminLogin: async (email: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_BASE_URL}/sessions/admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Admin login failed');
      }

      const { user, accessToken, refreshToken } = result.data;

      // Verify user is admin
      if (user.role !== 'MODERATOR' && user.role !== 'SUPER_ADMIN') {
        throw new Error('Not an admin account');
      }

      // Save to localStorage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userRole', user.role);

      set({
        isAuthenticated: true,
        user,
        accessToken,
        refreshToken,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Admin login failed',
      });
      throw error;
    }
  },

  // Register
  register: async (email: string, password: string, fullName: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Registration failed');
      }

      const { user, accessToken, refreshToken } = result.data;

      // Save to localStorage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      set({
        isAuthenticated: true,
        user,
        accessToken,
        refreshToken,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      });
      throw error;
    }
  },

  // Logout
  logout: async () => {
    const { refreshToken } = get();

    try {
      if (refreshToken) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear state and localStorage
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userRole');

      set({
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null,
        error: null,
      });
    }
  },

  // Refresh Access Token
  refreshAccessToken: async () => {
    const { refreshToken } = get();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error('Token refresh failed');
      }

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = result.data;

      // Update tokens
      localStorage.setItem('accessToken', newAccessToken);
      localStorage.setItem('refreshToken', newRefreshToken);

      set({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    } catch (error) {
      // If refresh fails, logout
      get().logout();
      throw error;
    }
  },

  // Clear Error
  clearError: () => set({ error: null }),
}));

// Helper to get auth header
export const getAuthHeader = () => {
  const token = useAuthStore.getState().accessToken;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper to check if user is admin
export const isAdmin = () => {
  const user = useAuthStore.getState().user;
  return user?.role === 'MODERATOR' || user?.role === 'SUPER_ADMIN';
};

// Helper to check if user is super admin
export const isSuperAdmin = () => {
  const user = useAuthStore.getState().user;
  return user?.role === 'SUPER_ADMIN';
};
