import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface NotificationAttributes {
  id: number;
  uuid: string;
  tenantId: number;
  storeId: number | null;
  userId: number | null;
  recipient: string;
  channel: 'email' | 'sms' | 'push' | 'in_app' | 'whatsapp';
  status: 'pending' | 'processing' | 'sent' | 'failed' | 'read';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  templateId: number | null;
  title: string | null;
  content: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response: any;
  error: string | null;
  scheduledAt: Date | null;
  sentAt: Date | null;
  readAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export type NotificationCreationAttributes = Optional<
  NotificationAttributes,
  | 'id'
  | 'uuid'
  | 'storeId'
  | 'userId'
  | 'status'
  | 'priority'
  | 'templateId'
  | 'title'
  | 'payload'
  | 'response'
  | 'error'
  | 'scheduledAt'
  | 'sentAt'
  | 'readAt'
>;

export class Notification
  extends Model<NotificationAttributes, NotificationCreationAttributes>
  implements NotificationAttributes
{
  declare id: number;
  declare uuid: string;
  declare tenantId: number;
  declare storeId: number | null;
  declare userId: number | null;
  declare recipient: string;
  declare channel: 'email' | 'sms' | 'push' | 'in_app' | 'whatsapp';
  declare status: 'pending' | 'processing' | 'sent' | 'failed' | 'read';
  declare priority: 'low' | 'normal' | 'high' | 'urgent';
  declare templateId: number | null;
  declare title: string | null;
  declare content: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  declare payload: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  declare response: any;
  declare error: string | null;
  declare scheduledAt: Date | null;
  declare sentAt: Date | null;
  declare readAt: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

Notification.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
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
    userId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'user_id',
    },
    recipient: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    channel: {
      type: DataTypes.ENUM('email', 'sms', 'push', 'in_app', 'whatsapp'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'sent', 'failed', 'read'),
      allowNull: false,
      defaultValue: 'pending',
    },
    priority: {
      type: DataTypes.ENUM('low', 'normal', 'high', 'urgent'),
      allowNull: false,
      defaultValue: 'normal',
    },
    templateId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'template_id',
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    payload: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    response: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    error: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    scheduledAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'scheduled_at',
    },
    sentAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'sent_at',
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'read_at',
    },
  },
  {
    sequelize,
    tableName: 'notifications',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);
