/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class BrandSeo extends Model<any, any> {
  declare id: number;
  declare brandId: number;
  declare metaTitle: string | null;
  declare metaDescription: string | null;
  declare metaKeywords: string | null;
  declare ogImage: string | null;
  declare canonicalUrl: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

BrandSeo.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    brandId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'brand_id',
    },
    metaTitle: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'meta_title',
    },
    metaDescription: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'meta_description',
    },
    metaKeywords: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'meta_keywords',
    },
    ogImage: {
      type: DataTypes.STRING(1024),
      allowNull: true,
      field: 'og_image',
    },
    canonicalUrl: {
      type: DataTypes.STRING(2048),
      allowNull: true,
      field: 'canonical_url',
    },
  },
  {
    sequelize,
    modelName: 'BrandSeo',
    tableName: 'brand_seo',
    timestamps: true,
    underscored: true,
  }
);
