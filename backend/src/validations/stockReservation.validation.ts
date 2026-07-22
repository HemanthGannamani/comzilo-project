import Joi from 'joi';

export const reservationValidation = {
  createReservation: Joi.object({
    referenceType: Joi.string().max(100).allow('', null).optional(),
    referenceId: Joi.string().max(255).allow('', null).optional(),
    expiresAt: Joi.date().iso().greater('now').allow(null).optional(),
    items: Joi.array()
      .items(
        Joi.object({
          warehouseId: Joi.number().integer().positive().required(),
          warehouseLocationId: Joi.number().integer().positive().required(),
          productId: Joi.number().integer().positive().required(),
          quantity: Joi.number().integer().positive().required(),
        })
      )
      .min(1)
      .required(),
  }),

  listReservations: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    status: Joi.string()
      .valid('active', 'released', 'fulfilled', 'expired', 'cancelled')
      .optional(),
  }),
};
