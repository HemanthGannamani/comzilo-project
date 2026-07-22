/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class CmsNavigationMenu extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare name: string;
  declare location: string;
  declare isMegaMenu: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

CmsNavigationMenu.init(
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
    location: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'header',
    },
    isMegaMenu: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_mega_menu',
    },
  },
  {
    sequelize,
    modelName: 'CmsNavigationMenu',
    tableName: 'cms_navigation_menus',
    timestamps: true,
    underscored: true,
  }
);
