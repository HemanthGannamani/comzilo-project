import { Request, Response, NextFunction } from 'express';
import { SellerApplication } from '../database/models';
import { success } from '../shared/responses';
import { NotFoundError, ValidationError } from '../shared/errors/AppError';
import { createAuditLog } from '../utils/auditHelper';
import { AdminSellerService } from '../services/adminSeller.service';
import { Op } from 'sequelize';

const sellerService = new AdminSellerService();

const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^[-]+|[-]+$/g, '');
};

export class AdminSellerApplicationController {
  public listApplications = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || '';
      const status = (req.query.status as string) || '';
      const businessType = (req.query.businessType as string) || '';
      const startDate = (req.query.startDate as string) || '';
      const endDate = (req.query.endDate as string) || '';
      const sort = (req.query.sort as string) || 'newest';

      const offset = (page - 1) * limit;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const whereClause: any = {};

      if (status) {
        whereClause.status = status;
      }

      if (businessType) {
        whereClause.businessType = businessType;
      }

      if (startDate || endDate) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dateFilter: any = {};
        if (startDate) {
          dateFilter[Op.gte] = new Date(startDate);
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          dateFilter[Op.lte] = end;
        }
        whereClause.createdAt = dateFilter;
      }

      if (search) {
        whereClause[Op.or] = [
          { applicationNumber: { [Op.like]: `%${search}%` } },
          { businessName: { [Op.like]: `%${search}%` } },
          { ownerName: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { phone: { [Op.like]: `%${search}%` } },
        ];
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const orderClause: any[] =
        sort === 'oldest' ? [['createdAt', 'ASC']] : [['createdAt', 'DESC']];

      const { count, rows } = await SellerApplication.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: orderClause,
      });

      success(res, 'Seller applications retrieved successfully', {
        applications: rows,
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      });
    } catch (error) {
      next(error);
    }
  };

  public getApplication = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const application = await SellerApplication.findByPk(id);

      if (!application) {
        throw new NotFoundError('Seller application not found');
      }

      // Log Audit View
      await createAuditLog(
        {
          action: 'seller_application.viewed',
          entityType: 'seller_application',
          entityId: String(application.id),
        },
        req.context
      );

      success(res, 'Seller application retrieved successfully', application);
    } catch (error) {
      next(error);
    }
  };

  public approveApplication = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const application = await SellerApplication.findByPk(id);

      if (!application) {
        throw new NotFoundError('Seller application not found');
      }

      if (application.status !== 'Pending') {
        throw new ValidationError('Only Pending applications can be approved');
      }

      // Reuse the existing onboarding service logic
      await sellerService.createSeller(
        {
          sellerApplicationId: application.id,
          passwordHash: application.passwordHash,
          ownerName: application.ownerName,
          email: application.email,
          phone: application.phone,
          businessName: application.businessName,
          businessType: application.businessType,
          gstNumber: application.gstNumber || undefined,
          panNumber: application.panNumber || undefined,
          addressLine1: application.addressLine1 || undefined,
          addressLine2: application.addressLine2 || undefined,
          city: application.city || undefined,
          state: application.state || undefined,
          country: application.country || undefined,
          postalCode: application.postalCode || undefined,
          tenantConfig: {
            mode: 'create',
            newName: application.businessName,
            newSlug: slugify(application.businessName),
            newStatus: 'active',
          },
          storeConfig: {
            mode: 'create',
            newName: application.preferredStoreName,
            newCode: slugify(application.preferredStoreName),
            newStatus: 'active',
          },
          roleCode: 'tenant_owner',
          status: 'active',
        },
        req.context
      );

      // Refresh application model state
      await application.reload();

      success(
        res,
        'Seller application approved and onboarding completed successfully',
        application
      );
    } catch (error) {
      next(error);
    }
  };

  public rejectApplication = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      if (!reason || reason.trim() === '') {
        throw new ValidationError('Reason is required for rejection');
      }

      const application = await SellerApplication.findByPk(id);

      if (!application) {
        throw new NotFoundError('Seller application not found');
      }

      if (application.status !== 'Pending') {
        throw new ValidationError('Only Pending applications can be rejected');
      }

      application.status = 'Rejected';
      application.reviewNotes = reason;
      application.reviewedAt = new Date();
      application.reviewedBy = req.context?.authenticatedUserId || null;
      await application.save();

      // Log Audit Reject
      await createAuditLog(
        {
          action: 'seller_application.rejected',
          entityType: 'seller_application',
          entityId: String(application.id),
          newValues: { status: 'Rejected', reason },
        },
        req.context
      );

      success(res, 'Seller application rejected successfully', application);
    } catch (error) {
      next(error);
    }
  };
}
