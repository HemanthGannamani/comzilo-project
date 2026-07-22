'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const flags = [
      {
        id: 1,
        code: 'pos_access',
        name: 'POS Operations',
        description: 'Enables POS billing and shift logs',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        code: 'voice_commerce',
        name: 'Voice Assistant Shopping',
        description: 'Enables hands-free voice orders and commands',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        code: 'custom_domain',
        name: 'Custom Domain Routing',
        description: 'Allows mapping custom domains to store subdomains',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        code: 'advanced_analytics',
        name: 'Advanced Reports & Analytics',
        description: 'Cohort tables, CLTV, and profitability reports',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 5,
        code: 'whatsapp_reminders',
        name: 'WhatsApp Abandoned Cart Notifications',
        description: 'Triggers automated WhatsApp template reminders',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    for (const flag of flags) {
      const existing = await queryInterface.sequelize.query(
        'SELECT id FROM feature_flags WHERE code = :code',
        {
          replacements: { code: flag.code },
          type: queryInterface.sequelize.QueryTypes.SELECT,
        }
      );
      if (existing.length === 0) {
        await queryInterface.bulkInsert('feature_flags', [flag]);
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('feature_flags', null, {});
  },
};
