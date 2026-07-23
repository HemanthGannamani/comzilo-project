/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../config/env';
import { BaseService } from '../core/BaseService';
import {
  User,
  Tenant,
  RefreshToken,
  LoginHistory,
  UserDevice,
  OtpRequest,
  PasswordResetToken,
  UserProfile,
} from '../database/models';
import { UserRepository } from '../repositories/user.repository';
import { RefreshTokenRepository } from '../repositories/refreshToken.repository';
import { OtpRequestRepository } from '../repositories/otpRequest.repository';
import { PasswordResetTokenRepository } from '../repositories/passwordResetToken.repository';
import {
  AuthenticationError,
  ValidationError,
  BusinessRuleError,
  NotFoundError,
} from '../shared/errors/AppError';
import { withTransaction } from '../utils/transactions';
import { RequestContext } from '../middleware/requestContext';
import { NotificationService } from './notification.service';
import { createAuditLog } from '../utils/auditHelper';
import { validatePasswordPolicy } from '../validations/auth.validation';

export class AuthService extends BaseService {
  private readonly userRepository = new UserRepository();
  private readonly refreshTokenRepository = new RefreshTokenRepository();
  private readonly otpRequestRepository = new OtpRequestRepository();
  private readonly resetTokenRepository = new PasswordResetTokenRepository();

  constructor() {
    super('AuthService');
  }

  private hashSHA256(val: string): string {
    return crypto.createHash('sha256').update(val).digest('hex');
  }

  /**
   * Registers a new customer user and profile
   */
  public async register(tenantId: number, data: any, context?: RequestContext): Promise<User> {
    this.logInfo(`Registering user ${data.email} for tenant ${tenantId}`, context);

    // Verify tenant exists
    const tenant = await Tenant.findByPk(tenantId);
    if (!tenant) {
      throw new NotFoundError('Tenant not found');
    }

    // Check duplicate email under this tenant
    const existingUser = await this.userRepository.findByEmail(tenantId, data.email);
    if (existingUser) {
      throw new BusinessRuleError(
        'Email is already registered under this tenant',
        'DUPLICATE_EMAIL'
      );
    }

    const passwordHash = await bcrypt.hash(data.password, env.BCRYPT_ROUNDS);

    return withTransaction(async (t) => {
      const user = await User.create(
        {
          tenantId,
          uuid: uuidv4(),
          email: data.email.toLowerCase(),
          passwordHash,
          firstName: data.firstName,
          lastName: data.lastName,
          mobile: data.mobile || null,
          status: 'active',
        },
        { transaction: t }
      );

      await UserProfile.create(
        {
          tenantId,
          userId: user.id,
        },
        { transaction: t }
      );

      return user;
    });
  }

  /**
   * Logs in a user, manages locking, history, and registers device context
   */
  public async login(
    tenantId: number,
    data: any,
    clientContext: { ip: string; userAgent: string },
    context?: RequestContext
  ): Promise<{ accessToken: string; refreshToken: string; user: User; tenant: Tenant }> {
    const email = data.email.toLowerCase();
    this.logInfo(`Login attempt for ${email} on tenant ${tenantId}`, context);

    const tenant = await Tenant.findByPk(tenantId);
    if (!tenant) {
      throw new NotFoundError('Tenant not found');
    }

    const user = await this.userRepository.findByEmail(tenantId, email);

    if (!user) {
      await LoginHistory.create({
        tenantId,
        userId: null,
        emailAttempted: email,
        wasSuccessful: false,
        failureReason: 'User not found',
        ipAddress: clientContext.ip,
        userAgent: clientContext.userAgent,
      });
      throw new AuthenticationError('Invalid email or password');
    }

    if (user.status === 'disabled' || user.status === 'suspended') {
      await LoginHistory.create({
        tenantId,
        userId: user.id,
        emailAttempted: email,
        wasSuccessful: false,
        failureReason: 'Account is inactive, disabled or suspended',
        ipAddress: clientContext.ip,
        userAgent: clientContext.userAgent,
      });
      throw new AuthenticationError('Account is inactive, disabled or suspended');
    }

    // Lockout Checks
    if ((user.status as any) === 'locked') {
      if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
        await LoginHistory.create({
          tenantId,
          userId: user.id,
          emailAttempted: email,
          wasSuccessful: false,
          failureReason: 'Account temporarily locked',
          ipAddress: clientContext.ip,
          userAgent: clientContext.userAgent,
        });
        throw new AuthenticationError('Account is temporarily locked. Try again later.');
      } else {
        // Lock expired
        user.failedLoginAttempts = 0;
        user.lockedUntil = null;
        user.status = 'active';
        await user.save();
      }
    }

