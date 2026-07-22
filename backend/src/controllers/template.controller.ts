import { Request, Response, NextFunction } from 'express';
import { TemplateService } from '../services/template.service';
import { success, created } from '../shared/responses';
import { createAuditLog } from '../utils/auditHelper';
import { createActivityLog } from '../utils/activityHelper';

export class TemplateController {
  private templateService = new TemplateService();

  public createTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = req.headers['x-store-id'] ? Number(req.headers['x-store-id']) : null;
      const userId = req.context!.authenticatedUserId!;

      const template = await this.templateService.createTemplate(tenantId, storeId, req.body);

      await createAuditLog(
        {
          tenantId,
          actorId: userId,
          action: 'NOTIFICATION_TEMPLATE_CREATED',
          entityType: 'NotificationTemplate',
          entityId: template.id.toString(),
          previousValues: null,
          newValues: template.toJSON(),
        },
        req.context
      );

      await createActivityLog(
        {
          tenantId,
          userId,
          activityType: 'NOTIFICATION_TEMPLATE_CREATED',
          description: `Created notification template '${template.name}'`,
        },
        req.context
      );

      created(res, 'Notification template created successfully', template);
    } catch (error) {
      next(error);
    }
  };

  public getTemplate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const id = Number(req.params.id);

      const template = await this.templateService.getTemplateById(tenantId, id);

      success(res, 'Notification template retrieved successfully', template);
    } catch (error) {
      next(error);
    }
  };

  public updateTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const id = Number(req.params.id);
      const userId = req.context!.authenticatedUserId!;

      const previous = await this.templateService.getTemplateById(tenantId, id);
      const updatedTemplate = await this.templateService.updateTemplate(tenantId, id, req.body);

      await createAuditLog(
        {
          tenantId,
          actorId: userId,
          action: 'NOTIFICATION_TEMPLATE_UPDATED',
          entityType: 'NotificationTemplate',
          entityId: id.toString(),
          previousValues: previous.toJSON(),
          newValues: updatedTemplate.toJSON(),
        },
        req.context
      );

      success(res, 'Notification template updated successfully', updatedTemplate);
    } catch (error) {
      next(error);
    }
  };

  public listTemplates = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = req.headers['x-store-id'] ? Number(req.headers['x-store-id']) : null;

      const templates = await this.templateService.listTemplates(tenantId, storeId);

      success(res, 'Notification templates retrieved successfully', templates);
    } catch (error) {
      next(error);
    }
  };
}
