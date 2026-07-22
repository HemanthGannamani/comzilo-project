'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'stores',
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
        name: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        slug: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        legal_name: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        email: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        mobile: {
          type: Sequelize.STRING(50),
          allowNull: true,
        },
        currency: {
          type: Sequelize.STRING(10),
          allowNull: false,
          defaultValue: 'INR',
        },
        timezone: {
          type: Sequelize.STRING(100),
          allowNull: false,
          defaultValue: 'UTC',
        },
        language: {
          type: Sequelize.STRING(10),
          allowNull: false,
          defaultValue: 'en',
        },
        logo_url: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        favicon_url: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        status: {
          type: Sequelize.ENUM('active', 'suspended'),
          allowNull: false,
          defaultValue: 'active',
        },
        onboarding_completed_at: {
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

    // Add unique composite constraint on tenant_id + slug
    await queryInterface.addIndex('stores', ['tenant_id', 'slug'], {
      unique: true,
      name: 'stores_tenant_id_slug_unique',
    });

    // Add index on status
    await queryInterface.addIndex('stores', ['tenant_id', 'status'], {
      name: 'stores_tenant_id_status_index',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('stores');
  },
};
