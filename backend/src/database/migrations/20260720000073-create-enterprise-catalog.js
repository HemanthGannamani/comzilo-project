'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Create category_seo table
    await queryInterface.createTable('category_seo', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      category_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: { model: 'categories', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      meta_title: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      meta_description: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      meta_keywords: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      og_image: {
        type: Sequelize.STRING(1024),
        allowNull: true,
      },
      canonical_url: {
        type: Sequelize.STRING(2048),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // 2. Create brand_seo table
    await queryInterface.createTable('brand_seo', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      brand_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: { model: 'brands', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      meta_title: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      meta_description: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      meta_keywords: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      og_image: {
        type: Sequelize.STRING(1024),
        allowNull: true,
      },
      canonical_url: {
        type: Sequelize.STRING(2048),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // 3. Create collection_rules table
    await queryInterface.createTable('collection_rules', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      collection_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: { model: 'collections', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      field: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      operator: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      value: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // 4. Add columns to product_attributes
    await queryInterface.addColumn('product_attributes', 'code', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await queryInterface.addColumn('product_attributes', 'type', {
      type: Sequelize.STRING(30),
      allowNull: false,
      defaultValue: 'dropdown',
    });
    await queryInterface.addColumn('product_attributes', 'is_required', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.addColumn('product_attributes', 'is_filterable', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
    await queryInterface.addColumn('product_attributes', 'is_searchable', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
    await queryInterface.addColumn('product_attributes', 'is_comparable', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.addColumn('product_attributes', 'sort_order', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    // 5. Add columns to product_attribute_values
    await queryInterface.addColumn('product_attribute_values', 'label', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn('product_attribute_values', 'swatch_data', {
      type: Sequelize.STRING(1024),
      allowNull: true,
    });
    await queryInterface.addColumn('product_attribute_values', 'sort_order', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.addColumn('product_attribute_values', 'status', {
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: 'active',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('product_attribute_values', 'status');
    await queryInterface.removeColumn('product_attribute_values', 'sort_order');
    await queryInterface.removeColumn('product_attribute_values', 'swatch_data');
    await queryInterface.removeColumn('product_attribute_values', 'label');

    await queryInterface.removeColumn('product_attributes', 'sort_order');
    await queryInterface.removeColumn('product_attributes', 'is_comparable');
    await queryInterface.removeColumn('product_attributes', 'is_searchable');
    await queryInterface.removeColumn('product_attributes', 'is_filterable');
    await queryInterface.removeColumn('product_attributes', 'is_required');
    await queryInterface.removeColumn('product_attributes', 'type');
    await queryInterface.removeColumn('product_attributes', 'code');

    await queryInterface.dropTable('collection_rules');
    await queryInterface.dropTable('brand_seo');
    await queryInterface.dropTable('category_seo');
  },
};
