/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class SupportTicket extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare storeId: number;
  declare sellerId: number | null;
  declare customerId: number;
  declare orderId: number | null;
  declare invoiceId: number | null;
  declare shipmentId: number | null;
  declare ticketNumber: string;
  declare subject: string;
  declare priority: string;
  declare status: string;
  declare category: string | null;
  declare assignedTo: number | null;
  declare createdBy: number | null;
  declare aiConfidenceScore: number | null;
  declare aiResolved: boolean;
  declare slaDueAt: Date | null;
  declare satisfactionScore: number | null;
  declare csatFeedback: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

SupportTicket.init(
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
    sellerId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'seller_id',
    },
    customerId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'customer_id',
    },
    orderId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'order_id',
    },
    invoiceId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'invoice_id',
    },
    shipmentId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'shipment_id',
    },
    ticketNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'ticket_number',
    },
    subject: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    priority: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'medium',
    },
    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'open',
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    assignedTo: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'assigned_to',
    },
    createdBy: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      field: 'created_by',
    },
    aiConfidenceScore: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      field: 'ai_confidence_score',
    },
    aiResolved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'ai_resolved',
    },
    slaDueAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'sla_due_at',
    },
    satisfactionScore: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'satisfaction_score',
    },
    csatFeedback: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'csat_feedback',
    },
  },
  {
    sequelize,
    modelName: 'SupportTicket',
    tableName: 'support_tickets',
    timestamps: true,
    underscored: true,
  }
);
