'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'users',
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
          onDelete: 'RESTRICT',
        },
        uuid: {
          type: Sequelize.CHAR(36),
          allowNull: false,
          unique: true,
        },
        email: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        password_hash: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        first_name: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        last_name: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        mobile: {
          type: Sequelize.STRING(50),
          allowNull: true,
        },
        email_verified_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        mobile_verified_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        last_login_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        status: {
          type: Sequelize.ENUM('invited', 'active', 'suspended', 'locked', 'disabled'),
          allowNull: false,
          defaultValue: 'active',
        },
        failed_login_attempts: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        locked_until: {
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
        deleted_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
      },
      {
        engine: 'InnoDB',
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
      }
    );

    // Add unique composite constraint on tenant_id + email
    await queryInterface.addIndex('users', ['tenant_id', 'email'], {
      unique: true,
      name: 'users_tenant_id_email_unique',
    });

    // Add index on uuid
    await queryInterface.addIndex('users', ['uuid'], {
      unique: true,
      name: 'users_uuid_unique',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  },
};
