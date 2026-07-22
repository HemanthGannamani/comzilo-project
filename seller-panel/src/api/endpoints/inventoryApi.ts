import { baseApi } from '../baseApi';

export const inventoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // WAREHOUSES
    getWarehouses: builder.query<any, { page?: number; limit?: number; search?: string }>({
      query: (params) => ({
        url: '/warehouses',
        params,
      }),
      providesTags: ['Warehouse'],
    }),
    createWarehouse: builder.mutation<any, any>({
      query: (data) => ({
        url: '/warehouses',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Warehouse'],
    }),
    updateWarehouse: builder.mutation<any, { id: number | string; data: any }>({
      query: ({ id, data }) => ({
        url: `/warehouses/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Warehouse'],
    }),
    deleteWarehouse: builder.mutation<any, number | string>({
      query: (id) => ({
        url: `/warehouses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Warehouse'],
    }),

    // LOCATIONS
    getLocations: builder.query<any, { warehouseId?: number | string }>({
      query: (params) => ({
        url: '/warehouse-locations',
        params,
      }),
      providesTags: ['Warehouse'],
    }),

    // STOCK BALANCES
    getStockBalances: builder.query<any, { page?: number; limit?: number; search?: string; warehouseId?: number }>({
      query: (params) => ({
        url: '/inventory/balances',
        params,
      }),
      providesTags: ['Inventory'],
    }),

    // STOCK MOVEMENTS
    getStockMovements: builder.query<any, { page?: number; limit?: number; search?: string }>({
      query: (params) => ({
        url: '/stock-movements',
        params,
      }),
      providesTags: ['Inventory'],
    }),

    // STOCK ADJUSTMENTS
    getStockAdjustments: builder.query<any, { page?: number; limit?: number }>({
      query: (params) => ({
        url: '/stock-adjustments',
        params,
      }),
      providesTags: ['Inventory'],
    }),
    createStockAdjustment: builder.mutation<any, any>({
      query: (data) => ({
        url: '/stock-adjustments',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Inventory'],
    }),

    // STOCK TRANSFERS
    getStockTransfers: builder.query<any, { page?: number; limit?: number }>({
      query: (params) => ({
        url: '/stock-transfers',
        params,
      }),
      providesTags: ['Inventory'],
    }),
    createStockTransfer: builder.mutation<any, any>({
      query: (data) => ({
        url: '/stock-transfers',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Inventory'],
    }),
    shipStockTransfer: builder.mutation<any, number | string>({
      query: (id) => ({
        url: `/stock-transfers/${id}/ship`,
        method: 'POST',
      }),
      invalidatesTags: ['Inventory'],
    }),
    receiveStockTransfer: builder.mutation<any, number | string>({
      query: (id) => ({
        url: `/stock-transfers/${id}/receive`,
        method: 'POST',
      }),
      invalidatesTags: ['Inventory'],
    }),

    // STOCK RESERVATIONS
    getStockReservations: builder.query<any, { page?: number; limit?: number }>({
      query: (params) => ({
        url: '/stock-reservations',
        params,
      }),
      providesTags: ['Inventory'],
    }),
    createStockReservation: builder.mutation<any, any>({
      query: (data) => ({
        url: '/stock-reservations',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Inventory'],
    }),
  }),
});

export const {
  useGetWarehousesQuery,
  useCreateWarehouseMutation,
  useUpdateWarehouseMutation,
  useDeleteWarehouseMutation,
  useGetLocationsQuery,
  useGetStockBalancesQuery,
  useGetStockMovementsQuery,
  useGetStockAdjustmentsQuery,
  useCreateStockAdjustmentMutation,
  useGetStockTransfersQuery,
  useCreateStockTransferMutation,
  useShipStockTransferMutation,
  useReceiveStockTransferMutation,
  useGetStockReservationsQuery,
  useCreateStockReservationMutation,
} = inventoryApi;
