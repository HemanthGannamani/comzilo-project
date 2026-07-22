/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';
import bcrypt from 'bcrypt';

export class OtpRequest extends Model<any, any> {
  declare id: number;
  declare tenantId: number | null;
  declare userId: number | null;
  declare purpose: 'email_verification' | 'mobile_verification' | 'login' | 'password_reset';
  declare destination: string;
  declare otpHash: string;
  declare attempts: number;
  declare maxAttempts: number;
  declare expiresAt: Date;
  declare consumedAt: Date | null;
  declare ipAddress: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  public async compareOtp(otp: string): Promise<boolean> {
    return bcrypt.compare(otp, this.otpHash);
  }
}

OtpRequest.init(
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
    purpose: {
      type: DataTypes.ENUM('email_verification', 'mobile_verification', 'login', 'password_reset'),
      allowNull: false,
    },
    destination: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    otpHash: {
      type: DataTypes.STRING(64),
      allowNull: false,
      field: 'otp_hash',
    },
    attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    maxAttempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
      field: 'max_attempts',
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'expires_at',
    },
    consumedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'consumed_at',
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: true,
      field: 'ip_address',
    },
  },
  {
    sequelize,
    tableName: 'otp_requests',
    underscored: true,
    timestamps: true,
  }
);
