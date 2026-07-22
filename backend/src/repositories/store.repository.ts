import { BaseRepository } from '../core/BaseRepository';
import { Store } from '../database/models/store';

export class StoreRepository extends BaseRepository<Store> {
  constructor() {
    super(Store);
  }

  public async findBySlug(tenantId: number | null, slug: string): Promise<Store | null> {
    return this.findOne(tenantId, { where: { slug } });
  }
}
