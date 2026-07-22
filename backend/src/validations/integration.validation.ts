import Joi from 'joi';

export const integrationValidation = {
  createEndpoint: Joi.object({
    name: Joi.string().required(),
    targetUrl: Joi.string().uri().required(),
    events: Joi.array().items(Joi.string()).min(1).required(),
    secret: Joi.string().optional(),
  }),

  updateEndpoint: Joi.object({
    name: Joi.string().optional(),
    targetUrl: Joi.string().uri().optional(),
    events: Joi.array().items(Joi.string()).optional(),
    isActive: Joi.boolean().optional(),
  }),

  triggerWebhook: Joi.object({
    eventType: Joi.string().required(),
    payload: Joi.object().required(),
  }),

  connectIntegration: Joi.object({
    provider: Joi.string()
      .valid('shopify', 'woocommerce', 'stripe', 'quickbooks', 'zapier', 'custom')
      .required(),
    name: Joi.string().required(),
    config: Joi.object().optional(),
  }),

  updateIntegration: Joi.object({
    name: Joi.string().optional(),
    config: Joi.object().optional(),
    status: Joi.string().valid('connected', 'disconnected', 'error').optional(),
  }),

  triggerSync: Joi.object({
    syncType: Joi.string().valid('orders', 'inventory', 'customers', 'products').required(),
  }),
};
