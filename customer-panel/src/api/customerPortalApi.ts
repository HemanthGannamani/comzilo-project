import { baseApi } from './baseApi';

export const customerPortalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomerDashboard: builder.query<any, void>({
      query: () => '/customer-portal/dashboard',
      providesTags: ['Customer', 'Order'],
    }),

    getCustomerProfile: builder.query<any, void>({
      query: () => '/customer-portal/profile',
      providesTags: ['Customer'],
    }),

    updateCustomerProfile: builder.mutation<any, any>({
      query: (data) => ({
        url: '/customer-portal/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Customer'],
    }),

    getMyOrders: builder.query<any, { page?: number; limit?: number; search?: string; status?: string }>({
      query: (params) => ({
        url: '/customer-portal/orders',
        params,
      }),
      providesTags: ['Order'],
    }),

    getMyOrderDetails: builder.query<any, number | string>({
      query: (id) => `/customer-portal/orders/${id}`,
      providesTags: ['Order'],
    }),

    cancelMyOrder: builder.mutation<any, number | string>({
      query: (id) => ({
        url: `/customer-portal/orders/${id}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: ['Order'],
    }),

    getMyAddresses: builder.query<any, void>({
      query: () => '/customer-portal/addresses',
      providesTags: ['Customer'],
    }),

    createMyAddress: builder.mutation<any, any>({
      query: (data) => ({
        url: '/customer-portal/addresses',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Customer'],
    }),

    updateMyAddress: builder.mutation<any, { id: number | string; data: any }>({
      query: ({ id, data }) => ({
        url: `/customer-portal/addresses/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Customer'],
    }),

    deleteMyAddress: builder.mutation<any, number | string>({
      query: (id) => ({
        url: `/customer-portal/addresses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Customer'],
    }),

    setDefaultAddress: builder.mutation<any, { id: number | string; type: 'billing' | 'shipping' }>({
      query: ({ id, type }) => ({
        url: `/customer-portal/addresses/${id}/default`,
        method: 'PATCH',
        body: { type },
      }),
      invalidatesTags: ['Customer'],
    }),

    getMyInvoices: builder.query<any, void>({
      query: () => '/customer-portal/invoices',
      providesTags: ['Order'],
    }),

    changeMyPassword: builder.mutation<any, any>({
      query: (data) => ({
        url: '/customer-portal/change-password',
        method: 'POST',
        body: data,
      }),
    }),

    validateCoupon: builder.mutation<any, { code: string; subtotal: number }>({
      query: (data) => ({
        url: '/customer-portal/validate-coupon',
        method: 'POST',
        body: data,
      }),
    }),

    placeOrder: builder.mutation<any, any>({
      query: (data) => ({
        url: '/customer-portal/place-order',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Order', 'Customer'],
    }),

    getMyNotifications: builder.query<any, void>({
      query: () => '/notifications',
    }),

    markNotificationRead: builder.mutation<any, number | string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PATCH',
      }),
    }),

    deleteNotification: builder.mutation<any, number | string>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetCustomerDashboardQuery,
  useGetCustomerProfileQuery,
  useUpdateCustomerProfileMutation,
  useGetMyOrdersQuery,
  useGetMyOrderDetailsQuery,
  useCancelMyOrderMutation,
  useGetMyAddressesQuery,
  useCreateMyAddressMutation,
  useUpdateMyAddressMutation,
  useDeleteMyAddressMutation,
  useSetDefaultAddressMutation,
  useGetMyInvoicesQuery,
  useChangeMyPasswordMutation,
  useValidateCouponMutation,
  usePlaceOrderMutation,
  useGetMyNotificationsQuery,
  useMarkNotificationReadMutation,
  useDeleteNotificationMutation,
} = customerPortalApi;
