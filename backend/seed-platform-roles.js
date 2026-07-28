const { sequelize } = require('./dist/config/database.js');

async function seedPlatformRoles() {
  console.log('Seeding enterprise platform roles...');

  const rolesToEnsure = [
    { code: 'platform_admin', name: 'Platform Admin', description: 'Global Platform Administrator' },
    { code: 'platform_operations', name: 'Platform Operations', description: 'System Operations Specialist' },
    { code: 'support', name: 'Support Specialist', description: 'Customer & Merchant Support' },
    { code: 'finance', name: 'Finance Auditor', description: 'SaaS Revenue & Finance Auditor' },
    { code: 'read_only', name: 'Read Only Operator', description: 'Read-only System Operator' },
  ];

  for (const r of rolesToEnsure) {
    await sequelize.query(
      `INSERT INTO roles (code, name, description, is_system, created_at, updated_at)
       SELECT :code, :name, :description, 1, NOW(), NOW()
       FROM DUAL
       WHERE NOT EXISTS (SELECT id FROM roles WHERE code = :code) LIMIT 1`,
      { replacements: r }
    );
  }

  console.log('Platform roles seeded successfully!');
  process.exit(0);
}

seedPlatformRoles().catch(err => {
  console.error(err);
  process.exit(1);
});
