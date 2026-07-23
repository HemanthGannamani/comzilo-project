import {
  User,
  UserRole,
  UserProfile,
  Tenant,
  Store,
  Role,
  SellerApplication,
} from '../database/models';
import { sequelize } from '../config/database';
import { ValidationError, ConflictError } from '../shared/errors/AppError';
import { createAuditLog } from '../utils/auditHelper';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export interface CreateSellerInput {
  sellerApplicationId?: number;
  passwordHash?: string;
  ownerName: string;
  email: string;
  phone: string;
  password?: string;
  businessName: string;
  businessType?: string;
  gstNumber?: string;
  panNumber?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  tenantConfig: {
    mode: 'assign' | 'create';
    tenantId?: number;
    newName?: string;
    newSlug?: string;
    newStatus?: 'pending' | 'active' | 'suspended' | 'cancelled';
  };
  storeConfig: {
    mode: 'assign' | 'create';
    storeId?: number;
    newName?: string;
    newCode?: string;
    newAddress?: string;
    newStatus?: 'active' | 'suspended';
  };
  roleCode: 'tenant_owner' | 'manager' | 'staff';
  status: 'invited' | 'active' | 'suspended' | 'locked' | 'disabled';
  mustChangePassword?: boolean;
}

export class AdminSellerService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async createSeller(input: CreateSellerInput, context: any): Promise<User> {
    // 1. Validations: Unique checks before starting transaction
    const existingUser = await User.findOne({ where: { email: input.email } });
    if (existingUser) {
      throw new ConflictError('A user with this email address already exists');
    }

    const existingPhone = await User.findOne({ where: { mobile: input.phone } });
    if (existingPhone) {
      throw new ConflictError('A user with this mobile phone number already exists');
    }

    if (input.gstNumber) {
      const existingGst = await UserProfile.findOne({
        where: sequelize.literal(
          `JSON_UNQUOTE(JSON_EXTRACT(metadata, '$.gstNumber')) = '${input.gstNumber}'`
        ),
      });
      if (existingGst) {
        throw new ConflictError('A business with this GST number already exists');
      }
    }

    if (input.tenantConfig.mode === 'create') {
      if (!input.tenantConfig.newSlug) {
        throw new ValidationError('Tenant slug is required for inline tenant creation');
      }
      const existingTenant = await Tenant.findOne({ where: { slug: input.tenantConfig.newSlug } });
      if (existingTenant) {
        throw new ConflictError('A tenant with this slug already exists');
      }
    }

    if (input.storeConfig.mode === 'create') {
      if (!input.storeConfig.newCode) {
        throw new ValidationError('Store code is required for inline store creation');
      }
      const existingStore = await Store.findOne({ where: { slug: input.storeConfig.newCode } });
      if (existingStore) {
        throw new ConflictError('A store with this code/slug already exists');
      }
    }

    // Hash Password
    let passwordHash = input.passwordHash;
    if (!passwordHash) {
      const password = input.password || 'TemporarySecurePassword2026!';
      passwordHash = await bcrypt.hash(password, 10);
    }

    const t = await sequelize.transaction();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const auditLogsToCreate: any[] = [];

