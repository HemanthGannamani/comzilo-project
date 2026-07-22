'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'store_domains',
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
        domain: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: true,
        },
        domain_type: {
          type: Sequelize.ENUM('subdomain', 'custom'),
          allowNull: false,
        },
        verification_status: {
          type: Sequelize.ENUM('pending', 'verified', 'failed'),
          allowNull: false,
          defaultValue: 'pending',
        },
        verification_token_hash: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        verified_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        is_primary: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
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

    // Add indexes for lookups
    await queryInterface.addIndex('store_domains', ['tenant_id'], {
      name: 'store_domains_tenant_id_index',
    });
    await queryInterface.addIndex('store_domains', ['store_id'], {
      name: 'store_domains_store_id_index',
    });
    await queryInterface.addIndex('store_domains', ['verification_status'], {
      name: 'store_domains_verification_status_index',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('store_domains');
  },
};
