import Joi from 'joi';

export const reportValidation = {
  getSalesReport: Joi.object({
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional(),
    period: Joi.string().valid('daily', 'weekly', 'monthly', 'yearly').default('daily'),
  }).unknown(false),

  getProductReport: Joi.object({
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional(),
    categoryId: Joi.number().integer().positive().optional(),
    brandId: Joi.number().integer().positive().optional(),
    sortBy: Joi.string().valid('revenue', 'units').default('revenue'),
    sortOrder: Joi.string().valid('ASC', 'DESC', 'asc', 'desc').default('DESC'),
    limit: Joi.number().integer().min(1).max(100).default(10),
  }).unknown(false),

  getInventoryReport: Joi.object({
    statusFilter: Joi.string().valid('low_stock', 'out_of_stock', 'all').default('all'),
    limit: Joi.number().integer().min(1).max(100).default(20),
  }).unknown(false),

  getCustomerReport: Joi.object({
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional(),
  }).unknown(false),

  getPaymentReport: Joi.object({
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional(),
    paymentMethod: Joi.string().optional(),
  }).unknown(false),

  getPOSReport: Joi.object({
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional(),
    registerId: Joi.number().integer().positive().optional(),
    cashierId: Joi.number().integer().positive().optional(),
  }).unknown(false),

  exportCSV: Joi.object({
    reportType: Joi.string()
      .valid('sales', 'products', 'inventory', 'customers', 'payments', 'pos')
      .required(),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional(),
  }).unknown(false),
};
