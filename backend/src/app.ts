import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { requestContext } from './middleware/requestContext';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import { sendResponse, success, serviceUnavailable } from './shared/responses';
import { getDatabaseHealthStatus } from './shared/database/databaseHealth';
import { HTTP_STATUS } from './shared/constants';

const app = express();

// Security Headers
app.use(helmet());

// CORS Configuration
const allowedOrigins = env.CORS_ALLOWED_ORIGINS.split(',').map((o) => o.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        (env.NODE_ENV !== 'production' &&
          /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+):/i.test(origin))
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Compression & Parser Middlewares
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request Context Initialization
app.use(requestContext);

// Request Logger
app.use(requestLogger);

// Global Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
    code: 'RATE_LIMIT_EXCEEDED',
    errors: [],
  },
});
app.use(limiter);

// Health Check Endpoint
app.get('/api/v1/health', async (req, res) => {
  try {
    const dbStatus = await getDatabaseHealthStatus();
    const payload = {
      status: 'UP',
      database: dbStatus,
      version: '1.0.0',
      environment: env.NODE_ENV,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      requestId: req.context?.requestId || 'N/A',
    };

    if (dbStatus === 'DOWN') {
      return serviceUnavailable(res, 'Database is unavailable');
    }

    return success(res, 'Service health retrieved', payload);
  } catch (error) {
    return serviceUnavailable(res, 'Database connection failed');
  }
});

// Mount Auth Routes
import authRoutes from './routes/auth.routes';
app.use('/api/v1/auth', authRoutes);

// Mount Tenant & Store Routes
import tenantRoutes from './routes/tenant.routes';
import storeRoutes from './routes/store.routes';
import { productRoutes } from './routes/product.routes';
import { categoryRoutes } from './routes/category.routes';
import { brandRoutes } from './routes/brand.routes';
import { collectionRoutes } from './routes/collection.routes';
import { tagRoutes } from './routes/tag.routes';
import { productClassificationRoutes } from './routes/productClassification.routes';

// Step 12 Routes
import { warehouseRoutes } from './routes/warehouse.routes';
import { warehouseLocationRoutes } from './routes/warehouseLocation.routes';
import { inventoryRoutes } from './routes/inventory.routes';
import { stockMovementRoutes } from './routes/stockMovement.routes';
import { stockAdjustmentRoutes } from './routes/stockAdjustment.routes';
import { stockTransferRoutes } from './routes/stockTransfer.routes';
import { stockReservationRoutes } from './routes/stockReservation.routes';

// Step 13 Routes
import customerRoutes from './routes/customer.routes';
import customerAddressRoutes from './routes/customerAddress.routes';
import customerDocumentRoutes from './routes/customerDocument.routes';

// Step 14 Routes
import orderRoutes from './routes/order.routes';

// Step 15 Routes
import paymentRoutes from './routes/payment.routes';
import invoiceRoutes from './routes/invoice.routes';
import refundRoutes from './routes/refund.routes';

// Step 16 Routes
import posRoutes from './routes/pos.routes';
import receiptRoutes from './routes/receipt.routes';

// Step 17 Routes
import reportRoutes from './routes/report.routes';

// Step 18 Routes
import notificationRoutes from './routes/notification.routes';
import templateRoutes from './routes/template.routes';
import preferenceRoutes from './routes/preference.routes';

// Step 19 Routes
import settingsRoutes from './routes/settings.routes';
import tenantSettingsRoutes from './routes/tenantSettings.routes';
import storeSettingsRoutes from './routes/storeSettings.routes';
import configurationRoutes from './routes/configuration.routes';

// Step 20 Routes
import webhookRoutes from './routes/webhook.routes';
import integrationRoutes from './routes/integration.routes';

