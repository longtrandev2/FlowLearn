import { create } from 'zustand';

type User = {
  id: string;
  userName: string;
  email: string;
  avatar?: string;
};

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;

  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, userName: string) => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: localStorage.getItem("isAuthenticated") === "true", // Rehydrate from localStorage
  user: null,
  isLoading: false,

  login: async (email, pass) => {
    set({ isLoading: true }); 
    
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (pass === '123456') {
      set({ 
        isLoading: false,
        isAuthenticated: true,
        user: { 
          id: '1', 
          userName: 'Demo Student', 
          email: email, 
        } 
      });
      localStorage.setItem("isAuthenticated", "true");
    } else {
      set({ isLoading: false });
      alert('Wrong mail or password!');
    }
  },

  register: async (email, pass, userName) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    set({
      isLoading: false,
      isAuthenticated: true,
      user: { id: '2', userName , email }
    }); 
    localStorage.setItem("isAuthenticated", "true");
  },

  logout: () => {
    set({ isAuthenticated: false, user: null });
    localStorage.removeItem("isAuthenticated");
  },
}));