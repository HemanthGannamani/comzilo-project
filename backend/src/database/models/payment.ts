import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface PaymentAttributes {
  id: number;
  uuid: string;
  tenantId: number;
  storeId: number;
  orderId: number;
  paymentNumber: string;
  paymentMethod: string;
  paymentStatus:
    'pending' | 'authorized' | 'paid' | 'failed' | 'cancelled' | 'refunded' | 'partially_refunded';
  gateway: string;
  gatewayReference: string | null;
  transactionReference: string | null;
  amount: number;
  currency: string;
  exchangeRate: number;
  paidAt: Date | null;
  notes: string | null;
  metadata: Record<string, unknown> | null;
  idempotencyKey: string | null;
  createdBy: number | null;
  updatedBy: number | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export type PaymentCreationAttributes = Optional<
  PaymentAttributes,
  | 'id'
  | 'uuid'
  | 'paymentStatus'
  | 'gateway'
  | 'gatewayReference'
  | 'transactionReference'
  | 'currency'
  | 'exchangeRate'
  | 'paidAt'
  | 'notes'
  | 'metadata'
  | 'idempotencyKey'
  | 'createdBy'
  | 'updatedBy'
  | 'deletedAt'
>;

export class Payment
  extends Model<PaymentAttributes, PaymentCreationAttributes>
  implements PaymentAttributes
{
  declare id: number;
  declare uuid: string;
  declare tenantId: number;
  declare storeId: number;
  declare orderId: number;
  declare paymentNumber: string;
  declare paymentMethod: string;
  declare paymentStatus:
    'pending' | 'authorized' | 'paid' | 'failed' | 'cancelled' | 'refunded' | 'partially_refunded';
  declare gateway: string;
  declare gatewayReference: string | null;
  declare transactionReference: string | null;
  declare amount: number;
  declare currency: string;
  declare exchangeRate: number;
  declare paidAt: Date | null;
  declare notes: string | null;
  declare metadata: Record<string, unknown> | null;
  declare idempotencyKey: string | null;
  declare createdBy: number | null;
  declare updatedBy: number | null;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

Payment.init(
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
    orderId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'order_id',
    },
    paymentNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'payment_number',
    },
    paymentMethod: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'payment_method',
    },
    paymentStatus: {
      type: DataTypes.ENUM(
        'pending',
        'authorized',
        'paid',
        'failed',
        'cancelled',
        'refunded',
        'partially_refunded'
      ),
      allowNull: false,
      defaultValue: 'pending',
      field: 'payment_status',
    },
    gateway: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'manual',
    },
    gatewayReference: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'gateway_reference',
    },
    transactionReference: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'transaction_reference',
    },
    amount: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      defaultValue: 0.0,
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'USD',
    },
    exchangeRate: {
      type: DataTypes.DECIMAL(15, 6),
      allowNull: false,
      defaultValue: 1.0,
      field: 'exchange_rate',
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'paid_at',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    idempotencyKey: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'idempotency_key',
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
    modelName: 'Payment',
    tableName: 'payments',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);
