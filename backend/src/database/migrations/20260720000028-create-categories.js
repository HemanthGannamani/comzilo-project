module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('categories', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: true,
      },
      tenant_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },
      store_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },
      parent_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: 'categories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('draft', 'active', 'inactive', 'archived'),
        allowNull: false,
        defaultValue: 'draft',
      },
      visibility: {
        type: Sequelize.ENUM('public', 'private', 'hidden'),
        allowNull: false,
        defaultValue: 'public',
      },
      sort_order: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      image_media_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: 'media',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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
      },
      updated_by: {
        type: Sequelize.BIGINT.UNSIGNED,
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
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
    await queryInterface.addIndex('categories', ['tenant_id', 'store_id', 'slug'], {
      unique: true,
      name: 'uq_categories_tenant_store_slug',
    });
    await queryInterface.addIndex('categories', ['tenant_id', 'store_id', 'parent_id'], {
      name: 'idx_categories_parent',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('categories', 'uq_categories_tenant_store_slug');
    await queryInterface.removeIndex('categories', 'idx_categories_parent');
    await queryInterface.dropTable('categories');
  },
};
