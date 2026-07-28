/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class SupportAuditLog extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare ticketId: number;
  declare actorType: 'customer' | 'ai_assistant' | 'seller_staff' | 'system';
  declare actorId: number | null;
  declare action: string;
  declare details: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

SupportAuditLog.init(
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
    ticketId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'ticket_id',
    },
    actorType: {
      type: DataTypes.STRING(30),
      allowNull: false,
      field: 'actor_type',
    },
    actorId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'actor_id',
    },
    action: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'SupportAuditLog',
    tableName: 'support_audit_logs',
    timestamps: true,
    underscored: true,
  }
);
