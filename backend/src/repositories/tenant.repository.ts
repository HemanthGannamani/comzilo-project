import { BaseRepository } from '../core/BaseRepository';
import { Tenant } from '../database/models/tenant';

export class TenantRepository extends BaseRepository<Tenant> {
  constructor() {
    super(Tenant);
  }

  public async findBySlug(slug: string): Promise<Tenant | null> {
    return this.findOne(null, { where: { slug } });
  }

  public async findByUuid(uuid: string): Promise<Tenant | null> {
    return this.findOne(null, { where: { uuid } });
  }
}
