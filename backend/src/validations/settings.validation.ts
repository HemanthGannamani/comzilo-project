import Joi from 'joi';

export const settingsValidation = {
  updateTenantSettings: Joi.object({
    settings: Joi.object().required(),
    category: Joi.string().optional().default('general'),
  }),

  updateTenantSettingSingle: Joi.object({
    key: Joi.string().required(),
    value: Joi.any().required(),
    category: Joi.string().optional().default('general'),
    isPublic: Joi.boolean().optional().default(false),
  }),

  updateStoreSettings: Joi.object({
    settings: Joi.object().required(),
  }),

  updateStoreSettingSingle: Joi.object({
    key: Joi.string().required(),
    value: Joi.any().required(),
    isPublic: Joi.boolean().optional().default(false),
  }),

  updateGlobalConfig: Joi.object({
    key: Joi.string().required(),
    value: Joi.any().required(),
    category: Joi.string().optional().default('system'),
    isPublic: Joi.boolean().optional().default(false),
  }),

  updateFeatureFlags: Joi.object({
    flags: Joi.object({
      pos: Joi.boolean().optional(),
      inventory: Joi.boolean().optional(),
      reports: Joi.boolean().optional(),
      notifications: Joi.boolean().optional(),
      loyalty: Joi.boolean().optional(),
      coupons: Joi.boolean().optional(),
      multi_store: Joi.boolean().optional(),
      multi_currency: Joi.boolean().optional(),
    }).required(),
  }),

  getHistory: Joi.object({
    scope: Joi.string().valid('global', 'tenant', 'store').optional(),
  }),
};
