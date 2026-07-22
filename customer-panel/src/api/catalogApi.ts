import { baseApi } from './baseApi';

export const catalogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<any, { page?: number; limit?: number; search?: string; categoryId?: number }>({
      query: (params) => ({
        url: '/products',
        params,
      }),
      providesTags: ['Product'],
    }),
    getProductById: builder.query<any, number | string>({
      query: (id) => `/products/${id}`,
      providesTags: ['Product'],
    }),
    getCategories: builder.query<any, void>({
      query: () => '/categories',
      providesTags: ['Category'],
    }),
    getOrders: builder.query<any, void>({
      query: () => '/orders',
      providesTags: ['Order'],
    }),
    createOrder: builder.mutation<any, any>({
      query: (data) => ({
        url: '/orders',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetCategoriesQuery,
  useGetOrdersQuery,
  useCreateOrderMutation,
} = catalogApi;
