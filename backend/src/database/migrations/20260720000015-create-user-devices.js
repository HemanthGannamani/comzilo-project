'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'user_devices',
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
        user_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        device_uuid: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        device_name: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        platform: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        browser: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        operating_system: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        last_user_agent: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        last_ip_address: {
          type: Sequelize.STRING(45),
          allowNull: true,
        },
        last_seen_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        trusted_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        revoked_at: {
          type: Sequelize.DATE,
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

    // Unique constraint on (user_id, device_uuid)
    await queryInterface.addIndex('user_devices', ['user_id', 'device_uuid'], {
      unique: true,
      name: 'user_devices_user_id_device_uuid_unique',
    });

    // Index for tenant isolation lookup
    await queryInterface.addIndex('user_devices', ['tenant_id'], {
      name: 'user_devices_tenant_id_index',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_devices');
  },
};
