import { baseApi } from '../baseApi';

export const mastersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // TENANTS
    getTenants: builder.query<any, { page?: number; limit?: number; search?: string; status?: string }>({
      query: (params) => ({
        url: '/tenants',
        params,
      }),
      providesTags: ['Tenant'],
    }),
    getTenantById: builder.query<any, number | string>({
      query: (id) => `/tenants/${id}`,
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
    updateTenant: builder.mutation<any, { id: number | string; data: any }>({
      query: ({ id, data }) => ({
        url: `/tenants/${id}`,
        method: 'PUT',
        body: data,
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
    restoreTenant: builder.mutation<any, number | string>({
      query: (id) => ({
        url: `/tenants/${id}/restore`,
        method: 'POST',
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
    getTenantStats: builder.query<any, number | string>({
      query: (id) => `/tenants/${id}/statistics`,
      providesTags: ['Tenant'],
    }),

    // STORES
    getStores: builder.query<any, { page?: number; limit?: number; search?: string }>({
      query: (params) => ({
        url: '/stores',
        params,
      }),
      providesTags: ['Store'],
    }),
    getStoreById: builder.query<any, number | string>({
      query: (id) => `/stores/${id}`,
      providesTags: ['Store'],
    }),
    createStore: builder.mutation<any, any>({
      query: (data) => ({
        url: '/stores',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Store'],
    }),
    updateStore: builder.mutation<any, { id: number | string; data: any }>({
      query: ({ id, data }) => ({
        url: `/stores/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Store'],
    }),
    deleteStore: builder.mutation<any, number | string>({
      query: (id) => ({
        url: `/stores/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Store'],
    }),
    restoreStore: builder.mutation<any, number | string>({
      query: (id) => ({
        url: `/stores/${id}/restore`,
        method: 'POST',
      }),
      invalidatesTags: ['Store'],
    }),
    updateStoreStatus: builder.mutation<any, { id: number | string; status: string }>({
      query: ({ id, status }) => ({
        url: `/stores/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Store'],
    }),
  }),
});

export const {
  useGetTenantsQuery,
  useGetTenantByIdQuery,
  useCreateTenantMutation,
  useUpdateTenantMutation,
  useDeleteTenantMutation,
  useRestoreTenantMutation,
  useUpdateTenantStatusMutation,
  useGetTenantStatsQuery,
  useGetStoresQuery,
  useGetStoreByIdQuery,
  useCreateStoreMutation,
  useUpdateStoreMutation,
  useDeleteStoreMutation,
  useRestoreStoreMutation,
  useUpdateStoreStatusMutation,
} = mastersApi;
