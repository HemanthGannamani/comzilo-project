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
import { CustomerOrdersPage } from '../pages/account/CustomerOrdersPage';
import { CustomerWishlistPage } from '../pages/account/CustomerWishlistPage';
import { PageLoader } from '../components/common/PageLoader';

import { BecomeSellerPage } from '../pages/public/BecomeSellerPage';

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

          {/* Auth Routes */}
          <Route path="/login" element={<CustomerLoginPage />} />
          <Route path="/register" element={<CustomerRegisterPage />} />

          {/* Customer Portal Account Routes */}
          <Route path="/account" element={<CustomerDashboardPage />} />
          <Route path="/account/orders" element={<CustomerOrdersPage />} />
          <Route path="/account/wishlist" element={<CustomerWishlistPage />} />
        </Route>

        {/* Fallback Catch-All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};