    // Verify Password
    const passwordMatch = await user.comparePassword(data.password);

    if (!passwordMatch) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= 5) {
        user.status = 'locked';
        user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
        this.logInfo(`User account locked due to consecutive failures: ${email}`, context);
      }
      await user.save();

      await LoginHistory.create({
        tenantId,
        userId: user.id,
        emailAttempted: email,
        wasSuccessful: false,
        failureReason: 'Incorrect password',
        ipAddress: clientContext.ip,
        userAgent: clientContext.userAgent,
      });

      throw new AuthenticationError('Invalid email or password');
    }

    // Success login operations
    const isFirstLogin = !user.lastLoginAt;
    user.failedLoginAttempts = 0;
    user.lockedUntil = null;
    user.lastLoginAt = new Date();
    if ((user.status as any) === 'locked') {
      user.status = 'active';
    }
    await user.save();

    if (isFirstLogin) {
      await createAuditLog(
        {
          action: 'user.first_login',
          entityType: 'user',
          entityId: String(user.id),
          newValues: { email: user.email },
        },
        context
      );
    }

    // Register Device Context
    const deviceUuid =
      data.deviceUuid || this.hashSHA256(clientContext.userAgent + clientContext.ip);
    await UserDevice.upsert({
      tenantId,
      userId: user.id,
      deviceUuid,
      deviceName: data.deviceName || 'Web Browser',
      platform: data.platform || null,
      browser: data.browser || null,
      operatingSystem: data.os || null,
      lastUserAgent: clientContext.userAgent,
      lastIpAddress: clientContext.ip,
      lastSeenAt: new Date(),
    });

    // Record Login History
    await LoginHistory.create({
      tenantId,
      userId: user.id,
      emailAttempted: email,
      wasSuccessful: true,
      failureReason: null,
      ipAddress: clientContext.ip,
      userAgent: clientContext.userAgent,
    });

    // Generate tokens
    const tokens = await this.issueTokenPair(tenantId, tenant.uuid, user, clientContext);

    return {
      ...tokens,
      user,
      tenant,
    };
  }

  /**
   * Refreshes access tokens, implements Refresh Token Rotation (RTR) and reuse detection
   */
  public async refresh(
    tenantId: number,
    refreshTokenString: string,
    clientContext: { ip: string; userAgent: string },
    context?: RequestContext
  ): Promise<{ accessToken: string; refreshToken: string }> {
    let decoded: any;
    try {
      decoded = jwt.verify(refreshTokenString, env.JWT_REFRESH_SECRET);
    } catch (err) {
      throw new AuthenticationError('Invalid refresh token signature');
    }

    const rawRefreshToken = decoded.jti;
    if (!rawRefreshToken) {
      throw new AuthenticationError('Invalid refresh token identifier');
    }

    const tokenHash = this.hashSHA256(rawRefreshToken);
    const tokenRecord = await this.refreshTokenRepository.findByHash(tenantId, tokenHash);

    if (!tokenRecord) {
      throw new AuthenticationError('Refresh token details unrecognized');
    }

    // Rotation Reuse Detection (Theft check)
    if (tokenRecord.revokedAt) {
      // Security breach warning: Revoke all tokens in family
      await this.refreshTokenRepository.revokeFamily(
        tenantId,
        tokenRecord.familyId,
        'Token reuse breach triggered'
      );
      this.logError(
        `Refresh token reuse breach detected! Family revoked: ${tokenRecord.familyId}`,
        null as any,
        context
      );
      throw new AuthenticationError('Session invalidated due to suspicious activity');
    }

    if (new Date(tokenRecord.expiresAt) < new Date()) {
      throw new AuthenticationError('Refresh token expired');
    }

    const user = await User.findByPk(tokenRecord.userId);
    const tenant = await Tenant.findByPk(tenantId);
    if (!user || !tenant) {
      throw new AuthenticationError('Identity could not be confirmed');
    }

    // Secure rotation: Consumed/Revoked rotated token
    tokenRecord.revokedAt = new Date();
    tokenRecord.revokeReason = 'Rotated';
    await tokenRecord.save();

    // Issue new pair under the same family
    return this.issueTokenPair(
      tenantId,
      tenant.uuid,
      user,
      clientContext,
      tokenRecord.familyId,
      tokenRecord.id
    );
  }

  public async logout(
    tenantId: number,
    refreshTokenString: string,
    context?: RequestContext
  ): Promise<void> {
    this.logInfo('Logout request received', context);
    let decoded: any;
    try {
      decoded = jwt.verify(refreshTokenString, env.JWT_REFRESH_SECRET);
    } catch (err) {
      throw new AuthenticationError('Invalid refresh token signature');
    }

    const rawRefreshToken = decoded.jti;
    if (!rawRefreshToken) {
      throw new AuthenticationError('Invalid refresh token identifier');
    }

    const tokenHash = this.hashSHA256(rawRefreshToken);
    const tokenRecord = await this.refreshTokenRepository.findByHash(tenantId, tokenHash);

    if (tokenRecord) {
      tokenRecord.revokedAt = new Date();
      tokenRecord.revokeReason = 'User logged out';
      await tokenRecord.save();
    }
  }

  /**
   * Revokes all refresh token sessions in the lineage family
   */
  public async logoutAll(
    tenantId: number,
    refreshTokenString: string,
    context?: RequestContext
  ): Promise<void> {
    this.logInfo('Logout-all request received', context);
    let decoded: any;
    try {
      decoded = jwt.verify(refreshTokenString, env.JWT_REFRESH_SECRET);
    } catch (err) {
      throw new AuthenticationError('Invalid refresh token signature');
    }

    const rawRefreshToken = decoded.jti;
    if (!rawRefreshToken) {
      throw new AuthenticationError('Invalid refresh token identifier');
    }

    const tokenHash = this.hashSHA256(rawRefreshToken);
    const tokenRecord = await this.refreshTokenRepository.findByHash(tenantId, tokenHash);

    if (tokenRecord) {
      await this.refreshTokenRepository.revokeFamily(
        tenantId,
        tokenRecord.familyId,
        'Logged out all devices'
      );
    }
  }

  /**
   * Requests a password reset token
   */
  public async requestPasswordReset(
    tenantId: number,
    email: string,
    clientContext: { ip: string; userAgent: string },
    _context?: RequestContext
  ): Promise<string> {
    let user = await this.userRepository.findByEmail(tenantId, email);
    if (!user) {
      user = await this.userRepository.findByEmail(null, email);
    }
    if (!user) {
      // Prevent user enumeration: act successful
      return 'dummy-token';
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = this.hashSHA256(rawToken);

    await PasswordResetToken.create({
      tenantId: user.tenantId,
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour validity
      requestedIp: clientContext.ip,
      userAgent: clientContext.userAgent,
    });

    try {
      const notificationService = new NotificationService();
      const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${rawToken}`;
      await notificationService.sendNotification(user.tenantId, null, {
        userId: user.id,
        recipient: user.email,
        channel: 'email',
        title: 'Password Reset Request',
        content: `Dear ${user.firstName}, you requested a password reset. Click here to reset: ${resetUrl}`,
      });
    } catch (e) {
      this.logError('Failed to send password reset notification email', e);
    }

    return rawToken;
  }

  /**
   * Resets password using valid token
   */
  public async resetPassword(
    tenantId: number,
    data: any,
    context?: RequestContext
  ): Promise<void> {
    const tokenHash = this.hashSHA256(data.token);
    let tokenRecord = await this.resetTokenRepository.findActiveToken(tenantId, tokenHash);
    if (!tokenRecord) {
      tokenRecord = await this.resetTokenRepository.findActiveToken(1, tokenHash);
    }

    if (!tokenRecord || new Date(tokenRecord.expiresAt) < new Date() || tokenRecord.consumedAt) {
      throw new ValidationError('Invalid or expired password reset token');
    }

    const user = await User.findByPk(tokenRecord.userId);
    if (!user) {
      throw new ValidationError('User not found');
    }

    const newPass = data.password || data.newPassword;
    if (!newPass) {
      throw new ValidationError('New password is required');
    }

    if (!validatePasswordPolicy(newPass)) {
      throw new ValidationError(
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
      );
    }

    const passwordHash = await bcrypt.hash(newPass, env.BCRYPT_ROUNDS);

    await withTransaction(async (t) => {
      user.passwordHash = passwordHash;
      user.failedLoginAttempts = 0;
      user.mustChangePassword = false;
      user.status = 'active';
      await user.save({ transaction: t });

      tokenRecord!.consumedAt = new Date();
      await tokenRecord!.save({ transaction: t });
    });

    await createAuditLog(
      {
        action: 'password.reset',
        entityType: 'user',
        entityId: String(user.id),
      },
      context
    );
  }

  /**
   * Allows authenticated user to change password
   */
  public async changePassword(
    _tenantId: number,
    userId: number,
    data: any,
    context?: RequestContext
  ): Promise<void> {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isMatch = await user.comparePassword(data.currentPassword);
    if (!isMatch) {
      throw new ValidationError('Current password is incorrect');
    }

    if (!validatePasswordPolicy(data.newPassword)) {
      throw new ValidationError(
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
      );
    }

    user.passwordHash = await bcrypt.hash(data.newPassword, env.BCRYPT_ROUNDS);
    user.mustChangePassword = false;
    await user.save();

    await createAuditLog(
      {
        action: 'password.changed',
        entityType: 'user',
        entityId: String(user.id),
      },
      context
    );
  }

  /**
   * Requests email verification OTP
   */
  public async requestEmailVerification(
    tenantId: number,
    userId: number,
    _context?: RequestContext
  ): Promise<string> {
    const user = await User.findByPk(userId);
    if (!user || user.tenantId !== tenantId) {
      throw new NotFoundError('User not found');
    }

    const otpCode = String(Math.floor(100000 + Math.random() * 900000)); // 6 digit OTP
    const otpHash = await bcrypt.hash(otpCode, 8); // fast rounds for OTP

    await OtpRequest.create({
      tenantId,
      userId,
      purpose: 'email_verification',
      destination: user.email,
      otpHash,
      attempts: 0,
      maxAttempts: 5,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 mins expiry
    });

    return otpCode;
  }

  /**
   * Verifies email using verification OTP code
   */
  public async verifyEmail(
    tenantId: number,
    userId: number,
    otpCode: string,
    _context?: RequestContext
  ): Promise<void> {
    const user = await User.findByPk(userId);
    if (!user || user.tenantId !== tenantId) {
      throw new NotFoundError('User not found');
    }

    const otpRecord = await this.otpRequestRepository.findLatestActive(
      tenantId,
      user.email,
      'email_verification'
    );

    if (!otpRecord || new Date(otpRecord.expiresAt) < new Date()) {
      throw new ValidationError('Invalid or expired verification OTP');
    }

    if (otpRecord.attempts >= otpRecord.maxAttempts) {
      throw new ValidationError('Maximum OTP verification attempts exceeded');
    }

    const isMatch = await otpRecord.compareOtp(otpCode);

    if (!isMatch) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      throw new ValidationError('Incorrect verification OTP code');
    }

    await withTransaction(async (t) => {
      user.emailVerifiedAt = new Date();
      await user.save({ transaction: t });

      otpRecord.consumedAt = new Date();
      await otpRecord.save({ transaction: t });
    });
  }

  /**
   * Helper to issue an access and refresh token pair
   */
  private async issueTokenPair(
    tenantId: number,
    _tenantUuid: string,
    user: User,
    clientContext: { ip: string; userAgent: string },
    familyId?: string,
    rotatedFrom?: number
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const userPayload = {
      userId: user.id,
      tenantId,
      jti: uuidv4(),
      tokenType: 'access',
    };

    const accessToken = jwt.sign(userPayload, env.JWT_ACCESS_SECRET, {
      algorithm: 'HS256',
      expiresIn: env.JWT_ACCESS_EXPIRES_IN as any,
    });

    const activeFamilyId = familyId || uuidv4();
    const rawRefreshToken = crypto.randomBytes(40).toString('hex');
    const refreshTokenHash = this.hashSHA256(rawRefreshToken);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await RefreshToken.create({
      tenantId,
      userId: user.id,
      tokenHash: refreshTokenHash,
      familyId: activeFamilyId,
      rotatedFrom: rotatedFrom || null,
      expiresAt,
      ipAddress: clientContext.ip,
      userAgent: clientContext.userAgent,
    });

    const refreshTokenPayload = {
      userId: user.id,
      tenantId,
      familyId: activeFamilyId,
    };

    // Sign the raw secret into the client JWT refresh token
    const refreshToken = jwt.sign(refreshTokenPayload, env.JWT_REFRESH_SECRET, {
      algorithm: 'HS256',
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
      jwtid: rawRefreshToken, // include raw random signature for verification
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