app.use('/api/v1/tenants', tenantRoutes);
app.use('/api/v1/stores', storeRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/brands', brandRoutes);
app.use('/api/v1/collections', collectionRoutes);
app.use('/api/v1/tags', tagRoutes);
app.use('/api/v1/products', productClassificationRoutes);

app.use('/api/v1/warehouses', warehouseRoutes);
app.use('/api/v1/warehouse-locations', warehouseLocationRoutes);
app.use('/api/v1/inventory', inventoryRoutes);
app.use('/api/v1/stock-movements', stockMovementRoutes);
app.use('/api/v1/stock-adjustments', stockAdjustmentRoutes);
app.use('/api/v1/stock-transfers', stockTransferRoutes);
app.use('/api/v1/stock-reservations', stockReservationRoutes);

app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/customer-addresses', customerAddressRoutes);
app.use('/api/v1/customer-documents', customerDocumentRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/invoices', invoiceRoutes);
app.use('/api/v1/refunds', refundRoutes);
app.use('/api/v1/pos', posRoutes);
app.use('/api/v1/receipts', receiptRoutes);
app.use('/api/v1/reports', reportRoutes);

app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/notification-templates', templateRoutes);
app.use('/api/v1/notification-preferences', preferenceRoutes);

app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/tenant-settings', tenantSettingsRoutes);
app.use('/api/v1/store-settings', storeSettingsRoutes);
app.use('/api/v1/configuration', configurationRoutes);

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

import sellerApplicationRoutes from './routes/sellerApplication.routes';
import adminSellerApplicationRoutes from './routes/adminSellerApplication.routes';
import adminSellerRoutes from './routes/adminSeller.routes';
import adminDashboardRoutes from './routes/adminDashboard.routes';
import adminSystemRoutes from './routes/adminSystem.routes';
import storeProductRoutes from './routes/storeProduct.routes';
import storeCatalogRoutes from './routes/storeCatalog.routes';
import storeInventoryRoutes from './routes/storeInventory.routes';
import storeOrderRoutes from './routes/storeOrder.routes';
import storeShippingRoutes from './routes/storeShipping.routes';
import storePaymentRoutes from './routes/storePayment.routes';
import storeCrmRoutes from './routes/storeCrm.routes';
import storeMarketingRoutes from './routes/storeMarketing.routes';
import storeCmsRoutes from './routes/storeCms.routes';
import storePosRoutes from './routes/storePos.routes';
import storePurchasingRoutes from './routes/storePurchasing.routes';

app.use('/api/v1/webhooks', webhookRoutes);
app.use('/api/v1/integrations', integrationRoutes);
app.use('/api/v1/seller-applications', sellerApplicationRoutes);
app.use('/api/v1/admin/seller-applications', adminSellerApplicationRoutes);
app.use('/api/v1/admin/sellers', adminSellerRoutes);
app.use('/api/v1/admin/dashboard', adminDashboardRoutes);
app.use('/api/v1/admin/system', adminSystemRoutes);
app.use('/api/v1/store/products', storeProductRoutes);
app.use('/api/v1/store/inventory', storeInventoryRoutes);
app.use('/api/v1/store/orders', storeOrderRoutes);
app.use('/api/v1/store/shipping', storeShippingRoutes);
app.use('/api/v1/store/payments', storePaymentRoutes);
app.use('/api/v1/store/crm', storeCrmRoutes);
app.use('/api/v1/store/marketing', storeMarketingRoutes);
app.use('/api/v1/store/cms', storeCmsRoutes);
app.use('/api/v1/store/pos', storePosRoutes);
app.use('/api/v1/store/purchasing', storePurchasingRoutes);
app.use('/api/v1/store', storeCatalogRoutes);

// Swagger OpenAPI Documentation UI
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Fallback Route
app.use((req, res) => {
  return sendResponse(
    res,
    HTTP_STATUS.NOT_FOUND,
    false,
    `Cannot ${req.method} ${req.path}`,
    null,
    null,
    []
  );
});

// Error Handler
app.use(errorHandler);

export default app;
export { app };
