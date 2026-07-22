import { Tenant, Store, User, UserRole, Role } from '../models';
import { connectDatabase } from '../../config/database';
import { logger } from '../../shared/logging/logger';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export const runMultiTenantVerification = async () => {
  try {
    await connectDatabase();

    logger.info('--- 1. TENANT CREATION VERIFICATION ---');
    // Ensure Tenant A
    let tenantA = await Tenant.findOne({ where: { slug: 'abc-electronics' } });
    if (!tenantA) {
      tenantA = await Tenant.create({
        uuid: '00000000-0000-0000-0000-00000000000a',
        name: 'ABC Electronics',
        slug: 'abc-electronics',
        status: 'active',
      });
      logger.info('Created Tenant A: ABC Electronics');
    } else {
      logger.info('Tenant A already exists');
    }

    // Ensure Tenant B
    let tenantB = await Tenant.findOne({ where: { slug: 'xyz-fashion' } });
    if (!tenantB) {
      tenantB = await Tenant.create({
        uuid: '00000000-0000-0000-0000-00000000000b',
        name: 'XYZ Fashion',
        slug: 'xyz-fashion',
        status: 'active',
      });
      logger.info('Created Tenant B: XYZ Fashion');
    } else {
      logger.info('Tenant B already exists');
    }

    logger.info('--- 2. STORE CREATION VERIFICATION ---');
    // Tenant A Stores
    let storeA1 = await Store.findOne({ where: { tenantId: tenantA.id, slug: 'hyderabad' } });
    if (!storeA1) {
      storeA1 = await Store.create({
        tenantId: tenantA.id,
        name: 'Hyderabad Store',
        code: 'STORE-HYD',
        slug: 'hyderabad',
        currency: 'INR',
        status: 'active',
      });
      logger.info('Created Store A1 (Hyderabad) for Tenant A');
    }

    let storeA2 = await Store.findOne({ where: { tenantId: tenantA.id, slug: 'vijayawada' } });
    if (!storeA2) {
      storeA2 = await Store.create({
        tenantId: tenantA.id,
        name: 'Vijayawada Store',
        code: 'STORE-VIJ',
        slug: 'vijayawada',
        currency: 'INR',
        status: 'active',
      });
      logger.info('Created Store A2 (Vijayawada) for Tenant A');
    }

    // Tenant B Stores
    let storeB1 = await Store.findOne({ where: { tenantId: tenantB.id, slug: 'bangalore' } });
    if (!storeB1) {
      storeB1 = await Store.create({
        tenantId: tenantB.id,
        name: 'Bangalore Store',
        code: 'STORE-BLR',
        slug: 'bangalore',
        currency: 'INR',
        status: 'active',
      });
      logger.info('Created Store B1 (Bangalore) for Tenant B');
    }

    let storeB2 = await Store.findOne({ where: { tenantId: tenantB.id, slug: 'chennai' } });
    if (!storeB2) {
      storeB2 = await Store.create({
        tenantId: tenantB.id,
        name: 'Chennai Store',
        code: 'STORE-MAA',
        slug: 'chennai',
        currency: 'INR',
        status: 'active',
      });
      logger.info('Created Store B2 (Chennai) for Tenant B');
    }

    logger.info('--- 3. SELLER CREATION VERIFICATION ---');
    const passwordHash = await bcrypt.hash('SellerSecurePassword2026!', 10);
    const sellerRole =
      (await Role.findOne({ where: { code: 'store_manager' } })) || (await Role.findByPk(3));

    // Create Seller 1 under Store A1
    let seller1 = await User.findOne({ where: { email: 'seller1@abc.com' } });
    if (!seller1) {
      seller1 = await User.create({
        tenantId: tenantA.id,
        uuid: uuidv4(),
        email: 'seller1@abc.com',
        passwordHash,
        firstName: 'Hyderabad',
        lastName: 'Seller',
        status: 'active',
      });
      if (sellerRole) {
        await UserRole.create({
          tenantId: tenantA.id,
          userId: seller1.id,
          roleId: sellerRole.id,
          storeId: storeA1.id,
          assignedAt: new Date(),
        });
      }
      logger.info('Created Seller 1 for Store A1');
    }

    // Create Seller 2 under Store B1
    let seller2 = await User.findOne({ where: { email: 'seller1@xyz.com' } });
    if (!seller2) {
      seller2 = await User.create({
        tenantId: tenantB.id,
        uuid: uuidv4(),
        email: 'seller1@xyz.com',
        passwordHash,
        firstName: 'Bangalore',
        lastName: 'Seller',
        status: 'active',
      });
      if (sellerRole) {
        await UserRole.create({
          tenantId: tenantB.id,
          userId: seller2.id,
          roleId: sellerRole.id,
          storeId: storeB1.id,
          assignedAt: new Date(),
        });
      }
      logger.info('Created Seller 2 for Store B1');
    }

    logger.info('--- MULTI-TENANT VERIFICATION COMPLETED SUCCESSFULLY ---');
  } catch (error) {
    logger.error('Multi-tenant verification failed:', error);
  }
};

if (require.main === module) {
  runMultiTenantVerification().then(() => process.exit(0));
}
