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
      const tenantId = req.headers.authorization ? req.context?.tenantId || 1 : null;
      let storeId = 1;
      try {
        storeId = await this.getStoreId(req);
      } catch {
        storeId = 1;
      }
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
      const tenantId = req.context?.tenantId || 1;
      let storeId = 1;
      try {
        storeId = await this.getStoreId(req);
      } catch {
        storeId = 1;
      }
      
      const filters: any = { ...req.query };
      if (!req.headers.authorization) {
        filters.allStores = true;
      }

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

  public uploadProductImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productId = parseInt(req.params.id, 10);
      const file = req.file;

      let imageUrl = req.body.imageUrl || req.body.url;
      if (file) {
        imageUrl = `/uploads/products/${file.filename}`;
      }

      if (!imageUrl) {
        throw new ValidationError('No image file or imageUrl provided');
      }

      const { ProductImage } = require('../database/models');
      const isPrimary = req.body.isPrimary === 'true' || req.body.isPrimary === true;
      const displayOrder = parseInt(req.body.displayOrder || '0', 10);

      const productImage = await ProductImage.create({
        productId,
        imageUrl,
        url: imageUrl,
        thumbnailUrl: imageUrl,
        displayOrder,
        isPrimary,
      });

      created(res, 'Product image uploaded successfully', productImage);
    } catch (error) {
      next(error);
    }
  };

  public getProductImages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productId = parseInt(req.params.id, 10);
      const { ProductImage } = require('../database/models');
      const images = await ProductImage.findAll({
        where: { productId },
        order: [['displayOrder', 'ASC'], ['id', 'ASC']],
      });
      success(res, RESPONSE_MESSAGES.SUCCESS, images);
    } catch (error) {
      next(error);
    }
  };

  public deleteProductImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productId = parseInt(req.params.id, 10);
      const imageId = parseInt(req.params.imageId, 10);
      const { ProductImage } = require('../database/models');

      const image = await ProductImage.findOne({ where: { id: imageId, productId } });
      if (!image) {
        throw new NotFoundError('Product image not found');
      }

      await image.destroy();
      success(res, 'Product image deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}
