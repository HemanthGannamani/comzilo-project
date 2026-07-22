/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class CmsPage extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare title: string;
  declare slug: string;
  declare template: string;
  declare isHomepage: boolean;
  declare status: string;
  declare publishedAt: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

CmsPage.init(
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
    template: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'default',
    },
    isHomepage: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_homepage',
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
    modelName: 'CmsPage',
    tableName: 'cms_pages',
    timestamps: true,
    underscored: true,
  }
);
