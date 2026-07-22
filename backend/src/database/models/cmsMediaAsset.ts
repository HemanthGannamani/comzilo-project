/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class CmsMediaAsset extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare filename: string;
  declare fileUrl: string;
  declare mimeType: string | null;
  declare fileSize: number | null;
  declare altText: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

CmsMediaAsset.init(
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
    filename: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    fileUrl: {
      type: DataTypes.STRING(1024),
      allowNull: false,
      field: 'file_url',
    },
    mimeType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'mime_type',
    },
    fileSize: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'file_size',
    },
    altText: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'alt_text',
    },
  },
  {
    sequelize,
    modelName: 'CmsMediaAsset',
    tableName: 'cms_media_assets',
    timestamps: true,
    underscored: true,
  }
);
