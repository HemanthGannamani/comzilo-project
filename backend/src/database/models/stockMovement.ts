import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface StockMovementAttributes {
  id: number;
  uuid: string;
  tenantId: number;
  storeId: number;
  warehouseId: number;
  warehouseLocationId: number;
  productId: number;
  movementType:
    | 'opening_stock'
    | 'stock_in'
    | 'stock_out'
    | 'adjustment_in'
    | 'adjustment_out'
    | 'transfer_in'
    | 'transfer_out'
    | 'reservation'
    | 'reservation_release'
    | 'reservation_fulfillment'
    | 'return_in'
    | 'damage_out'
    | 'expired_out'
    | 'correction';
  direction: 'in' | 'out' | 'neutral';
  quantity: number;
  quantityBefore: number;
  quantityAfter: number;
  referenceType: string | null;
  referenceId: string | null;
  reason: string | null;
  notes: string | null;
  idempotencyKey: string | null;
  performedBy: number | null;
  createdAt?: Date;
}

export type StockMovementCreationAttributes = Optional<
  StockMovementAttributes,
  | 'id'
  | 'uuid'
  | 'referenceType'
  | 'referenceId'
  | 'reason'
  | 'notes'
  | 'idempotencyKey'
  | 'performedBy'
>;

export class StockMovement
  extends Model<StockMovementAttributes, StockMovementCreationAttributes>
  implements StockMovementAttributes
{
  declare id: number;
  declare uuid: string;
  declare tenantId: number;
  declare storeId: number;
  declare warehouseId: number;
  declare warehouseLocationId: number;
  declare productId: number;
  declare movementType:
    | 'opening_stock'
    | 'stock_in'
    | 'stock_out'
    | 'adjustment_in'
    | 'adjustment_out'
    | 'transfer_in'
    | 'transfer_out'
    | 'reservation'
    | 'reservation_release'
    | 'reservation_fulfillment'
    | 'return_in'
    | 'damage_out'
    | 'expired_out'
    | 'correction';
  declare direction: 'in' | 'out' | 'neutral';
  declare quantity: number;
  declare quantityBefore: number;
  declare quantityAfter: number;
  declare referenceType: string | null;
  declare referenceId: string | null;
  declare reason: string | null;
  declare notes: string | null;
  declare idempotencyKey: string | null;
  declare performedBy: number | null;

  declare readonly createdAt: Date;
}

StockMovement.init(
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
    movementType: {
      type: DataTypes.ENUM(
        'opening_stock',
        'stock_in',
        'stock_out',
        'adjustment_in',
        'adjustment_out',
        'transfer_in',
        'transfer_out',
        'reservation',
        'reservation_release',
        'reservation_fulfillment',
        'return_in',
        'damage_out',
        'expired_out',
        'correction'
      ),
      allowNull: false,
      field: 'movement_type',
    },
    direction: {
      type: DataTypes.ENUM('in', 'out', 'neutral'),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    quantityBefore: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'quantity_before',
    },
    quantityAfter: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'quantity_after',
    },
    referenceType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'reference_type',
    },
    referenceId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'reference_id',
    },
    reason: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    idempotencyKey: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'idempotency_key',
    },
    performedBy: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'performed_by',
    },
  },
  {
    sequelize,
    modelName: 'StockMovement',
    tableName: 'stock_movements',
    timestamps: true,
    updatedAt: false,
    underscored: true,
  }
);
