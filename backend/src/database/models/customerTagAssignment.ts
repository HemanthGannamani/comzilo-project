import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export interface CustomerTagAssignmentAttributes {
  customerId: number;
  tagId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class CustomerTagAssignment
  extends Model<CustomerTagAssignmentAttributes>
  implements CustomerTagAssignmentAttributes
{
  declare customerId: number;
  declare tagId: number;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

CustomerTagAssignment.init(
  {
    customerId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: 'customer_id',
    },
    tagId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: 'tag_id',
    },
  },
  {
    sequelize,
    modelName: 'CustomerTagAssignment',
    tableName: 'customer_tag_assignments',
    timestamps: true,
    underscored: true,
  }
);
