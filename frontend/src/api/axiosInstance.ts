import axios from 'axios';
import { storage } from '../utils/storage';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = storage.getAccessToken();
  const tenant = storage.getTenant();
  const activeStoreId = storage.getActiveStoreId();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (tenant?.uuid) {
    config.headers['X-Tenant-UUID'] = tenant.uuid;
  }
  if (activeStoreId) {
    config.headers['X-Store-ID'] = activeStoreId.toString();
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
          const res = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
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
