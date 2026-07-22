/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseRepository } from '../core/BaseRepository';
import { IntegrationSyncLog } from '../database/models/integrationSyncLog';

export class IntegrationSyncLogRepository extends BaseRepository<IntegrationSyncLog> {
  constructor() {
    super(IntegrationSyncLog);
  }

  public async getLogsByIntegration(
    tenantId: number,
    integrationId: number
  ): Promise<IntegrationSyncLog[]> {
    return this.model.findAll({
      where: { tenantId, integrationId },
      order: [['id', 'DESC']],
    });
  }
}
