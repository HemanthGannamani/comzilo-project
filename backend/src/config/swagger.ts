/* eslint-disable @typescript-eslint/no-explicit-any */
import swaggerJsdoc from 'swagger-jsdoc';

const swaggerDefinition: any = {
  openapi: '3.0.0',
  info: {
    title: 'Comzilo Enterprise Backend API',
    version: '1.0.0',
    description:
      'Production-grade Monolithic Multi-Tenant & Multi-Store E-Commerce & POS ERP Backend API for Comzilo.',
    contact: {
      name: 'Comzilo Engineering',
      email: 'support@comzilo.com',
    },
  },
  servers: [
    {
      url: '/api/v1',
      description: 'Primary API V1 Base Path',
    },
  ],
  tags: [
    {
      name: 'Authentication',
      description: 'User authentication, tokens, login history, password management, and profile',
    },
    {
      name: 'Tenants',
      description:
        'Multi-tenant organization lifecycle management, statistics, and domain management',
    },
    { name: 'Stores', description: 'Multi-store location management, statuses, and domains' },
    { name: 'Products', description: 'Product catalog, variants, pricing, and bulk operations' },
    { name: 'Categories', description: 'Hierarchical product category taxonomy' },
    { name: 'Brands', description: 'Product brand management' },
    { name: 'Collections', description: 'Curated product collection groupings' },
    { name: 'Tags', description: 'Product and entity tagging system' },
    {
      name: 'Product Classifications',
      description: 'Product category, brand, collection, and tag assignments',
    },
    { name: 'Warehouses', description: 'Fulfillment warehouses and location bin management' },
    {
      name: 'Inventory',
      description: 'Real-time stock balance tracking, low-stock, and out-of-stock monitoring',
    },
    {
      name: 'Stock Movements',
      description: 'Audit history of physical inventory additions, removals, and adjustments',
    },
    {
      name: 'Stock Adjustments',
      description: 'Manual stock count reconciliation and approval workflow',
    },
    {
      name: 'Stock Transfers',
      description: 'Inter-warehouse inventory transfer workflows (ship, receive, cancel)',
    },
    {
      name: 'Stock Reservations',
      description: 'Temporary stock holds and fulfillment reservations',
    },
    {
      name: 'Customers',
      description: 'Customer profiles, CRM notes, tags, preferences, and documents',
    },
    { name: 'Customer Addresses', description: 'Customer billing and shipping address management' },
    {
      name: 'Customer Documents',
      description: 'Customer identity verification and compliance documents',
    },
    { name: 'Orders', description: 'Sales order processing, fulfillment, and cancellation' },
    { name: 'Invoices', description: 'Order invoice generation and PDF exports' },
    { name: 'Payments', description: 'Payment processing, captures, and authorization voids' },
    { name: 'Refunds', description: 'Payment refund management' },
    {
      name: 'POS (Point of Sale)',
      description: 'POS registers, sessions, checkout sales, returns, and receipts',
    },
    { name: 'Receipts', description: 'POS receipt management and printing formats' },
    {
      name: 'Reporting & Analytics',
      description: 'Read-only business analytics, executive dashboards, and CSV data exports',
    },
    {
      name: 'Notifications',
      description: 'In-app notification delivery, mark read, and unread counts',
    },
    {
      name: 'Notification Templates',
      description: 'Email/SMS/Push/WhatsApp notification template management',
    },
    { name: 'Notification Preferences', description: 'User notification channel preferences' },
    { name: 'Settings', description: 'Unified hierarchical settings resolution engine' },
    { name: 'Tenant Settings', description: 'Tenant-wide configuration defaults' },
    { name: 'Store Settings', description: 'Store-level configuration overrides' },
    {
      name: 'Global Configuration',
      description: 'Platform-wide system configuration, feature flags, and change history',
    },
    {
      name: 'Webhooks',
      description: 'Webhook endpoints registration, HMAC signatures, and event delivery logs',
    },
    {
      name: 'Integrations',
      description:
        'External marketplace app marketplace and sync logging (Shopify, WooCommerce, Stripe, etc.)',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Pass JWT Access Token in HTTP Authorization header as: Bearer <token>',
      },
      tenantHeader: {
        type: 'apiKey',
        in: 'header',
        name: 'X-Tenant-UUID',
        description: 'Tenant UUID header for multi-tenant isolation',
      },
      storeHeader: {
        type: 'apiKey',
        in: 'header',
        name: 'X-Store-ID',
        description: 'Store Database ID header for store isolation',
      },
    },
    schemas: {
      StandardSuccessResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Operation completed successfully' },
          data: { type: 'object' },
        },
      },
      StandardErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Resource not found or unauthorized' },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'NOT_FOUND_ERROR' },
              statusCode: { type: 'number', example: 404 },
              details: { type: 'object', nullable: true },
            },
          },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
      tenantHeader: [],
    },
  ],
  paths: {
    // 1. AUTHENTICATION MODULE
    '/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register new tenant & tenant owner admin user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  tenantName: { type: 'string' },
                  email: { type: 'string' },
                  password: { type: 'string' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Tenant and admin created successfully' } },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Authenticate user credentials and obtain JWT tokens',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { email: { type: 'string' }, password: { type: 'string' } },
              },
            },
          },
        },
        responses: { 200: { description: 'Authenticated successfully' } },
      },
    },
    '/auth/refresh': {
      post: {
        tags: ['Authentication'],
        summary: 'Refresh access token using valid refresh token',
        responses: { 200: { description: 'Token refreshed successfully' } },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['Authentication'],
        summary: 'Invalidate refresh token and logout user session',
        responses: { 200: { description: 'Logged out successfully' } },
      },
    },
    '/auth/profile': {
      get: {
        tags: ['Authentication'],
        summary: 'Get authenticated user profile details',
        responses: { 200: { description: 'User profile details' } },
      },
    },
    '/auth/change-password': {
      post: {
        tags: ['Authentication'],
        summary: 'Change current user password',
        responses: { 200: { description: 'Password changed successfully' } },
      },
    },
    '/auth/forgot-password': {
      post: {
        tags: ['Authentication'],
        summary: 'Request password reset token via email',
        responses: { 200: { description: 'Reset token sent if user exists' } },
      },
    },
    '/auth/reset-password': {
      post: {
        tags: ['Authentication'],
        summary: 'Reset user password using reset token',
        responses: { 200: { description: 'Password reset successfully' } },
      },
    },

    // 2. TENANTS MODULE
    '/tenants': {
      get: {
        tags: ['Tenants'],
        summary: 'List all tenants',
        responses: { 200: { description: 'Tenant list' } },
      },
      post: {
        tags: ['Tenants'],
        summary: 'Create new tenant',
        responses: { 201: { description: 'Tenant created' } },
      },
    },
    '/tenants/{id}': {
      get: {
        tags: ['Tenants'],
        summary: 'Get tenant details by ID',
        responses: { 200: { description: 'Tenant details' } },
      },
      put: {
        tags: ['Tenants'],
        summary: 'Update tenant details',
        responses: { 200: { description: 'Tenant updated' } },
      },
      delete: {
        tags: ['Tenants'],
        summary: 'Soft-delete tenant',
        responses: { 200: { description: 'Tenant deleted' } },
      },
    },
    '/tenants/{id}/restore': {
      post: {
        tags: ['Tenants'],
        summary: 'Restore soft-deleted tenant',
        responses: { 200: { description: 'Tenant restored' } },
      },
    },
    '/tenants/{id}/status': {
      patch: {
        tags: ['Tenants'],
        summary: 'Update tenant status (active/inactive/suspended)',
        responses: { 200: { description: 'Status updated' } },
      },
    },
    '/tenants/{id}/statistics': {
      get: {
        tags: ['Tenants'],
        summary: 'Get tenant usage statistics & metrics',
        responses: { 200: { description: 'Tenant statistics' } },
      },
    },

    // 3. STORES MODULE
    '/stores': {
      get: {
        tags: ['Stores'],
        summary: 'List stores for active tenant',
        responses: { 200: { description: 'Store list' } },
      },
      post: {
        tags: ['Stores'],
        summary: 'Create new store',
        responses: { 201: { description: 'Store created' } },
      },
    },
    '/stores/{id}': {
      get: {
        tags: ['Stores'],
        summary: 'Get store details by ID',
        responses: { 200: { description: 'Store details' } },
      },
      put: {
        tags: ['Stores'],
        summary: 'Update store details',
        responses: { 200: { description: 'Store updated' } },
      },
      delete: {
        tags: ['Stores'],
        summary: 'Soft-delete store',
        responses: { 200: { description: 'Store deleted' } },
      },
    },
    '/stores/{id}/restore': {
      post: {
        tags: ['Stores'],
        summary: 'Restore soft-deleted store',
        responses: { 200: { description: 'Store restored' } },
      },
    },
    '/stores/{id}/status': {
      patch: {
        tags: ['Stores'],
        summary: 'Update store active status',
        responses: { 200: { description: 'Status updated' } },
      },
    },

    // 4. PRODUCTS & CATALOG MODULE
    '/products': {
      get: {
        tags: ['Products'],
        summary: 'List products with search, filters, sorting, and pagination',
        responses: { 200: { description: 'Product list' } },
      },
      post: {
        tags: ['Products'],
        summary: 'Create new catalog product',
        responses: { 201: { description: 'Product created' } },
      },
    },
    '/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Get product details by ID',
        responses: { 200: { description: 'Product details' } },
      },
      put: {
        tags: ['Products'],
        summary: 'Update product details',
        responses: { 200: { description: 'Product updated' } },
      },
      delete: {
        tags: ['Products'],
        summary: 'Soft-delete product',
        responses: { 200: { description: 'Product deleted' } },
      },
    },
    '/products/{id}/restore': {
      post: {
        tags: ['Products'],
        summary: 'Restore soft-deleted product',
        responses: { 200: { description: 'Product restored' } },
      },
    },
    '/categories': {
      get: {
        tags: ['Categories'],
        summary: 'List product categories',
        responses: { 200: { description: 'Category list' } },
      },
      post: {
        tags: ['Categories'],
        summary: 'Create new category',
        responses: { 201: { description: 'Category created' } },
      },
    },
    '/categories/tree': {
      get: {
        tags: ['Categories'],
        summary: 'Get category taxonomy tree hierarchy',
        responses: { 200: { description: 'Category tree' } },
      },
    },
    '/categories/{id}': {
      get: {
        tags: ['Categories'],
        summary: 'Get category by ID',
        responses: { 200: { description: 'Category details' } },
      },
      put: {
        tags: ['Categories'],
        summary: 'Update category',
        responses: { 200: { description: 'Category updated' } },
      },
      delete: {
        tags: ['Categories'],
        summary: 'Delete category',
        responses: { 200: { description: 'Category deleted' } },
      },
    },
    '/brands': {
      get: {
        tags: ['Brands'],
        summary: 'List product brands',
        responses: { 200: { description: 'Brand list' } },
      },
      post: {
        tags: ['Brands'],
        summary: 'Create new brand',
        responses: { 201: { description: 'Brand created' } },
      },
    },
    '/brands/{id}': {
      get: {
        tags: ['Brands'],
        summary: 'Get brand by ID',
        responses: { 200: { description: 'Brand details' } },
      },
      put: {
        tags: ['Brands'],
        summary: 'Update brand',
        responses: { 200: { description: 'Brand updated' } },
      },
      delete: {
        tags: ['Brands'],
        summary: 'Delete brand',
        responses: { 200: { description: 'Brand deleted' } },
      },
    },
    '/collections': {
      get: {
        tags: ['Collections'],
        summary: 'List product collections',
        responses: { 200: { description: 'Collection list' } },
      },
      post: {
        tags: ['Collections'],
        summary: 'Create new collection',
        responses: { 201: { description: 'Collection created' } },
      },
    },
    '/collections/{id}': {
      get: {
        tags: ['Collections'],
        summary: 'Get collection by ID',
        responses: { 200: { description: 'Collection details' } },
      },
      put: {
        tags: ['Collections'],
        summary: 'Update collection',
        responses: { 200: { description: 'Collection updated' } },
      },
      delete: {
        tags: ['Collections'],
        summary: 'Delete collection',
        responses: { 200: { description: 'Collection deleted' } },
      },
    },
    '/tags': {
      get: {
        tags: ['Tags'],
        summary: 'List catalog tags',
        responses: { 200: { description: 'Tag list' } },
      },
      post: {
        tags: ['Tags'],
        summary: 'Create tag',
        responses: { 201: { description: 'Tag created' } },
      },
    },
    '/tags/{id}': {
      get: {
        tags: ['Tags'],
        summary: 'Get tag by ID',
        responses: { 200: { description: 'Tag details' } },
      },
      put: {
        tags: ['Tags'],
        summary: 'Update tag',
        responses: { 200: { description: 'Tag updated' } },
      },
      delete: {
        tags: ['Tags'],
        summary: 'Delete tag',
        responses: { 200: { description: 'Tag deleted' } },
      },
    },
    '/products/{id}/classifications': {
      get: {
        tags: ['Product Classifications'],
        summary: 'Get product category, brand, collection, and tag assignments',
        responses: { 200: { description: 'Classifications' } },
      },
      put: {
        tags: ['Product Classifications'],
        summary: 'Update product category, brand, collection, and tag assignments',
        responses: { 200: { description: 'Updated classifications' } },
      },
    },

    // 5. INVENTORY & WAREHOUSES MODULE
    '/warehouses': {
      get: {
        tags: ['Warehouses'],
        summary: 'List warehouses',
        responses: { 200: { description: 'Warehouse list' } },
      },
      post: {
        tags: ['Warehouses'],
        summary: 'Create warehouse',
        responses: { 201: { description: 'Warehouse created' } },
      },
    },
    '/warehouses/{id}': {
      get: {
        tags: ['Warehouses'],
        summary: 'Get warehouse details',
        responses: { 200: { description: 'Warehouse details' } },
      },
      put: {
        tags: ['Warehouses'],
        summary: 'Update warehouse',
        responses: { 200: { description: 'Warehouse updated' } },
      },
      delete: {
        tags: ['Warehouses'],
        summary: 'Delete warehouse',
        responses: { 200: { description: 'Warehouse deleted' } },
      },
    },
    '/warehouse-locations/{id}': {
      get: {
        tags: ['Warehouses'],
        summary: 'Get location bin details',
        responses: { 200: { description: 'Location details' } },
      },
      put: {
        tags: ['Warehouses'],
        summary: 'Update location bin',
        responses: { 200: { description: 'Location updated' } },
      },
      delete: {
        tags: ['Warehouses'],
        summary: 'Delete location bin',
        responses: { 200: { description: 'Location deleted' } },
      },
    },
    '/inventory/balances': {
      get: {
        tags: ['Inventory'],
        summary: 'Get stock inventory balances across warehouses',
        responses: { 200: { description: 'Stock balances' } },
      },
    },
    '/inventory/low-stock': {
      get: {
        tags: ['Inventory'],
        summary: 'Get low stock inventory items below safety threshold',
        responses: { 200: { description: 'Low stock items' } },
      },
    },
    '/inventory/out-of-stock': {
      get: {
        tags: ['Inventory'],
        summary: 'Get out of stock items',
        responses: { 200: { description: 'Out of stock items' } },
      },
    },
    '/stock-movements': {
      get: {
        tags: ['Stock Movements'],
        summary: 'List audit trail of physical stock movements',
        responses: { 200: { description: 'Stock movements' } },
      },
    },
    '/stock-adjustments': {
      get: {
        tags: ['Stock Adjustments'],
        summary: 'List stock adjustments',
        responses: { 200: { description: 'Stock adjustments' } },
      },
      post: {
        tags: ['Stock Adjustments'],
        summary: 'Create stock adjustment',
        responses: { 201: { description: 'Stock adjustment created' } },
      },
    },
    '/stock-transfers': {
      get: {
        tags: ['Stock Transfers'],
        summary: 'List inter-warehouse stock transfers',
        responses: { 200: { description: 'Stock transfers' } },
      },
      post: {
        tags: ['Stock Transfers'],
        summary: 'Create stock transfer request',
        responses: { 201: { description: 'Transfer created' } },
      },
    },
    '/stock-transfers/{id}/ship': {
      post: {
        tags: ['Stock Transfers'],
        summary: 'Ship stock transfer items from origin warehouse',
        responses: { 200: { description: 'Transfer shipped' } },
      },
    },
    '/stock-transfers/{id}/receive': {
      post: {
        tags: ['Stock Transfers'],
        summary: 'Receive stock transfer items at destination warehouse',
        responses: { 200: { description: 'Transfer received' } },
      },
    },
    '/stock-reservations': {
      get: {
        tags: ['Stock Reservations'],
        summary: 'List stock reservations',
        responses: { 200: { description: 'Reservations list' } },
      },
      post: {
        tags: ['Stock Reservations'],
        summary: 'Create stock reservation hold',
        responses: { 201: { description: 'Reservation created' } },
      },
    },

    // 6. CUSTOMERS MODULE
    '/customers': {
      get: {
        tags: ['Customers'],
        summary: 'List customers',
        responses: { 200: { description: 'Customer list' } },
      },
      post: {
        tags: ['Customers'],
        summary: 'Create customer profile',
        responses: { 201: { description: 'Customer created' } },
      },
    },
    '/customers/{id}': {
      get: {
        tags: ['Customers'],
        summary: 'Get customer by ID',
        responses: { 200: { description: 'Customer details' } },
      },
      put: {
        tags: ['Customers'],
        summary: 'Update customer profile',
        responses: { 200: { description: 'Customer updated' } },
      },
      delete: {
        tags: ['Customers'],
        summary: 'Delete customer',
        responses: { 200: { description: 'Customer deleted' } },
      },
    },
    '/customer-addresses': {
      get: {
        tags: ['Customer Addresses'],
        summary: 'List customer addresses',
        responses: { 200: { description: 'Addresses list' } },
      },
      post: {
        tags: ['Customer Addresses'],
        summary: 'Create customer address',
        responses: { 201: { description: 'Address created' } },
      },
    },
    '/customer-documents': {
      get: {
        tags: ['Customer Documents'],
        summary: 'List customer documents',
        responses: { 200: { description: 'Documents list' } },
      },
      post: {
        tags: ['Customer Documents'],
        summary: 'Upload customer document',
        responses: { 201: { description: 'Document uploaded' } },
      },
    },

    // 7. ORDERS & INVOICES MODULE
    '/orders': {
      get: {
        tags: ['Orders'],
        summary: 'List sales orders with status filters and pagination',
        responses: { 200: { description: 'Orders list' } },
      },
      post: {
        tags: ['Orders'],
        summary: 'Create new sales order',
        responses: { 201: { description: 'Order created' } },
      },
    },
    '/orders/{id}': {
      get: {
        tags: ['Orders'],
        summary: 'Get order details with line items',
        responses: { 200: { description: 'Order details' } },
      },
      put: {
        tags: ['Orders'],
        summary: 'Update order details',
        responses: { 200: { description: 'Order updated' } },
      },
    },
    '/orders/{id}/cancel': {
      post: {
        tags: ['Orders'],
        summary: 'Cancel sales order and release stock holds',
        responses: { 200: { description: 'Order cancelled' } },
      },
    },
    '/invoices': {
      get: {
        tags: ['Invoices'],
        summary: 'List generated invoices',
        responses: { 200: { description: 'Invoices list' } },
      },
    },
    '/invoices/{id}': {
      get: {
        tags: ['Invoices'],
        summary: 'Get invoice details',
        responses: { 200: { description: 'Invoice details' } },
      },
    },

    // 8. PAYMENTS & REFUNDS MODULE
    '/payments': {
      get: {
        tags: ['Payments'],
        summary: 'List payment transactions',
        responses: { 200: { description: 'Payments list' } },
      },
      post: {
        tags: ['Payments'],
        summary: 'Process payment transaction',
        responses: { 201: { description: 'Payment processed' } },
      },
    },
    '/payments/{id}': {
      get: {
        tags: ['Payments'],
        summary: 'Get payment details by ID',
        responses: { 200: { description: 'Payment details' } },
      },
    },
    '/refunds': {
      get: {
        tags: ['Refunds'],
        summary: 'List payment refunds',
        responses: { 200: { description: 'Refunds list' } },
      },
      post: {
        tags: ['Refunds'],
        summary: 'Process payment refund',
        responses: { 201: { description: 'Refund processed' } },
      },
    },

    // 9. POS (POINT OF SALE) MODULE
    '/pos/sales': {
      post: {
        tags: ['POS (Point of Sale)'],
        summary: 'Process POS checkout transaction sale',
        responses: { 201: { description: 'POS Sale completed' } },
      },
    },
    '/pos/returns': {
      post: {
        tags: ['POS (Point of Sale)'],
        summary: 'Process POS order return and refund',
        responses: { 200: { description: 'POS Return processed' } },
      },
    },
    '/pos/register/open': {
      post: {
        tags: ['POS (Point of Sale)'],
        summary: 'Open POS register session',
        responses: { 201: { description: 'Register session opened' } },
      },
    },
    '/pos/register/close': {
      post: {
        tags: ['POS (Point of Sale)'],
        summary: 'Close active POS register session with cash drawer count',
        responses: { 200: { description: 'Register session closed' } },
      },
    },
    '/pos/sessions': {
      get: {
        tags: ['POS (Point of Sale)'],
        summary: 'List POS sessions history',
        responses: { 200: { description: 'POS Sessions list' } },
      },
    },
    '/receipts': {
      get: {
        tags: ['Receipts'],
        summary: 'List POS receipts',
        responses: { 200: { description: 'Receipts list' } },
      },
    },
    '/receipts/{id}': {
      get: {
        tags: ['Receipts'],
        summary: 'Get receipt details by ID',
        responses: { 200: { description: 'Receipt details' } },
      },
    },

    // 10. REPORTING & ANALYTICS MODULE
    '/reports/dashboard': {
      get: {
        tags: ['Reporting & Analytics'],
        summary: 'Get executive dashboard analytics summary metrics',
        responses: { 200: { description: 'Dashboard metrics' } },
      },
    },
    '/reports/sales': {
      get: {
        tags: ['Reporting & Analytics'],
        summary: 'Get sales breakdown analytics report',
        responses: { 200: { description: 'Sales report' } },
      },
    },
    '/reports/products': {
      get: {
        tags: ['Reporting & Analytics'],
        summary: 'Get top performing product analytics report',
        responses: { 200: { description: 'Product report' } },
      },
    },
    '/reports/inventory': {
      get: {
        tags: ['Reporting & Analytics'],
        summary: 'Get inventory valuation and turnover analytics report',
        responses: { 200: { description: 'Inventory report' } },
      },
    },
    '/reports/customers': {
      get: {
        tags: ['Reporting & Analytics'],
        summary: 'Get customer lifetime value and acquisition analytics report',
        responses: { 200: { description: 'Customer report' } },
      },
    },
    '/reports/export/csv': {
      get: {
        tags: ['Reporting & Analytics'],
        summary: 'Export reporting data to CSV file format',
        responses: { 200: { description: 'CSV data export' } },
      },
    },

    // 11. NOTIFICATIONS MODULE
    '/notifications': {
      get: {
        tags: ['Notifications'],
        summary: 'List user notifications',
        responses: { 200: { description: 'Notifications list' } },
      },
      post: {
        tags: ['Notifications'],
        summary: 'Send notification',
        responses: { 201: { description: 'Notification sent' } },
      },
    },
    '/notifications/unread-count': {
      get: {
        tags: ['Notifications'],
        summary: 'Get unread notifications count',
        responses: { 200: { description: 'Unread count' } },
      },
    },
    '/notifications/mark-all-read': {
      patch: {
        tags: ['Notifications'],
        summary: 'Mark all notifications as read',
        responses: { 200: { description: 'Notifications marked read' } },
      },
    },
    '/notification-templates': {
      get: {
        tags: ['Notification Templates'],
        summary: 'List notification templates',
        responses: { 200: { description: 'Templates list' } },
      },
      post: {
        tags: ['Notification Templates'],
        summary: 'Create notification template',
        responses: { 201: { description: 'Template created' } },
      },
    },
    '/notification-preferences': {
      get: {
        tags: ['Notification Preferences'],
        summary: 'Get user notification preferences',
        responses: { 200: { description: 'Preferences' } },
      },
      put: {
        tags: ['Notification Preferences'],
        summary: 'Update user notification preferences',
        responses: { 200: { description: 'Preferences updated' } },
      },
    },

    // 12. SETTINGS & CONFIGURATION MODULE
    '/settings': {
      get: {
        tags: ['Settings'],
        summary: 'Get resolved settings hierarchy (Store -> Tenant -> Global -> Default)',
        responses: { 200: { description: 'Resolved settings' } },
      },
    },
    '/tenant-settings': {
      get: {
        tags: ['Tenant Settings'],
        summary: 'Get tenant settings',
        responses: { 200: { description: 'Tenant settings' } },
      },
      put: {
        tags: ['Tenant Settings'],
        summary: 'Update tenant settings',
        responses: { 200: { description: 'Tenant settings updated' } },
      },
    },
    '/store-settings': {
      get: {
        tags: ['Store Settings'],
        summary: 'Get store settings',
        responses: { 200: { description: 'Store settings' } },
      },
      put: {
        tags: ['Store Settings'],
        summary: 'Update store settings',
        responses: { 200: { description: 'Store settings updated' } },
      },
    },
    '/configuration': {
      get: {
        tags: ['Global Configuration'],
        summary: 'Get global system configurations',
        responses: { 200: { description: 'Global configurations' } },
      },
    },
    '/configuration/feature-flags': {
      get: {
        tags: ['Global Configuration'],
        summary: 'Get system feature flags state',
        responses: { 200: { description: 'Feature flags' } },
      },
      put: {
        tags: ['Global Configuration'],
        summary: 'Update system feature flags state',
        responses: { 200: { description: 'Feature flags updated' } },
      },
    },

    // 13. WEBHOOKS & INTEGRATIONS MODULE
    '/webhooks': {
      get: {
        tags: ['Webhooks'],
        summary: 'List registered webhook endpoints',
        responses: { 200: { description: 'Endpoints list' } },
      },
      post: {
        tags: ['Webhooks'],
        summary: 'Register new webhook endpoint',
        responses: { 201: { description: 'Endpoint registered' } },
      },
    },
    '/webhooks/{id}': {
      get: {
        tags: ['Webhooks'],
        summary: 'Get webhook endpoint details',
        responses: { 200: { description: 'Endpoint details' } },
      },
      put: {
        tags: ['Webhooks'],
        summary: 'Update webhook endpoint',
        responses: { 200: { description: 'Endpoint updated' } },
      },
      delete: {
        tags: ['Webhooks'],
        summary: 'Delete webhook endpoint',
        responses: { 200: { description: 'Endpoint deleted' } },
      },
    },
    '/webhooks/trigger': {
      post: {
        tags: ['Webhooks'],
        summary: 'Manually dispatch webhook event',
        responses: { 200: { description: 'Event dispatched' } },
      },
    },
    '/webhooks/{id}/logs': {
      get: {
        tags: ['Webhooks'],
        summary: 'Get delivery logs for webhook endpoint',
        responses: { 200: { description: 'Delivery logs' } },
      },
    },
    '/integrations/marketplace': {
      get: {
        tags: ['Integrations'],
        summary: 'List available marketplace integration connectors',
        responses: { 200: { description: 'Marketplace connectors' } },
      },
    },
    '/integrations': {
      get: {
        tags: ['Integrations'],
        summary: 'List connected external integrations',
        responses: { 200: { description: 'Connected integrations' } },
      },
      post: {
        tags: ['Integrations'],
        summary: 'Connect new external integration',
        responses: { 201: { description: 'Integration connected' } },
      },
    },
    '/integrations/{id}': {
      get: {
        tags: ['Integrations'],
        summary: 'Get integration details',
        responses: { 200: { description: 'Integration details' } },
      },
      put: {
        tags: ['Integrations'],
        summary: 'Update integration settings',
        responses: { 200: { description: 'Integration updated' } },
      },
    },
    '/integrations/{id}/disconnect': {
      post: {
        tags: ['Integrations'],
        summary: 'Disconnect external integration',
        responses: { 200: { description: 'Integration disconnected' } },
      },
    },
    '/integrations/{id}/sync': {
      post: {
        tags: ['Integrations'],
        summary: 'Trigger manual data sync for integration',
        responses: { 200: { description: 'Sync completed' } },
      },
    },
    '/integrations/{id}/logs': {
      get: {
        tags: ['Integrations'],
        summary: 'Get sync attempt logs for integration',
        responses: { 200: { description: 'Sync logs' } },
      },
    },
  },
};

const options: swaggerJsdoc.Options = {
  definition: swaggerDefinition,
  apis: ['./src/routes/*.ts', './dist/routes/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
