import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { success, created } from '../shared/responses';
import { User, Tenant, Store, UserRole, Role } from '../database/models';

export class AuthController {
  private readonly authService = new AuthService();

  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context.tenantId!;
      const user = await this.authService.register(tenantId, req.body, req.context);

      created(res, 'User registered successfully', {
        uuid: user.uuid,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context.tenantId!;
      const clientContext = {
        ip: req.context.ipAddress || req.ip || '',
        userAgent: (req.context.userAgent || req.headers['user-agent'] || '') as string,
      };

      const result = await this.authService.login(tenantId, req.body, clientContext, req.context);

      success(res, 'Login successful', {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: {
          uuid: result.user.uuid,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          emailVerifiedAt: result.user.emailVerifiedAt,
          status: result.user.status,
          mustChangePassword: result.user.mustChangePassword,
        },
        tenant: {
          uuid: result.tenant.uuid,
          name: result.tenant.name,
          slug: result.tenant.slug,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context.tenantId!;
      const { refreshToken } = req.body;
      await this.authService.logout(tenantId, refreshToken, req.context);
      success(res, 'Logout successful');
    } catch (error) {
      next(error);
    }
  };

  public logoutAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context.tenantId!;
      const { refreshToken } = req.body;
      await this.authService.logoutAll(tenantId, refreshToken, req.context);
      success(res, 'Logout from all devices successful');
    } catch (error) {
      next(error);
    }
  };

  public refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context.tenantId!;
      const { refreshToken } = req.body;
      const clientContext = {
        ip: req.context.ipAddress || req.ip || '',
        userAgent: (req.context.userAgent || req.headers['user-agent'] || '') as string,
      };

      const result = await this.authService.refresh(
        tenantId,
        refreshToken,
        clientContext,
        req.context
      );

      success(res, 'Tokens refreshed successfully', {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
    } catch (error) {
      next(error);
    }
  };

  public requestPasswordReset = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context.tenantId!;
      const clientContext = {
        ip: req.context.ipAddress || req.ip || '',
        userAgent: (req.context.userAgent || req.headers['user-agent'] || '') as string,
      };

      const token = await this.authService.requestPasswordReset(
        tenantId,
        req.body.email,
        clientContext,
        req.context
      );

      success(res, 'If email is registered, password reset instructions will be sent', {
        // Expose token only in development/test for unit/integration testing
        token: process.env.NODE_ENV === 'test' ? token : undefined,
      });
    } catch (error) {
      next(error);
    }
  };

  public resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context.tenantId!;
      await this.authService.resetPassword(tenantId, req.body, req.context);
      success(res, 'Password has been reset successfully');
    } catch (error) {
      next(error);
    }
  };

  public changePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context.tenantId!;
      const userId = req.context.authenticatedUserId!;
      await this.authService.changePassword(tenantId, userId, req.body, req.context);
      success(res, 'Password changed successfully');
    } catch (error) {
      next(error);
    }
  };

  public requestEmailVerification = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context.tenantId!;
      const userId = req.context.authenticatedUserId!;
      const otpCode = await this.authService.requestEmailVerification(
        tenantId,
        userId,
        req.context
      );

      success(res, 'Email verification OTP requested successfully', {
        // Expose OTP only in development/test for unit/integration testing
        otpCode: process.env.NODE_ENV === 'test' ? otpCode : undefined,
      });
    } catch (error) {
      next(error);
    }
  };

  public verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context.tenantId!;
      const userId = req.context.authenticatedUserId!;
      const { otpCode } = req.body;
      await this.authService.verifyEmail(tenantId, userId, otpCode, req.context);
      success(res, 'Email verified successfully');
    } catch (error) {
      next(error);
    }
  };

  public me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context.tenantId!;
      const userId = req.context.authenticatedUserId!;

      const user = await User.findOne({
        where: { id: userId, tenantId },
        include: ['profile'],
      });

      if (!user) {
        res.sendStatus(401);
        return;
      }

      const tenant = await Tenant.findByPk(tenantId);
      const store = await Store.findOne({ where: { tenantId } });
      const userRole = await UserRole.findOne({
        where: { userId, tenantId },
        include: [{ model: Role, as: 'role' }],
      });

      const roleName = (userRole as any)?.role?.name || (userRole as any)?.role?.code || 'Seller Owner';
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
      const tenantName = tenant?.name || 'Comzilo Merchant';
      const storeName = store?.name || 'Main Store';
      const avatar = user.profile?.avatarUrl || null;

      success(res, 'Profile retrieved successfully', {
        id: user.id,
        uuid: user.uuid,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName,
        tenantId: user.tenantId,
        tenantName,
        storeName,
        role: roleName,
        avatar,
        emailVerifiedAt: user.emailVerifiedAt,
        status: user.status,
        mustChangePassword: user.mustChangePassword,
        user: {
          id: user.id,
          uuid: user.uuid,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName,
          status: user.status,
          mustChangePassword: user.mustChangePassword,
          role: roleName,
          avatar,
        },
        tenant: tenant
          ? {
              id: tenant.id,
              uuid: tenant.uuid,
              name: tenant.name,
              slug: tenant.slug,
            }
          : null,
        store: store
          ? {
              id: store.id,
              uuid: store.uuid,
              name: store.name,
              slug: store.slug,
            }
          : null,
        profile: user.profile
          ? {
              avatarUrl: user.profile.avatarUrl,
              gender: user.profile.gender,
              city: user.profile.city,
              country: user.profile.country,
            }
          : null,
      });
    } catch (error) {
      next(error);
    }
  };
}
