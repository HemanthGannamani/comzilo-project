/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseRepository } from '../core/BaseRepository';
import { Refund } from '../database/models/refund';

export class RefundRepository extends BaseRepository<Refund> {
  constructor() {
    super(Refund);
  }

  private applyStoreScope(tenantId: number, storeId: number, options: any = {}): any {
    const opts = { ...options };
    opts.where = {
      ...opts.where,
      tenant_id: tenantId,
      store_id: storeId,
    };
    return opts;
  }

  public async findScopedById(
    tenantId: number,
    storeId: number,
    id: number,
    options: any = {}
  ): Promise<Refund | null> {
    return this.model.findOne(
      this.applyStoreScope(tenantId, storeId, { ...options, where: { ...options.where, id } })
    );
  }

  public async findScopedOne(
    tenantId: number,
    storeId: number,
    options: any = {}
  ): Promise<Refund | null> {
    return this.model.findOne(this.applyStoreScope(tenantId, storeId, options));
  }

  public async findScopedMany(
    tenantId: number,
    storeId: number,
    options: any = {}
  ): Promise<Refund[]> {
    return this.model.findAll(this.applyStoreScope(tenantId, storeId, options));
  }

  public async findAndCountAllScoped(
    tenantId: number,
    storeId: number,
    options: any = {}
  ): Promise<{ rows: Refund[]; count: number }> {
    return this.model.findAndCountAll(this.applyStoreScope(tenantId, storeId, options));
  }

  public async createScoped(
    tenantId: number,
    storeId: number,
    data: any,
    options: any = {}
  ): Promise<Refund> {
    return this.model.create(
      {
        ...data,
        tenantId,
        storeId,
        tenant_id: tenantId,
        store_id: storeId,
      },
      options
    );
  }

  public async updateScoped(
    tenantId: number,
    storeId: number,
    id: number,
    data: any,
    options: any = {}
  ): Promise<number> {
    const [affected] = await this.model.update(
      data,
      this.applyStoreScope(tenantId, storeId, { ...options, where: { ...options.where, id } })
    );
    return affected;
  }
}
