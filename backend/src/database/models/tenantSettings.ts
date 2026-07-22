import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface TenantSettingsAttributes {
  id: number;
  uuid: string;
  tenantId: number;
  settingKey: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  settingValue: any;
  category: string;
  isPublic: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export type TenantSettingsCreationAttributes = Optional<
  TenantSettingsAttributes,
  'id' | 'uuid' | 'category' | 'isPublic'
>;

export class TenantSettings
  extends Model<TenantSettingsAttributes, TenantSettingsCreationAttributes>
  implements TenantSettingsAttributes
{
  declare id: number;
  declare uuid: string;
  declare tenantId: number;
  declare settingKey: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  declare settingValue: any;
  declare category: string;
  declare isPublic: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

TenantSettings.init(
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
    settingKey: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'setting_key',
    },
    settingValue: {
      type: DataTypes.JSON,
      allowNull: false,
      field: 'setting_value',
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'general',
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_public',
    },
  },
  {
    sequelize,
    tableName: 'tenant_settings',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);
