'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'products',
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
          references: { model: 'tenants', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        store_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false,
          references: { model: 'stores', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        name: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        slug: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        sku: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        short_description: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        description: {
          type: Sequelize.TEXT('long'),
          allowNull: true,
        },
        status: {
          type: Sequelize.ENUM('draft', 'active', 'archived', 'deleted'),
          allowNull: false,
          defaultValue: 'draft',
        },
        visibility: {
          type: Sequelize.ENUM('public', 'private', 'hidden'),
          allowNull: false,
          defaultValue: 'public',
        },
        brand: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        category: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        price: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: 0.0,
        },
        compare_price: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: true,
        },
        cost: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: true,
        },
        weight: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: true,
        },
        dimensions: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        barcode: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        tax_class: {
          type: Sequelize.STRING(50),
          allowNull: true,
        },
        seo_title: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        seo_description: {
          type: Sequelize.STRING(500),
          allowNull: true,
        },
        seo_keywords: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        canonical_url: {
          type: Sequelize.STRING(2048),
          allowNull: true,
        },
        created_by: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: true,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        updated_by: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: true,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
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

    await queryInterface.addIndex('products', ['store_id', 'slug'], {
      unique: true,
      name: 'products_store_id_slug_unique',
    });

    await queryInterface.addIndex('products', ['store_id', 'sku'], {
      unique: true,
      name: 'products_store_id_sku_unique',
    });

    await queryInterface.addIndex('products', ['store_id', 'name']);
    await queryInterface.addIndex('products', ['store_id', 'barcode']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  },
};
