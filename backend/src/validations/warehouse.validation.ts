import Joi from 'joi';

export const warehouseValidation = {
  createWarehouse: Joi.object({
    name: Joi.string().max(255).required(),
    code: Joi.string().max(100).required(),
    description: Joi.string().allow('', null).optional(),
    status: Joi.string().valid('active', 'inactive', 'archived').default('active'),
    type: Joi.string().valid('physical', 'virtual', 'fulfillment', 'returns').default('physical'),
    addressLine1: Joi.string().max(255).allow('', null).optional(),
    addressLine2: Joi.string().max(255).allow('', null).optional(),
    city: Joi.string().max(100).allow('', null).optional(),
    state: Joi.string().max(100).allow('', null).optional(),
    country: Joi.string().max(100).allow('', null).optional(),
    postalCode: Joi.string().max(20).allow('', null).optional(),
    contactName: Joi.string().max(255).allow('', null).optional(),
    contactPhone: Joi.string().max(50).allow('', null).optional(),
    contactEmail: Joi.string().email().max(255).allow('', null).optional(),
    isDefault: Joi.boolean().default(false),
  }),

  updateWarehouse: Joi.object({
    name: Joi.string().max(255).optional(),
    code: Joi.string().max(100).optional(),
    description: Joi.string().allow('', null).optional(),
    status: Joi.string().valid('active', 'inactive', 'archived').optional(),
    type: Joi.string().valid('physical', 'virtual', 'fulfillment', 'returns').optional(),
    addressLine1: Joi.string().max(255).allow('', null).optional(),
    addressLine2: Joi.string().max(255).allow('', null).optional(),
    city: Joi.string().max(100).allow('', null).optional(),
    state: Joi.string().max(100).allow('', null).optional(),
    country: Joi.string().max(100).allow('', null).optional(),
    postalCode: Joi.string().max(20).allow('', null).optional(),
    contactName: Joi.string().max(255).allow('', null).optional(),
    contactPhone: Joi.string().max(50).allow('', null).optional(),
    contactEmail: Joi.string().email().max(255).allow('', null).optional(),
    isDefault: Joi.boolean().optional(),
  }),

  listWarehouses: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().allow('').optional(),
    status: Joi.string().valid('active', 'inactive', 'archived').optional(),
    type: Joi.string().valid('physical', 'virtual', 'fulfillment', 'returns').optional(),
  }),
};
