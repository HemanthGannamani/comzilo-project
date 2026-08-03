import axios from 'axios';

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
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    config.baseURL = getBaseUrl();
    const token = localStorage.getItem('customer_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Extract storeSlug from URL path (e.g. /store/satish-traders/...) or fallback to localStorage
    const match = window.location.pathname.match(/\/store\/([^/]+)/);
    const activeStoreSlug = match ? match[1] : localStorage.getItem('comzilo_active_store_slug');
    if (activeStoreSlug) {
      config.headers['x-store-slug'] = activeStoreSlug;
      localStorage.setItem('comzilo_active_store_slug', activeStoreSlug);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('customer_access_token');
      localStorage.removeItem('customer_user_data');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
