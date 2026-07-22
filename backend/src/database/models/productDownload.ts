/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class ProductDownload extends Model<any, any> {
  declare id: number;
  declare productId: number;
  declare url: string;
  declare filename: string;
  declare fileSize: string | null;
  declare version: string | null;
  declare downloadLimit: number | null;
  declare expiryDate: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

ProductDownload.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    productId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'product_id',
    },
    url: {
      type: DataTypes.STRING(1024),
      allowNull: false,
    },
    filename: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    fileSize: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'file_size',
    },
    version: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    downloadLimit: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'download_limit',
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'expiry_date',
    },
  },
  {
    sequelize,
    modelName: 'ProductDownload',
    tableName: 'product_downloads',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);
