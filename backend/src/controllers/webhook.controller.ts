import { Request, Response, NextFunction } from 'express';
import { WebhookService } from '../services/webhook.service';
import { success, created } from '../shared/responses';
import { createAuditLog } from '../utils/auditHelper';
import { createActivityLog } from '../utils/activityHelper';

export class WebhookController {
  private webhookService = new WebhookService();

  public createEndpoint = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = req.headers['x-store-id'] ? Number(req.headers['x-store-id']) : null;
      const userId = req.context!.authenticatedUserId!;

      const endpoint = await this.webhookService.createEndpoint(tenantId, storeId, req.body);

      await createAuditLog(
        {
          tenantId,
          actorId: userId,
          action: 'WEBHOOK_ENDPOINT_CREATED',
          entityType: 'WebhookEndpoint',
          entityId: endpoint.id.toString(),
          previousValues: null,
          newValues: endpoint.toJSON(),
        },
        req.context
      );

      await createActivityLog(
        {
          tenantId,
          userId,
          activityType: 'WEBHOOK_ENDPOINT_CREATED',
          description: `Created webhook endpoint '${endpoint.name}'`,
        },
        req.context
      );

      created(res, 'Webhook endpoint registered successfully', endpoint);
    } catch (error) {
      next(error);
    }
  };

  public getEndpoint = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const id = Number(req.params.id);

      const endpoint = await this.webhookService.getEndpoint(tenantId, id);
      success(res, 'Webhook endpoint retrieved successfully', endpoint);
    } catch (error) {
      next(error);
    }
  };

  public listEndpoints = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = req.headers['x-store-id'] ? Number(req.headers['x-store-id']) : null;

      const endpoints = await this.webhookService.listEndpoints(tenantId, storeId);
      success(res, 'Webhook endpoints retrieved successfully', endpoints);
    } catch (error) {
      next(error);
    }
  };

  public updateEndpoint = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const id = Number(req.params.id);
      const userId = req.context!.authenticatedUserId!;

      const previous = await this.webhookService.getEndpoint(tenantId, id);
      const updated = await this.webhookService.updateEndpoint(tenantId, id, req.body);

      await createAuditLog(
        {
          tenantId,
          actorId: userId,
          action: 'WEBHOOK_ENDPOINT_UPDATED',
          entityType: 'WebhookEndpoint',
          entityId: id.toString(),
          previousValues: previous.toJSON(),
          newValues: updated.toJSON(),
        },
        req.context
      );

      success(res, 'Webhook endpoint updated successfully', updated);
    } catch (error) {
      next(error);
    }
  };

  public deleteEndpoint = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const id = Number(req.params.id);
      const userId = req.context!.authenticatedUserId!;

      const previous = await this.webhookService.getEndpoint(tenantId, id);
      await this.webhookService.deleteEndpoint(tenantId, id);

      await createAuditLog(
        {
          tenantId,
          actorId: userId,
          action: 'WEBHOOK_ENDPOINT_DELETED',
          entityType: 'WebhookEndpoint',
          entityId: id.toString(),
          previousValues: previous.toJSON(),
          newValues: null,
        },
        req.context
      );

      success(res, 'Webhook endpoint deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  public triggerEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = req.headers['x-store-id'] ? Number(req.headers['x-store-id']) : null;
      const { eventType, payload } = req.body;

      const logs = await this.webhookService.dispatchEvent(tenantId, storeId, eventType, payload);
      success(res, `Webhook event '${eventType}' dispatched to ${logs.length} endpoints`, logs);
    } catch (error) {
      next(error);
    }
  };

  public listLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const endpointId = Number(req.params.id);

      const logs = await this.webhookService.listLogs(tenantId, endpointId);
      success(res, 'Webhook logs retrieved successfully', logs);
    } catch (error) {
      next(error);
    }
  };
}
