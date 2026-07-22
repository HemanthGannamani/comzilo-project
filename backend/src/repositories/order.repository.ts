/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseRepository } from '../core/BaseRepository';
import { Order } from '../database/models/order';

export class OrderRepository extends BaseRepository<Order> {
  constructor() {
    super(Order);
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
  ): Promise<Order | null> {
    return this.model.findOne(
      this.applyStoreScope(tenantId, storeId, { ...options, where: { ...options.where, id } })
    );
  }

  public async findScopedOne(
    tenantId: number,
    storeId: number,
    options: any = {}
  ): Promise<Order | null> {
    return this.model.findOne(this.applyStoreScope(tenantId, storeId, options));
  }

  public async findScopedMany(
    tenantId: number,
    storeId: number,
    options: any = {}
  ): Promise<Order[]> {
    return this.model.findAll(this.applyStoreScope(tenantId, storeId, options));
  }

  public async findAndCountAllScoped(
    tenantId: number,
    storeId: number,
    options: any = {}
  ): Promise<{ rows: Order[]; count: number }> {
    return this.model.findAndCountAll(this.applyStoreScope(tenantId, storeId, options));
  }

  public async createScoped(
    tenantId: number,
    storeId: number,
    data: any,
    options: any = {}
  ): Promise<Order> {
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

  public async deleteScoped(
    tenantId: number,
    storeId: number,
    id: number,
    options: any = {}
  ): Promise<number> {
    return this.model.destroy(
      this.applyStoreScope(tenantId, storeId, { ...options, where: { ...options.where, id } })
    );
  }

  public async restoreScoped(
    tenantId: number,
    storeId: number,
    id: number,
    options: any = {}
  ): Promise<Order | null> {
    const record = await this.model.findOne(
      this.applyStoreScope(tenantId, storeId, {
        ...options,
        where: { ...options.where, id },
        paranoid: false,
      })
    );
    if (record) {
      await record.restore(options);
      return record;
    }
    return null;
  }
}
