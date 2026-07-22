/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import { CollectionService } from '../services/collection.service';
import { createAuditLog } from '../utils/auditHelper';
import { RESPONSE_MESSAGES } from '../shared/constants';
import { success, created } from '../shared/responses';
import { ValidationError } from '../shared/errors/AppError';

export class CollectionController {
  private collectionService: CollectionService;

  constructor() {
    this.collectionService = new CollectionService();
  }

  private getStoreId(req: Request): number {
    const storeId = Number(req.headers['x-store-id'] || req.query.storeId || req.body.storeId);
    if (!storeId || isNaN(storeId)) {
      throw new ValidationError('Store context is missing');
    }
    return storeId;
  }

  public createCollection = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const userId = req.context!.authenticatedUserId!;

      const collection = await this.collectionService.createCollection(
        tenantId,
        storeId,
        userId,
        req.body
      );

      await createAuditLog(
        {
          tenantId,
          action: 'collection.create',
          entityType: 'collection',
          entityId: String(collection.id),
          newValues: collection.toJSON(),
        },
        req.context
      );

      created(res, 'Collection created successfully', collection);
    } catch (error) {
      next(error);
    }
  };

  public getCollection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const collectionId = parseInt(req.params.id, 10);

      const collection = await this.collectionService.getCollection(
        tenantId,
        storeId,
        collectionId
      );

      success(res, RESPONSE_MESSAGES.SUCCESS, collection);
    } catch (error) {
      next(error);
    }
  };

  public listCollections = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const filters = req.query;

      const collections = await this.collectionService.listCollections(tenantId, storeId, filters);

      success(res, RESPONSE_MESSAGES.SUCCESS, collections.rows, {
        total: collections.count,
        page: parseInt((filters.page as string) || '1', 10),
        limit: parseInt((filters.limit as string) || '10', 10),
      });
    } catch (error) {
      next(error);
    }
  };

  public updateCollection = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const userId = req.context!.authenticatedUserId!;
      const collectionId = parseInt(req.params.id, 10);

      const oldCollection = await this.collectionService.getCollection(
        tenantId,
        storeId,
        collectionId
      );
      const collection = await this.collectionService.updateCollection(
        tenantId,
        storeId,
        collectionId,
        userId,
        req.body
      );

      await createAuditLog(
        {
          tenantId,
          action: 'collection.update',
          entityType: 'collection',
          entityId: String(collection.id),
          previousValues: oldCollection.toJSON(),
          newValues: collection.toJSON(),
        },
        req.context
      );

      success(res, 'Collection updated successfully', collection);
    } catch (error) {
      next(error);
    }
  };

  public deleteCollection = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const userId = req.context!.authenticatedUserId!;
      const collectionId = parseInt(req.params.id, 10);

      const collection = await this.collectionService.getCollection(
        tenantId,
        storeId,
        collectionId
      );
      await this.collectionService.deleteCollection(tenantId, storeId, collectionId, userId);

      await createAuditLog(
        {
          tenantId,
          action: 'collection.delete',
          entityType: 'collection',
          entityId: String(collectionId),
          previousValues: collection.toJSON(),
        },
        req.context
      );

      success(res, 'Collection deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  public restoreCollection = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const userId = req.context!.authenticatedUserId!;
      const collectionId = parseInt(req.params.id, 10);

      const collection = await this.collectionService.restoreCollection(
        tenantId,
        storeId,
        collectionId,
        userId
      );

      await createAuditLog(
        {
          tenantId,
          action: 'collection.restore',
          entityType: 'collection',
          entityId: String(collectionId),
          newValues: collection.toJSON(),
        },
        req.context
      );

      success(res, 'Collection restored successfully', collection);
    } catch (error) {
      next(error);
    }
  };

  // --- COLLECTION PRODUCTS ---

  public listCollectionProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const collectionId = parseInt(req.params.id, 10);
      const filters = req.query;

      const products = await this.collectionService.listCollectionProducts(
        tenantId,
        storeId,
        collectionId,
        filters
      );

      success(res, RESPONSE_MESSAGES.SUCCESS, products.rows, {
        total: products.count,
        page: parseInt((filters.page as string) || '1', 10),
        limit: parseInt((filters.limit as string) || '10', 10),
      });
    } catch (error) {
      next(error);
    }
  };

  public addProductToCollection = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const collectionId = parseInt(req.params.id, 10);
      const { productId, sortOrder } = req.body;

      await this.collectionService.addProductToCollection(
        tenantId,
        storeId,
        collectionId,
        productId,
        sortOrder
      );

      await createAuditLog(
        {
          tenantId,
          action: 'collection.product.add',
          entityType: 'collection',
          entityId: String(collectionId),
          newValues: { productId, sortOrder },
        },
        req.context
      );

      success(res, 'Product added to collection successfully');
    } catch (error) {
      next(error);
    }
  };

  public removeProductFromCollection = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const collectionId = parseInt(req.params.id, 10);
      const productId = parseInt(req.params.productId, 10);

      await this.collectionService.removeProductFromCollection(
        tenantId,
        storeId,
        collectionId,
        productId
      );

      await createAuditLog(
        {
          tenantId,
          action: 'collection.product.remove',
          entityType: 'collection',
          entityId: String(collectionId),
          previousValues: { productId },
        },
        req.context
      );

      success(res, 'Product removed from collection successfully');
    } catch (error) {
      next(error);
    }
  };

  public replaceProductsInCollection = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const collectionId = parseInt(req.params.id, 10);
      const { productIds } = req.body;

      await this.collectionService.replaceProductsInCollection(
        tenantId,
        storeId,
        collectionId,
        productIds
      );

      await createAuditLog(
        {
          tenantId,
          action: 'collection.products.replace',
          entityType: 'collection',
          entityId: String(collectionId),
          newValues: { productIds },
        },
        req.context
      );

      success(res, 'Collection products replaced successfully');
    } catch (error) {
      next(error);
    }
  };

  public reorderProductsInCollection = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const collectionId = parseInt(req.params.id, 10);
      const { orderedProductIds } = req.body;

      await this.collectionService.reorderProductsInCollection(
        tenantId,
        storeId,
        collectionId,
        orderedProductIds
      );

      await createAuditLog(
        {
          tenantId,
          action: 'collection.products.reorder',
          entityType: 'collection',
          entityId: String(collectionId),
          newValues: { orderedProductIds },
        },
        req.context
      );

      success(res, 'Collection products reordered successfully');
    } catch (error) {
      next(error);
    }
  };
}
