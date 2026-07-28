const { User } = require('./dist/database/models/user.js');
const { Customer } = require('./dist/database/models/customer.js');
const { Store } = require('./dist/database/models/store.js');

async function syncStoreCustomers() {
  const seller = await User.findOne({ where: { email: 'satishveeravalli2004@gmail.com' } });
  if (!seller) {
    console.error('Seller not found');
    process.exit(1);
  }

  console.log(`Seller ID: ${seller.id} | tenantId: ${seller.tenantId} | storeId: ${seller.storeId}`);

  let store = await Store.findOne({ where: { id: seller.storeId || 1 } });
  if (!store) {
    store = await Store.findOne({ where: { tenantId: seller.tenantId } });
  }

  const activeTenantId = seller.tenantId || (store ? store.tenantId : 1);
  const activeStoreId = store ? store.id : 1;

  console.log(`Aligning customer records to multi-tenant store context: tenantId=${activeTenantId}, storeId=${activeStoreId}`);

  // Align customer records so they belong to the multi-tenant store context
  const [updatedCount] = await Customer.update(
    { tenantId: activeTenantId, storeId: activeStoreId },
    { where: {} }
  );

  console.log(`Updated ${updatedCount} customer records to tenantId=${activeTenantId}, storeId=${activeStoreId}`);
  process.exit(0);
}

syncStoreCustomers();
