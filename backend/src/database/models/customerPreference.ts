import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface CustomerPreferenceAttributes {
  id: number;
  customerId: number;
  tenantId: number;
  storeId: number;
  emailNotifications: boolean;
  smsNotifications: boolean;
  whatsappNotifications: boolean;
  marketingEmails: boolean;
  marketingSms: boolean;
  preferredLanguage: string;
  preferredCurrency: string;
  preferredTimezone: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CustomerPreferenceCreationAttributes = Optional<
  CustomerPreferenceAttributes,
  | 'id'
  | 'emailNotifications'
  | 'smsNotifications'
  | 'whatsappNotifications'
  | 'marketingEmails'
  | 'marketingSms'
  | 'preferredLanguage'
  | 'preferredCurrency'
  | 'preferredTimezone'
>;

export class CustomerPreference
  extends Model<CustomerPreferenceAttributes, CustomerPreferenceCreationAttributes>
  implements CustomerPreferenceAttributes
{
  declare id: number;
  declare customerId: number;
  declare tenantId: number;
  declare storeId: number;
  declare emailNotifications: boolean;
  declare smsNotifications: boolean;
  declare whatsappNotifications: boolean;
  declare marketingEmails: boolean;
  declare marketingSms: boolean;
  declare preferredLanguage: string;
  declare preferredCurrency: string;
  declare preferredTimezone: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

CustomerPreference.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    customerId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'customer_id',
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
    emailNotifications: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'email_notifications',
    },
    smsNotifications: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'sms_notifications',
    },
    whatsappNotifications: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'whatsapp_notifications',
    },
    marketingEmails: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'marketing_emails',
    },
    marketingSms: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'marketing_sms',
    },
    preferredLanguage: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'en',
      field: 'preferred_language',
    },
    preferredCurrency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'USD',
      field: 'preferred_currency',
    },
    preferredTimezone: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'UTC',
      field: 'preferred_timezone',
    },
  },
  {
    sequelize,
    modelName: 'CustomerPreference',
    tableName: 'customer_preferences',
    timestamps: true,
    underscored: true,
  }
);
