import { Request, Response, NextFunction } from 'express';
import { User, UserRole, UserProfile, Tenant, Store, Role } from '../database/models';
import { sequelize } from '../config/database';
import { AdminSellerService } from '../services/adminSeller.service';
import { success } from '../shared/responses';
import { NotFoundError, ValidationError } from '../shared/errors/AppError';
import { createAuditLog } from '../utils/auditHelper';
import { Op } from 'sequelize';
import Joi from 'joi';

const sellerService = new AdminSellerService();

export const createSellerValidationSchema = Joi.object({
  ownerName: Joi.string().required().min(2).max(100),
  email: Joi.string().email().required(),
  phone: Joi.string().required().min(8).max(20),
  password: Joi.string().required().min(6).max(100),
  businessName: Joi.string().required().min(2).max(100),
  businessType: Joi.string()
    .valid('Retail', 'Wholesale', 'Manufacturer', 'Distributor', 'Other')
    .default('Retail'),
  gstNumber: Joi.string().allow('', null).max(15),
  panNumber: Joi.string().allow('', null).max(10),
  addressLine1: Joi.string().allow('', null).max(255),
  addressLine2: Joi.string().allow('', null).max(255),
  city: Joi.string().allow('', null).max(100),
  state: Joi.string().allow('', null).max(100),
  country: Joi.string().allow('', null).max(100),
  postalCode: Joi.string().allow('', null).max(20),
  tenantConfig: Joi.object({
    mode: Joi.string().valid('assign', 'create').required(),
    tenantId: Joi.number().optional(),
    newName: Joi.string().optional(),
    newSlug: Joi.string().optional(),
    newStatus: Joi.string().valid('pending', 'active', 'suspended', 'cancelled').optional(),
  }).required(),
  storeConfig: Joi.object({
    mode: Joi.string().valid('assign', 'create').required(),
    storeId: Joi.number().optional(),
    newName: Joi.string().optional(),
    newCode: Joi.string().optional(),
    newAddress: Joi.string().optional(),
    newStatus: Joi.string().valid('active', 'suspended').optional(),
  }).required(),
  roleCode: Joi.string().valid('tenant_owner', 'manager', 'staff').required(),
  status: Joi.string()
    .valid('invited', 'active', 'suspended', 'locked', 'disabled')
    .default('active'),
});

export const updateSellerValidationSchema = Joi.object({
  ownerName: Joi.string().optional().min(2).max(100),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional().min(8).max(20),
  businessName: Joi.string().optional().min(2).max(100),
  businessType: Joi.string()
    .valid('Retail', 'Wholesale', 'Manufacturer', 'Distributor', 'Other')
    .optional(),
  gstNumber: Joi.string().allow('', null).max(15).optional(),
  panNumber: Joi.string().allow('', null).max(10).optional(),
  addressLine1: Joi.string().allow('', null).max(255).optional(),
  addressLine2: Joi.string().allow('', null).max(255).optional(),
  city: Joi.string().allow('', null).max(100).optional(),
  state: Joi.string().allow('', null).max(100).optional(),
  country: Joi.string().allow('', null).max(100).optional(),
  postalCode: Joi.string().allow('', null).max(20).optional(),
});

export class AdminSellerController {
  public listSellers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || '';
      const status = (req.query.status as string) || '';
      const roleCode = (req.query.role as string) || '';
      const tenantId = req.query.tenantId ? parseInt(req.query.tenantId as string) : null;
      const storeId = req.query.storeId ? parseInt(req.query.storeId as string) : null;
      const sort = (req.query.sort as string) || 'newest';

      const offset = (page - 1) * limit;

      // Build User where clause
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const whereClause: any = {};
      if (status) {
        whereClause.status = status;
      }
      if (tenantId) {
        whereClause.tenantId = tenantId;
      }

      if (search) {
        whereClause[Op.or] = [
          { firstName: { [Op.like]: `%${search}%` } },
          { lastName: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { mobile: { [Op.like]: `%${search}%` } },
        ];
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const userRoleWhere: any = {};
      if (storeId) {
        userRoleWhere.storeId = storeId;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const roleWhere: any = {};
      if (roleCode) {
        roleWhere.code = roleCode;
      } else {
        // Only return sellers, managers, staff
        roleWhere.code = { [Op.in]: ['tenant_owner', 'manager', 'staff'] };
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const orderClause: any[] =
        sort === 'oldest' ? [['createdAt', 'ASC']] : [['createdAt', 'DESC']];

      const { count, rows } = await User.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: UserProfile,
            as: 'profile',
          },
          {
            model: Tenant,
            as: 'tenant',
          },
          {
            model: UserRole,
            as: 'userRoles',
            where: Object.keys(userRoleWhere).length ? userRoleWhere : undefined,
            include: [
              {
                model: Role,
                as: 'role',
                where: roleWhere,
              },
              {
                model: Store,
                as: 'store',
              },
            ],
          },
        ],
        limit,
        offset,
        order: orderClause,
        distinct: true,
      });

