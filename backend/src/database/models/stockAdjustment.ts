import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface StockAdjustmentAttributes {
  id: number;
  uuid: string;
  tenantId: number;
  storeId: number;
  warehouseId: number;
  warehouseLocationId: number;
  productId: number;
  adjustmentType: 'increase' | 'decrease' | 'set_absolute';
  quantity: number;
  reasonCode: string;
  reason: string | null;
  notes: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  requestedBy: number | null;
  approvedBy: number | null;
  approvedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type StockAdjustmentCreationAttributes = Optional<
  StockAdjustmentAttributes,
  'id' | 'uuid' | 'reason' | 'notes' | 'status' | 'requestedBy' | 'approvedBy' | 'approvedAt'
>;

export class StockAdjustment
  extends Model<StockAdjustmentAttributes, StockAdjustmentCreationAttributes>
  implements StockAdjustmentAttributes
{
  declare id: number;
  declare uuid: string;
  declare tenantId: number;
  declare storeId: number;
  declare warehouseId: number;
  declare warehouseLocationId: number;
  declare productId: number;
  declare adjustmentType: 'increase' | 'decrease' | 'set_absolute';
  declare quantity: number;
  declare reasonCode: string;
  declare reason: string | null;
  declare notes: string | null;
  declare status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  declare requestedBy: number | null;
  declare approvedBy: number | null;
  declare approvedAt: Date | null;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

StockAdjustment.init(
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
    warehouseId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'warehouse_id',
    },
    warehouseLocationId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'warehouse_location_id',
    },
    productId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'product_id',
    },
    adjustmentType: {
      type: DataTypes.ENUM('increase', 'decrease', 'set_absolute'),
      allowNull: false,
      field: 'adjustment_type',
    },
    quantity: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    reasonCode: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'reason_code',
    },
    reason: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
    },
    requestedBy: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'requested_by',
    },
    approvedBy: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'approved_by',
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'approved_at',
    },
  },
  {
    sequelize,
    modelName: 'StockAdjustment',
    tableName: 'stock_adjustments',
    timestamps: true,
    underscored: true,
  }
);
