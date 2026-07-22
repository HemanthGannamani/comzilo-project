import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface RefundAttributes {
  id: number;
  uuid: string;
  tenantId: number;
  storeId: number;
  paymentId: number;
  refundNumber: string;
  amount: number;
  reason: string | null;
  status: 'pending' | 'processed' | 'failed' | 'cancelled';
  refundedAt: Date | null;
  createdBy: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type RefundCreationAttributes = Optional<
  RefundAttributes,
  'id' | 'uuid' | 'reason' | 'status' | 'refundedAt' | 'createdBy'
>;

export class Refund
  extends Model<RefundAttributes, RefundCreationAttributes>
  implements RefundAttributes
{
  declare id: number;
  declare uuid: string;
  declare tenantId: number;
  declare storeId: number;
  declare paymentId: number;
  declare refundNumber: string;
  declare amount: number;
  declare reason: string | null;
  declare status: 'pending' | 'processed' | 'failed' | 'cancelled';
  declare refundedAt: Date | null;
  declare createdBy: number | null;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Refund.init(
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
    paymentId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'payment_id',
    },
    refundNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'refund_number',
    },
    amount: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      defaultValue: 0.0,
    },
    reason: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'processed', 'failed', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
    },
    refundedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'refunded_at',
    },
    createdBy: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'created_by',
    },
  },
  {
    sequelize,
    modelName: 'Refund',
    tableName: 'refunds',
    timestamps: true,
    underscored: true,
  }
);
