/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class ProductVirtual extends Model<any, any> {
  declare id: number;
  declare productId: number;
  declare licenseKey: string | null;
  declare subscriptionDetails: any;
  declare meetingLink: string | null;
  declare serviceDuration: number | null;
  declare activationInstructions: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

ProductVirtual.init(
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
    licenseKey: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'license_key',
    },
    subscriptionDetails: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'subscription_details',
    },
    meetingLink: {
      type: DataTypes.STRING(1024),
      allowNull: true,
      field: 'meeting_link',
    },
    serviceDuration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'service_duration',
    },
    activationInstructions: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'activation_instructions',
    },
  },
  {
    sequelize,
    modelName: 'ProductVirtual',
    tableName: 'product_virtuals',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);
