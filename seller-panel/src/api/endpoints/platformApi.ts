import { baseApi } from '../baseApi';

export const platformApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POS & RECEIPTS
    createPosSale: builder.mutation<any, any>({
      query: (data) => ({
        url: '/pos/sales',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['POS', 'Order', 'Inventory'],
    }),
    getReceipts: builder.query<any, { page?: number; limit?: number }>({
      query: (params) => ({
        url: '/receipts',
        params,
      }),
      providesTags: ['POS'],
    }),

    // REPORTS
    getDashboardReport: builder.query<any, void>({
      query: () => '/reports/dashboard',
      providesTags: ['Report'],
    }),
    getSalesReport: builder.query<any, void>({
      query: () => '/reports/sales',
      providesTags: ['Report'],
    }),

    // NOTIFICATIONS & TEMPLATES
    getNotifications: builder.query<any, void>({
      query: () => '/notifications',
      providesTags: ['Notification'],
    }),
    markAllNotificationsRead: builder.mutation<any, void>({
      query: () => ({
        url: '/notifications/mark-all-read',
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'],
    }),
    getNotificationTemplates: builder.query<any, void>({
      query: () => '/notification-templates',
      providesTags: ['Notification'],
    }),
    createNotificationTemplate: builder.mutation<any, any>({
      query: (data) => ({
        url: '/notification-templates',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Notification'],
    }),

    // SETTINGS & CONFIGURATION
    getSettings: builder.query<any, void>({
      query: () => '/settings',
      providesTags: ['Settings'],
    }),
    getTenantSettings: builder.query<any, void>({
      query: () => '/tenant-settings',
      providesTags: ['Settings'],
    }),
    getFeatureFlags: builder.query<any, void>({
      query: () => '/configuration/feature-flags',
      providesTags: ['Settings'],
    }),

    // WEBHOOKS
    getWebhooks: builder.query<any, void>({
      query: () => '/webhooks',
      providesTags: ['Webhook'],
    }),
    createWebhook: builder.mutation<any, any>({
      query: (data) => ({
        url: '/webhooks',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Webhook'],
    }),
    deleteWebhook: builder.mutation<any, number | string>({
      query: (id) => ({
        url: `/webhooks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Webhook'],
    }),

    // INTEGRATIONS
    getIntegrations: builder.query<any, void>({
      query: () => '/integrations',
      providesTags: ['Integration'],
    }),
    getMarketplaceApps: builder.query<any, void>({
      query: () => '/integrations/marketplace',
      providesTags: ['Integration'],
    }),
  }),
});

export const {
  useCreatePosSaleMutation,
  useGetReceiptsQuery,
  useGetDashboardReportQuery,
  useGetSalesReportQuery,
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useGetNotificationTemplatesQuery,
  useCreateNotificationTemplateMutation,
  useGetSettingsQuery,
  useGetTenantSettingsQuery,
  useGetFeatureFlagsQuery,
  useGetWebhooksQuery,
  useCreateWebhookMutation,
  useDeleteWebhookMutation,
  useGetIntegrationsQuery,
  useGetMarketplaceAppsQuery,
} = platformApi;
