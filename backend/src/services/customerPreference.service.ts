/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomerPreferenceRepository } from '../repositories/customerPreference.repository';
import { CustomerPreference } from '../database/models/customerPreference';
import { BaseService } from '../core/BaseService';
import { NotFoundError } from '../shared/errors/AppError';
import { createAuditLog } from '../utils/auditHelper';
import { createActivityLog } from '../utils/activityHelper';

export class CustomerPreferenceService extends BaseService {
  private preferenceRepo = new CustomerPreferenceRepository();

  constructor() {
    super('CustomerPreferenceService');
  }

  public async getPreferences(
    tenantId: number,
    storeId: number,
    customerId: number
  ): Promise<CustomerPreference> {
    const preference = await this.preferenceRepo.findScopedOne(tenantId, storeId, {
      where: { customerId },
    });
    if (!preference) {
      throw new NotFoundError(`Preferences for customer ID ${customerId} not found.`);
    }
    return preference;
  }

  public async updatePreferences(
    tenantId: number,
    storeId: number,
    customerId: number,
    userId: number,
    data: any,
    ip?: string,
    userAgent?: string
  ): Promise<CustomerPreference> {
    const preference = await this.getPreferences(tenantId, storeId, customerId);
    const oldValues = preference.toJSON();

    await this.preferenceRepo.updateScoped(tenantId, storeId, preference.id, data);
    const updated = await this.getPreferences(tenantId, storeId, customerId);

    await createAuditLog(
      {
        tenantId,
        actorId: userId,
        action: 'CUSTOMER_PREFERENCES_UPDATED',
        entityType: 'CustomerPreference',
        entityId: String(preference.id),
        previousValues: oldValues,
        newValues: updated.toJSON(),
      },
      { ipAddress: ip, userAgent } as any
    );

    await createActivityLog(
      {
        tenantId,
        userId,
        activityType: 'CUSTOMER_PREFERENCES_UPDATED',
        description: `Updated customer preferences for customer ${customerId}`,
      },
      { ipAddress: ip } as any
    );

    return updated;
  }
}
