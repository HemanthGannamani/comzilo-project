import Joi from 'joi';

export const inventoryValidation = {
  updateReorderSettings: Joi.object({
    reorderPoint: Joi.number().integer().min(0).optional(),
    reorderQuantity: Joi.number().integer().min(0).optional(),
    safetyStock: Joi.number().integer().min(0).optional(),
  }),

  listLowStock: Joi.object({
    warehouseId: Joi.number().integer().positive().optional(),
    warehouseLocationId: Joi.number().integer().positive().optional(),
    productId: Joi.number().integer().positive().optional(),
    limit: Joi.number().integer().min(1).max(100).default(20),
    offset: Joi.number().integer().min(0).default(0),
  }),

  stockIn: Joi.object({
    warehouseId: Joi.number().integer().positive().required(),
    warehouseLocationId: Joi.number().integer().positive().required(),
    productId: Joi.number().integer().positive().required(),
    quantity: Joi.number().integer().positive().required(),
    reason: Joi.string().max(255).allow('', null).optional(),
    notes: Joi.string().allow('', null).optional(),
    idempotencyKey: Joi.string().max(255).allow('', null).optional(),
  }),

  stockOut: Joi.object({
    warehouseId: Joi.number().integer().positive().required(),
    warehouseLocationId: Joi.number().integer().positive().required(),
    productId: Joi.number().integer().positive().required(),
    quantity: Joi.number().integer().positive().required(),
    reason: Joi.string().max(255).allow('', null).optional(),
    notes: Joi.string().allow('', null).optional(),
    idempotencyKey: Joi.string().max(255).allow('', null).optional(),
  }),

  listMovements: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    warehouseId: Joi.number().integer().positive().optional(),
    warehouseLocationId: Joi.number().integer().positive().optional(),
    productId: Joi.number().integer().positive().optional(),
    movementType: Joi.string().optional(),
  }),
};
