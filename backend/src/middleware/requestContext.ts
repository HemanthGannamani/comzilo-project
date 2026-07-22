import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export interface RequestContext {
  requestId: string;
  tenantId: number | null;
  tenantUuid: string | null;
  authenticatedUserId: number | null;
  authenticatedRoleIds: number[];
  ipAddress: string;
  userAgent: string;
  requestStartTime: number;
  storeId?: number | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rbacCache?: any;
}

export const requestContext = (req: Request, res: Response, next: NextFunction): void => {
  const ipAddress =
    (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  const userAgent = req.headers['user-agent'] || 'Unknown';
  const requestId = uuidv4();

  // Attach context to request object
  req.context = {
    requestId,
    tenantId: null,
    tenantUuid: null,
    authenticatedUserId: null,
    authenticatedRoleIds: [],
    storeId: null,
    ipAddress,
    userAgent,
    requestStartTime: Date.now(),
  };

  // Set Request ID in response headers
  res.setHeader('X-Request-Id', requestId);

  next();
};
