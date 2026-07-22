/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tenant } from './tenant';
import { User } from './user';
import { UserProfile } from './userProfile';
import { RefreshToken } from './refreshToken';
import { LoginHistory } from './loginHistory';
import { UserDevice } from './userDevice';
import { OtpRequest } from './otpRequest';
import { PasswordResetToken } from './passwordResetToken';
import { Role } from './role';
import { Permission } from './permission';
import { RolePermission } from './rolePermission';
import { UserRole } from './userRole';
import { Store } from './store';
import { StoreDomain } from './storeDomain';
import { StoreSettings } from './storeSettings';
import { Plan } from './plan';
import { Subscription } from './subscription';
import { Media } from './media';
import { Product } from './product';
import { ProductMedia } from './productMedia';

// Step 11 Models
import { Category } from './category';
import { Brand } from './brand';
import { Collection } from './collection';
import { Tag } from './tag';
import { ProductCategory } from './productCategory';
import { ProductCollection } from './productCollection';
import { ProductTag } from './productTag';

// Step 12 Models
import { Warehouse } from './warehouse';
import { WarehouseLocation } from './warehouseLocation';
import { InventoryBalance } from './inventoryBalance';
import { StockMovement } from './stockMovement';
import { StockAdjustment } from './stockAdjustment';
import { StockTransfer } from './stockTransfer';
import { StockTransferItem } from './stockTransferItem';
import { StockReservation } from './stockReservation';
import { StockReservationItem } from './stockReservationItem';

// Step 13 Models
import { Customer } from './customer';
import { CustomerAddress } from './customerAddress';
import { CustomerPreference } from './customerPreference';
import { CustomerTag } from './customerTag';
import { CustomerTagAssignment } from './customerTagAssignment';
import { CustomerNote } from './customerNote';
import { CustomerDocument } from './customerDocument';

// Step 14 Models
import { Order } from './order';
import { OrderItem } from './orderItem';

// Step 15 Models
import { Payment } from './payment';
import { Refund } from './refund';
import { Invoice } from './invoice';

// Step 16 Models
import { POSRegister } from './posRegister';
import { POSSession } from './posSession';
import { Receipt } from './receipt';

// Step 18 Models
import { NotificationTemplate } from './notificationTemplate';
import { NotificationPreference } from './notificationPreference';
import { Notification } from './notification';
import { NotificationQueue } from './notificationQueue';

// Step 19 Models
import { TenantSettings } from './tenantSettings';
import { SystemSettings } from './systemSettings';
import { SettingsHistory } from './settingsHistory';

// Step 20 Models
import { WebhookEndpoint } from './webhookEndpoint';
import { WebhookLog } from './webhookLog';
import { Integration } from './integration';
import { IntegrationSyncLog } from './integrationSyncLog';
import { SellerApplication } from './sellerApplication';

// Establish Associations
// Tenant <-> User
Tenant.hasMany(User, { foreignKey: 'tenant_id', as: 'users' });
User.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });

// User <-> UserProfile
User.hasOne(UserProfile, { foreignKey: 'user_id', as: 'profile' });
UserProfile.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Tenant <-> UserProfile
Tenant.hasMany(UserProfile, { foreignKey: 'tenant_id', as: 'profiles' });
UserProfile.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });

// User <-> RefreshToken
User.hasMany(RefreshToken, { foreignKey: 'user_id', as: 'refreshTokens' });
RefreshToken.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Tenant <-> RefreshToken
Tenant.hasMany(RefreshToken, { foreignKey: 'tenant_id', as: 'refreshTokens' });
RefreshToken.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });

// User <-> LoginHistory
User.hasMany(LoginHistory, { foreignKey: 'user_id', as: 'loginHistories' });
LoginHistory.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Tenant <-> LoginHistory
Tenant.hasMany(LoginHistory, { foreignKey: 'tenant_id', as: 'loginHistories' });
LoginHistory.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });

