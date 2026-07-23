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
    suspendSeller: builder.mutation<any, { id: number | string; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/admin/sellers/${id}/suspend`,
        method: 'PATCH',
        body: { reason },
      }),
      invalidatesTags: ['Seller'],
    }),
    activateSeller: builder.mutation<any, number | string>({
      query: (id) => ({
        url: `/admin/sellers/${id}/activate`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Seller'],
    }),
    resetSellerPassword: builder.mutation<any, number | string>({
      query: (id) => ({
        url: `/admin/sellers/${id}/reset-password`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Seller'],
    }),
    resendSellerCredentials: builder.mutation<any, number | string>({
      query: (id) => ({
        url: `/admin/sellers/${id}/resend-credentials`,
        method: 'POST',
      }),
      invalidatesTags: ['Seller'],
    }),
    impersonateSeller: builder.mutation<any, number | string>({
      query: (id) => ({
        url: `/admin/sellers/${id}/impersonate`,
        method: 'POST',
      }),
    }),
    deleteSeller: builder.mutation<any, number | string>({
      query: (id) => ({
        url: `/admin/sellers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Seller'],
    }),
    getAdminDashboardMetrics: builder.query<any, void>({
      query: () => '/admin/dashboard',
      providesTags: ['Seller', 'SellerApplication', 'Tenant', 'Store'],
    }),
    getSellersReport: builder.query<any, any>({
      query: (params) => ({
        url: '/admin/reports/sellers',
        params,
      }),
    }),
    getApplicationsReport: builder.query<any, any>({
      query: (params) => ({
        url: '/admin/reports/applications',
        params,
      }),
    }),
    getTenantsReport: builder.query<any, any>({
      query: (params) => ({
        url: '/admin/reports/tenants',
        params,
      }),
    }),
    getStoresReport: builder.query<any, any>({
      query: (params) => ({
        url: '/admin/reports/stores',
        params,
      }),
    }),
    getSystemSettings: builder.query<any, void>({
      query: () => '/admin/settings',
      providesTags: ['Setting' as any],
    }),
    saveSystemSettings: builder.mutation<any, any[]>({
      query: (settings) => ({
        url: '/admin/settings',
        method: 'POST',
        body: settings,
      }),
      invalidatesTags: ['Setting' as any],
    }),
    getEmailTemplates: builder.query<any, void>({
      query: () => '/admin/email-templates',
      providesTags: ['EmailTemplate' as any],
    }),
    saveEmailTemplate: builder.mutation<any, any>({
      query: (template) => ({
        url: '/admin/email-templates',
        method: 'POST',
        body: template,
      }),
      invalidatesTags: ['EmailTemplate' as any],
    }),
    getNotifications: builder.query<any, any>({
      query: (params) => ({
        url: '/admin/notifications',
        params,
      }),
      providesTags: ['Notification' as any],
    }),
    markNotificationRead: builder.mutation<any, string | number>({
      query: (id) => ({
        url: `/admin/notifications/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification' as any],
    }),
    markNotificationUnread: builder.mutation<any, string | number>({
      query: (id) => ({
        url: `/admin/notifications/${id}/unread`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification' as any],
    }),
    getSystemHealth: builder.query<any, void>({
      query: () => '/admin/system-health',
    }),
    getBackups: builder.query<any, void>({
      query: () => '/admin/backups',
      providesTags: ['Backup' as any],
    }),
    createBackup: builder.mutation<any, void>({
      query: () => ({
        url: '/admin/backups',
        method: 'POST',
      }),
      invalidatesTags: ['Backup' as any],
    }),
    deleteBackup: builder.mutation<any, string>({
      query: (filename) => ({
        url: `/admin/backups/${filename}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Backup' as any],
    }),
    restoreBackup: builder.mutation<any, { filename: string; confirm: boolean }>({
      query: ({ filename, confirm }) => ({
        url: `/admin/backups/${filename}/restore`,
        method: 'POST',
        body: { confirm },
      }),
      invalidatesTags: ['Seller', 'SellerApplication', 'Tenant', 'Store', 'Backup' as any],
    }),
    getAuditLogs: builder.query<any, any>({
      query: (params) => ({
        url: '/admin/audit-logs',
        params,
      }),
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
  useSuspendSellerMutation,
  useActivateSellerMutation,
  useResetSellerPasswordMutation,
  useResendSellerCredentialsMutation,
  useImpersonateSellerMutation,
  useDeleteSellerMutation,
  useGetAdminDashboardMetricsQuery,
  useGetSellersReportQuery,
  useGetApplicationsReportQuery,
  useGetTenantsReportQuery,
  useGetStoresReportQuery,
  useGetSystemSettingsQuery,
  useSaveSystemSettingsMutation,
  useGetEmailTemplatesQuery,
  useSaveEmailTemplateMutation,
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkNotificationUnreadMutation,
  useGetSystemHealthQuery,
  useGetBackupsQuery,
  useCreateBackupMutation,
  useDeleteBackupMutation,
  useRestoreBackupMutation,
  useGetAuditLogsQuery,
} = adminApi;
