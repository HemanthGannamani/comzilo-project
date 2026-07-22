/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class CmsSection extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare pageId: number;
  declare sectionType: string;
  declare sortOrder: number;
  declare settingsJson: any;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

CmsSection.init(
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
    pageId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'page_id',
    },
    sectionType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'section_type',
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'sort_order',
    },
    settingsJson: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'settings_json',
    },
  },
  {
    sequelize,
    modelName: 'CmsSection',
    tableName: 'cms_sections',
    timestamps: true,
    underscored: true,
  }
);
