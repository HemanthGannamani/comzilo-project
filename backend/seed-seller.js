const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { User } = require('./dist/database/models/user.js');
const { Store } = require('./dist/database/models/store.js');
const { Tenant } = require('./dist/database/models/tenant.js');

async function seedSellerAccount() {
  console.log('Seeding Seller Account: satishveeravalli2004@gmail.com...');
  
  // Find or create default tenant
  let tenant = await Tenant.findOne();
  if (!tenant) {
    tenant = await Tenant.create({
      name: 'Default Tenant',
      slug: 'default-tenant',
      status: 'active'
    });
  }

  // Find or create default store
  let store = await Store.findOne();
  if (!store) {
    store = await Store.create({
      tenantId: tenant.id,
      name: 'Satish Traders Store',
      slug: 'satish-traders-store',
      status: 'active'
    });
  }

  // Hash password
  const passwordHash = await bcrypt.hash('Satish@123', 10);

  // Upsert user
  const [user, created] = await User.findOrCreate({
    where: { email: 'satishveeravalli2004@gmail.com' },
    defaults: {
      uuid: crypto.randomUUID(),
      tenantId: tenant.id,
      storeId: store.id,
      firstName: 'Satish',
      lastName: 'Veeravalli',
      email: 'satishveeravalli2004@gmail.com',
      passwordHash: passwordHash,
      role: 'SELLER',
      status: 'ACTIVE',
      isEmailVerified: true
    }
  });

  if (!created) {
    user.passwordHash = passwordHash;
    user.status = 'ACTIVE';
    user.role = 'SELLER';
    await user.save();
    console.log('Updated existing user password and role to ACTIVE SELLER.');
  } else {
    console.log('Created new SELLER account successfully.');
  }

  console.log('Seller User ID:', user.id, 'Email:', user.email);
  process.exit(0);
}

seedSellerAccount().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
