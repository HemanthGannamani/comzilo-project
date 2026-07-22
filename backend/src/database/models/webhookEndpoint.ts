import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface WebhookEndpointAttributes {
  id: number;
  uuid: string;
  tenantId: number;
  storeId: number | null;
  name: string;
  targetUrl: string;
  secret: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  events: any;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export type WebhookEndpointCreationAttributes = Optional<
  WebhookEndpointAttributes,
  'id' | 'uuid' | 'storeId' | 'isActive'
>;

export class WebhookEndpoint
  extends Model<WebhookEndpointAttributes, WebhookEndpointCreationAttributes>
  implements WebhookEndpointAttributes
{
  declare id: number;
  declare uuid: string;
  declare tenantId: number;
  declare storeId: number | null;
  declare name: string;
  declare targetUrl: string;
  declare secret: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  declare events: any;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

WebhookEndpoint.init(
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
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    targetUrl: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      field: 'target_url',
    },
    secret: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    events: {
      type: DataTypes.JSON,
      allowNull: false,
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
    tableName: 'webhook_endpoints',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);
