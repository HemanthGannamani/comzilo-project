import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';
import { createAuditLog } from '../utils/auditHelper';
import { RESPONSE_MESSAGES } from '../shared/constants';
import { success, created } from '../shared/responses';
import { ValidationError } from '../shared/errors/AppError';
import { sequelize } from '../config/database';
import { QueryTypes } from 'sequelize';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  private async getStoreId(req: Request): Promise<number> {
    const rawStoreId = req.headers['x-store-id'] || req.query.storeId || req.body.storeId || req.context?.storeId;
    if (rawStoreId) {
      const parsed = Number(rawStoreId);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }

    const tenantId = req.context?.tenantId;
    if (tenantId) {
      const [store]: any = await sequelize.query(
        'SELECT id FROM stores WHERE tenant_id = :tenantId ORDER BY id ASC LIMIT 1',
        { replacements: { tenantId }, type: QueryTypes.SELECT }
      );
      if (store && store.id) {
        return Number(store.id);
      }
    }

    throw new ValidationError('Store context is missing');
  }

  public createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = await this.getStoreId(req);
      const userId = req.context!.authenticatedUserId!;
      const { mediaIds, ...productData } = req.body;

      const product = await this.productService.createProduct(
        tenantId,
        storeId,
        userId,
        productData,
        mediaIds
      );

      await createAuditLog(
        {
          tenantId,
          action: 'product.create',
          entityType: 'product',
          entityId: String(product.id),
          newValues: product.toJSON(),
        },
        req.context
      );

      created(res, 'Product created successfully', product);
    } catch (error) {
      next(error);
    }
  };

  public updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = await this.getStoreId(req);
      const userId = req.context!.authenticatedUserId!;
      const productId = parseInt(req.params.id, 10);
      const { mediaIds, ...productData } = req.body;

      // Detect status or price changes for specific audit logs
      const oldProduct = await this.productService.getProduct(tenantId, storeId, productId);

      const product = await this.productService.updateProduct(
        tenantId,
        storeId,
        productId,
        userId,
        productData,
        mediaIds
      );

      let action = 'product.update';
      if (
        productData.price !== undefined &&
        Number(productData.price) !== Number(oldProduct.price)
      ) {
        action = 'product.update.price';
      } else if (productData.status !== undefined && productData.status !== oldProduct.status) {
        action = 'product.update.status';
      }

      await createAuditLog(
        {
          tenantId,
          action,
          entityType: 'product',
          entityId: String(product.id),
          previousValues: oldProduct.toJSON(),
          newValues: product.toJSON(),
        },
        req.context
      );

      success(res, 'Product updated successfully', product);
    } catch (error) {
      next(error);
    }
  };

  public getProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = await this.getStoreId(req);
      const productId = parseInt(req.params.id, 10);

      const product = await this.productService.getProduct(tenantId, storeId, productId);

      success(res, RESPONSE_MESSAGES.SUCCESS, product);
    } catch (error) {
      next(error);
    }
  };

  public getProductTypes = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const types = await this.productService.getProductTypes();
      success(res, 'Product types retrieved successfully', types);
    } catch (error) {
      next(error);
    }
  };

  public listProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = await this.getStoreId(req);
      const filters = req.query;

      const products = await this.productService.listProducts(tenantId, storeId, filters);

      success(res, RESPONSE_MESSAGES.SUCCESS, products.rows, {
        total: products.count,
        page: parseInt((filters.page as string) || '1', 10),
        limit: parseInt((filters.limit as string) || '10', 10),
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = await this.getStoreId(req);
      const userId = req.context!.authenticatedUserId!;
      const productId = parseInt(req.params.id, 10);

      const product = await this.productService.getProduct(tenantId, storeId, productId);

      await this.productService.deleteProduct(tenantId, storeId, productId, userId);

      await createAuditLog(
        {
          tenantId,
          action: 'product.delete',
          entityType: 'product',
          entityId: String(productId),
          previousValues: product.toJSON(),
        },
        req.context
      );

      success(res, 'Product deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  public restoreProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = Number(req.headers['x-store-id'] || req.query.storeId || req.body.storeId);
      if (!storeId || isNaN(storeId)) {
        throw new ValidationError('Store context is missing');
      }
      const userId = req.context!.authenticatedUserId!;
      const productId = parseInt(req.params.id, 10);

      const product = await this.productService.restoreProduct(
        tenantId,
        storeId,
        productId,
        userId
      );

      await createAuditLog(
        {
          tenantId,
          action: 'product.restore',
          entityType: 'product',
          entityId: String(productId),
          newValues: product.toJSON(),
        },
        req.context
      );

      success(res, 'Product restored successfully', product);
    } catch (error) {
      next(error);
    }
  };
}
