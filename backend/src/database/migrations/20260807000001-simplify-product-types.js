'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const removedCodes = ['digital', 'bundle', 'service', 'subscription', 'gift_card', 'rental'];

    // 1. Delete removed product types from product_types table
    await queryInterface.bulkDelete('product_types', {
      code: {
        [Sequelize.Op.in]: removedCodes,
      },
    });

    // 2. Delete existing products in products table belonging to removed product types
    await queryInterface.bulkDelete('products', {
      product_type: {
        [Sequelize.Op.in]: removedCodes,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Re-insert removed product types if rollback is needed
    const now = new Date();
    await queryInterface.bulkInsert('product_types', [
      {
        code: 'digital',
        name: 'Digital Product',
        description: 'File upload, download limits, license keys',
        supports_inventory: false,
        supports_shipping: false,
        supports_variants: false,
        supports_downloads: true,
        supports_virtual: true,
        supports_print_on_demand: false,
        status: 'active',
        created_at: now,
        updated_at: now,
      },
      {
        code: 'bundle',
        name: 'Bundle Product',
        description: 'Package combining multiple products',
        supports_inventory: true,
        supports_shipping: true,
        supports_variants: false,
        supports_downloads: false,
        supports_virtual: false,
        supports_print_on_demand: false,
        status: 'active',
        created_at: now,
        updated_at: now,
      },
      {
        code: 'service',
        name: 'Service Product',
        description: 'Time-based appointments and booking',
        supports_inventory: false,
        supports_shipping: false,
        supports_variants: false,
        supports_downloads: false,
        supports_virtual: true,
        supports_print_on_demand: false,
        status: 'active',
        created_at: now,
        updated_at: now,
      },
      {
        code: 'subscription',
        name: 'Subscription Product',
        description: 'Recurring monthly or annual billing',
        supports_inventory: false,
        supports_shipping: false,
        supports_variants: false,
        supports_downloads: false,
        supports_virtual: true,
        supports_print_on_demand: false,
        status: 'active',
        created_at: now,
        updated_at: now,
      },
      {
        code: 'gift_card',
        name: 'Gift Card',
        description: 'Digital voucher code',
        supports_inventory: false,
        supports_shipping: false,
        supports_variants: false,
        supports_downloads: false,
        supports_virtual: true,
        supports_print_on_demand: false,
        status: 'active',
        created_at: now,
        updated_at: now,
      },
      {
        code: 'rental',
        name: 'Rental Product',
        description: 'Daily/hourly rental rate',
        supports_inventory: true,
        supports_shipping: true,
        supports_variants: false,
        supports_downloads: false,
        supports_virtual: false,
        supports_print_on_demand: false,
        status: 'active',
        created_at: now,
        updated_at: now,
      },
    ]);
  },
};
