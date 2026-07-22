import { HTTP_STATUS, RESPONSE_MESSAGES } from '../constants';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly errors: unknown[];
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    code: string = 'INTERNAL_SERVER_ERROR',
    errors: unknown[] = []
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
    this.isOperational = true;

    // Restore prototype chain for extending Error subclass
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = RESPONSE_MESSAGES.VALIDATION_ERROR, errors: unknown[] = []) {
    super(message, HTTP_STATUS.BAD_REQUEST, 'VALIDATION_ERROR', errors);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = RESPONSE_MESSAGES.UNAUTHORIZED) {
    super(message, HTTP_STATUS.UNAUTHORIZED, 'UNAUTHORIZED');
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = RESPONSE_MESSAGES.FORBIDDEN) {
    super(message, HTTP_STATUS.FORBIDDEN, 'FORBIDDEN');
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

export class TenantNotFoundError extends AppError {
  constructor(message: string = RESPONSE_MESSAGES.TENANT_NOT_FOUND) {
    super(message, HTTP_STATUS.NOT_FOUND, 'TENANT_NOT_FOUND');
    Object.setPrototypeOf(this, TenantNotFoundError.prototype);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = RESPONSE_MESSAGES.CONFLICT) {
    super(message, HTTP_STATUS.CONFLICT, 'CONFLICT');
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed', errors: unknown[] = []) {
    super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'DATABASE_ERROR', errors);
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = RESPONSE_MESSAGES.NOT_FOUND) {
    super(message, HTTP_STATUS.NOT_FOUND, 'NOT_FOUND');
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = RESPONSE_MESSAGES.RATE_LIMIT_EXCEEDED) {
    super(message, HTTP_STATUS.TOO_MANY_REQUESTS, 'RATE_LIMIT_EXCEEDED');
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

export class BusinessRuleError extends AppError {
  constructor(message: string, code: string = 'BUSINESS_RULE_VIOLATION') {
    super(message, HTTP_STATUS.UNPROCESSABLE_ENTITY, code);
    Object.setPrototypeOf(this, BusinessRuleError.prototype);
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message: string = RESPONSE_MESSAGES.SERVICE_UNAVAILABLE) {
    super(message, HTTP_STATUS.SERVICE_UNAVAILABLE, 'SERVICE_UNAVAILABLE');
    Object.setPrototypeOf(this, ServiceUnavailableError.prototype);
  }
}
