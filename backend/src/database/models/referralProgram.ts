/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class ReferralProgram extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare customerId: number;
  declare referralCode: string;
  declare referrerReward: number;
  declare friendReward: number;
  declare referralsCount: number;
  declare status: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

ReferralProgram.init(
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
    referralCode: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'referral_code',
    },
    referrerReward: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 10.0,
      field: 'referrer_reward',
    },
    friendReward: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 10.0,
      field: 'friend_reward',
    },
    referralsCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'referrals_count',
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'active',
    },
  },
  {
    sequelize,
    modelName: 'ReferralProgram',
    tableName: 'referral_programs',
    timestamps: true,
    underscored: true,
  }
);
