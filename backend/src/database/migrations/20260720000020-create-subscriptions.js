'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'subscriptions',
      {
        id: {
          type: Sequelize.BIGINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        tenant_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false,
          references: {
            model: 'tenants',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        plan_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false,
          references: {
            model: 'plans',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',
        },
        status: {
          type: Sequelize.ENUM('trialing', 'active', 'past_due', 'cancelled', 'expired'),
          allowNull: false,
        },
        starts_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        trial_ends_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        current_period_start: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        current_period_end: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        cancelled_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        ends_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        billing_cycle: {
          type: Sequelize.ENUM('monthly', 'yearly'),
          allowNull: false,
        },
        amount: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        currency: {
          type: Sequelize.STRING(10),
          allowNull: false,
          defaultValue: 'INR',
        },
        provider: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        provider_subscription_id: {
          type: Sequelize.STRING(255),
          allowNull: true,
          unique: true,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        },
      },
      {
        engine: 'InnoDB',
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
      }
    );

    // Add indexes
    await queryInterface.addIndex('subscriptions', ['tenant_id'], {
      name: 'subscriptions_tenant_id_index',
    });
    await queryInterface.addIndex('subscriptions', ['status'], {
      name: 'subscriptions_status_index',
    });
    await queryInterface.addIndex('subscriptions', ['current_period_end'], {
      name: 'subscriptions_current_period_end_index',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('subscriptions');
  },
};
