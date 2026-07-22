'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const mappings = [
      // Free Trial Mappings
      {
        plan_id: 1,
        feature_flag_id: 1, // POS
        limit_value: 1,
        is_enabled: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        plan_id: 1,
        feature_flag_id: 2, // Voice
        limit_value: 0,
        is_enabled: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      // Starter Mappings
      {
        plan_id: 2,
        feature_flag_id: 1,
        limit_value: 3, // Max 3 POS cashiers
        is_enabled: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        plan_id: 2,
        feature_flag_id: 3, // Custom Domain
        limit_value: 1,
        is_enabled: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      // Pro Mappings
      {
        plan_id: 3,
        feature_flag_id: 1,
        limit_value: null, // Unlimited
        is_enabled: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        plan_id: 3,
        feature_flag_id: 2,
        limit_value: null,
        is_enabled: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        plan_id: 3,
        feature_flag_id: 3,
        limit_value: null,
        is_enabled: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        plan_id: 3,
        feature_flag_id: 4,
        limit_value: null,
        is_enabled: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        plan_id: 3,
        feature_flag_id: 5,
        limit_value: null,
        is_enabled: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    for (const map of mappings) {
      const existing = await queryInterface.sequelize.query(
        'SELECT id FROM plan_features WHERE plan_id = :plan_id AND feature_flag_id = :feature_flag_id',
        {
          replacements: { plan_id: map.plan_id, feature_flag_id: map.feature_flag_id },
          type: queryInterface.sequelize.QueryTypes.SELECT,
        }
      );
      if (existing.length === 0) {
        await queryInterface.bulkInsert('plan_features', [map]);
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('plan_features', null, {});
  },
};
