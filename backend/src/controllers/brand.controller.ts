/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import { BrandService } from '../services/brand.service';
import { createAuditLog } from '../utils/auditHelper';
import { RESPONSE_MESSAGES } from '../shared/constants';
import { success, created } from '../shared/responses';
import { ValidationError } from '../shared/errors/AppError';

export class BrandController {
  private brandService: BrandService;

  constructor() {
    this.brandService = new BrandService();
  }

  private getStoreId(req: Request): number {
    const storeId = Number(req.headers['x-store-id'] || req.query.storeId || req.body.storeId);
    if (!storeId || isNaN(storeId)) {
      throw new ValidationError('Store context is missing');
    }
    return storeId;
  }

  public createBrand = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const userId = req.context!.authenticatedUserId!;

      const brand = await this.brandService.createBrand(tenantId, storeId, userId, req.body);

      await createAuditLog(
        {
          tenantId,
          action: 'brand.create',
          entityType: 'brand',
          entityId: String(brand.id),
          newValues: brand.toJSON(),
        },
        req.context
      );

      created(res, 'Brand created successfully', brand);
    } catch (error) {
      next(error);
    }
  };

  public getBrand = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const brandId = parseInt(req.params.id, 10);

      const brand = await this.brandService.getBrand(tenantId, storeId, brandId);

      success(res, RESPONSE_MESSAGES.SUCCESS, brand);
    } catch (error) {
      next(error);
    }
  };

  public listBrands = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const filters = req.query;

      const brands = await this.brandService.listBrands(tenantId, storeId, filters);

      success(res, RESPONSE_MESSAGES.SUCCESS, brands.rows, {
        total: brands.count,
        page: parseInt((filters.page as string) || '1', 10),
        limit: parseInt((filters.limit as string) || '10', 10),
      });
    } catch (error) {
      next(error);
    }
  };

  public updateBrand = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const userId = req.context!.authenticatedUserId!;
      const brandId = parseInt(req.params.id, 10);

      const oldBrand = await this.brandService.getBrand(tenantId, storeId, brandId);
      const brand = await this.brandService.updateBrand(
        tenantId,
        storeId,
        brandId,
        userId,
        req.body
      );

      await createAuditLog(
        {
          tenantId,
          action: 'brand.update',
          entityType: 'brand',
          entityId: String(brand.id),
          previousValues: oldBrand.toJSON(),
          newValues: brand.toJSON(),
        },
        req.context
      );

      success(res, 'Brand updated successfully', brand);
    } catch (error) {
      next(error);
    }
  };

  public deleteBrand = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const userId = req.context!.authenticatedUserId!;
      const brandId = parseInt(req.params.id, 10);

      const brand = await this.brandService.getBrand(tenantId, storeId, brandId);
      await this.brandService.deleteBrand(tenantId, storeId, brandId, userId);

      await createAuditLog(
        {
          tenantId,
          action: 'brand.delete',
          entityType: 'brand',
          entityId: String(brandId),
          previousValues: brand.toJSON(),
        },
        req.context
      );

      success(res, 'Brand deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  public restoreBrand = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const userId = req.context!.authenticatedUserId!;
      const brandId = parseInt(req.params.id, 10);

      const brand = await this.brandService.restoreBrand(tenantId, storeId, brandId, userId);

      await createAuditLog(
        {
          tenantId,
          action: 'brand.restore',
          entityType: 'brand',
          entityId: String(brandId),
          newValues: brand.toJSON(),
        },
        req.context
      );

      success(res, 'Brand restored successfully', brand);
    } catch (error) {
      next(error);
    }
  };
}
