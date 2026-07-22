import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface SettingsHistoryAttributes {
  id: number;
  uuid: string;
  tenantId: number | null;
  storeId: number | null;
  settingScope: 'global' | 'tenant' | 'store';
  settingKey: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  previousValue: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  newValue: any;
  changedBy: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type SettingsHistoryCreationAttributes = Optional<
  SettingsHistoryAttributes,
  'id' | 'uuid' | 'tenantId' | 'storeId' | 'previousValue' | 'newValue' | 'changedBy'
>;

export class SettingsHistory
  extends Model<SettingsHistoryAttributes, SettingsHistoryCreationAttributes>
  implements SettingsHistoryAttributes
{
  declare id: number;
  declare uuid: string;
  declare tenantId: number | null;
  declare storeId: number | null;
  declare settingScope: 'global' | 'tenant' | 'store';
  declare settingKey: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  declare previousValue: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  declare newValue: any;
  declare changedBy: number | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

SettingsHistory.init(
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
      allowNull: true,
      field: 'tenant_id',
    },
    storeId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'store_id',
    },
    settingScope: {
      type: DataTypes.ENUM('global', 'tenant', 'store'),
      allowNull: false,
      field: 'setting_scope',
    },
    settingKey: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'setting_key',
    },
    previousValue: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'previous_value',
    },
    newValue: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'new_value',
    },
    changedBy: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'changed_by',
    },
  },
  {
    sequelize,
    tableName: 'settings_histories',
    timestamps: true,
    underscored: true,
  }
);
