/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { StoreCatalogService } from '../services/storeCatalog.service';
import { success, badRequest, created } from '../shared/responses';
import { logger } from '../shared/logging/logger';

export class StoreCatalogController {
  // CATEGORIES
  static async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const tree = await StoreCatalogService.getCategoriesTree(tenantId, storeId);
      success(res, 'Categories tree retrieved successfully', tree);
    } catch (error: unknown) {
      const err = error as Error;
      logger.error(`[StoreCatalogController] getCategories error: ${err.message}`);
      badRequest(res, err.message);
    }
  }

  static async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const category = await StoreCatalogService.createCategory(
        tenantId,
        storeId,
        userId,
        req.body
      );
      created(res, 'Category created successfully', category);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;
      const id = parseInt(req.params.id, 10);

      await StoreCatalogService.deleteCategory(tenantId, storeId, userId, id);
      success(res, 'Category deleted successfully', null);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // BRANDS
  static async getBrands(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const result = await StoreCatalogService.getBrands(tenantId, storeId, req.query);
      success(res, 'Brands retrieved successfully', result);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async createBrand(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const brand = await StoreCatalogService.createBrand(tenantId, storeId, userId, req.body);
      created(res, 'Brand created successfully', brand);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // TAGS
  static async getTags(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const tags = await StoreCatalogService.getTags(tenantId, storeId, req.query);
      success(res, 'Tags retrieved successfully', tags);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async createTag(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const tag = await StoreCatalogService.createTag(tenantId, storeId, userId, req.body);
      created(res, 'Tag created successfully', tag);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // COLLECTIONS
  static async getCollections(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const collections = await StoreCatalogService.getCollections(tenantId, storeId, req.query);
      success(res, 'Collections retrieved successfully', collections);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async createCollection(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const collection = await StoreCatalogService.createCollection(
        tenantId,
        storeId,
        userId,
        req.body
      );
      created(res, 'Collection created successfully', collection);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // ATTRIBUTES
  static async getAttributes(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const attributes = await StoreCatalogService.getAttributes(tenantId, storeId);
      success(res, 'Attributes retrieved successfully', attributes);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async createAttribute(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const attribute = await StoreCatalogService.createAttribute(
        tenantId,
        storeId,
        userId,
        req.body
      );
      created(res, 'Attribute created successfully', attribute);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }
}
