/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class Subscription extends Model<any, any> {
  declare id: number;
  declare tenantId: number;
  declare planId: number;
  declare status: 'trialing' | 'active' | 'past_due' | 'cancelled' | 'expired';
  declare startsAt: Date;
  declare trialEndsAt: Date | null;
  declare currentPeriodStart: Date;
  declare currentPeriodEnd: Date;
  declare cancelledAt: Date | null;
  declare endsAt: Date;
  declare billingCycle: 'monthly' | 'yearly';
  declare amount: number;
  declare currency: string;
  declare provider: string;
  declare providerSubscriptionId: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Subscription.init(
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
    planId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: 'plan_id',
    },
    status: {
      type: DataTypes.ENUM('trialing', 'active', 'past_due', 'cancelled', 'expired'),
      allowNull: false,
    },
    startsAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'starts_at',
    },
    trialEndsAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'trial_ends_at',
    },
    currentPeriodStart: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'current_period_start',
    },
    currentPeriodEnd: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'current_period_end',
    },
    cancelledAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'cancelled_at',
    },
    endsAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'ends_at',
    },
    billingCycle: {
      type: DataTypes.ENUM('monthly', 'yearly'),
      allowNull: false,
      field: 'billing_cycle',
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'INR',
    },
    provider: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    providerSubscriptionId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
      field: 'provider_subscription_id',
    },
  },
  {
    sequelize,
    tableName: 'subscriptions',
    underscored: true,
    timestamps: true,
  }
);
