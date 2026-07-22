import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface NotificationQueueAttributes {
  id: number;
  uuid: string;
  tenantId: number;
  storeId: number | null;
  notificationId: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  attempts: number;
  maxAttempts: number;
  nextRetryAt: Date | null;
  failureReason: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type NotificationQueueCreationAttributes = Optional<
  NotificationQueueAttributes,
  | 'id'
  | 'uuid'
  | 'storeId'
  | 'status'
  | 'attempts'
  | 'maxAttempts'
  | 'nextRetryAt'
  | 'failureReason'
>;

export class NotificationQueue
  extends Model<NotificationQueueAttributes, NotificationQueueCreationAttributes>
  implements NotificationQueueAttributes
{
  declare id: number;
  declare uuid: string;
  declare tenantId: number;
  declare storeId: number | null;
  declare notificationId: number;
  declare status: 'pending' | 'processing' | 'completed' | 'failed';
  declare attempts: number;
  declare maxAttempts: number;
  declare nextRetryAt: Date | null;
  declare failureReason: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

NotificationQueue.init(
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
    notificationId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'notification_id',
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed'),
      allowNull: false,
      defaultValue: 'pending',
    },
    attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    maxAttempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3,
      field: 'max_attempts',
    },
    nextRetryAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'next_retry_at',
    },
    failureReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'failure_reason',
    },
  },
  {
    sequelize,
    tableName: 'notification_queues',
    timestamps: true,
    underscored: true,
  }
);
