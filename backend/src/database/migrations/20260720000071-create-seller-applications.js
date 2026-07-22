'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('seller_applications', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      application_number: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
        field: 'application_number',
      },
      business_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
        field: 'business_name',
      },
      owner_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
        field: 'owner_name',
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
        field: 'email',
      },
      phone: {
        type: Sequelize.STRING(50),
        allowNull: false,
        field: 'phone',
      },
      business_type: {
        type: Sequelize.STRING(100),
        allowNull: false,
        field: 'business_type',
      },
      gst_number: {
        type: Sequelize.STRING(15),
        allowNull: true,
        field: 'gst_number',
      },
      pan_number: {
        type: Sequelize.STRING(10),
        allowNull: true,
        field: 'pan_number',
      },
      address_line1: {
        type: Sequelize.STRING(255),
        allowNull: false,
        field: 'address_line1',
      },
      address_line2: {
        type: Sequelize.STRING(255),
        allowNull: true,
        field: 'address_line2',
      },
      city: {
        type: Sequelize.STRING(100),
        allowNull: false,
        field: 'city',
      },
      state: {
        type: Sequelize.STRING(100),
        allowNull: false,
        field: 'state',
      },
      country: {
        type: Sequelize.STRING(100),
        allowNull: false,
        field: 'country',
      },
      postal_code: {
        type: Sequelize.STRING(20),
        allowNull: false,
        field: 'postal_code',
      },
      preferred_store_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
        field: 'preferred_store_name',
      },
      password_hash: {
        type: Sequelize.STRING(255),
        allowNull: false,
        field: 'password_hash',
      },
      logo_path: {
        type: Sequelize.STRING(255),
        allowNull: true,
        field: 'logo_path',
      },
      license_path: {
        type: Sequelize.STRING(255),
        allowNull: true,
        field: 'license_path',
      },
      gst_certificate_path: {
        type: Sequelize.STRING(255),
        allowNull: true,
        field: 'gst_certificate_path',
      },
      identity_proof_path: {
        type: Sequelize.STRING(255),
        allowNull: true,
        field: 'identity_proof_path',
      },
      status: {
        type: Sequelize.ENUM('Pending', 'Approved', 'Rejected'),
        allowNull: false,
        defaultValue: 'Pending',
        field: 'status',
      },
      review_notes: {
        type: Sequelize.TEXT,
        allowNull: true,
        field: 'review_notes',
      },
      submitted_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'submitted_at',
      },
      reviewed_at: {
        type: Sequelize.DATE,
        allowNull: true,
        field: 'reviewed_at',
      },
      reviewed_by: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        field: 'reviewed_by',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        field: 'created_at',
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        field: 'updated_at',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('seller_applications');
  },
};
