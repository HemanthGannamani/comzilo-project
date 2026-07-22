/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomerAddressRepository } from '../repositories/customerAddress.repository';
import { CustomerAddress } from '../database/models/customerAddress';
import { BaseService } from '../core/BaseService';
import { sequelize } from '../config/database';
import { NotFoundError } from '../shared/errors/AppError';
import { createAuditLog } from '../utils/auditHelper';
import { createActivityLog } from '../utils/activityHelper';

export class CustomerAddressService extends BaseService {
  private addressRepo = new CustomerAddressRepository();

  constructor() {
    super('CustomerAddressService');
  }

  public async getAddress(tenantId: number, storeId: number, id: number): Promise<CustomerAddress> {
    const address = await this.addressRepo.findScopedById(tenantId, storeId, id);
    if (!address) {
      throw new NotFoundError(`Address with ID ${id} not found.`);
    }
    return address;
  }

  public async listAddresses(
    tenantId: number,
    storeId: number,
    customerId: number
  ): Promise<CustomerAddress[]> {
    return this.addressRepo.findScopedMany(tenantId, storeId, {
      where: { customerId },
    });
  }

  public async createAddress(
    tenantId: number,
    storeId: number,
    customerId: number,
    userId: number,
    data: any,
    ip?: string,
    userAgent?: string
  ): Promise<CustomerAddress> {
    const address = await sequelize.transaction(async (t) => {
      if (data.isDefaultBilling) {
        await this.addressRepo.dbModel.update(
          { isDefaultBilling: false },
          {
            where: {
              tenant_id: tenantId,
              store_id: storeId,
              customer_id: customerId,
              is_default_billing: true,
            },
            transaction: t,
          }
        );
      }

      if (data.isDefaultShipping) {
        await this.addressRepo.dbModel.update(
          { isDefaultShipping: false },
          {
            where: {
              tenant_id: tenantId,
              store_id: storeId,
              customer_id: customerId,
              is_default_shipping: true,
            },
            transaction: t,
          }
        );
      }

      return this.addressRepo.createScoped(
        tenantId,
        storeId,
        {
          ...data,
          customerId,
        },
        { transaction: t }
      );
    });

    await createAuditLog(
      {
        tenantId,
        actorId: userId,
        action: 'CUSTOMER_ADDRESS_CREATED',
        entityType: 'CustomerAddress',
        entityId: String(address.id),
        previousValues: null,
        newValues: address.toJSON(),
      },
      { ipAddress: ip, userAgent } as any
    );

    await createActivityLog(
      {
        tenantId,
        userId,
        activityType: 'CUSTOMER_ADDRESS_CREATED',
        description: `Created address with ID ${address.id} for customer ${customerId}`,
      },
      { ipAddress: ip } as any
    );

    return address;
  }

  public async updateAddress(
    tenantId: number,
    storeId: number,
    id: number,
    userId: number,
    data: any,
    ip?: string,
    userAgent?: string
  ): Promise<CustomerAddress> {
    const address = await this.getAddress(tenantId, storeId, id);
    const oldValues = address.toJSON();

    await sequelize.transaction(async (t) => {
      if (data.isDefaultBilling && !address.isDefaultBilling) {
        await this.addressRepo.dbModel.update(
          { isDefaultBilling: false },
          {
            where: {
              tenant_id: tenantId,
              store_id: storeId,
              customer_id: address.customerId,
              is_default_billing: true,
            },
            transaction: t,
          }
        );
      }

      if (data.isDefaultShipping && !address.isDefaultShipping) {
        await this.addressRepo.dbModel.update(
          { isDefaultShipping: false },
          {
            where: {
              tenant_id: tenantId,
              store_id: storeId,
              customer_id: address.customerId,
              is_default_shipping: true,
            },
            transaction: t,
          }
        );
      }

      await this.addressRepo.updateScoped(tenantId, storeId, id, data, { transaction: t });
    });

    const updated = await this.getAddress(tenantId, storeId, id);

    await createAuditLog(
      {
        tenantId,
        actorId: userId,
        action: 'CUSTOMER_ADDRESS_UPDATED',
        entityType: 'CustomerAddress',
        entityId: String(id),
        previousValues: oldValues,
        newValues: updated.toJSON(),
      },
      { ipAddress: ip, userAgent } as any
    );

    await createActivityLog(
      {
        tenantId,
        userId,
        activityType: 'CUSTOMER_ADDRESS_UPDATED',
        description: `Updated address with ID ${id}`,
      },
      { ipAddress: ip } as any
    );

    return updated;
  }

