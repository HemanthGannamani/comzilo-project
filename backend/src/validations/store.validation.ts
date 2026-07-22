import Joi from 'joi';

export const createStoreSchema = {
  body: Joi.object({
    name: Joi.string().min(2).max(255).required(),
    slug: Joi.string().max(255).optional(),
    legalName: Joi.string().max(255).optional().allow('', null),
    email: Joi.string().email().max(255).optional().allow('', null),
    mobile: Joi.string().max(50).optional().allow('', null),
    currency: Joi.string().max(10).optional().default('INR'),
    timezone: Joi.string().max(100).optional().default('UTC'),
    language: Joi.string().max(10).optional().default('en'),
    logoUrl: Joi.string().max(255).optional().allow('', null),
    faviconUrl: Joi.string().max(255).optional().allow('', null),
    status: Joi.string().valid('active', 'suspended').optional().default('active'),
  }),
};

export const updateStoreSchema = {
  body: Joi.object({
    name: Joi.string().min(2).max(255).optional(),
    slug: Joi.string().max(255).optional(),
    legalName: Joi.string().max(255).optional().allow('', null),
    email: Joi.string().email().max(255).optional().allow('', null),
    mobile: Joi.string().max(50).optional().allow('', null),
    currency: Joi.string().max(10).optional(),
    timezone: Joi.string().max(100).optional(),
    language: Joi.string().max(10).optional(),
    logoUrl: Joi.string().max(255).optional().allow('', null),
    faviconUrl: Joi.string().max(255).optional().allow('', null),
    status: Joi.string().valid('active', 'suspended').optional(),
  }),
};

export const updateSettingsSchema = {
  body: Joi.object()
    .pattern(
      Joi.string().required(),
      Joi.object({
        value: Joi.any().required(),
        isPublic: Joi.boolean().optional().default(false),
      })
    )
    .required(),
};

export const domainSchema = {
  body: Joi.object({
    domain: Joi.string().min(3).max(255).required(),
    domainType: Joi.string().valid('subdomain', 'custom').optional().default('custom'),
    isPrimary: Joi.boolean().optional().default(false),
  }),
};
