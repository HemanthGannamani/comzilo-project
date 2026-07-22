/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import { ProductClassificationService } from '../services/productClassification.service';
import { createAuditLog } from '../utils/auditHelper';
import { RESPONSE_MESSAGES } from '../shared/constants';
import { success } from '../shared/responses';
import { ValidationError } from '../shared/errors/AppError';

export class ProductClassificationController {
  private classificationService: ProductClassificationService;

  constructor() {
    this.classificationService = new ProductClassificationService();
  }

  private getStoreId(req: Request): number {
    const storeId = Number(req.headers['x-store-id'] || req.query.storeId || req.body.storeId);
    if (!storeId || isNaN(storeId)) {
      throw new ValidationError('Store context is missing');
    }
    return storeId;
  }

  public getClassification = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const productId = parseInt(req.params.id, 10);

      const classification = await this.classificationService.getClassification(
        tenantId,
        storeId,
        productId
      );

      success(res, RESPONSE_MESSAGES.SUCCESS, classification);
    } catch (error) {
      next(error);
    }
  };

  public replaceCategories = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const productId = parseInt(req.params.id, 10);
      const { categoryIds, primaryCategoryId } = req.body;

      const oldClassification = await this.classificationService.getClassification(
        tenantId,
        storeId,
        productId
      );
      await this.classificationService.replaceCategories(
        tenantId,
        storeId,
        productId,
        categoryIds,
        primaryCategoryId
      );

      await createAuditLog(
        {
          tenantId,
          action: 'product.categories.replace',
          entityType: 'product',
          entityId: String(productId),
          previousValues: { categoryIds: oldClassification.categories.map((c: any) => c.id) },
          newValues: { categoryIds, primaryCategoryId },
        },
        req.context
      );

      success(res, 'Product categories replaced successfully');
    } catch (error) {
      next(error);
    }
  };

  public assignBrand = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const productId = parseInt(req.params.id, 10);
      const { brandId } = req.body;

      const oldClassification = await this.classificationService.getClassification(
        tenantId,
        storeId,
        productId
      );
      await this.classificationService.assignBrand(tenantId, storeId, productId, brandId);

      await createAuditLog(
        {
          tenantId,
          action: 'product.brand.assign',
          entityType: 'product',
          entityId: String(productId),
          previousValues: { brandId: oldClassification.brand ? oldClassification.brand.id : null },
          newValues: { brandId },
        },
        req.context
      );

      success(res, 'Product brand assigned successfully');
    } catch (error) {
      next(error);
    }
  };

  public replaceCollections = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const productId = parseInt(req.params.id, 10);
      const { collectionIds } = req.body;

      const oldClassification = await this.classificationService.getClassification(
        tenantId,
        storeId,
        productId
      );
      await this.classificationService.replaceCollections(
        tenantId,
        storeId,
        productId,
        collectionIds
      );

      await createAuditLog(
        {
          tenantId,
          action: 'product.collections.replace',
          entityType: 'product',
          entityId: String(productId),
          previousValues: { collectionIds: oldClassification.collections.map((c: any) => c.id) },
          newValues: { collectionIds },
        },
        req.context
      );

      success(res, 'Product collections replaced successfully');
    } catch (error) {
      next(error);
    }
  };

  public replaceTags = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const productId = parseInt(req.params.id, 10);
      const { tagIds } = req.body;

      const oldClassification = await this.classificationService.getClassification(
        tenantId,
        storeId,
        productId
      );
      await this.classificationService.replaceTags(tenantId, storeId, productId, tagIds);

      await createAuditLog(
        {
          tenantId,
          action: 'product.tags.replace',
          entityType: 'product',
          entityId: String(productId),
          previousValues: { tagIds: oldClassification.tags.map((t: any) => t.id) },
          newValues: { tagIds },
        },
        req.context
      );

      success(res, 'Product tags replaced successfully');
    } catch (error) {
      next(error);
    }
  };
}
