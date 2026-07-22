import { Request, Response, NextFunction } from 'express';
import { CustomerTagService } from '../services/customerTag.service';
import { success } from '../shared/responses';
import { ValidationError } from '../shared/errors/AppError';

export class CustomerTagController {
  private tagService = new CustomerTagService();

  private getStoreId(req: Request): number {
    const storeId = Number(req.headers['x-store-id'] || req.query.storeId || req.body.storeId);
    if (!storeId || isNaN(storeId)) {
      throw new ValidationError('Store context is missing');
    }
    return storeId;
  }

  public replaceTags = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const customerId = Number(req.params.id);
      const userId = req.context!.authenticatedUserId!;
      const ip = req.ip;
      const userAgent = req.headers['user-agent'];

      const tags = await this.tagService.replaceTags(
        tenantId,
        storeId,
        customerId,
        userId,
        req.body.tags,
        ip,
        userAgent
      );
      success(res, 'Customer tags updated successfully', tags);
    } catch (error) {
      next(error);
    }
  };
}
