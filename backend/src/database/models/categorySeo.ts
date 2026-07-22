/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class CategorySeo extends Model<any, any> {
  declare id: number;
  declare categoryId: number;
  declare metaTitle: string | null;
  declare metaDescription: string | null;
  declare metaKeywords: string | null;
  declare ogImage: string | null;
  declare canonicalUrl: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

CategorySeo.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'category_id',
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
    modelName: 'CategorySeo',
    tableName: 'category_seo',
    timestamps: true,
    underscored: true,
  }
);