// User <-> UserDevice
User.hasMany(UserDevice, { foreignKey: 'user_id', as: 'devices' });
UserDevice.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Tenant <-> UserDevice
Tenant.hasMany(UserDevice, { foreignKey: 'tenant_id', as: 'devices' });
UserDevice.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });

// User <-> OtpRequest
User.hasMany(OtpRequest, { foreignKey: 'user_id', as: 'otps' });
OtpRequest.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Tenant <-> OtpRequest
Tenant.hasMany(OtpRequest, { foreignKey: 'tenant_id', as: 'otps' });
OtpRequest.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });

// User <-> PasswordResetToken
User.hasMany(PasswordResetToken, { foreignKey: 'user_id', as: 'passwordResets' });
PasswordResetToken.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Tenant <-> PasswordResetToken
Tenant.hasMany(PasswordResetToken, { foreignKey: 'tenant_id', as: 'passwordResets' });
PasswordResetToken.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });

// Self-association for RefreshToken rotated lineages
RefreshToken.belongsTo(RefreshToken, { foreignKey: 'rotated_from', as: 'previousToken' });

// Role & Permission Junction
Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: 'role_id',
  as: 'permissions',
});
Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: 'permission_id',
  as: 'roles',
});

// User & Role Junction
User.belongsToMany(Role, { through: UserRole, foreignKey: 'user_id', as: 'roles' });
Role.belongsToMany(User, { through: UserRole, foreignKey: 'role_id', as: 'users' });

// UserRole specific associations
User.hasMany(UserRole, { foreignKey: 'user_id', as: 'userRoles' });
UserRole.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Role.hasMany(UserRole, { foreignKey: 'role_id', as: 'userRoles' });
UserRole.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });

Tenant.hasMany(UserRole, { foreignKey: 'tenant_id', as: 'userRoles' });
UserRole.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });

Store.hasMany(UserRole, { foreignKey: 'store_id', as: 'userRoles' });
UserRole.belongsTo(Store, { foreignKey: 'store_id', as: 'store' });

// Tenant <-> Store
Tenant.hasMany(Store, { foreignKey: 'tenant_id', as: 'stores' });
Store.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });

// Store <-> StoreDomain
Store.hasMany(StoreDomain, { foreignKey: 'store_id', as: 'domains' });
StoreDomain.belongsTo(Store, { foreignKey: 'store_id', as: 'store' });

// Tenant <-> StoreDomain
Tenant.hasMany(StoreDomain, { foreignKey: 'tenant_id', as: 'domains' });
StoreDomain.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });

// Store <-> StoreSettings
Store.hasMany(StoreSettings, { foreignKey: 'store_id', as: 'settings' });
StoreSettings.belongsTo(Store, { foreignKey: 'store_id', as: 'store' });

// Tenant <-> StoreSettings
Tenant.hasMany(StoreSettings, { foreignKey: 'tenant_id', as: 'storeSettings' });
StoreSettings.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });

// Tenant <-> Subscription
Tenant.hasMany(Subscription, { foreignKey: 'tenant_id', as: 'subscriptions' });
Subscription.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });

// Plan <-> Subscription
Plan.hasMany(Subscription, { foreignKey: 'plan_id', as: 'subscriptions' });
Subscription.belongsTo(Plan, { foreignKey: 'plan_id', as: 'plan' });

// Tenant <-> Media
Tenant.hasMany(Media, { foreignKey: 'tenant_id', as: 'media' });
Media.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });

// Tenant <-> Product
Tenant.hasMany(Product, { foreignKey: 'tenant_id', as: 'products' });
Product.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });

// Store <-> Product
Store.hasMany(Product, { foreignKey: 'store_id', as: 'products' });
Product.belongsTo(Store, { foreignKey: 'store_id', as: 'store' });

// User <-> Product (Creator/Updater)
User.hasMany(Product, { foreignKey: 'created_by', as: 'createdProducts' });
Product.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
User.hasMany(Product, { foreignKey: 'updated_by', as: 'updatedProducts' });
Product.belongsTo(User, { foreignKey: 'updated_by', as: 'updater' });

