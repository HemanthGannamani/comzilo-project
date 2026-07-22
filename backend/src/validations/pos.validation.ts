import Joi from 'joi';

export const posValidation = {
  openRegister: Joi.object({
    registerId: Joi.number().integer().positive().required(),
    openingAmount: Joi.number().min(0).default(0),
    registerName: Joi.string().max(100).optional(),
    registerCode: Joi.string().max(100).optional(),
  }).unknown(false),

  closeRegister: Joi.object({
    registerId: Joi.number().integer().positive().required(),
    closingAmount: Joi.number().min(0).required(),
  }).unknown(false),

  createPOSSale: Joi.object({
    registerId: Joi.number().integer().positive().required(),
    customerId: Joi.number().integer().positive().optional(),
    items: Joi.array()
      .items(
        Joi.object({
          productId: Joi.number().integer().positive().optional(),
          sku: Joi.string().optional(),
          barcode: Joi.string().optional(),
          quantity: Joi.number().integer().positive().required(),
          discountType: Joi.string().valid('percentage', 'fixed').optional(),
          discountValue: Joi.number().min(0).optional(),
        })
      )
      .min(1)
      .required(),
    orderDiscountType: Joi.string().valid('percentage', 'fixed').optional(),
    orderDiscountValue: Joi.number().min(0).optional(),
    tax: Joi.number().min(0).default(0),
    payments: Joi.array()
      .items(
        Joi.object({
          paymentMethod: Joi.string()
            .valid(
              'Cash',
              'Card',
              'Bank Transfer',
              'UPI',
              'Wallet',
              'Cheque',
              'Store Credit',
              'Manual'
            )
            .required(),
          amount: Joi.number().positive().required(),
        })
      )
      .min(1)
      .required(),
  }).unknown(false),

  createPOSReturn: Joi.object({
    registerId: Joi.number().integer().positive().required(),
    orderId: Joi.number().integer().positive().required(),
    items: Joi.array()
      .items(
        Joi.object({
          productId: Joi.number().integer().positive().required(),
          quantity: Joi.number().integer().positive().required(),
          unitPrice: Joi.number().min(0).optional(),
        })
      )
      .min(1)
      .required(),
    reason: Joi.string().allow('', null).optional(),
  }).unknown(false),

  listReceipts: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().valid('createdAt', 'receiptNumber', 'total').default('createdAt'),
    sortOrder: Joi.string().valid('ASC', 'DESC', 'asc', 'desc').default('DESC'),
    receiptNumber: Joi.string().allow('').optional(),
    cashierId: Joi.number().integer().positive().optional(),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional(),
  }).unknown(false),
};
