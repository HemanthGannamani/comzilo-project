import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface SystemSettingsAttributes {
  id: number;
  uuid: string;
  settingKey: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  settingValue: any;
  category: string;
  isPublic: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export type SystemSettingsCreationAttributes = Optional<
  SystemSettingsAttributes,
  'id' | 'uuid' | 'category' | 'isPublic'
>;

export class SystemSettings
  extends Model<SystemSettingsAttributes, SystemSettingsCreationAttributes>
  implements SystemSettingsAttributes
{
  declare id: number;
  declare uuid: string;
  declare settingKey: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  declare settingValue: any;
  declare category: string;
  declare isPublic: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

SystemSettings.init(
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
    settingKey: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
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
      defaultValue: 'system',
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
    tableName: 'system_settings',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);
