import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

export interface CustomerTagAttributes {
  id: number;
  tenantId: number;
  storeId: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CustomerTagCreationAttributes = Optional<CustomerTagAttributes, 'id'>;

export class CustomerTag
  extends Model<CustomerTagAttributes, CustomerTagCreationAttributes>
  implements CustomerTagAttributes
{
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare name: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

CustomerTag.init(
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
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'CustomerTag',
    tableName: 'customer_tags',
    timestamps: true,
    underscored: true,
  }
);
