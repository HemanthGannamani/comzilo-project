/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class SupportKnowledgeBase extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare title: string;
  declare category: string;
  declare content: string;
  declare tags: string | null;
  declare isPublished: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

SupportKnowledgeBase.init(
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
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'General',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tags: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_published',
    },
  },
  {
    sequelize,
    modelName: 'SupportKnowledgeBase',
    tableName: 'support_knowledge_base',
    timestamps: true,
    underscored: true,
  }
);
