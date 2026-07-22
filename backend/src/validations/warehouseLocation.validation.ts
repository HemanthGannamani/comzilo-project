import Joi from 'joi';

export const locationValidation = {
  createLocation: Joi.object({
    name: Joi.string().max(255).required(),
    code: Joi.string().max(100).required(),
    description: Joi.string().allow('', null).optional(),
    zone: Joi.string().max(100).allow('', null).optional(),
    aisle: Joi.string().max(50).allow('', null).optional(),
    rack: Joi.string().max(50).allow('', null).optional(),
    shelf: Joi.string().max(50).allow('', null).optional(),
    bin: Joi.string().max(50).allow('', null).optional(),
    status: Joi.string().valid('active', 'inactive', 'archived').default('active'),
    isDefault: Joi.boolean().default(false),
  }),

  updateLocation: Joi.object({
    name: Joi.string().max(255).optional(),
    code: Joi.string().max(100).optional(),
    description: Joi.string().allow('', null).optional(),
    zone: Joi.string().max(100).allow('', null).optional(),
    aisle: Joi.string().max(50).allow('', null).optional(),
    rack: Joi.string().max(50).allow('', null).optional(),
    shelf: Joi.string().max(50).allow('', null).optional(),
    bin: Joi.string().max(50).allow('', null).optional(),
    status: Joi.string().valid('active', 'inactive', 'archived').optional(),
    isDefault: Joi.boolean().optional(),
  }),

  listLocations: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().allow('').optional(),
    status: Joi.string().valid('active', 'inactive', 'archived').optional(),
  }),
};
