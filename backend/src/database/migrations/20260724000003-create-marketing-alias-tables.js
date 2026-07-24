'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. marketing_email_providers
    await queryInterface.createTable('marketing_email_providers', {
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
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      provider_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      config_json: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      is_default: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      status: {
        type: Sequelize.STRING(30),
        defaultValue: 'active',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    // 2. marketing_email_templates
    await queryInterface.createTable('marketing_email_templates', {
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
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      subject: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      body_html: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING(30),
        defaultValue: 'active',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    // 3. marketing_coupons
    await queryInterface.createTable('marketing_coupons', {
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
      code: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      discount_type: {
        type: Sequelize.STRING(50),
        defaultValue: 'percentage',
      },
      discount_value: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 10.0,
      },
      status: {
        type: Sequelize.STRING(30),
        defaultValue: 'active',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    // 4. marketing_abandoned_carts
    await queryInterface.createTable('marketing_abandoned_carts', {
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
      customer_email: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      cart_token: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      total_amount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      recovery_status: {
        type: Sequelize.STRING(50),
        defaultValue: 'pending',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    // 5. marketing_customer_segments
    await queryInterface.createTable('marketing_customer_segments', {
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
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      rules_json: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING(30),
        defaultValue: 'active',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    // 6. marketing_automation_rules
    await queryInterface.createTable('marketing_automation_rules', {
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
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      trigger_event: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      action_type: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING(30),
        defaultValue: 'active',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    // 7. marketing_analytics
    await queryInterface.createTable('marketing_analytics', {
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
      metric_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      metric_value: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.dropTable('marketing_analytics');
    await queryInterface.dropTable('marketing_automation_rules');
    await queryInterface.dropTable('marketing_customer_segments');
    await queryInterface.dropTable('marketing_abandoned_carts');
    await queryInterface.dropTable('marketing_coupons');
    await queryInterface.dropTable('marketing_email_templates');
    await queryInterface.dropTable('marketing_email_providers');
  },
};
