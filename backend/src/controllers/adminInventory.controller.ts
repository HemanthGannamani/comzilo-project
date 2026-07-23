import { Request, Response, NextFunction } from 'express';
import { InventoryManagementService } from '../services/inventoryManagement.service';
import { success } from '../shared/responses';

const inventoryService = new InventoryManagementService();

export class AdminInventoryController {
  public getAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.query.tenantId ? Number(req.query.tenantId) : 1;
      const stats = await inventoryService.getDashboardStats(tenantId);
      success(res, 'Global inventory analytics retrieved successfully', stats);
    } catch (error) {
      next(error);
    }
  };

  public getWarehouseMonitoring = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.query.tenantId ? Number(req.query.tenantId) : 1;
      const warehouses = await inventoryService.getWarehouses(tenantId);
      success(res, 'Warehouse monitoring data retrieved successfully', warehouses);
    } catch (error) {
      next(error);
    }
  };
}