// Product <-> Media Junction
Product.belongsToMany(Media, {
  through: ProductMedia,
  foreignKey: 'product_id',
  otherKey: 'media_id',
  as: 'media',
});
Media.belongsToMany(Product, {
  through: ProductMedia,
  foreignKey: 'media_id',
  otherKey: 'product_id',
  as: 'products',
});

// ProductMedia specific associations
Product.hasMany(ProductMedia, { foreignKey: 'product_id', as: 'productMedia' });
ProductMedia.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

Media.hasMany(ProductMedia, { foreignKey: 'media_id', as: 'productMedia' });
ProductMedia.belongsTo(Media, { foreignKey: 'media_id', as: 'media' });

// --- STEP 11 ASSOCIATIONS ---

// Category
Category.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });
Category.belongsTo(Store, { foreignKey: 'store_id', as: 'store' });
Category.belongsTo(Category, { foreignKey: 'parent_id', as: 'parent' });
Category.hasMany(Category, { foreignKey: 'parent_id', as: 'children' });
Category.belongsTo(Media, { foreignKey: 'image_media_id', as: 'image' });
Category.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
Category.belongsTo(User, { foreignKey: 'updated_by', as: 'updater' });
Category.belongsToMany(Product, {
  through: ProductCategory,
  foreignKey: 'category_id',
  otherKey: 'product_id',
  as: 'products',
});

// Brand
Brand.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });
Brand.belongsTo(Store, { foreignKey: 'store_id', as: 'store' });
Brand.belongsTo(Media, { foreignKey: 'logo_media_id', as: 'logo' });
Brand.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
Brand.belongsTo(User, { foreignKey: 'updated_by', as: 'updater' });
Brand.hasMany(Product, { foreignKey: 'brand_id', as: 'products' });

// Collection
Collection.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });
Collection.belongsTo(Store, { foreignKey: 'store_id', as: 'store' });
Collection.belongsTo(Media, { foreignKey: 'image_media_id', as: 'image' });
Collection.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
Collection.belongsTo(User, { foreignKey: 'updated_by', as: 'updater' });
Collection.belongsToMany(Product, {
  through: ProductCollection,
  foreignKey: 'collection_id',
  otherKey: 'product_id',
  as: 'products',
});

// Tag
Tag.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });
Tag.belongsTo(Store, { foreignKey: 'store_id', as: 'store' });
Tag.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
Tag.belongsTo(User, { foreignKey: 'updated_by', as: 'updater' });
Tag.belongsToMany(Product, {
  through: ProductTag,
  foreignKey: 'tag_id',
  otherKey: 'product_id',
  as: 'products',
});

// Product updates for classification
Product.belongsTo(Brand, { foreignKey: 'brand_id', as: 'brandRecord' });
Product.belongsToMany(Category, {
  through: ProductCategory,
  foreignKey: 'product_id',
  otherKey: 'category_id',
  as: 'categories',
});
Product.belongsToMany(Collection, {
  through: ProductCollection,
  foreignKey: 'product_id',
  otherKey: 'collection_id',
  as: 'collections',
});
Product.belongsToMany(Tag, {
  through: ProductTag,
  foreignKey: 'product_id',
  otherKey: 'tag_id',
  as: 'tags',
});

// Junction explicit associations for query flexibility
ProductCategory.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
ProductCategory.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
ProductCollection.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
ProductCollection.belongsTo(Collection, { foreignKey: 'collection_id', as: 'collection' });
ProductTag.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
ProductTag.belongsTo(Tag, { foreignKey: 'tag_id', as: 'tag' });

// Step 12 Associations
Warehouse.hasMany(WarehouseLocation, { foreignKey: 'warehouse_id', as: 'locations' });
WarehouseLocation.belongsTo(Warehouse, { foreignKey: 'warehouse_id', as: 'warehouse' });

Warehouse.hasMany(InventoryBalance, { foreignKey: 'warehouse_id', as: 'balances' });
InventoryBalance.belongsTo(Warehouse, { foreignKey: 'warehouse_id', as: 'warehouse' });

