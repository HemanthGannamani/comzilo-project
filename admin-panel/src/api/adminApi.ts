import { baseApi } from './baseApi';

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // TENANTS
    getTenants: builder.query<any, { page?: number; limit?: number; search?: string }>({
      query: (params) => ({
        url: '/tenants',
        params,
      }),
      providesTags: ['Tenant'],
    }),
    createTenant: builder.mutation<any, any>({
      query: (data) => ({
        url: '/tenants',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Tenant'],
    }),
    updateTenantStatus: builder.mutation<any, { id: number | string; status: string }>({
      query: ({ id, status }) => ({
        url: `/tenants/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Tenant'],
    }),
    deleteTenant: builder.mutation<any, number | string>({
      query: (id) => ({
        url: `/tenants/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Tenant'],
    }),

    // STORES
    getStores: builder.query<any, { page?: number; limit?: number; search?: string }>({
      query: (params) => ({
        url: '/stores',
        params,
      }),
      providesTags: ['Store'],
    }),
    updateStoreStatus: builder.mutation<any, { id: number | string; status: string }>({
      query: ({ id, status }) => ({
        url: `/stores/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Store'],
    }),

    // REPORTS & ANALYTICS
    getHealthCheck: builder.query<any, void>({
      query: () => '/health',
    }),
    getDashboardReport: builder.query<any, void>({
      query: () => '/reports/dashboard',
      providesTags: ['Report'],
    }),

    // FEATURE FLAGS & CONFIGURATION
    getFeatureFlags: builder.query<any, void>({
      query: () => '/configuration/feature-flags',
      providesTags: ['FeatureFlag'],
    }),

    // SETTINGS
    getSettings: builder.query<any, void>({
      query: () => '/settings',
      providesTags: ['Settings'],
    }),

    getSellerApplications: builder.query<
      any,
      {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        businessType?: string;
        startDate?: string;
        endDate?: string;
        sort?: string;
      }
    >({
      query: (params) => ({
        url: '/admin/seller-applications',
        params,
      }),
      providesTags: ['SellerApplication'],
    }),
    getSellerApplicationById: builder.query<any, number | string>({
      query: (id) => `/admin/seller-applications/${id}`,
      providesTags: ['SellerApplication'],
    }),
    approveSellerApplication: builder.mutation<any, number | string>({
      query: (id) => ({
        url: `/admin/seller-applications/${id}/approve`,
        method: 'PATCH',
      }),
      invalidatesTags: ['SellerApplication'],
    }),
    rejectSellerApplication: builder.mutation<any, { id: number | string; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/admin/seller-applications/${id}/reject`,
        method: 'PATCH',
        body: { reason },
      }),
      invalidatesTags: ['SellerApplication'],
    }),

    // SELLERS
    getSellers: builder.query<any, { page?: number; limit?: number; search?: string; status?: string; role?: string; tenantId?: number | string; storeId?: number | string; sort?: string }>({
      query: (params) => ({
        url: '/admin/sellers',
        params,
      }),
      providesTags: ['Seller'],
    }),
    getSellerById: builder.query<any, number | string>({
      query: (id) => `/admin/sellers/${id}`,
      providesTags: ['Seller'],
    }),
    createSeller: builder.mutation<any, any>({
      query: (data) => ({
        url: '/admin/sellers',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Seller', 'Tenant', 'Store'],
    }),
    updateSeller: builder.mutation<any, { id: number | string; data: any }>({
      query: ({ id, data }) => ({
        url: `/admin/sellers/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Seller'],
    }),
    updateSellerStatus: builder.mutation<any, { id: number | string; status: string }>({
      query: ({ id, status }) => ({
        url: `/admin/sellers/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Seller'],
    }),
    deleteSeller: builder.mutation<any, number | string>({
      query: (id) => ({
        url: `/admin/sellers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Seller'],
    }),
  }),
});

export const {
  useGetTenantsQuery,
  useCreateTenantMutation,
  useUpdateTenantStatusMutation,
  useDeleteTenantMutation,
  useGetStoresQuery,
  useUpdateStoreStatusMutation,
  useGetHealthCheckQuery,
  useGetDashboardReportQuery,
  useGetFeatureFlagsQuery,
  useGetSettingsQuery,
  useGetSellerApplicationsQuery,
  useGetSellerApplicationByIdQuery,
  useApproveSellerApplicationMutation,
  useRejectSellerApplicationMutation,
  useGetSellersQuery,
  useGetSellerByIdQuery,
  useCreateSellerMutation,
  useUpdateSellerMutation,
  useUpdateSellerStatusMutation,
  useDeleteSellerMutation,
} = adminApi;
