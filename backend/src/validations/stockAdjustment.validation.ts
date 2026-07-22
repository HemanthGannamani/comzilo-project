import Joi from 'joi';

export const adjustmentValidation = {
  createAdjustment: Joi.object({
    warehouseId: Joi.number().integer().positive().required(),
    warehouseLocationId: Joi.number().integer().positive().required(),
    productId: Joi.number().integer().positive().required(),
    adjustmentType: Joi.string().valid('increase', 'decrease', 'set_absolute').required(),
    quantity: Joi.number().integer().min(0).required(),
    reasonCode: Joi.string().max(100).required(),
    reason: Joi.string().max(255).allow('', null).optional(),
    notes: Joi.string().allow('', null).optional(),
  }),

  listAdjustments: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    warehouseId: Joi.number().integer().positive().optional(),
    productId: Joi.number().integer().positive().optional(),
    status: Joi.string().valid('pending', 'approved', 'rejected', 'cancelled').optional(),
  }),
};
