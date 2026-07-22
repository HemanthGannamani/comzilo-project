import { Transaction } from 'sequelize';
import { Schema } from 'joi';
import { ValidationError } from '../shared/errors/AppError';
import { withTransaction } from '../utils/transactions';
import { logger } from '../shared/logging/logger';
import { RequestContext } from '../middleware/requestContext';

export abstract class BaseService {
  protected constructor(protected readonly serviceName: string) {}

  /**
   * Helper to run queries inside a database transaction wrapper
   */
  protected async withTransaction<T>(
    callback: (transaction: Transaction) => Promise<T>,
    existingTransaction?: Transaction
  ): Promise<T> {
    return withTransaction(callback, existingTransaction);
  }

  /**
   * Validate parameters using a Joi Schema
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected validateData<T>(schema: Schema, data: any): T {
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((detail) => ({
        message: detail.message,
        path: detail.path.map(String),
      }));
      throw new ValidationError('Validation failed', details);
    }

    return value as T;
  }

  /**
   * Return a context-aware structured logger instance
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected logInfo(message: string, context?: RequestContext, meta?: Record<string, any>): void {
    logger.info(`[${this.serviceName}] ${message}`, {
      requestId: context?.requestId || 'N/A',
      tenantId: context?.tenantUuid || null,
      userId: context?.authenticatedUserId || null,
      ...meta,
    });
  }

  protected logError(
    message: string,
    error: unknown,
    context?: RequestContext,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    meta?: Record<string, any>
  ): void {
    logger.error(`[${this.serviceName}] ${message}`, {
      requestId: context?.requestId || 'N/A',
      tenantId: context?.tenantUuid || null,
      userId: context?.authenticatedUserId || null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      errorMessage: (error as any)?.message || String(error),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      stack: (error as any)?.stack,
      ...meta,
    });
  }
}
export default BaseService;
