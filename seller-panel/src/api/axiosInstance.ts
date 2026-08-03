import axios from 'axios';
import { storage } from '../utils/storage';

const getBaseUrl = (): string => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  const host = typeof window !== 'undefined' && window.location.hostname ? window.location.hostname : 'localhost';
  return `http://${host}:5000/api/v1`;
};

export const axiosInstance = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  config.baseURL = getBaseUrl();
  const isLoginRoute = config.url?.includes('/auth/login');
  const token = storage.getAccessToken();
  const tenant = storage.getTenant();
  const activeStoreId = storage.getActiveStoreId();

  if (!isLoginRoute) {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (tenant?.uuid) {
      config.headers['X-Tenant-UUID'] = tenant.uuid;
    }
    if (tenant?.id) {
      config.headers['X-Tenant-ID'] = tenant.id.toString();
    }
    if (activeStoreId) {
      config.headers['X-Store-ID'] = activeStoreId.toString();
    }
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = storage.getRefreshToken();

      if (refreshToken) {
        try {
          const res = await axios.post(`${getBaseUrl()}/auth/refresh`, { refreshToken });
          const newAccessToken = res.data.data.accessToken;

          storage.setAccessToken(newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return axiosInstance(originalRequest);
        } catch {
          storage.clearAuth();
          window.location.href = '/login';
          return Promise.reject(error);
        }
      } else {
        storage.clearAuth();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);
