const { User } = require('./dist/database/models/user.js');
const { Customer } = require('./dist/database/models/customer.js');
const { UserRole } = require('./dist/database/models/userRole.js');
const { Store } = require('./dist/database/models/store.js');

async function alignDeekshithStore() {
  console.log('Finding Deekshith store...');
  const store = await Store.findOne({ where: { name: 'deekshith store' } });
  if (!store) {
    console.error('Deekshith store not found');
    process.exit(1);
  }

  const targetTenantId = store.tenantId;
  const targetStoreId = store.id;
  console.log(`Deekshith Store ID: ${targetStoreId} | Tenant ID: ${targetTenantId}`);

  // 1. Update Seller User satishveeravalli2004@gmail.com
  const seller = await User.findOne({ where: { email: 'satishveeravalli2004@gmail.com' } });
  if (seller) {
    seller.tenantId = targetTenantId;
    seller.storeId = targetStoreId;
    await seller.save();
    console.log(`Updated seller user ${seller.email} to tenantId=${targetTenantId}, storeId=${targetStoreId}`);

    // Update UserRole
    await UserRole.update(
      { tenantId: targetTenantId, storeId: targetStoreId },
      { where: { userId: seller.id } }
    );
    console.log(`Updated UserRole for seller ${seller.id}`);
  }

  // 2. Update Customer gannamani@gmail.com to Deekshith store
  const custUser = await User.findOne({ where: { email: 'gannamani@gmail.com' } });
  if (custUser) {
    custUser.tenantId = targetTenantId;
    custUser.storeId = targetStoreId;
    await custUser.save();
    console.log(`Updated customer user ${custUser.email} to tenantId=${targetTenantId}, storeId=${targetStoreId}`);
  }

  const custRecord = await Customer.findOne({ where: { email: 'gannamani@gmail.com' } });
  if (custRecord) {
    custRecord.tenantId = targetTenantId;
    custRecord.storeId = targetStoreId;
    await custRecord.save();
    console.log(`Updated customer record ${custRecord.email} to tenantId=${targetTenantId}, storeId=${targetStoreId}`);
  }

  // 3. Align all recent customers to Deekshith store for test visibility
  const [updatedCount] = await Customer.update(
    { tenantId: targetTenantId, storeId: targetStoreId },
    { where: {} }
  );
  console.log(`Updated ${updatedCount} total customer records to Deekshith store (tenantId=${targetTenantId}, storeId=${targetStoreId})`);

  process.exit(0);
}

alignDeekshithStore();
