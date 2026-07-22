/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class CmsTheme extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare name: string;
  declare code: string;
  declare isActive: boolean;
  declare themeSettings: any;
  declare customCss: string | null;
  declare customJs: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

CmsTheme.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
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
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_active',
    },
    themeSettings: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'theme_settings',
    },
    customCss: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'custom_css',
    },
    customJs: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'custom_js',
    },
  },
  {
    sequelize,
    modelName: 'CmsTheme',
    tableName: 'cms_themes',
    timestamps: true,
    underscored: true,
  }
);
