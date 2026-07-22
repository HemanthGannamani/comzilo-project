import { Request, Response, NextFunction } from 'express';
import { TagService } from '../services/tag.service';
import { createAuditLog } from '../utils/auditHelper';
import { RESPONSE_MESSAGES } from '../shared/constants';
import { success, created } from '../shared/responses';
import { ValidationError } from '../shared/errors/AppError';

export class TagController {
  private tagService: TagService;

  constructor() {
    this.tagService = new TagService();
  }

  private getStoreId(req: Request): number {
    const storeId = Number(req.headers['x-store-id'] || req.query.storeId || req.body.storeId);
    if (!storeId || isNaN(storeId)) {
      throw new ValidationError('Store context is missing');
    }
    return storeId;
  }

  public createTag = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const userId = req.context!.authenticatedUserId!;

      const tag = await this.tagService.createTag(tenantId, storeId, userId, req.body);

      await createAuditLog(
        {
          tenantId,
          action: 'tag.create',
          entityType: 'tag',
          entityId: String(tag.id),
          newValues: tag.toJSON(),
        },
        req.context
      );

      created(res, 'Tag created successfully', tag);
    } catch (error) {
      next(error);
    }
  };

  public getTag = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const tagId = parseInt(req.params.id, 10);

      const tag = await this.tagService.getTag(tenantId, storeId, tagId);

      success(res, RESPONSE_MESSAGES.SUCCESS, tag);
    } catch (error) {
      next(error);
    }
  };

  public listTags = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const filters = req.query;

      const tags = await this.tagService.listTags(tenantId, storeId, filters);

      success(res, RESPONSE_MESSAGES.SUCCESS, tags.rows, {
        total: tags.count,
        page: parseInt((filters.page as string) || '1', 10),
        limit: parseInt((filters.limit as string) || '10', 10),
      });
    } catch (error) {
      next(error);
    }
  };

  public updateTag = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const userId = req.context!.authenticatedUserId!;
      const tagId = parseInt(req.params.id, 10);

      const oldTag = await this.tagService.getTag(tenantId, storeId, tagId);
      const tag = await this.tagService.updateTag(tenantId, storeId, tagId, userId, req.body);

      await createAuditLog(
        {
          tenantId,
          action: 'tag.update',
          entityType: 'tag',
          entityId: String(tag.id),
          previousValues: oldTag.toJSON(),
          newValues: tag.toJSON(),
        },
        req.context
      );

      success(res, 'Tag updated successfully', tag);
    } catch (error) {
      next(error);
    }
  };

  public deleteTag = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const userId = req.context!.authenticatedUserId!;
      const tagId = parseInt(req.params.id, 10);

      const tag = await this.tagService.getTag(tenantId, storeId, tagId);
      await this.tagService.deleteTag(tenantId, storeId, tagId, userId);

      await createAuditLog(
        {
          tenantId,
          action: 'tag.delete',
          entityType: 'tag',
          entityId: String(tagId),
          previousValues: tag.toJSON(),
        },
        req.context
      );

      success(res, 'Tag deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  public restoreTag = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const userId = req.context!.authenticatedUserId!;
      const tagId = parseInt(req.params.id, 10);

      const tag = await this.tagService.restoreTag(tenantId, storeId, tagId, userId);

      await createAuditLog(
        {
          tenantId,
          action: 'tag.restore',
          entityType: 'tag',
          entityId: String(tagId),
          newValues: tag.toJSON(),
        },
        req.context
      );

      success(res, 'Tag restored successfully', tag);
    } catch (error) {
      next(error);
    }
  };
}
