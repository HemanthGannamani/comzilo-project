import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { ValidationError } from '../shared/errors/AppError';

export interface ValidationSchemas {
  body?: Schema;
  query?: Schema;
  params?: Schema;
  headers?: Schema;
}

export const validate = (schemas: ValidationSchemas) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const errors: { message: string; path: string[] }[] = [];

    const targets: ('body' | 'query' | 'params' | 'headers')[] = [
      'body',
      'query',
      'params',
      'headers',
    ];

    for (const target of targets) {
      const schema = schemas[target];
      if (schema) {
        const { error, value } = schema.validate(req[target], {
          abortEarly: false,
          stripUnknown: target !== 'headers',
        });

        if (error) {
          errors.push(
            ...error.details.map((detail) => ({
              message: detail.message,
              path: [target, ...detail.path.map(String)],
            }))
          );
        } else {
          req[target] = value;
        }
      }
    }

    if (errors.length > 0) {
      return next(new ValidationError('Validation failed', errors));
    }

    next();
  };
};