WarehouseLocation.hasMany(InventoryBalance, {
  foreignKey: 'warehouse_location_id',
  as: 'balances',
});
InventoryBalance.belongsTo(WarehouseLocation, {
  foreignKey: 'warehouse_location_id',
  as: 'location',
});

Product.hasMany(InventoryBalance, { foreignKey: 'product_id', as: 'inventoryBalances' });
InventoryBalance.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

Product.hasMany(StockMovement, { foreignKey: 'product_id', as: 'stockMovements' });
StockMovement.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

Warehouse.hasMany(StockMovement, { foreignKey: 'warehouse_id', as: 'stockMovements' });
StockMovement.belongsTo(Warehouse, { foreignKey: 'warehouse_id', as: 'warehouse' });

WarehouseLocation.hasMany(StockMovement, {
  foreignKey: 'warehouse_location_id',
  as: 'stockMovements',
});
StockMovement.belongsTo(WarehouseLocation, { foreignKey: 'warehouse_location_id', as: 'location' });

StockTransfer.hasMany(StockTransferItem, { foreignKey: 'stock_transfer_id', as: 'items' });
StockTransferItem.belongsTo(StockTransfer, { foreignKey: 'stock_transfer_id', as: 'transfer' });

StockTransferItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
StockTransferItem.belongsTo(WarehouseLocation, {
  foreignKey: 'source_location_id',
  as: 'sourceLocation',
});
StockTransferItem.belongsTo(WarehouseLocation, {
  foreignKey: 'destination_location_id',
  as: 'destinationLocation',
});

StockReservation.hasMany(StockReservationItem, { foreignKey: 'reservation_id', as: 'items' });
StockReservationItem.belongsTo(StockReservation, {
  foreignKey: 'reservation_id',
  as: 'reservation',
});

StockReservationItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
StockReservationItem.belongsTo(Warehouse, { foreignKey: 'warehouse_id', as: 'warehouse' });
StockReservationItem.belongsTo(WarehouseLocation, {
  foreignKey: 'warehouse_location_id',
  as: 'location',
});

// Customer Associations
Customer.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });
Customer.belongsTo(Store, { foreignKey: 'store_id', as: 'store' });

Customer.hasMany(CustomerAddress, { foreignKey: 'customer_id', as: 'addresses' });
CustomerAddress.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

Customer.hasOne(CustomerPreference, { foreignKey: 'customer_id', as: 'preference' });
CustomerPreference.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

Customer.belongsToMany(CustomerTag, {
  through: CustomerTagAssignment,
  foreignKey: 'customer_id',
  otherKey: 'tag_id',
  as: 'tags',
});
CustomerTag.belongsToMany(Customer, {
  through: CustomerTagAssignment,
  foreignKey: 'tag_id',
  otherKey: 'customer_id',
  as: 'customers',
});

Customer.hasMany(CustomerNote, { foreignKey: 'customer_id', as: 'customerNotes' });
CustomerNote.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });
CustomerNote.belongsTo(User, { foreignKey: 'author_id', as: 'author' });

Customer.hasMany(CustomerDocument, { foreignKey: 'customer_id', as: 'documents' });
CustomerDocument.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });
CustomerDocument.belongsTo(Media, { foreignKey: 'media_id', as: 'media' });

Customer.belongsTo(Media, { foreignKey: 'profile_image_id', as: 'profileImage' });

// Order Associations
Order.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });
Order.belongsTo(Store, { foreignKey: 'store_id', as: 'store' });
Order.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });
Customer.hasMany(Order, { foreignKey: 'customer_id', as: 'orders' });

Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Payment Associations
Order.hasMany(Payment, { foreignKey: 'order_id', as: 'payments' });
Payment.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

Payment.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });
Payment.belongsTo(Store, { foreignKey: 'store_id', as: 'store' });

Order.hasMany(Invoice, { foreignKey: 'order_id', as: 'invoices' });
Invoice.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

Invoice.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });
Invoice.belongsTo(Store, { foreignKey: 'store_id', as: 'store' });

