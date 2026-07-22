/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import {
  User,
  Tenant,
  Store,
  SellerApplication,
  UserRole,
  Role,
  UserProfile,
} from '../database/models';
import { sequelize } from '../config/database';
import { success } from '../shared/responses';
import { Op, fn, col } from 'sequelize';

export class AdminDashboardController {
  public getDashboardMetrics = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      // 1. Summaries Overall vs Today
      const totalSellers = await User.count();
      const todaySellers = await User.count({ where: { createdAt: { [Op.gte]: todayStart } } });

      const activeSellers = await User.count({ where: { status: 'active' } });
      const todayActiveSellers = await User.count({
        where: { status: 'active', createdAt: { [Op.gte]: todayStart } },
      });

      const suspendedSellers = await User.count({ where: { status: 'suspended' } });
      const todaySuspendedSellers = await User.count({
        where: { status: 'suspended', createdAt: { [Op.gte]: todayStart } },
      });

      const pendingApps = await SellerApplication.count({ where: { status: 'Pending' } });
      const todayPendingApps = await SellerApplication.count({
        where: { status: 'Pending', createdAt: { [Op.gte]: todayStart } },
      });

      const approvedApps = await SellerApplication.count({ where: { status: 'Approved' } });
      const todayApprovedApps = await SellerApplication.count({
        where: { status: 'Approved', createdAt: { [Op.gte]: todayStart } },
      });

      const rejectedApps = await SellerApplication.count({ where: { status: 'Rejected' } });
      const todayRejectedApps = await SellerApplication.count({
        where: { status: 'Rejected', createdAt: { [Op.gte]: todayStart } },
      });

      const totalTenants = await Tenant.count();
      const todayTenants = await Tenant.count({ where: { createdAt: { [Op.gte]: todayStart } } });

      const totalStores = await Store.count();
      const todayStores = await Store.count({ where: { createdAt: { [Op.gte]: todayStart } } });

      // 2. Monthly Registrations Last 12 Months
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
      twelveMonthsAgo.setDate(1);
      twelveMonthsAgo.setHours(0, 0, 0, 0);

      const growthDataRaw = await User.findAll({
        attributes: [
          [fn('date_format', col('created_at'), '%Y-%m'), 'month'],
          [fn('count', col('id')), 'count'],
        ],
        where: { createdAt: { [Op.gte]: twelveMonthsAgo } },
        group: [fn('date_format', col('created_at'), '%Y-%m')],
        order: [[fn('date_format', col('created_at'), '%Y-%m'), 'ASC']],
        raw: true,
      });

