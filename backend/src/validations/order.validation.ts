import Joi from 'joi';

export const orderValidation = {
  createOrder: Joi.object({
    customerId: Joi.number().integer().positive().required(),
    discountAmount: Joi.number().min(0).default(0),
    taxAmount: Joi.number().min(0).default(0),
    shippingAmount: Joi.number().min(0).default(0),
    currency: Joi.string().max(10).default('USD'),
    notes: Joi.string().allow('', null).optional(),
    items: Joi.array()
      .items(
        Joi.object({
          productId: Joi.number().integer().positive().required(),
          productVariantId: Joi.number().integer().positive().allow(null).optional(),
          quantity: Joi.number().integer().positive().required(),
          discount: Joi.number().min(0).default(0),
          tax: Joi.number().min(0).default(0),
        })
      )
      .min(1)
      .required(),
  }).unknown(false),

  updateOrder: Joi.object({
    customerId: Joi.number().integer().positive().optional(),
    discountAmount: Joi.number().min(0).optional(),
    taxAmount: Joi.number().min(0).optional(),
    shippingAmount: Joi.number().min(0).optional(),
    currency: Joi.string().max(10).optional(),
    notes: Joi.string().allow('', null).optional(),
    items: Joi.array()
      .items(
        Joi.object({
          productId: Joi.number().integer().positive().required(),
          productVariantId: Joi.number().integer().positive().allow(null).optional(),
          quantity: Joi.number().integer().positive().required(),
          discount: Joi.number().min(0).default(0),
          tax: Joi.number().min(0).default(0),
        })
      )
      .min(1)
      .optional(),
  }).unknown(false),

  listOrders: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string()
      .valid('createdAt', 'orderNumber', 'totalAmount', 'status')
      .default('createdAt'),
    sortOrder: Joi.string().valid('ASC', 'DESC', 'asc', 'desc').default('DESC'),
    orderNumber: Joi.string().allow('').optional(),
    customerId: Joi.number().integer().positive().optional(),
    status: Joi.string()
      .valid('draft', 'pending', 'confirmed', 'processing', 'completed', 'cancelled')
      .optional(),
    paymentStatus: Joi.string().valid('unpaid', 'partially_paid', 'paid', 'refunded').optional(),
    fulfillmentStatus: Joi.string()
      .valid('pending', 'picking', 'packed', 'shipped', 'delivered', 'returned')
      .optional(),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional(),
    minTotal: Joi.number().min(0).optional(),
    maxTotal: Joi.number().min(0).optional(),
  }).unknown(false),
};
