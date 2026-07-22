/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { BaseRepository } from '../core/BaseRepository';
import { ProductTag } from '../database/models/productTag';

export class ProductTagRepository extends BaseRepository<ProductTag> {
  constructor() {
    super(ProductTag);
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

  public async findScopedOne(
    tenantId: number,
    storeId: number,
    options: any = {}
  ): Promise<ProductTag | null> {
    return this.model.findOne(this.applyStoreScope(tenantId, storeId, options));
  }

  public async findScopedMany(
    tenantId: number,
    storeId: number,
    options: any = {}
  ): Promise<ProductTag[]> {
    return this.model.findAll(this.applyStoreScope(tenantId, storeId, options));
  }

  public async createScoped(tenantId: number, storeId: number, data: any): Promise<ProductTag> {
    return this.model.create({
      ...data,
      tenantId,
      storeId,
      tenant_id: tenantId,
      store_id: storeId,
    });
  }

  public async deleteScoped(tenantId: number, storeId: number, where: any): Promise<number> {
    return this.model.destroy(this.applyStoreScope(tenantId, storeId, { where }));
  }

  public async bulkCreateScoped(
    tenantId: number,
    storeId: number,
    dataArray: any[]
  ): Promise<ProductTag[]> {
    const records = dataArray.map((item) => ({
      ...item,
      tenantId,
      storeId,
      tenant_id: tenantId,
      store_id: storeId,
    }));
    return this.model.bulkCreate(records);
  }
}
