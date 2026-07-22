'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'audit_logs',
      {
        id: {
          type: Sequelize.BIGINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        tenant_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: true,
          references: {
            model: 'tenants',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        user_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: true,
          references: {
            model: 'users',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        action: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        entity_type: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        entity_id: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        old_values: {
          type: Sequelize.JSON,
          allowNull: true,
        },
        new_values: {
          type: Sequelize.JSON,
          allowNull: true,
        },
        request_id: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        request_method: {
          type: Sequelize.STRING(10),
          allowNull: true,
        },
        request_path: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        response_status: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        ip_address: {
          type: Sequelize.STRING(45),
          allowNull: true,
        },
        user_agent: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      },
      {
        engine: 'InnoDB',
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
      }
    );

    // Add indexes
    await queryInterface.addIndex('audit_logs', ['tenant_id'], {
      name: 'audit_logs_tenant_id_index',
    });
    await queryInterface.addIndex('audit_logs', ['user_id'], {
      name: 'audit_logs_user_id_index',
    });
    await queryInterface.addIndex('audit_logs', ['entity_type', 'entity_id'], {
      name: 'audit_logs_entity_index',
    });
    await queryInterface.addIndex('audit_logs', ['request_id'], {
      name: 'audit_logs_request_id_index',
    });
    await queryInterface.addIndex('audit_logs', ['created_at'], {
      name: 'audit_logs_created_at_index',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('audit_logs');
  },
};
