/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseService } from '../core/BaseService';
import { NotificationTemplateRepository } from '../repositories/notificationTemplate.repository';
import { NotificationTemplate } from '../database/models/notificationTemplate';
import { NotFoundError } from '../shared/errors/AppError';

export class TemplateService extends BaseService {
  private templateRepo = new NotificationTemplateRepository();

  constructor() {
    super('TemplateService');
  }

  public compileTemplate(templateString: string, variables: Record<string, any> = {}): string {
    if (!templateString) return '';
    return templateString.replace(/\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g, (_match, key) => {
      const val = variables[key];
      return val !== undefined && val !== null ? String(val) : '';
    });
  }

  public async createTemplate(
    tenantId: number,
    storeId: number | null,
    data: any
  ): Promise<NotificationTemplate> {
    return this.templateRepo.createScoped(tenantId, storeId, data);
  }

  public async getTemplateById(tenantId: number, id: number): Promise<NotificationTemplate> {
    const tpl = await this.templateRepo.findScopedById(tenantId, id);
    if (!tpl) {
      throw new NotFoundError(`Notification template with ID ${id} not found.`);
    }
    return tpl;
  }

  public async updateTemplate(
    tenantId: number,
    id: number,
    data: any
  ): Promise<NotificationTemplate> {
    const tpl = await this.getTemplateById(tenantId, id);
    return tpl.update(data);
  }

  public async listTemplates(
    tenantId: number,
    storeId: number | null
  ): Promise<NotificationTemplate[]> {
    const where: any = { tenantId };
    if (storeId) where.storeId = storeId;
    return this.templateRepo.model.findAll({ where });
  }
}
