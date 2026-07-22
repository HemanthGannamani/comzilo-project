/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class CmsBlogPost extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare title: string;
  declare slug: string;
  declare content: string;
  declare featuredImage: string | null;
  declare status: string;
  declare publishedAt: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

CmsBlogPost.init(
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
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    featuredImage: {
      type: DataTypes.STRING(1024),
      allowNull: true,
      field: 'featured_image',
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'draft',
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'published_at',
    },
  },
  {
    sequelize,
    modelName: 'CmsBlogPost',
    tableName: 'cms_blog_posts',
    timestamps: true,
    underscored: true,
  }
);
