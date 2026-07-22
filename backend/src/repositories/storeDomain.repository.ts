import { BaseRepository } from '../core/BaseRepository';
import { StoreDomain } from '../database/models/storeDomain';

export class StoreDomainRepository extends BaseRepository<StoreDomain> {
  constructor() {
    super(StoreDomain);
  }

  public async findByDomain(domain: string): Promise<StoreDomain | null> {
    return this.findOne(null, { where: { domain } });
  }

  public async findPrimaryDomain(
    tenantId: number | null,
    storeId: number
  ): Promise<StoreDomain | null> {
    return this.findOne(tenantId, { where: { store_id: storeId, is_primary: true } });
  }
}
