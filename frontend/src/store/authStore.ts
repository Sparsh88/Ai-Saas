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
    const rToken = get().refreshToken || localStorage.getItem('SF_REFRESH_TOKEN');
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
        localStorage.removeItem('SF_TOKEN');
        localStorage.removeItem('SF_REFRESH_TOKEN');
        localStorage.removeItem('SF_USER');
        set({ user: null, token: null, refreshToken: null });
      }
    }
  },
}));

// Global Axios Request Interceptor: Attach token if available
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('SF_TOKEN');
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global Axios Response Interceptor: Seamless background token refresh on 401
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/api/auth/login') &&
      !originalRequest.url?.includes('/api/auth/register') &&
      !originalRequest.url?.includes('/api/auth/refresh')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const storedRefreshToken = localStorage.getItem('SF_REFRESH_TOKEN');
      if (!storedRefreshToken) {
        isRefreshing = false;
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post('/api/auth/refresh', {
          refreshToken: storedRefreshToken,
        });

        const newAccessToken = data.accessToken;
        localStorage.setItem('SF_TOKEN', newAccessToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        useAuthStore.setState({ token: newAccessToken });
        processQueue(null, newAccessToken);

        return axios(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
