/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class ProductPodTemplate extends Model<any, any> {
  declare id: number;
  declare productId: number;
  declare canvasSize: string | null;
  declare layersJson: any;
  declare mockupPreviewUrl: string | null;
  declare printArea: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

ProductPodTemplate.init(
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
    canvasSize: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'canvas_size',
    },
    layersJson: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'layers_json',
    },
    mockupPreviewUrl: {
      type: DataTypes.STRING(1024),
      allowNull: true,
      field: 'mockup_preview_url',
    },
    printArea: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'print_area',
    },
  },
  {
    sequelize,
    modelName: 'ProductPodTemplate',
    tableName: 'product_pod_templates',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);
