/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { StoreAnalyticsService } from '../services/storeAnalytics.service';
import { success, badRequest, created } from '../shared/responses';
import { logger } from '../shared/logging/logger';

export class StoreAnalyticsController {
  // EXECUTIVE DASHBOARD & KPIS
  static async getDashboard(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const data = await StoreAnalyticsService.getDashboardKPIs(tenantId, storeId);
      success(res, 'Executive BI Dashboard retrieved successfully', data);
    } catch (error: unknown) {
      const err = error as Error;
      logger.error(`[StoreAnalyticsController] getDashboard error: ${err.message}`);
      badRequest(res, err.message);
    }
  }

  // DOMAIN ANALYTICS
  static async getSalesAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const sales = await StoreAnalyticsService.getSalesAnalytics(tenantId, storeId);
      success(res, 'Sales analytics retrieved successfully', sales);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async getInventoryAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const inventory = await StoreAnalyticsService.getInventoryAnalytics(tenantId, storeId);
      success(res, 'Inventory analytics retrieved successfully', inventory);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async getFinanceAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const finance = await StoreAnalyticsService.getFinanceAnalytics(tenantId, storeId);
      success(res, 'Finance analytics retrieved successfully', finance);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async getCustomerAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const customers = await StoreAnalyticsService.getCustomerAnalytics(tenantId, storeId);
      success(res, 'Customer analytics retrieved successfully', customers);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // PREDICTIVE FORECASTING ENGINE
  static async getForecast(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const forecast = await StoreAnalyticsService.getForecasts(tenantId, storeId);
      success(res, 'Predictive forecasting model retrieved successfully', forecast);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // REPORT BUILDER & EXPORTS
  static async getSavedReports(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const reports = await StoreAnalyticsService.getSavedReports(tenantId, storeId);
      success(res, 'Saved reports retrieved successfully', reports);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async createSavedReport(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const report = await StoreAnalyticsService.createSavedReport(
        tenantId,
        storeId,
        userId,
        req.body
      );
      created(res, 'Custom report created and saved successfully', report);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async exportData(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const reportType = (req.query.type as string) || 'sales';

      const exportStream = await StoreAnalyticsService.exportDataStream(
        tenantId,
        storeId,
        reportType
      );
      success(res, 'Analytics data exported successfully', exportStream);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }
}
