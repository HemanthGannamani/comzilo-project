'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const plans = [
      {
        id: 1,
        code: 'free_trial',
        name: 'Free Trial',
        description: '7-day evaluation plan',
        price_monthly: 0.0,
        price_yearly: 0.0,
        currency: 'INR',
        trial_days: 7,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        code: 'starter',
        name: 'Starter Plan',
        description: 'For small stores growing online',
        price_monthly: 999.0,
        price_yearly: 9990.0,
        currency: 'INR',
        trial_days: 0,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        code: 'pro',
        name: 'Pro Plan',
        description: 'Complete suite for advanced high-growth stores',
        price_monthly: 2999.0,
        price_yearly: 29990.0,
        currency: 'INR',
        trial_days: 0,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    for (const plan of plans) {
      const existing = await queryInterface.sequelize.query(
        'SELECT id FROM plans WHERE code = :code',
        {
          replacements: { code: plan.code },
          type: queryInterface.sequelize.QueryTypes.SELECT,
        }
      );
      if (existing.length === 0) {
        await queryInterface.bulkInsert('plans', [plan]);
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('plans', null, {});
  },
};
