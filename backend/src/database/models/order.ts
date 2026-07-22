import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface OrderAttributes {
  id: number;
  uuid: string;
  tenantId: number;
  storeId: number;
  orderNumber: string;
  customerId: number;
  status: 'draft' | 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled';
  paymentStatus: 'unpaid' | 'partially_paid' | 'paid' | 'refunded';
  fulfillmentStatus: 'pending' | 'picking' | 'packed' | 'shipped' | 'delivered' | 'returned';
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingAmount: number;
  totalAmount: number;
  currency: string;
  notes: string | null;
  orderedAt: Date | null;
  createdBy: number | null;
  updatedBy: number | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export type OrderCreationAttributes = Optional<
  OrderAttributes,
  | 'id'
  | 'uuid'
  | 'status'
  | 'paymentStatus'
  | 'fulfillmentStatus'
  | 'subtotal'
  | 'discountAmount'
  | 'taxAmount'
  | 'shippingAmount'
  | 'totalAmount'
  | 'currency'
  | 'notes'
  | 'orderedAt'
  | 'createdBy'
  | 'updatedBy'
  | 'deletedAt'
>;

export class Order
  extends Model<OrderAttributes, OrderCreationAttributes>
  implements OrderAttributes
{
  declare id: number;
  declare uuid: string;
  declare tenantId: number;
  declare storeId: number;
  declare orderNumber: string;
  declare customerId: number;
  declare status: 'draft' | 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled';
  declare paymentStatus: 'unpaid' | 'partially_paid' | 'paid' | 'refunded';
  declare fulfillmentStatus:
    'pending' | 'picking' | 'packed' | 'shipped' | 'delivered' | 'returned';
  declare subtotal: number;
  declare discountAmount: number;
  declare taxAmount: number;
  declare shippingAmount: number;
  declare totalAmount: number;
  declare currency: string;
  declare notes: string | null;
  declare orderedAt: Date | null;
  declare createdBy: number | null;
  declare updatedBy: number | null;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

Order.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
    },
    tenantId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'tenant_id',
    },
    storeId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'store_id',
    },
    orderNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'order_number',
    },
    customerId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'customer_id',
    },
    status: {
      type: DataTypes.ENUM('draft', 'pending', 'confirmed', 'processing', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'draft',
    },
    paymentStatus: {
      type: DataTypes.ENUM('unpaid', 'partially_paid', 'paid', 'refunded'),
      allowNull: false,
      defaultValue: 'unpaid',
      field: 'payment_status',
    },
    fulfillmentStatus: {
      type: DataTypes.ENUM('pending', 'picking', 'packed', 'shipped', 'delivered', 'returned'),
      allowNull: false,
      defaultValue: 'pending',
      field: 'fulfillment_status',
    },
    subtotal: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      defaultValue: 0.0,
    },
    discountAmount: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      defaultValue: 0.0,
      field: 'discount_amount',
    },
    taxAmount: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      defaultValue: 0.0,
      field: 'tax_amount',
    },
    shippingAmount: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      defaultValue: 0.0,
      field: 'shipping_amount',
    },
    totalAmount: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      defaultValue: 0.0,
      field: 'total_amount',
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'USD',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    orderedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'ordered_at',
    },
    createdBy: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'created_by',
    },
    updatedBy: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'updated_by',
    },
  },
  {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);
