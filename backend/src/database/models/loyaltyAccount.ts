/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class LoyaltyAccount extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare customerId: number;
  declare pointsBalance: number;
  declare tierLevel: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

LoyaltyAccount.init(
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
    customerId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'customer_id',
    },
    pointsBalance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'points_balance',
    },
    tierLevel: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'bronze',
      field: 'tier_level',
    },
  },
  {
    sequelize,
    modelName: 'LoyaltyAccount',
    tableName: 'loyalty_accounts',
    timestamps: true,
    underscored: true,
  }
);