      // 3. Top 10 Tenants with Seller Count and Store Count
      const tenantsRaw = await Tenant.findAll({
        limit: 10,
        attributes: [
          'id',
          'name',
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM users WHERE users.tenant_id = Tenant.id AND users.deleted_at IS NULL)'
            ),
            'sellerCount',
          ],
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM stores WHERE stores.tenant_id = Tenant.id AND stores.deleted_at IS NULL)'
            ),
            'storeCount',
          ],
        ],
        raw: true,
      });

      // 4. Top Stores with Number of Sellers
      const storesRaw = await Store.findAll({
        limit: 10,
        attributes: [
          'id',
          'name',
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM user_roles WHERE user_roles.store_id = Store.id)'
            ),
            'sellerCount',
          ],
        ],
        raw: true,
      });

      // 5. Recent Activities from Audit Logs
      const [recentActivities]: any[] = await sequelize.query(
        `SELECT action, entity_type as entityType, entity_id as entityId, old_values as oldValues, new_values as newValues, old_values as payload,Old_Values as variables,Old_Values as title, old_values as content,Old_Values as channel,Old_Values as status,old_values as priority,old_values as templateId, old_values as old_values,old_values as OldValues,old_values as oldValues,created_at as createdAt
         FROM audit_logs
         WHERE action IN (
           'seller.created', 'seller.updated', 'seller.suspended', 'seller.activated',
           'seller_application.submitted', 'seller_application.approved', 'seller_application.rejected', 'seller.deleted'
         )
         ORDER BY id DESC
         LIMIT 20`,
        { raw: true }
      );

      success(res, 'Dashboard metrics compiled successfully', {
        summary: {
          sellers: { total: totalSellers, today: todaySellers },
          activeSellers: { total: activeSellers, today: todayActiveSellers },
          suspendedSellers: { total: suspendedSellers, today: todaySuspendedSellers },
          pendingApplications: { total: pendingApps, today: todayPendingApps },
          approvedApplications: { total: approvedApps, today: todayApprovedApps },
          rejectedApplications: { total: rejectedApps, today: todayRejectedApps },
          tenants: { total: totalTenants, today: todayTenants },
          stores: { total: totalStores, today: todayStores },
        },
        growth: growthDataRaw,
        tenants: tenantsRaw,
        stores: storesRaw,
        activities: recentActivities,
      });
    } catch (error) {
      next(error);
    }
  };

  public getSellersReport = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { status, tenantId, storeId, startDate, endDate, search } = req.query;
      const whereClause: any = {};

      if (status) whereClause.status = status;
      if (tenantId) whereClause.tenantId = tenantId;

      if (startDate && endDate) {
        whereClause.createdAt = {
          [Op.between]: [new Date(startDate as string), new Date(endDate as string)],
        };
      }

      if (search) {
        whereClause[Op.or] = [
          { firstName: { [Op.like]: `%${search}%` } },
          { lastName: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
        ];
      }

      const userRoleInclude: any = {
        model: UserRole,
        as: 'userRoles',
        required: !!storeId,
        include: [
          { model: Store, as: 'store', attributes: ['id', 'name'] },
          { model: Role, as: 'role', attributes: ['id', 'name', 'code'] },
        ],
      };

      if (storeId) {
        userRoleInclude.where = { storeId };
      }

      const users = await User.findAll({
        where: whereClause,
        include: [
          { model: Tenant, as: 'tenant', attributes: ['id', 'name'] },
          {
            model: UserProfile,
            as: 'profile',
            attributes: ['metadata', 'addressLine1', 'city', 'state'],
          },
          userRoleInclude,
        ],
        order: [['id', 'DESC']],
      });

      success(res, 'Sellers report generated successfully', users);
    } catch (error) {
      next(error);
    }
  };

  public getApplicationsReport = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { status, search } = req.query;
      const whereClause: any = {};

      if (status) whereClause.status = status;

      if (search) {
        whereClause[Op.or] = [
          { businessName: { [Op.like]: `%${search}%` } },
          { ownerName: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { applicationNumber: { [Op.like]: `%${search}%` } },
        ];
      }

      const apps = await SellerApplication.findAll({
        where: whereClause,
        order: [['id', 'DESC']],
      });

      success(res, 'Applications report generated successfully', apps);
    } catch (error) {
      next(error);
    }
  };

  public getTenantsReport = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { search } = req.query;
      const whereClause: any = {};

      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { slug: { [Op.like]: `%${search}%` } },
        ];
      }

      const tenants = await Tenant.findAll({
        where: whereClause,
        attributes: ['id', 'name', 'slug', 'status', 'createdAt', [col('name'), 'dummy']],
        order: [['id', 'DESC']],
      });

      success(res, 'Tenants report generated successfully', tenants);
    } catch (error) {
      next(error);
    }
  };

  public getStoresReport = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { search } = req.query;
      const whereClause: any = {};

      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { code: { [Op.like]: `%${search}%` } },
        ];
      }

      const stores = await Store.findAll({
        where: whereClause,
        include: [{ model: Tenant, as: 'tenant', attributes: ['id', 'name'] }],
        order: [['id', 'DESC']],
      });

      success(res, 'Stores report generated successfully', stores);
    } catch (error) {
      next(error);
    }
  };
}
