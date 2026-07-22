import { Request, Response, NextFunction } from 'express';
import { IntegrationService } from '../services/integration.service';
import { success, created } from '../shared/responses';
import { createAuditLog } from '../utils/auditHelper';
import { createActivityLog } from '../utils/activityHelper';

export class IntegrationController {
  private integrationService = new IntegrationService();

  public getMarketplaceApps = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const apps = this.integrationService.getMarketplaceApps();
      success(res, 'Marketplace integrations retrieved successfully', apps);
    } catch (error) {
      next(error);
    }
  };

  public connectIntegration = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = req.headers['x-store-id'] ? Number(req.headers['x-store-id']) : null;
      const userId = req.context!.authenticatedUserId!;

      const integration = await this.integrationService.connectIntegration(
        tenantId,
        storeId,
        req.body
      );

      await createAuditLog(
        {
          tenantId,
          actorId: userId,
          action: 'INTEGRATION_CONNECTED',
          entityType: 'Integration',
          entityId: integration.id.toString(),
          previousValues: null,
          newValues: integration.toJSON(),
        },
        req.context
      );

      await createActivityLog(
        {
          tenantId,
          userId,
          activityType: 'INTEGRATION_CONNECTED',
          description: `Connected external integration '${integration.name}'`,
        },
        req.context
      );

      created(res, 'Integration connected successfully', integration);
    } catch (error) {
      next(error);
    }
  };

  public getIntegration = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const id = Number(req.params.id);

      const integration = await this.integrationService.getIntegration(tenantId, id);
      success(res, 'Integration details retrieved successfully', integration);
    } catch (error) {
      next(error);
    }
  };

  public listIntegrations = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = req.headers['x-store-id'] ? Number(req.headers['x-store-id']) : null;

      const integrations = await this.integrationService.listIntegrations(tenantId, storeId);
      success(res, 'Integrations retrieved successfully', integrations);
    } catch (error) {
      next(error);
    }
  };

  public updateIntegration = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const id = Number(req.params.id);
      const userId = req.context!.authenticatedUserId!;

      const previous = await this.integrationService.getIntegration(tenantId, id);
      const updated = await this.integrationService.updateIntegration(tenantId, id, req.body);

      await createAuditLog(
        {
          tenantId,
          actorId: userId,
          action: 'INTEGRATION_UPDATED',
          entityType: 'Integration',
          entityId: id.toString(),
          previousValues: previous.toJSON(),
          newValues: updated.toJSON(),
        },
        req.context
      );

      success(res, 'Integration updated successfully', updated);
    } catch (error) {
      next(error);
    }
  };

  public disconnectIntegration = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const id = Number(req.params.id);
      const userId = req.context!.authenticatedUserId!;

      const disconnected = await this.integrationService.disconnectIntegration(tenantId, id);

      await createAuditLog(
        {
          tenantId,
          actorId: userId,
          action: 'INTEGRATION_DISCONNECTED',
          entityType: 'Integration',
          entityId: id.toString(),
          previousValues: null,
          newValues: disconnected.toJSON(),
        },
        req.context
      );

      success(res, 'Integration disconnected successfully', disconnected);
    } catch (error) {
      next(error);
    }
  };

  public triggerSync = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const id = Number(req.params.id);
      const { syncType } = req.body;

      const syncLog = await this.integrationService.triggerSync(tenantId, id, syncType);
      success(res, `Integration sync '${syncType}' completed successfully`, syncLog);
    } catch (error) {
      next(error);
    }
  };

  public listSyncLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const id = Number(req.params.id);

      const logs = await this.integrationService.listSyncLogs(tenantId, id);
      success(res, 'Integration sync logs retrieved successfully', logs);
    } catch (error) {
      next(error);
    }
  };
}
