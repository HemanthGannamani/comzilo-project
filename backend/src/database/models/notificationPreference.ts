import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface NotificationPreferenceAttributes {
  id: number;
  uuid: string;
  tenantId: number;
  userId: number;
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  whatsappEnabled: boolean;
  orderNotifications: boolean;
  paymentNotifications: boolean;
  inventoryAlerts: boolean;
  systemAlerts: boolean;
  marketingNotifications: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export type NotificationPreferenceCreationAttributes = Optional<
  NotificationPreferenceAttributes,
  | 'id'
  | 'uuid'
  | 'emailEnabled'
  | 'smsEnabled'
  | 'pushEnabled'
  | 'whatsappEnabled'
  | 'orderNotifications'
  | 'paymentNotifications'
  | 'inventoryAlerts'
  | 'systemAlerts'
  | 'marketingNotifications'
>;

export class NotificationPreference
  extends Model<NotificationPreferenceAttributes, NotificationPreferenceCreationAttributes>
  implements NotificationPreferenceAttributes
{
  declare id: number;
  declare uuid: string;
  declare tenantId: number;
  declare userId: number;
  declare emailEnabled: boolean;
  declare smsEnabled: boolean;
  declare pushEnabled: boolean;
  declare whatsappEnabled: boolean;
  declare orderNotifications: boolean;
  declare paymentNotifications: boolean;
  declare inventoryAlerts: boolean;
  declare systemAlerts: boolean;
  declare marketingNotifications: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

NotificationPreference.init(
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
    userId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'user_id',
    },
    emailEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'email_enabled',
    },
    smsEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'sms_enabled',
    },
    pushEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'push_enabled',
    },
    whatsappEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'whatsapp_enabled',
    },
    orderNotifications: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'order_notifications',
    },
    paymentNotifications: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'payment_notifications',
    },
    inventoryAlerts: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'inventory_alerts',
    },
    systemAlerts: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'system_alerts',
    },
    marketingNotifications: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'marketing_notifications',
    },
  },
  {
    sequelize,
    tableName: 'notification_preferences',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);
