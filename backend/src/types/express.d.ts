import 'express';
import { RequestContext } from '../middleware/requestContext';

declare global {
  namespace Express {
    interface Request {
      // Extended typed context
      context: RequestContext;

      // Legacy direct fields for backward compatibility
      requestId: string;
      tenantId?: string;
      userId?: string;
      user?: {
        id: string;
        tenantId: string;
        roles: string[];
      };
    }
  }
}
