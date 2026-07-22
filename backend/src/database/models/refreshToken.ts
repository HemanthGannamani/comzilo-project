/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class RefreshToken extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare userId: number;
  declare tokenHash: string;
  declare familyId: string;
  declare rotatedFrom: number | null;
  declare expiresAt: Date;
  declare revokedAt: Date | null;
  declare revokeReason: string | null;
  declare ipAddress: string | null;
  declare userAgent: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

RefreshToken.init(
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
    tokenHash: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
      field: 'token_hash',
    },
    familyId: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'family_id',
    },
    rotatedFrom: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'rotated_from',
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'expires_at',
    },
    revokedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'revoked_at',
    },
    revokeReason: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'revoke_reason',
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: true,
      field: 'ip_address',
    },
    userAgent: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'user_agent',
    },
  },
  {
    sequelize,
    tableName: 'refresh_tokens',
    underscored: true,
    timestamps: true,
  }
);
