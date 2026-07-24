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
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AuthenticationError('Authentication credentials were not provided'));
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;

    // Adopt tenant identity from verified access token
    if (decoded.tenantId) {
      req.context.tenantId = decoded.tenantId;
    }

    // Set credentials on request context
    req.context.authenticatedUserId = decoded.userId;

    return next();
  } catch (error: any) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AuthenticationError('Token expired'));
    }
    if (error instanceof AuthenticationError || error instanceof AuthorizationError) {
      return next(error);
    }
    return next(new AuthenticationError('Authentication failed'));
  }
};
