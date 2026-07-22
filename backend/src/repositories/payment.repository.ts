/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseRepository } from '../core/BaseRepository';
import { Payment } from '../database/models/payment';

export class PaymentRepository extends BaseRepository<Payment> {
  constructor() {
    super(Payment);
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
  ): Promise<Payment | null> {
    return this.model.findOne(
      this.applyStoreScope(tenantId, storeId, { ...options, where: { ...options.where, id } })
    );
  }

  public async findScopedOne(
    tenantId: number,
    storeId: number,
    options: any = {}
  ): Promise<Payment | null> {
    return this.model.findOne(this.applyStoreScope(tenantId, storeId, options));
  }

  public async findScopedMany(
    tenantId: number,
    storeId: number,
    options: any = {}
  ): Promise<Payment[]> {
    return this.model.findAll(this.applyStoreScope(tenantId, storeId, options));
  }

  public async findAndCountAllScoped(
    tenantId: number,
    storeId: number,
    options: any = {}
  ): Promise<{ rows: Payment[]; count: number }> {
    return this.model.findAndCountAll(this.applyStoreScope(tenantId, storeId, options));
  }

  public async createScoped(
    tenantId: number,
    storeId: number,
    data: any,
    options: any = {}
  ): Promise<Payment> {
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
