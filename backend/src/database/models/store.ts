/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class Store extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare name: string;
  declare slug: string;
  declare legalName: string | null;
  declare email: string | null;
  declare mobile: string | null;
  declare currency: string;
  declare timezone: string;
  declare language: string;
  declare logoUrl: string | null;
  declare faviconUrl: string | null;
  declare status: 'active' | 'suspended';
  declare onboardingCompletedAt: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

Store.init(
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
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    legalName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'legal_name',
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    mobile: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'INR',
    },
    timezone: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'UTC',
    },
    language: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'en',
    },
    logoUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'logo_url',
    },
    faviconUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'favicon_url',
    },
    status: {
      type: DataTypes.ENUM('active', 'suspended'),
      allowNull: false,
      defaultValue: 'active',
    },
    onboardingCompletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'onboarding_completed_at',
    },
  },
  {
    sequelize,
    tableName: 'stores',
    underscored: true,
    timestamps: true,
    paranoid: true,
  }
);
