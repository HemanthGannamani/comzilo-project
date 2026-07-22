import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface StockReservationItemAttributes {
  id: number;
  tenantId: number;
  storeId: number;
  reservationId: number;
  warehouseId: number;
  warehouseLocationId: number;
  productId: number;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type StockReservationItemCreationAttributes = Optional<StockReservationItemAttributes, 'id'>;

export class StockReservationItem
  extends Model<StockReservationItemAttributes, StockReservationItemCreationAttributes>
  implements StockReservationItemAttributes
{
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare reservationId: number;
  declare warehouseId: number;
  declare warehouseLocationId: number;
  declare productId: number;
  declare quantity: number;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

StockReservationItem.init(
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
    reservationId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'reservation_id',
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
    quantity: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'StockReservationItem',
    tableName: 'stock_reservation_items',
    timestamps: true,
    underscored: true,
  }
);