    try {
      // 2. Resolve or Create Tenant
      let tenantId: number;

      if (input.tenantConfig.mode === 'create') {
        const newTenant = await Tenant.create(
          {
            uuid: uuidv4(),
            name: input.tenantConfig.newName || input.businessName,
            slug: input.tenantConfig.newSlug,
            status: input.tenantConfig.newStatus || 'active',
          },
          { transaction: t }
        );
        tenantId = newTenant.id;

        // Collect Tenant Audit
        auditLogsToCreate.push({
          payload: {
            action: 'tenant.created',
            entityType: 'tenant',
            entityId: String(newTenant.id),
            newValues: { name: newTenant.name, slug: newTenant.slug },
          },
          context: { ...context, tenantId },
        });
      } else {
        if (!input.tenantConfig.tenantId) {
          throw new ValidationError('Existing Tenant ID is required');
        }
        const existingTenant = await Tenant.findByPk(input.tenantConfig.tenantId);
        if (!existingTenant) {
          throw new ValidationError('Selected tenant does not exist');
        }
        tenantId = existingTenant.id;
      }

      // 3. Resolve or Create Store
      let storeId: number | null = null;

      if (input.storeConfig.mode === 'create') {
        const newStore = await Store.create(
          {
            tenantId,
            name: input.storeConfig.newName || input.businessName,
            slug: input.storeConfig.newCode, // Maps slug to store code
            status: input.storeConfig.newStatus || 'active',
          },
          { transaction: t }
        );
        storeId = newStore.id;

        // Collect Store Audit
        auditLogsToCreate.push({
          payload: {
            action: 'store.created',
            entityType: 'store',
            entityId: String(newStore.id),
            newValues: { name: newStore.name, code: newStore.slug },
          },
          context: { ...context, tenantId },
        });
      } else if (input.storeConfig.mode === 'assign') {
        if (!input.storeConfig.storeId) {
          throw new ValidationError('Existing Store ID is required');
        }
        const existingStore = await Store.findByPk(input.storeConfig.storeId);
        if (!existingStore) {
          throw new ValidationError('Selected store does not exist');
        }
        storeId = existingStore.id;
      }

      // 4. Create Seller User
      const [firstName, ...lastNameParts] = input.ownerName.trim().split(' ');
      const lastName = lastNameParts.join(' ') || ' ';

      const user = await User.create(
        {
          tenantId,
          uuid: uuidv4(),
          email: input.email,
          passwordHash,
          firstName,
          lastName,
          mobile: input.phone,
          status: input.status || 'active',
          mustChangePassword: input.mustChangePassword ?? true,
        },
        { transaction: t }
      );

      // Collect User Onboarding Audit
      auditLogsToCreate.push({
        payload: {
          action: 'user.onboarded',
          entityType: 'user',
          entityId: String(user.id),
          newValues: { email: user.email, name: input.ownerName },
        },
        context: { ...context, tenantId },
      });

      // 5. Create Profile mapping with business details
      await UserProfile.create(
        {
          tenantId,
          userId: user.id,
          addressLine1: input.addressLine1 || null,
          addressLine2: input.addressLine2 || null,
          city: input.city || null,
          state: input.state || null,
          country: input.country || null,
          postalCode: input.postalCode || null,
          metadata: {
            businessName: input.businessName,
            businessType: input.businessType || 'Retail',
            gstNumber: input.gstNumber || null,
            panNumber: input.panNumber || null,
          },
        },
        { transaction: t }
      );

      // 6. Assign Role Mapping
      const role = await Role.findOne({ where: { code: input.roleCode } });
      if (!role) {
        throw new ValidationError(`Role mapping for '${input.roleCode}' does not exist`);
      }

      await UserRole.create(
        {
          tenantId,
          userId: user.id,
          roleId: role.id,
          storeId,
          assignedAt: new Date(),
          assignedBy: context?.authenticatedUserId || null,
        },
        { transaction: t }
      );

      // Collect Role Assigned Audit
      auditLogsToCreate.push({
        payload: {
          action: 'role.assigned',
          entityType: 'user_role',
          entityId: String(user.id),
          newValues: { userId: user.id, roleCode: input.roleCode, storeId },
        },
        context: { ...context, tenantId },
      });

      if (input.sellerApplicationId) {
        const application = await SellerApplication.findByPk(input.sellerApplicationId, {
          transaction: t,
        });
        if (!application) {
          throw new ValidationError('Seller application not found');
        }
        if (application.status !== 'Pending') {
          throw new ValidationError('Only Pending applications can be approved');
        }
        application.status = 'Approved';
        application.reviewedAt = new Date();
        application.reviewedBy = context?.authenticatedUserId || null;
        await application.save({ transaction: t });

        // Collect Application Approved Audit
        auditLogsToCreate.push({
          payload: {
            action: 'seller_application.approved',
            entityType: 'seller_application',
            entityId: String(application.id),
            newValues: { status: 'Approved' },
          },
          context: { ...context, tenantId },
        });
      }

      await t.commit();

      // Write deferred audit logs post-transaction
      for (const log of auditLogsToCreate) {
        await createAuditLog(log.payload, log.context);
      }

      return user;
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }
}
