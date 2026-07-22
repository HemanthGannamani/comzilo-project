/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class CmsFormSubmission extends Model<any, any> {
  declare id: number;
  declare formId: number;
  declare submissionData: any;
  declare submittedAt: Date;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

CmsFormSubmission.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    formId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'form_id',
    },
    submissionData: {
      type: DataTypes.JSON,
      allowNull: false,
      field: 'submission_data',
    },
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'submitted_at',
    },
  },
  {
    sequelize,
    modelName: 'CmsFormSubmission',
    tableName: 'cms_form_submissions',
    timestamps: true,
    underscored: true,
  }
);
