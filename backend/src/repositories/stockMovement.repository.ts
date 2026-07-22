/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseRepository } from '../core/BaseRepository';
import { StockMovement } from '../database/models/stockMovement';

export class StockMovementRepository extends BaseRepository<StockMovement> {
  constructor() {
    super(StockMovement);
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
  ): Promise<StockMovement | null> {
    return this.model.findOne(
      this.applyStoreScope(tenantId, storeId, { ...options, where: { ...options.where, id } })
    );
  }

  public async findScopedOne(
    tenantId: number,
    storeId: number,
    options: any = {}
  ): Promise<StockMovement | null> {
    return this.model.findOne(this.applyStoreScope(tenantId, storeId, options));
  }

  public async findScopedMany(
    tenantId: number,
    storeId: number,
    options: any = {}
  ): Promise<StockMovement[]> {
    return this.model.findAll(this.applyStoreScope(tenantId, storeId, options));
  }

  public async findAndCountAllScoped(
    tenantId: number,
    storeId: number,
    options: any = {}
  ): Promise<{ rows: StockMovement[]; count: number }> {
    return this.model.findAndCountAll(this.applyStoreScope(tenantId, storeId, options));
  }

  public async createScoped(
    tenantId: number,
    storeId: number,
    data: any,
    options: any = {}
  ): Promise<StockMovement> {
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
}
