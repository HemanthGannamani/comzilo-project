/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class StoreDomain extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare domain: string;
  declare domainType: 'subdomain' | 'custom';
  declare verificationStatus: 'pending' | 'verified' | 'failed';
  declare verificationTokenHash: string;
  declare verifiedAt: Date | null;
  declare isPrimary: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

StoreDomain.init(
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
    domain: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    domainType: {
      type: DataTypes.ENUM('subdomain', 'custom'),
      allowNull: false,
      field: 'domain_type',
    },
    verificationStatus: {
      type: DataTypes.ENUM('pending', 'verified', 'failed'),
      allowNull: false,
      defaultValue: 'pending',
      field: 'verification_status',
    },
    verificationTokenHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'verification_token_hash',
    },
    verifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'verified_at',
    },
    isPrimary: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_primary',
    },
  },
  {
    sequelize,
    tableName: 'store_domains',
    underscored: true,
    timestamps: true,
  }
);
