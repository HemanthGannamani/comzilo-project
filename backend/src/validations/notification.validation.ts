import Joi from 'joi';

export const notificationValidation = {
  createTemplate: Joi.object({
    code: Joi.string().required(),
    name: Joi.string().required(),
    channel: Joi.string().valid('email', 'sms', 'push', 'in_app', 'whatsapp').required(),
    subject: Joi.string().optional().allow('', null),
    body: Joi.string().required(),
    variables: Joi.array().items(Joi.string()).optional(),
    isActive: Joi.boolean().optional(),
  }),

  updateTemplate: Joi.object({
    name: Joi.string().optional(),
    subject: Joi.string().optional().allow('', null),
    body: Joi.string().optional(),
    variables: Joi.array().items(Joi.string()).optional(),
    isActive: Joi.boolean().optional(),
  }),

  updatePreferences: Joi.object({
    emailEnabled: Joi.boolean().optional(),
    smsEnabled: Joi.boolean().optional(),
    pushEnabled: Joi.boolean().optional(),
    whatsappEnabled: Joi.boolean().optional(),
    orderNotifications: Joi.boolean().optional(),
    paymentNotifications: Joi.boolean().optional(),
    inventoryAlerts: Joi.boolean().optional(),
    systemAlerts: Joi.boolean().optional(),
    marketingNotifications: Joi.boolean().optional(),
  }),

  sendNotification: Joi.object({
    userId: Joi.number().integer().positive().optional(),
    recipient: Joi.string().required(),
    channel: Joi.string().valid('email', 'sms', 'push', 'in_app', 'whatsapp').required(),
    title: Joi.string().optional(),
    content: Joi.string().optional().allow(''),
    templateCode: Joi.string().optional(),
    variables: Joi.object().optional(),
    priority: Joi.string().valid('low', 'normal', 'high', 'urgent').optional(),
    payload: Joi.object().optional(),
  }),

  listNotifications: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    status: Joi.string().optional(),
  }),
};
