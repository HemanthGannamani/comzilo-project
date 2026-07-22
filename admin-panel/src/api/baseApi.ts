import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('admin_access_token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    'Tenant',
    'Store',
    'Plan',
    'User',
    'Role',
    'Report',
    'Settings',
    'FeatureFlag',
    'Webhook',
    'AuditLog',
    'SellerApplication',
    'Seller',
  ],
  endpoints: () => ({}),
});
