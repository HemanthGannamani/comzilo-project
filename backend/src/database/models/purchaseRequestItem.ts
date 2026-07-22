/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class PurchaseRequestItem extends Model<any, any> {
  declare id: number;
  declare requestId: number;
  declare productId: number;
  declare quantityRequested: number;
  declare estimatedUnitCost: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

PurchaseRequestItem.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    requestId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'request_id',
    },
    productId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'product_id',
    },
    quantityRequested: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: 'quantity_requested',
    },
    estimatedUnitCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'estimated_unit_cost',
    },
  },
  {
    sequelize,
    modelName: 'PurchaseRequestItem',
    tableName: 'purchase_request_items',
    timestamps: true,
    underscored: true,
  }
);
