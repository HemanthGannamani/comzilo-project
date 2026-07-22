/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { BaseRepository } from '../core/BaseRepository';
import { Category } from '../database/models/category';

export class CategoryRepository extends BaseRepository<Category> {
  constructor() {
    super(Category);
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
  ): Promise<Category | null> {
    return this.model.findOne(
      this.applyStoreScope(tenantId, storeId, { ...options, where: { ...options.where, id } })
    );
  }

  public async findScopedOne(
    tenantId: number,
    storeId: number,
    options: any = {}
  ): Promise<Category | null> {
    return this.model.findOne(this.applyStoreScope(tenantId, storeId, options));
  }

  public async findScopedMany(
    tenantId: number,
    storeId: number,
    options: any = {}
  ): Promise<Category[]> {
    return this.model.findAll(this.applyStoreScope(tenantId, storeId, options));
  }

  public async findAndCountAllScoped(
    tenantId: number,
    storeId: number,
    options: any = {}
  ): Promise<{ rows: Category[]; count: number }> {
    return this.model.findAndCountAll(this.applyStoreScope(tenantId, storeId, options));
  }

  public async createScoped(tenantId: number, storeId: number, data: any): Promise<Category> {
    return this.model.create({
      ...data,
      tenantId,
      storeId,
      tenant_id: tenantId,
      store_id: storeId,
    });
  }

  public async updateScoped(
    tenantId: number,
    storeId: number,
    id: number,
    data: any
  ): Promise<number> {
    const [affected] = await this.model.update(
      data,
      this.applyStoreScope(tenantId, storeId, { where: { id } })
    );
    return affected;
  }

  public async deleteScoped(tenantId: number, storeId: number, id: number): Promise<number> {
    return this.model.destroy(this.applyStoreScope(tenantId, storeId, { where: { id } }));
  }

  public async restoreScoped(
    tenantId: number,
    storeId: number,
    id: number
  ): Promise<Category | null> {
    const record = await this.model.findOne(
      this.applyStoreScope(tenantId, storeId, { where: { id }, paranoid: false })
    );
    if (record) {
      await record.restore();
      return record;
    }
    return null;
  }
}
