import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '../components/layout/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PageLoader } from '../components/common/PageLoader';

import { AdminLoginPage } from '../pages/auth/AdminLoginPage';
import { AdminDashboardPage } from '../pages/dashboard/AdminDashboardPage';
import { TenantsPage } from '../pages/tenants/TenantsPage';
import { StoresPage } from '../pages/stores/StoresPage';
import { SubscriptionPlansPage } from '../pages/subscriptions/SubscriptionPlansPage';
import { PlatformUsersPage } from '../pages/users/PlatformUsersPage';
import { RolesPermissionsPage } from '../pages/roles/RolesPermissionsPage';
import { PlatformReportsPage } from '../pages/reports/PlatformReportsPage';
import { FeatureFlagsPage } from '../pages/flags/FeatureFlagsPage';
import { SystemSettingsPage } from '../pages/settings/SystemSettingsPage';
import { AdminIntegrationsPage } from '../pages/integrations/AdminIntegrationsPage';
import { AuditLogsPage } from '../pages/logs/AuditLogsPage';
import { SystemHealthPage } from '../pages/health/SystemHealthPage';
import { SellerApplicationsPage } from '../pages/SellerApplicationsPage';
import { SellersListPage } from '../pages/SellersListPage';
import { AddSellerPage } from '../pages/AddSellerPage';

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Login Route */}
        <Route path="/login" element={<AdminLoginPage />} />

        {/* Protected Super Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<AdminDashboardPage />} />
            <Route path="/tenants" element={<TenantsPage />} />
            <Route path="/seller-applications" element={<SellerApplicationsPage />} />
            <Route path="/sellers" element={<SellersListPage />} />
            <Route path="/sellers/add" element={<AddSellerPage />} />
            <Route path="/stores" element={<StoresPage />} />
            <Route path="/subscriptions" element={<SubscriptionPlansPage />} />
            <Route path="/users" element={<PlatformUsersPage />} />
            <Route path="/roles" element={<RolesPermissionsPage />} />
            <Route path="/reports" element={<PlatformReportsPage />} />
            <Route path="/feature-flags" element={<FeatureFlagsPage />} />
            <Route path="/settings" element={<SystemSettingsPage />} />
            <Route path="/integrations" element={<AdminIntegrationsPage />} />
            <Route path="/logs" element={<AuditLogsPage />} />
            <Route path="/health" element={<SystemHealthPage />} />
          </Route>
        </Route>

        {/* Fallback Catch-All */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};
