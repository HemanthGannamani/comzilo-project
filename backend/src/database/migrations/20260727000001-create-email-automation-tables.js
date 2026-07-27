'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. marketing_email_logs
    await queryInterface.createTable('marketing_email_logs', {
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
        allowNull: true,
        defaultValue: 1,
      },
      recipient: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      subject: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      template_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      provider_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'smtp',
      },
      status: {
        type: Sequelize.STRING(30),
        allowNull: false,
        defaultValue: 'queued', // queued, processing, sent, failed, cancelled
      },
      retry_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      failure_reason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      message_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      sent_at: {
        type: Sequelize.DATE,
        allowNull: true,
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

    // 2. marketing_email_queue
    await queryInterface.createTable('marketing_email_queue', {
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
        allowNull: true,
        defaultValue: 1,
      },
      trigger_event: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      recipient: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      payload_json: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      scheduled_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      status: {
        type: Sequelize.STRING(30),
        allowNull: false,
        defaultValue: 'pending', // pending, processing, completed, failed, cancelled
      },
      retry_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      next_retry_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      error_log: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      cart_token: {
        type: Sequelize.STRING(255),
        allowNull: true,
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
    await queryInterface.dropTable('marketing_email_queue');
    await queryInterface.dropTable('marketing_email_logs');
  },
};
