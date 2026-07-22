/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class PurchaseRequest extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare requestNumber: string;
  declare department: string;
  declare status: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

PurchaseRequest.init(
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
    requestNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'request_number',
    },
    department: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'Inventory',
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'submitted',
    },
  },
  {
    sequelize,
    modelName: 'PurchaseRequest',
    tableName: 'purchase_requests',
    timestamps: true,
    underscored: true,
  }
);
