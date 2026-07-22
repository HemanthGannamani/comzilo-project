/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseRepository } from '../core/BaseRepository';
import { OrderItem } from '../database/models/orderItem';

export class OrderItemRepository extends BaseRepository<OrderItem> {
  constructor() {
    super(OrderItem);
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

  public async findScopedMany(
    tenantId: number,
    storeId: number,
    options: any = {}
  ): Promise<OrderItem[]> {
    return this.model.findAll(this.applyStoreScope(tenantId, storeId, options));
  }

  public async createScoped(
    tenantId: number,
    storeId: number,
    data: any,
    options: any = {}
  ): Promise<OrderItem> {
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
