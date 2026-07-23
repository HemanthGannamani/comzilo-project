import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class GoodsIssue extends Model {
  public id!: number;
  public tenantId!: number;
  public storeId?: number;
  public ginNumber!: string;
  public warehouseId!: number;
  public referenceOrder?: string;
  public reason!: string;
  public status!: 'issued' | 'pending' | 'cancelled';
  public issuedAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

GoodsIssue.init(
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
      allowNull: true,
      field: 'store_id',
    },
    ginNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'gin_number',
    },
    warehouseId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'warehouse_id',
    },
    referenceOrder: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'reference_order',
    },
    reason: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('issued', 'pending', 'cancelled'),
      allowNull: false,
      defaultValue: 'issued',
    },
    issuedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'issued_at',
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'goods_issues',
    timestamps: true,
    underscored: true,
  }
);
