'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Ensure clean state: drop existing table if it exists
await queryInterface.dropTable('onboarding_steps').catch(() => {});
await queryInterface.createTable(
      'onboarding_steps',
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
        store_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false,
          references: {
            model: 'stores',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        step_code: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        status: {
          type: Sequelize.ENUM('pending', 'in_progress', 'completed', 'skipped'),
          allowNull: false,
          defaultValue: 'pending',
        },
        completed_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        skipped_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        metadata: {
          type: Sequelize.JSON,
          allowNull: true,
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

    // Unique index on store_id + step_code
    await queryInterface.addIndex('onboarding_steps', ['store_id', 'step_code'], {
      unique: true,
      name: 'onboarding_steps_store_id_step_code_unique',
    });

    // Index for tenant isolation lookup
    await queryInterface.addIndex('onboarding_steps', ['tenant_id'], {
      name: 'onboarding_steps_tenant_id_index',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('onboarding_steps');
  },
};
