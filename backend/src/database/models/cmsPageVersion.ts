/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class CmsPageVersion extends Model<any, any> {
  declare id: number;
  declare pageId: number;
  declare versionNumber: number;
  declare sectionsJson: any;
  declare createdBy: number | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

CmsPageVersion.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    pageId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'page_id',
    },
    versionNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: 'version_number',
    },
    sectionsJson: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'sections_json',
    },
    createdBy: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'created_by',
    },
  },
  {
    sequelize,
    modelName: 'CmsPageVersion',
    tableName: 'cms_page_versions',
    timestamps: true,
    underscored: true,
  }
);
