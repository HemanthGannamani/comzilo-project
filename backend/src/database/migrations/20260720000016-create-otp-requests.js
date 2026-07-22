'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'otp_requests',
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
          onDelete: 'CASCADE',
        },
        user_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: true,
          references: {
            model: 'users',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        purpose: {
          type: Sequelize.ENUM(
            'email_verification',
            'mobile_verification',
            'login',
            'password_reset'
          ),
          allowNull: false,
        },
        destination: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        otp_hash: {
          type: Sequelize.STRING(64),
          allowNull: false,
        },
        attempts: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        max_attempts: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 5,
        },
        expires_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        consumed_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        ip_address: {
          type: Sequelize.STRING(45),
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

    // Add indexes
    await queryInterface.addIndex('otp_requests', ['destination'], {
      name: 'otp_requests_destination_index',
    });
    await queryInterface.addIndex('otp_requests', ['expires_at'], {
      name: 'otp_requests_expires_at_index',
    });
    await queryInterface.addIndex('otp_requests', ['purpose'], {
      name: 'otp_requests_purpose_index',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('otp_requests');
  },
};
