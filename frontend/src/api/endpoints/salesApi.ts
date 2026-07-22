import { baseApi } from '../baseApi';

export const salesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // CUSTOMERS
    getCustomers: builder.query<any, { page?: number; limit?: number; search?: string }>({
      query: (params) => ({
        url: '/customers',
        params,
      }),
      providesTags: ['Customer'],
    }),
    getCustomerById: builder.query<any, number | string>({
      query: (id) => `/customers/${id}`,
      providesTags: ['Customer'],
    }),
    createCustomer: builder.mutation<any, any>({
      query: (data) => ({
        url: '/customers',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Customer'],
    }),
    updateCustomer: builder.mutation<any, { id: number | string; data: any }>({
      query: ({ id, data }) => ({
        url: `/customers/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Customer'],
    }),
    deleteCustomer: builder.mutation<any, number | string>({
      query: (id) => ({
        url: `/customers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Customer'],
    }),

    // CUSTOMER ADDRESSES & DOCUMENTS
    getCustomerAddresses: builder.query<any, { customerId?: number | string }>({
      query: (params) => ({
        url: '/customer-addresses',
        params,
      }),
      providesTags: ['Customer'],
    }),
    getCustomerDocuments: builder.query<any, { customerId?: number | string }>({
      query: (params) => ({
        url: '/customer-documents',
        params,
      }),
      providesTags: ['Customer'],
    }),

    // ORDERS
    getOrders: builder.query<any, { page?: number; limit?: number; search?: string; status?: string }>({
      query: (params) => ({
        url: '/orders',
        params,
      }),
      providesTags: ['Order'],
    }),
    getOrderById: builder.query<any, number | string>({
      query: (id) => `/orders/${id}`,
      providesTags: ['Order'],
    }),
    createOrder: builder.mutation<any, any>({
      query: (data) => ({
        url: '/orders',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Order', 'Inventory'],
    }),
    cancelOrder: builder.mutation<any, number | string>({
      query: (id) => ({
        url: `/orders/${id}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: ['Order', 'Inventory'],
    }),

    // INVOICES
    getInvoices: builder.query<any, { page?: number; limit?: number }>({
      query: (params) => ({
        url: '/invoices',
        params,
      }),
      providesTags: ['Invoice'],
    }),
    getInvoiceById: builder.query<any, number | string>({
      query: (id) => `/invoices/${id}`,
      providesTags: ['Invoice'],
    }),

    // PAYMENTS
    getPayments: builder.query<any, { page?: number; limit?: number }>({
      query: (params) => ({
        url: '/payments',
        params,
      }),
      providesTags: ['Payment'],
    }),
    createPayment: builder.mutation<any, any>({
      query: (data) => ({
        url: '/payments',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Payment', 'Order'],
    }),

    // REFUNDS
    getRefunds: builder.query<any, { page?: number; limit?: number }>({
      query: (params) => ({
        url: '/refunds',
        params,
      }),
      providesTags: ['Refund'],
    }),
    createRefund: builder.mutation<any, any>({
      query: (data) => ({
        url: '/refunds',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Refund', 'Payment', 'Order'],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useGetCustomerAddressesQuery,
  useGetCustomerDocumentsQuery,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useCancelOrderMutation,
  useGetInvoicesQuery,
  useGetInvoiceByIdQuery,
  useGetPaymentsQuery,
  useCreatePaymentMutation,
  useGetRefundsQuery,
  useCreateRefundMutation,
} = salesApi;
