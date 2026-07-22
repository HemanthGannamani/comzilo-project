import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface WebhookLogAttributes {
  id: number;
  uuid: string;
  tenantId: number;
  storeId: number | null;
  webhookEndpointId: number;
  eventType: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
  responseStatus: number | null;
  responseBody: string | null;
  executionTimeMs: number | null;
  attempts: number;
  status: 'pending' | 'delivered' | 'failed';
  error: string | null;
  nextRetryAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type WebhookLogCreationAttributes = Optional<
  WebhookLogAttributes,
  | 'id'
  | 'uuid'
  | 'storeId'
  | 'responseStatus'
  | 'responseBody'
  | 'executionTimeMs'
  | 'attempts'
  | 'status'
  | 'error'
  | 'nextRetryAt'
>;

export class WebhookLog
  extends Model<WebhookLogAttributes, WebhookLogCreationAttributes>
  implements WebhookLogAttributes
{
  declare id: number;
  declare uuid: string;
  declare tenantId: number;
  declare storeId: number | null;
  declare webhookEndpointId: number;
  declare eventType: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  declare payload: any;
  declare responseStatus: number | null;
  declare responseBody: string | null;
  declare executionTimeMs: number | null;
  declare attempts: number;
  declare status: 'pending' | 'delivered' | 'failed';
  declare error: string | null;
  declare nextRetryAt: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

WebhookLog.init(
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
    webhookEndpointId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'webhook_endpoint_id',
    },
    eventType: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'event_type',
    },
    payload: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    responseStatus: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'response_status',
    },
    responseBody: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'response_body',
    },
    executionTimeMs: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'execution_time_ms',
    },
    attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    status: {
      type: DataTypes.ENUM('pending', 'delivered', 'failed'),
      allowNull: false,
      defaultValue: 'pending',
    },
    error: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    nextRetryAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'next_retry_at',
    },
  },
  {
    sequelize,
    tableName: 'webhook_logs',
    timestamps: true,
    underscored: true,
  }
);