Payment.hasMany(Refund, { foreignKey: 'payment_id', as: 'refunds' });
Refund.belongsTo(Payment, { foreignKey: 'payment_id', as: 'payment' });

Refund.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });
Refund.belongsTo(Store, { foreignKey: 'store_id', as: 'store' });

// POS Associations
POSRegister.hasMany(POSSession, { foreignKey: 'register_id', as: 'sessions' });
POSSession.belongsTo(POSRegister, { foreignKey: 'register_id', as: 'register' });

POSSession.belongsTo(User, { foreignKey: 'cashier_id', as: 'cashier' });
POSSession.hasMany(Receipt, { foreignKey: 'pos_session_id', as: 'receipts' });
Receipt.belongsTo(POSSession, { foreignKey: 'pos_session_id', as: 'session' });

Order.hasOne(Receipt, { foreignKey: 'order_id', as: 'receipt' });
Receipt.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// --- STEP 18 ASSOCIATIONS ---
NotificationTemplate.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });
NotificationTemplate.belongsTo(Store, { foreignKey: 'store_id', as: 'store' });

NotificationPreference.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });
NotificationPreference.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasOne(NotificationPreference, { foreignKey: 'user_id', as: 'notificationPreference' });

Notification.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });
Notification.belongsTo(Store, { foreignKey: 'store_id', as: 'store' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Notification.belongsTo(NotificationTemplate, { foreignKey: 'template_id', as: 'template' });

NotificationQueue.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });
NotificationQueue.belongsTo(Notification, { foreignKey: 'notification_id', as: 'notification' });

// --- STEP 19 ASSOCIATIONS ---
TenantSettings.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });
Tenant.hasMany(TenantSettings, { foreignKey: 'tenant_id', as: 'tenantSettings' });

// --- STEP 20 ASSOCIATIONS ---
WebhookEndpoint.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });
WebhookEndpoint.belongsTo(Store, { foreignKey: 'store_id', as: 'store' });
WebhookEndpoint.hasMany(WebhookLog, { foreignKey: 'webhook_endpoint_id', as: 'logs' });

WebhookLog.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });
WebhookLog.belongsTo(WebhookEndpoint, { foreignKey: 'webhook_endpoint_id', as: 'endpoint' });

Integration.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });
Integration.belongsTo(Store, { foreignKey: 'store_id', as: 'store' });
Integration.hasMany(IntegrationSyncLog, { foreignKey: 'integration_id', as: 'syncLogs' });

IntegrationSyncLog.belongsTo(Tenant, { foreignKey: 'tenant_id', as: 'tenant' });
IntegrationSyncLog.belongsTo(Integration, { foreignKey: 'integration_id', as: 'integration' });

export {
  Tenant,
  User,
  UserProfile,
  RefreshToken,
  LoginHistory,
  UserDevice,
  OtpRequest,
  PasswordResetToken,
  Role,
  Permission,
  RolePermission,
  UserRole,
  Store,
  StoreDomain,
  StoreSettings,
  Plan,
  Subscription,
  Media,
  Product,
  ProductMedia,
  Category,
  Brand,
  Collection,
  Tag,
  ProductCategory,
  ProductCollection,
  ProductTag,
  Warehouse,
  WarehouseLocation,
  InventoryBalance,
  StockMovement,
  StockAdjustment,
  StockTransfer,
  StockTransferItem,
  StockReservation,
  StockReservationItem,
  Customer,
  CustomerAddress,
  CustomerPreference,
  CustomerTag,
  CustomerTagAssignment,
  CustomerNote,
  CustomerDocument,
  Order,
  OrderItem,
  Payment,
  Refund,
  Invoice,
  POSRegister,
  POSSession,
  Receipt,
  NotificationTemplate,
  NotificationPreference,
  Notification,
  NotificationQueue,
  TenantSettings,
  SystemSettings,
  SettingsHistory,
  WebhookEndpoint,
  WebhookLog,
  Integration,
  IntegrationSyncLog,
  SellerApplication,
};
