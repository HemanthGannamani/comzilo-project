/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class LoginHistory extends Model<any, any> {
  declare id: number;
  declare tenantId: number | null;
  declare userId: number | null;
  declare emailAttempted: string;
  declare wasSuccessful: boolean;
  declare failureReason: string | null;
  declare ipAddress: string | null;
  declare userAgent: string | null;
  declare country: string | null;
  declare city: string | null;
  declare readonly createdAt: Date;
}

LoginHistory.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    tenantId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'tenant_id',
    },
    userId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'user_id',
    },
    emailAttempted: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'email_attempted',
    },
    wasSuccessful: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'was_successful',
    },
    failureReason: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'failure_reason',
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
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'login_history',
    underscored: true,
    timestamps: true,
    updatedAt: false, // only created_at is present
  }
);
