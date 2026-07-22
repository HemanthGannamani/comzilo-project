/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class InventoryBatch extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare warehouseId: number;
  declare batchNumber: string;
  declare lotNumber: string | null;
  declare mfgDate: string | null;
  declare expiryDate: string | null;
  declare status: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

InventoryBatch.init(
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
    batchNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'batch_number',
    },
    lotNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'lot_number',
    },
    mfgDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'mfg_date',
    },
    expiryDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'expiry_date',
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'active',
    },
  },
  {
    sequelize,
    modelName: 'InventoryBatch',
    tableName: 'inventory_batches',
    timestamps: true,
    underscored: true,
  }
);
