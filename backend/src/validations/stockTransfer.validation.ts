import Joi from 'joi';

export const transferValidation = {
  createTransfer: Joi.object({
    sourceWarehouseId: Joi.number().integer().positive().required(),
    destinationWarehouseId: Joi.number().integer().positive().required(),
    referenceNumber: Joi.string().max(100).allow('', null).optional(),
    notes: Joi.string().allow('', null).optional(),
    items: Joi.array()
      .items(
        Joi.object({
          productId: Joi.number().integer().positive().required(),
          sourceLocationId: Joi.number().integer().positive().required(),
          destinationLocationId: Joi.number().integer().positive().required(),
          requestedQuantity: Joi.number().integer().positive().required(),
        })
      )
      .min(1)
      .required(),
  }),

  updateTransfer: Joi.object({
    referenceNumber: Joi.string().max(100).allow('', null).optional(),
    notes: Joi.string().allow('', null).optional(),
    items: Joi.array()
      .items(
        Joi.object({
          productId: Joi.number().integer().positive().required(),
          sourceLocationId: Joi.number().integer().positive().required(),
          destinationLocationId: Joi.number().integer().positive().required(),
          requestedQuantity: Joi.number().integer().positive().required(),
        })
      )
      .optional(),
  }),

  receiveTransfer: Joi.object({
    items: Joi.array()
      .items(
        Joi.object({
          productId: Joi.number().integer().positive().required(),
          receivedQuantity: Joi.number().integer().min(0).required(),
        })
      )
      .min(1)
      .required(),
  }),

  listTransfers: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    status: Joi.string()
      .valid(
        'draft',
        'pending_approval',
        'approved',
        'in_transit',
        'partially_received',
        'received',
        'rejected',
        'cancelled'
      )
      .optional(),
  }),
};
