/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseRepository } from '../core/BaseRepository';
import { NotificationTemplate } from '../database/models/notificationTemplate';

export class NotificationTemplateRepository extends BaseRepository<NotificationTemplate> {
  constructor() {
    super(NotificationTemplate);
  }

  public async findByCode(
    tenantId: number,
    storeId: number | null,
    code: string
  ): Promise<NotificationTemplate | null> {
    const whereClause: Record<string, unknown> = { tenantId, code, isActive: true };
    if (storeId) {
      whereClause.storeId = storeId;
    }
    return this.model.findOne({ where: whereClause });
  }

  public async findScopedById(tenantId: number, id: number): Promise<NotificationTemplate | null> {
    return this.model.findOne({ where: { tenantId, id } });
  }

  public async createScoped(
    tenantId: number,
    storeId: number | null,
    data: any
  ): Promise<NotificationTemplate> {
    return this.model.create({ ...data, tenantId, storeId });
  }
}