      success(res, 'Sellers list retrieved successfully', {
        sellers: rows,
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      });
    } catch (error) {
      next(error);
    }
  };

  public getSeller = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const seller = await User.findOne({
        where: { id },
        include: [
          {
            model: UserProfile,
            as: 'profile',
          },
          {
            model: Tenant,
            as: 'tenant',
          },
          {
            model: UserRole,
            as: 'userRoles',
            include: [
              {
                model: Role,
                as: 'role',
              },
              {
                model: Store,
                as: 'store',
              },
            ],
          },
        ],
      });

      if (!seller) {
        throw new NotFoundError('Seller not found');
      }

      success(res, 'Seller details retrieved successfully', seller);
    } catch (error) {
      next(error);
    }
  };

  public createSeller = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { error, value } = createSellerValidationSchema.validate(req.body);
      if (error) {
        throw new ValidationError(error.details[0].message);
      }

      const seller = await sellerService.createSeller(value, req.context);

      // Log direct audit seller creation
      await createAuditLog(
        {
          action: 'seller.created',
          entityType: 'user',
          entityId: String(seller.id),
        },
        req.context
      );

      success(res, 'Seller created successfully', seller);
    } catch (error) {
      next(error);
    }
  };

  public updateSeller = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { error, value } = updateSellerValidationSchema.validate(req.body);
      if (error) {
        throw new ValidationError(error.details[0].message);
      }

      const user = await User.findByPk(id);
      if (!user) {
        throw new NotFoundError('Seller not found');
      }

      const t = await sequelize.transaction();

      try {
        if (value.ownerName) {
          const [firstName, ...lastNameParts] = value.ownerName.trim().split(' ');
          const lastName = lastNameParts.join(' ') || ' ';
          user.firstName = firstName;
          user.lastName = lastName;
        }

        if (value.email) user.email = value.email;
        if (value.phone) user.mobile = value.phone;

        await user.save({ transaction: t });

        // Update Profile
        const profile = await UserProfile.findOne({ where: { userId: user.id } });
        if (profile) {
          if (value.addressLine1 !== undefined) profile.addressLine1 = value.addressLine1;
          if (value.addressLine2 !== undefined) profile.addressLine2 = value.addressLine2;
          if (value.city !== undefined) profile.city = value.city;
          if (value.state !== undefined) profile.state = value.state;
          if (value.country !== undefined) profile.country = value.country;
          if (value.postalCode !== undefined) profile.postalCode = value.postalCode;

          const metadata = { ...(profile.metadata || {}) };
          if (value.businessName) metadata.businessName = value.businessName;
          if (value.businessType) metadata.businessType = value.businessType;
          if (value.gstNumber !== undefined) metadata.gstNumber = value.gstNumber;
          if (value.panNumber !== undefined) metadata.panNumber = value.panNumber;

          profile.metadata = metadata;
          await profile.save({ transaction: t });
        }

        await t.commit();

        await createAuditLog(
          {
            action: 'seller.updated',
            entityType: 'user',
            entityId: String(user.id),
          },
          req.context
        );

        success(res, 'Seller updated successfully', user);
      } catch (err) {
        await t.rollback();
        throw err;
      }
    } catch (error) {
      next(error);
    }
  };

  public updateSellerStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        throw new ValidationError('Status is required');
      }

      const user = await User.findByPk(id);
      if (!user) {
        throw new NotFoundError('Seller not found');
      }

      user.status = status;
      await user.save();

      await createAuditLog(
        {
          action: 'user.status_updated',
          entityType: 'user',
          entityId: String(user.id),
          newValues: { status },
        },
        req.context
      );

      success(res, 'Seller status updated successfully', user);
    } catch (error) {
      next(error);
    }
  };

  public deleteSeller = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) {
        throw new NotFoundError('Seller not found');
      }

      await user.destroy(); // Paranoid paranoid soft delete

      await createAuditLog(
        {
          action: 'user.deleted',
          entityType: 'user',
          entityId: String(user.id),
        },
        req.context
      );

      success(res, 'Seller deleted successfully', null);
    } catch (error) {
      next(error);
    }
  };
}
