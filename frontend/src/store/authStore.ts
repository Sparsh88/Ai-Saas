import { create } from 'zustand';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  credits: number;
  plan: 'FREE' | 'PREMIUM';
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  theme: 'dark' | 'light';
  notificationsCount: number;
  setAuth: (user: User, token: string, refreshToken: string) => void;
  updateUserCredits: (credits: number) => void;
  updateUserPlan: (plan: 'FREE' | 'PREMIUM') => void;
  toggleTheme: () => void;
  setNotificationsCount: (count: number) => void;
  logout: () => Promise<void>;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  refreshToken: null,
  theme: 'dark',
  notificationsCount: 0,

  setAuth: (user, token, refreshToken) => {
    localStorage.setItem('SF_TOKEN', token);
    localStorage.setItem('SF_REFRESH_TOKEN', refreshToken);
    localStorage.setItem('SF_USER', JSON.stringify(user));
    
    // Set global Axios authorization header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    set({ user, token, refreshToken });
  },

  updateUserCredits: (credits) => {
    const { user } = get();
    if (user) {
      const updated = { ...user, credits };
      localStorage.setItem('SF_USER', JSON.stringify(updated));
      set({ user: updated });
    }
  },

  updateUserPlan: (plan) => {
    const { user } = get();
    if (user) {
      const updated = { ...user, plan };
      localStorage.setItem('SF_USER', JSON.stringify(updated));
      set({ user: updated });
    }
  },

  toggleTheme: () => {
    const currentTheme = get().theme;
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    const root = window.document.documentElement;
    if (nextTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    
    localStorage.setItem('SF_THEME', nextTheme);
    set({ theme: nextTheme });
  },

  setNotificationsCount: (count) => {
    set({ notificationsCount: count });
  },

  logout: async () => {
    const rToken = get().refreshToken;
    try {
      if (rToken) {
        await axios.post('/api/auth/logout', { refreshToken: rToken });
      }
    } catch (e) {
      console.warn('Logout API invocation failed during store clearance:', e);
    }

    localStorage.removeItem('SF_TOKEN');
    localStorage.removeItem('SF_REFRESH_TOKEN');
    localStorage.removeItem('SF_USER');
    
    delete axios.defaults.headers.common['Authorization'];

    set({ user: null, token: null, refreshToken: null });
  },

  initializeAuth: () => {
    const token = localStorage.getItem('SF_TOKEN');
    const refreshToken = localStorage.getItem('SF_REFRESH_TOKEN');
    const userStr = localStorage.getItem('SF_USER');
    const themeStr = localStorage.getItem('SF_THEME') as 'dark' | 'light' | null;

    // Theme initialization
    const theme = themeStr || 'dark';
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    if (token && refreshToken && userStr) {
      try {
        const user = JSON.parse(userStr);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        set({ user, token, refreshToken, theme });
      } catch (e) {
        localStorage.clear();
        set({ theme });
      }
    } else {
      set({ theme });
    }
  },
}));
