/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class SellerApplication extends Model<any, any> {
  declare id: number;
  declare applicationNumber: string;
  declare businessName: string;
  declare ownerName: string;
  declare email: string;
  declare phone: string;
  declare businessType: string;
  declare gstNumber: string | null;
  declare panNumber: string | null;
  declare addressLine1: string;
  declare addressLine2: string | null;
  declare city: string;
  declare state: string;
  declare country: string;
  declare postalCode: string;
  declare preferredStoreName: string;
  declare passwordHash: string;
  declare logoPath: string | null;
  declare licensePath: string | null;
  declare gstCertificatePath: string | null;
  declare identityProofPath: string | null;
  declare status: 'Pending' | 'Approved' | 'Rejected';
  declare reviewNotes: string | null;
  declare submittedAt: Date;
  declare reviewedAt: Date | null;
  declare reviewedBy: number | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

SellerApplication.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    applicationNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      field: 'application_number',
    },
    businessName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'business_name',
    },
    ownerName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'owner_name',
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      field: 'email',
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'phone',
    },
    businessType: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'business_type',
    },
    gstNumber: {
      type: DataTypes.STRING(15),
      allowNull: true,
      field: 'gst_number',
    },
    panNumber: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'pan_number',
    },
    addressLine1: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'address_line1',
    },
    addressLine2: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'address_line2',
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'city',
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'state',
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'country',
    },
    postalCode: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'postal_code',
    },
    preferredStoreName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'preferred_store_name',
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'password_hash',
    },
    logoPath: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'logo_path',
    },
    licensePath: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'license_path',
    },
    gstCertificatePath: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'gst_certificate_path',
    },
    identityProofPath: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'identity_proof_path',
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
      allowNull: false,
      defaultValue: 'Pending',
      field: 'status',
    },
    reviewNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'review_notes',
    },
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'submitted_at',
    },
    reviewedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'reviewed_at',
    },
    reviewedBy: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'reviewed_by',
    },
  },
  {
    sequelize,
    tableName: 'seller_applications',
    underscored: true,
    timestamps: true,
  }
);
