import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthenticationError, AuthorizationError } from '../shared/errors/AppError';

import { AuthorizationService } from '../services/authorization.service';

const authzService = new AuthorizationService();

export interface TokenPayload {
  userId: number;
  userUuid: string;
  tenantId: number;
  tenantUuid: string;
  email: string;
}

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthenticationError('Authentication credentials were not provided');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;

    // Tenant Isolation Check: Verify token tenant matches current resolved tenant context (Super Admin bypass)
    if (req.context.tenantId !== null && req.context.tenantId !== decoded.tenantId) {
      const isSuper = await authzService.isSuperAdmin(decoded.userId);
      if (!isSuper) {
        throw new AuthorizationError('Authenticated user does not belong to this tenant');
      }
    }

    // Set credentials on request context
    req.context.authenticatedUserId = decoded.userId;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthenticationError('Token expired');
    }
    if (error instanceof AuthenticationError || error instanceof AuthorizationError) {
      throw error;
    }
    throw new AuthenticationError('Authentication failed');
  }
};
