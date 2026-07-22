'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Create analytics_dashboards table
    await queryInterface.createTable('analytics_dashboards', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      tenant_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },
      store_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      is_default: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      layout_config: {
        type: Sequelize.JSON,
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

    // 2. Create analytics_widgets table
    await queryInterface.createTable('analytics_widgets', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      dashboard_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: { model: 'analytics_dashboards', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      widget_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      data_source: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      settings: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      sort_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
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

    // 3. Create analytics_saved_reports table
    await queryInterface.createTable('analytics_saved_reports', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      tenant_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },
      store_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      report_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      filters: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      fields: {
        type: Sequelize.JSON,
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

    // 4. Create analytics_kpis table
    await queryInterface.createTable('analytics_kpis', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      tenant_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },
      store_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },
      kpi_key: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      kpi_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      current_value: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      target_value: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
      },
      unit: {
        type: Sequelize.STRING(30),
        allowNull: false,
        defaultValue: 'currency',
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

    // 5. Create analytics_forecasts table
    await queryInterface.createTable('analytics_forecasts', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      tenant_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },
      store_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },
      forecast_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      forecast_json: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      accuracy_score: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 95.0,
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
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.dropTable('analytics_forecasts');
    await queryInterface.dropTable('analytics_kpis');
    await queryInterface.dropTable('analytics_saved_reports');
    await queryInterface.dropTable('analytics_widgets');
    await queryInterface.dropTable('analytics_dashboards');
  },
};
