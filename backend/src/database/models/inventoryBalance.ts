import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface InventoryBalanceAttributes {
  id: number;
  tenantId: number;
  storeId: number;
  warehouseId: number;
  warehouseLocationId: number;
  productId: number;
  quantityOnHand: number;
  quantityReserved: number;
  quantityAvailable: number;
  reorderPoint: number;
  reorderQuantity: number;
  safetyStock: number;
  lastMovementAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type InventoryBalanceCreationAttributes = Optional<
  InventoryBalanceAttributes,
  | 'id'
  | 'quantityOnHand'
  | 'quantityReserved'
  | 'quantityAvailable'
  | 'reorderPoint'
  | 'reorderQuantity'
  | 'safetyStock'
  | 'lastMovementAt'
>;

export class InventoryBalance
  extends Model<InventoryBalanceAttributes, InventoryBalanceCreationAttributes>
  implements InventoryBalanceAttributes
{
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare warehouseId: number;
  declare warehouseLocationId: number;
  declare productId: number;
  declare quantityOnHand: number;
  declare quantityReserved: number;
  declare quantityAvailable: number;
  declare reorderPoint: number;
  declare reorderQuantity: number;
  declare safetyStock: number;
  declare lastMovementAt: Date | null;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

InventoryBalance.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
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
    quantityOnHand: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
      field: 'quantity_on_hand',
    },
    quantityReserved: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
      field: 'quantity_reserved',
    },
    quantityAvailable: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
      field: 'quantity_available',
    },
    reorderPoint: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
      field: 'reorder_point',
    },
    reorderQuantity: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
      field: 'reorder_quantity',
    },
    safetyStock: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
      field: 'safety_stock',
    },
    lastMovementAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_movement_at',
    },
  },
  {
    sequelize,
    modelName: 'InventoryBalance',
    tableName: 'inventory_balances',
    timestamps: true,
    underscored: true,
  }
);
