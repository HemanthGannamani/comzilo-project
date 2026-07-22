import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface NotificationTemplateAttributes {
  id: number;
  uuid: string;
  tenantId: number;
  storeId: number | null;
  code: string;
  name: string;
  channel: 'email' | 'sms' | 'push' | 'in_app' | 'whatsapp';
  subject: string | null;
  body: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variables: any;
  version: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export type NotificationTemplateCreationAttributes = Optional<
  NotificationTemplateAttributes,
  'id' | 'uuid' | 'storeId' | 'subject' | 'variables' | 'version' | 'isActive'
>;

export class NotificationTemplate
  extends Model<NotificationTemplateAttributes, NotificationTemplateCreationAttributes>
  implements NotificationTemplateAttributes
{
  declare id: number;
  declare uuid: string;
  declare tenantId: number;
  declare storeId: number | null;
  declare code: string;
  declare name: string;
  declare channel: 'email' | 'sms' | 'push' | 'in_app' | 'whatsapp';
  declare subject: string | null;
  declare body: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  declare variables: any;
  declare version: number;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

NotificationTemplate.init(
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
    code: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    channel: {
      type: DataTypes.ENUM('email', 'sms', 'push', 'in_app', 'whatsapp'),
      allowNull: false,
      defaultValue: 'email',
    },
    subject: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    variables: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active',
    },
  },
  {
    sequelize,
    tableName: 'notification_templates',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);
