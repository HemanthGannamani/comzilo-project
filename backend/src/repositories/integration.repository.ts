/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseRepository } from '../core/BaseRepository';
import { Integration } from '../database/models/integration';

export class IntegrationRepository extends BaseRepository<Integration> {
  constructor() {
    super(Integration);
  }

  public async findByProvider(
    tenantId: number,
    storeId: number | null,
    provider: string
  ): Promise<Integration | null> {
    const where: any = { tenantId, provider };
    if (storeId) where.storeId = storeId;
    return this.model.findOne({ where });
  }

  public async listIntegrations(tenantId: number, storeId: number | null): Promise<Integration[]> {
    const where: any = { tenantId };
    if (storeId) where.storeId = storeId;
    return this.model.findAll({ where });
  }
}
