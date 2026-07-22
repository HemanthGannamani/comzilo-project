import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface StockTransferItemAttributes {
  id: number;
  tenantId: number;
  storeId: number;
  stockTransferId: number;
  productId: number;
  sourceLocationId: number;
  destinationLocationId: number;
  requestedQuantity: number;
  shippedQuantity: number;
  receivedQuantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type StockTransferItemCreationAttributes = Optional<
  StockTransferItemAttributes,
  'id' | 'shippedQuantity' | 'receivedQuantity'
>;

export class StockTransferItem
  extends Model<StockTransferItemAttributes, StockTransferItemCreationAttributes>
  implements StockTransferItemAttributes
{
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare stockTransferId: number;
  declare productId: number;
  declare sourceLocationId: number;
  declare destinationLocationId: number;
  declare requestedQuantity: number;
  declare shippedQuantity: number;
  declare receivedQuantity: number;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

StockTransferItem.init(
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
    stockTransferId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'stock_transfer_id',
    },
    productId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'product_id',
    },
    sourceLocationId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'source_location_id',
    },
    destinationLocationId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'destination_location_id',
    },
    requestedQuantity: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'requested_quantity',
    },
    shippedQuantity: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
      field: 'shipped_quantity',
    },
    receivedQuantity: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
      field: 'received_quantity',
    },
  },
  {
    sequelize,
    modelName: 'StockTransferItem',
    tableName: 'stock_transfer_items',
    timestamps: true,
    underscored: true,
  }
);