  public async deleteAddress(
    tenantId: number,
    storeId: number,
    id: number,
    userId: number,
    ip?: string,
    userAgent?: string
  ): Promise<void> {
    const address = await this.getAddress(tenantId, storeId, id);

    await sequelize.transaction(async (t) => {
      await this.addressRepo.updateScoped(
        tenantId,
        storeId,
        id,
        {
          isDefaultBilling: false,
          isDefaultShipping: false,
        },
        { transaction: t }
      );

      await this.addressRepo.deleteScoped(tenantId, storeId, id, { transaction: t });
    });

    await createAuditLog(
      {
        tenantId,
        actorId: userId,
        action: 'CUSTOMER_ADDRESS_DELETED',
        entityType: 'CustomerAddress',
        entityId: String(id),
        previousValues: address.toJSON(),
        newValues: null,
      },
      { ipAddress: ip, userAgent } as any
    );

    await createActivityLog(
      {
        tenantId,
        userId,
        activityType: 'CUSTOMER_ADDRESS_DELETED',
        description: `Deleted address with ID ${id}`,
      },
      { ipAddress: ip } as any
    );
  }

  public async restoreAddress(
    tenantId: number,
    storeId: number,
    id: number,
    userId: number,
    ip?: string,
    userAgent?: string
  ): Promise<CustomerAddress> {
    const address = await sequelize.transaction(async (t) => {
      const restored = await this.addressRepo.restoreScoped(tenantId, storeId, id, {
        transaction: t,
      });
      if (!restored) {
        throw new NotFoundError(`Address with ID ${id} not found or not deleted.`);
      }
      return restored;
    });

    await createAuditLog(
      {
        tenantId,
        actorId: userId,
        action: 'CUSTOMER_ADDRESS_RESTORED',
        entityType: 'CustomerAddress',
        entityId: String(id),
        previousValues: null,
        newValues: address.toJSON(),
      },
      { ipAddress: ip, userAgent } as any
    );

    await createActivityLog(
      {
        tenantId,
        userId,
        activityType: 'CUSTOMER_ADDRESS_RESTORED',
        description: `Restored address with ID ${id}`,
      },
      { ipAddress: ip } as any
    );

    return address;
  }

  public async setDefaultBilling(
    tenantId: number,
    storeId: number,
    id: number,
    userId: number,
    ip?: string,
    userAgent?: string
  ): Promise<CustomerAddress> {
    const address = await this.getAddress(tenantId, storeId, id);

    await sequelize.transaction(async (t) => {
      await this.addressRepo.dbModel.update(
        { isDefaultBilling: false },
        {
          where: {
            tenant_id: tenantId,
            store_id: storeId,
            customer_id: address.customerId,
            is_default_billing: true,
          },
          transaction: t,
        }
      );

      await this.addressRepo.updateScoped(
        tenantId,
        storeId,
        id,
        { isDefaultBilling: true },
        { transaction: t }
      );
    });

    const updated = await this.getAddress(tenantId, storeId, id);

    await createAuditLog(
      {
        tenantId,
        actorId: userId,
        action: 'CUSTOMER_DEFAULT_ADDRESS_CHANGED',
        entityType: 'CustomerAddress',
        entityId: String(id),
        previousValues: address.toJSON(),
        newValues: updated.toJSON(),
      },
      { ipAddress: ip, userAgent } as any
    );

    await createActivityLog(
      {
        tenantId,
        userId,
        activityType: 'CUSTOMER_DEFAULT_ADDRESS_CHANGED',
        description: `Set default billing for customer ${address.customerId} to address ${id}`,
      },
      { ipAddress: ip } as any
    );

    return updated;
  }

  public async setDefaultShipping(
    tenantId: number,
    storeId: number,
    id: number,
    userId: number,
    ip?: string,
    userAgent?: string
  ): Promise<CustomerAddress> {
    const address = await this.getAddress(tenantId, storeId, id);

    await sequelize.transaction(async (t) => {
      await this.addressRepo.dbModel.update(
        { isDefaultShipping: false },
        {
          where: {
            tenant_id: tenantId,
            store_id: storeId,
            customer_id: address.customerId,
            is_default_shipping: true,
          },
          transaction: t,
        }
      );

      await this.addressRepo.updateScoped(
        tenantId,
        storeId,
        id,
        { isDefaultShipping: true },
        { transaction: t }
      );
    });

    const updated = await this.getAddress(tenantId, storeId, id);

    await createAuditLog(
      {
        tenantId,
        actorId: userId,
        action: 'CUSTOMER_DEFAULT_ADDRESS_CHANGED',
        entityType: 'CustomerAddress',
        entityId: String(id),
        previousValues: address.toJSON(),
        newValues: updated.toJSON(),
      },
      { ipAddress: ip, userAgent } as any
    );

    await createActivityLog(
      {
        tenantId,
        userId,
        activityType: 'CUSTOMER_DEFAULT_ADDRESS_CHANGED',
        description: `Set default shipping for customer ${address.customerId} to address ${id}`,
      },
      { ipAddress: ip } as any
    );

    return updated;
  }
}
