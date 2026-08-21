import { create } from 'zustand';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  notificationsCount: number;
  setAuth: (user: User, token: string, refreshToken: string) => void;
  setNotificationsCount: (count: number) => void;
  logout: () => Promise<void>;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  refreshToken: null,
  notificationsCount: 0,

  setAuth: (user, token, refreshToken) => {
    localStorage.setItem('SF_TOKEN', token);
    localStorage.setItem('SF_REFRESH_TOKEN', refreshToken);
    localStorage.setItem('SF_USER', JSON.stringify(user));
    
    // Set global Axios authorization header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    set({ user, token, refreshToken });
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

    // Always enforce dark theme on root
    const root = window.document.documentElement;
    root.classList.add('dark');
    root.classList.remove('light');

    if (token && refreshToken && userStr) {
      try {
        const user = JSON.parse(userStr);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        set({ user, token, refreshToken });
      } catch (e) {
        localStorage.clear();
        set({ user: null, token: null, refreshToken: null });
      }
    }
  },
}));
