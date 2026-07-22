import { Request, Response, NextFunction } from 'express';
import { logger } from '../shared/logging/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = req.context?.requestStartTime || Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const { method, path, headers } = req;
    const statusCode = res.statusCode;

    // Filter headers to strip out sensitive data
    const safeHeaders = { ...headers };
    delete safeHeaders.authorization;
    delete safeHeaders.cookie;
    delete safeHeaders['x-refresh-token'];

    logger.info(`HTTP ${method} ${path} ${statusCode} - ${duration}ms`, {
      requestId: req.context?.requestId || 'N/A',
      tenantId: req.context?.tenantUuid || null,
      userId: req.context?.authenticatedUserId || null,
      method,
      path,
      statusCode,
      duration,
      ip: req.context?.ipAddress || '127.0.0.1',
      userAgent: req.context?.userAgent || 'Unknown',
      headers: safeHeaders,
    });
  });

  next();
};
