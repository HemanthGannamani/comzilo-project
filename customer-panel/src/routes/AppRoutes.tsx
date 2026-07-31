import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CustomerLayout } from '../components/layout/CustomerLayout';
import { HomePage } from '../pages/public/HomePage';
import { ProductListingPage } from '../pages/public/ProductListingPage';
import { ProductDetailPage } from '../pages/public/ProductDetailPage';
import { CartPage } from '../pages/public/CartPage';
import { CheckoutPage } from '../pages/public/CheckoutPage';
import { OrderConfirmationPage } from '../pages/public/OrderConfirmationPage';

import { CustomerLoginPage } from '../pages/auth/CustomerLoginPage';
import { CustomerRegisterPage } from '../pages/auth/CustomerRegisterPage';

import { CustomerDashboardPage } from '../pages/account/CustomerDashboardPage';
import { CustomerProfilePage } from '../pages/account/CustomerProfilePage';
import { CustomerOrdersPage } from '../pages/account/CustomerOrdersPage';
import { CustomerAddressesPage } from '../pages/account/CustomerAddressesPage';
import { CustomerWishlistPage } from '../pages/account/CustomerWishlistPage';
import { CustomerNotificationsPage } from '../pages/account/CustomerNotificationsPage';
import { CustomerInvoicesPage } from '../pages/account/CustomerInvoicesPage';
import { CustomerChangePasswordPage } from '../pages/account/CustomerChangePasswordPage';
import { CustomerPrivacyPage } from '../pages/account/CustomerPrivacyPage';

import { PageLoader } from '../components/common/PageLoader';
import { BecomeSellerPage } from '../pages/public/BecomeSellerPage';
import { SupportCenterPage } from '../pages/SupportCenterPage';

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<CustomerLayout />}>
          {/* Public Storefront Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/become-seller" element={<BecomeSellerPage />} />
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />

          {/* Auth & Storefront Store-specific Routes */}
          <Route path="/login" element={<CustomerLoginPage />} />
          <Route path="/register" element={<CustomerRegisterPage />} />
          <Route path="/store/:storeSlug" element={<HomePage />} />
          <Route path="/store/:storeSlug/login" element={<CustomerLoginPage />} />
          <Route path="/store/:storeSlug/register" element={<CustomerRegisterPage />} />

          {/* Enterprise Customer Portal Account Routes */}
          <Route path="/account" element={<CustomerDashboardPage />} />
          <Route path="/account/profile" element={<CustomerProfilePage />} />
          <Route path="/account/orders" element={<CustomerOrdersPage />} />
          <Route path="/account/addresses" element={<CustomerAddressesPage />} />
          <Route path="/account/wishlist" element={<CustomerWishlistPage />} />
          <Route path="/account/notifications" element={<CustomerNotificationsPage />} />
          <Route path="/account/invoices" element={<CustomerInvoicesPage />} />
          <Route path="/account/change-password" element={<CustomerChangePasswordPage />} />
          <Route path="/account/privacy" element={<CustomerPrivacyPage />} />
          <Route path="/support" element={<SupportCenterPage />} />
          <Route path="/account/support" element={<SupportCenterPage />} />
        </Route>

        {/* Fallback Catch-All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};
