import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { MainLayout } from '../layouts/MainLayout';
import { PosLayout } from '../layouts/PosLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PermissionGuard } from './PermissionGuard';
import { PageLoader } from '../components/common/PageLoader';

import { LoginPage } from '../pages/auth/LoginPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage';
import { ProfilePage } from '../pages/auth/ProfilePage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';

import { TenantsPage } from '../features/tenants/TenantsPage';
import { StoresPage } from '../features/stores/StoresPage';
import { UsersPage } from '../features/users/UsersPage';
import { RolesPage } from '../features/roles/RolesPage';
import { PermissionsPage } from '../features/permissions/PermissionsPage';

import { ProductsPage } from '../features/products/pages/ProductsPage';
import { CategoriesPage } from '../features/products/pages/CategoriesPage';
import { BrandsPage } from '../features/products/pages/BrandsPage';
import { CollectionsPage } from '../features/products/pages/CollectionsPage';
import { TagsPage } from '../features/products/pages/TagsPage';

import { WarehousesPage } from '../features/inventory/pages/WarehousesPage';
import { WarehouseLocationsPage } from '../features/inventory/pages/WarehouseLocationsPage';
import { StockBalancesPage } from '../features/inventory/pages/StockBalancesPage';
import { StockMovementsPage } from '../features/inventory/pages/StockMovementsPage';
import { StockAdjustmentsPage } from '../features/inventory/pages/StockAdjustmentsPage';
import { StockTransfersPage } from '../features/inventory/pages/StockTransfersPage';
import { StockReservationsPage } from '../features/inventory/pages/StockReservationsPage';

import { CustomersPage } from '../features/customers/pages/CustomersPage';
import { CustomerAddressesPage } from '../features/customers/pages/CustomerAddressesPage';
import { CustomerDocumentsPage } from '../features/customers/pages/CustomerDocumentsPage';
import { OrdersPage } from '../features/orders/pages/OrdersPage';
import { InvoicesPage } from '../features/orders/pages/InvoicesPage';
import { PaymentsPage } from '../features/payments/pages/PaymentsPage';
import { RefundsPage } from '../features/payments/pages/RefundsPage';

import { PosTerminalPage } from '../features/pos/pages/PosTerminalPage';
import { ReceiptsPage } from '../features/pos/pages/ReceiptsPage';
import { ReportsPage } from '../features/reports/pages/ReportsPage';
import { NotificationsPage } from '../features/notifications/pages/NotificationsPage';
import { NotificationTemplatesPage } from '../features/notifications/pages/NotificationTemplatesPage';
import { SettingsPage } from '../features/settings/pages/SettingsPage';
import { FeatureFlagsPage } from '../features/settings/pages/FeatureFlagsPage';
import { WebhooksPage } from '../features/integrations/pages/WebhooksPage';
import { IntegrationsPage } from '../features/integrations/pages/IntegrationsPage';

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Protected App Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* Phase 2 Masters Routes */}
            <Route path="/tenants" element={<PermissionGuard permission="tenant.read"><TenantsPage /></PermissionGuard>} />
            <Route path="/stores" element={<PermissionGuard permission="store.read"><StoresPage /></PermissionGuard>} />
            <Route path="/users" element={<PermissionGuard permission="user.read"><UsersPage /></PermissionGuard>} />
            <Route path="/roles" element={<PermissionGuard permission="role.read"><RolesPage /></PermissionGuard>} />
            <Route path="/permissions" element={<PermissionGuard permission="permission.read"><PermissionsPage /></PermissionGuard>} />

            {/* Phase 3 Catalog Routes */}
            <Route path="/products" element={<PermissionGuard permission="product.read"><ProductsPage /></PermissionGuard>} />
            <Route path="/categories" element={<PermissionGuard permission="category.read"><CategoriesPage /></PermissionGuard>} />
            <Route path="/brands" element={<PermissionGuard permission="brand.read"><BrandsPage /></PermissionGuard>} />
            <Route path="/collections" element={<PermissionGuard permission="collection.read"><CollectionsPage /></PermissionGuard>} />
            <Route path="/tags" element={<PermissionGuard permission="tag.read"><TagsPage /></PermissionGuard>} />

            {/* Phase 4 Inventory Routes */}
            <Route path="/warehouses" element={<PermissionGuard permission="warehouse.read"><WarehousesPage /></PermissionGuard>} />
            <Route path="/warehouse-locations" element={<PermissionGuard permission="warehouse_location.read"><WarehouseLocationsPage /></PermissionGuard>} />
            <Route path="/inventory" element={<PermissionGuard permission="inventory.read"><StockBalancesPage /></PermissionGuard>} />
            <Route path="/stock-movements" element={<PermissionGuard permission="stock_movement.read"><StockMovementsPage /></PermissionGuard>} />
            <Route path="/stock-adjustments" element={<PermissionGuard permission="stock_adjustment.read"><StockAdjustmentsPage /></PermissionGuard>} />
            <Route path="/stock-transfers" element={<PermissionGuard permission="stock_transfer.read"><StockTransfersPage /></PermissionGuard>} />
            <Route path="/stock-reservations" element={<PermissionGuard permission="stock_reservation.read"><StockReservationsPage /></PermissionGuard>} />

            {/* Phase 5 Sales & Financials Routes */}
            <Route path="/customers" element={<PermissionGuard permission="customer.read"><CustomersPage /></PermissionGuard>} />
            <Route path="/customer-addresses" element={<PermissionGuard permission="customer.read"><CustomerAddressesPage /></PermissionGuard>} />
            <Route path="/customer-documents" element={<PermissionGuard permission="customer.read"><CustomerDocumentsPage /></PermissionGuard>} />
            <Route path="/orders" element={<PermissionGuard permission="order.read"><OrdersPage /></PermissionGuard>} />
            <Route path="/invoices" element={<PermissionGuard permission="invoice.read"><InvoicesPage /></PermissionGuard>} />
            <Route path="/payments" element={<PermissionGuard permission="payment.read"><PaymentsPage /></PermissionGuard>} />
            <Route path="/refunds" element={<PermissionGuard permission="refund.read"><RefundsPage /></PermissionGuard>} />

            {/* Phase 6 Platform Extensions Routes */}
            <Route path="/receipts" element={<PermissionGuard permission="receipt.read"><ReceiptsPage /></PermissionGuard>} />
            <Route path="/reports" element={<PermissionGuard permission="report.read"><ReportsPage /></PermissionGuard>} />
            <Route path="/notifications" element={<PermissionGuard permission="notification.read"><NotificationsPage /></PermissionGuard>} />
            <Route path="/notification-templates" element={<PermissionGuard permission="notification.template.read"><NotificationTemplatesPage /></PermissionGuard>} />
            <Route path="/settings" element={<PermissionGuard permission="settings.read"><SettingsPage /></PermissionGuard>} />
            <Route path="/feature-flags" element={<PermissionGuard permission="configuration.read"><FeatureFlagsPage /></PermissionGuard>} />
            <Route path="/webhooks" element={<PermissionGuard permission="webhook.read"><WebhooksPage /></PermissionGuard>} />
            <Route path="/integrations" element={<PermissionGuard permission="marketplace.read"><IntegrationsPage /></PermissionGuard>} />
          </Route>

          <Route element={<PosLayout />}>
            <Route path="/pos" element={<PermissionGuard permission="pos.access"><PosTerminalPage /></PermissionGuard>} />
          </Route>
        </Route>

        {/* Fallback Catch-All */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};
