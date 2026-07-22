/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class UserDevice extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare userId: number;
  declare deviceUuid: string;
  declare deviceName: string | null;
  declare platform: string | null;
  declare browser: string | null;
  declare operatingSystem: string | null;
  declare lastUserAgent: string | null;
  declare lastIpAddress: string | null;
  declare lastSeenAt: Date;
  declare trustedAt: Date | null;
  declare revokedAt: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

UserDevice.init(
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
    userId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'user_id',
    },
    deviceUuid: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'device_uuid',
    },
    deviceName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'device_name',
    },
    platform: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    browser: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    operatingSystem: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'operating_system',
    },
    lastUserAgent: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'last_user_agent',
    },
    lastIpAddress: {
      type: DataTypes.STRING(45),
      allowNull: true,
      field: 'last_ip_address',
    },
    lastSeenAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'last_seen_at',
    },
    trustedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'trusted_at',
    },
    revokedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'revoked_at',
    },
  },
  {
    sequelize,
    tableName: 'user_devices',
    underscored: true,
    timestamps: true,
  }
);
