/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseRepository } from '../core/BaseRepository';
import { Product } from '../database/models/product';

export class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super(Product);
  }

  private applyStoreScope(tenantId: number, storeId: number, options: any = {}): any {
    const opts = { ...options };
    opts.where = {
      ...opts.where,
      tenantId,
      storeId,
    };
    return opts;
  }

  public async findScopedById(
    tenantId: number,
    storeId: number,
    id: number,
    options: any = {}
  ): Promise<Product | null> {
    return this.model.findOne(
      this.applyStoreScope(tenantId, storeId, { ...options, where: { ...options.where, id } })
    );
  }

  public async findScopedOne(
    tenantId: number,
    storeId: number,
    options: any = {}
  ): Promise<Product | null> {
    return this.model.findOne(this.applyStoreScope(tenantId, storeId, options));
  }
}
