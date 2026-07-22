import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('admin_access_token');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('admin_user_data');
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
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
