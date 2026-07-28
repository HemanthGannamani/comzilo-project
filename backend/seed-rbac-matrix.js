const { sequelize } = require('./dist/config/database.js');
const { QueryTypes } = require('sequelize');

const modules = [
  'dashboard', 'tenant', 'seller_application', 'seller', 'store',
  'subscription_plan', 'platform_user', 'role', 'product', 'category',
  'brand', 'customer', 'order', 'invoice', 'inventory', 'shipping',
  'marketing', 'finance', 'report', 'pos', 'notification', 'integration',
  'setting', 'audit_log'
];

const actions = ['create', 'read', 'update', 'delete', 'approve', 'reject', 'export', 'import', 'assign', 'manage', 'access'];

async function seedRbacMatrix() {
  console.log('=== SEEDING ENTERPRISE RBAC MATRIX PERMISSIONS ===');

  for (const mod of modules) {
    for (const act of actions) {
      const code = `${mod}.${act}`;
      const name = `${mod.replace('_', ' ').toUpperCase()} - ${act.toUpperCase()}`;
      const description = `Allows ${act} operations on ${mod}`;

      await sequelize.query(
        `INSERT INTO permissions (code, name, description, created_at)
         SELECT :code, :name, :description, NOW()
         FROM DUAL
         WHERE NOT EXISTS (SELECT id FROM permissions WHERE code = :code)`,
        { replacements: { code, name, description } }
      );
    }
  }

  // Fetch all permissions
  const allPerms = await sequelize.query('SELECT id, code FROM permissions', { type: QueryTypes.SELECT });
  const permMap = new Map(allPerms.map(p => [p.code, p.id]));

  // Ensure SUPER_ADMIN (role_id 1) has ALL permissions
  console.log('Mapping ALL permissions to SUPER_ADMIN...');
  for (const p of allPerms) {
    await sequelize.query(
      `INSERT INTO role_permissions (role_id, permission_id, created_at)
       SELECT 1, :permId, NOW()
       FROM DUAL
       WHERE NOT EXISTS (SELECT id FROM role_permissions WHERE role_id = 1 AND permission_id = :permId)`,
      { replacements: { permId: p.id } }
    );
  }

  // Ensure STORE_MANAGER (role_id = 3 or code = 'store_manager') has store, product, category, order, inventory, customer perms
  const [storeMgrRole] = await sequelize.query("SELECT id FROM roles WHERE code = 'store_manager' OR code = 'manager' LIMIT 1", { type: QueryTypes.SELECT });
  if (storeMgrRole) {
    const mgrPermCodes = [
      'dashboard.read', 'product.create', 'product.read', 'product.update', 'product.delete', 'product.export',
      'category.create', 'category.read', 'category.update', 'category.delete',
      'order.create', 'order.read', 'order.update', 'order.export',
      'inventory.create', 'inventory.read', 'inventory.update',
      'customer.read', 'customer.create', 'customer.update', 'pos.access', 'pos.read', 'pos.create'
    ];
    for (const code of mgrPermCodes) {
      const pId = permMap.get(code);
      if (pId) {
        await sequelize.query(
          `INSERT INTO role_permissions (role_id, permission_id, created_at)
           SELECT :roleId, :permId, NOW()
           FROM DUAL
           WHERE NOT EXISTS (SELECT id FROM role_permissions WHERE role_id = :roleId AND permission_id = :permId)`,
          { replacements: { roleId: storeMgrRole.id, permId: pId } }
        );
      }
    }
  }

  // Ensure POS_CASHIER (role code 'pos_cashier') has POS and read order perms only
  let [cashierRole] = await sequelize.query("SELECT id FROM roles WHERE code = 'pos_cashier' LIMIT 1", { type: QueryTypes.SELECT });
  if (!cashierRole) {
    await sequelize.query("INSERT INTO roles (code, name, description, is_system, created_at) VALUES ('pos_cashier', 'POS Cashier Kiosk', 'Kiosk POS Cashier', 1, NOW())");
    [cashierRole] = await sequelize.query("SELECT id FROM roles WHERE code = 'pos_cashier' LIMIT 1", { type: QueryTypes.SELECT });
  }

  if (cashierRole) {
    const cashierPerms = ['pos.access', 'pos.read', 'pos.create', 'order.read', 'product.read'];
    for (const code of cashierPerms) {
      const pId = permMap.get(code);
      if (pId) {
        await sequelize.query(
          `INSERT INTO role_permissions (role_id, permission_id, created_at)
           SELECT :roleId, :permId, NOW()
           FROM DUAL
           WHERE NOT EXISTS (SELECT id FROM role_permissions WHERE role_id = :roleId AND permission_id = :permId)`,
          { replacements: { roleId: cashierRole.id, permId: pId } }
        );
      }
    }
  }

  // Ensure READ_ONLY (role code 'read_only') has only read permissions
  const [readOnlyRole] = await sequelize.query("SELECT id FROM roles WHERE code = 'read_only' LIMIT 1", { type: QueryTypes.SELECT });
  if (readOnlyRole) {
    const readOnlyCodes = allPerms.filter(p => p.code.endsWith('.read')).map(p => p.id);
    for (const pId of readOnlyCodes) {
      await sequelize.query(
        `INSERT INTO role_permissions (role_id, permission_id, created_at)
         SELECT :roleId, :permId, NOW()
         FROM DUAL
         WHERE NOT EXISTS (SELECT id FROM role_permissions WHERE role_id = :roleId AND permission_id = :permId)`,
        { replacements: { roleId: readOnlyRole.id, permId: pId } }
      );
    }
  }

  console.log('=== ENTERPRISE RBAC MATRIX SEEDED SUCCESSFULLY ===');
  process.exit(0);
}

seedRbacMatrix().catch(err => {
  console.error(err);
  process.exit(1);
});
