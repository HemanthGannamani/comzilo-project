'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('product_reviews', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      tenant_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        defaultValue: 1,
      },
      store_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        defaultValue: 1,
      },
      product_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: { model: 'products', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      customer_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
      },
      user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
      },
      customer_name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      customer_email: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      rating: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 5,
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      verified_purchase: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'approved',
      },
      helpful_count: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
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
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('product_reviews');
  },
};
