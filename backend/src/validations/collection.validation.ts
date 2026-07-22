import Joi from 'joi';

export const collectionValidation = {
  createCollection: Joi.object({
    name: Joi.string().max(255).required(),
    slug: Joi.string().max(255).optional(),
    description: Joi.string().allow('', null).optional(),
    imageMediaId: Joi.number().integer().positive().allow(null).optional(),
    status: Joi.string().valid('draft', 'active', 'inactive', 'archived').default('draft'),
    visibility: Joi.string().valid('public', 'private', 'hidden').default('public'),
    sortOrder: Joi.number().integer().allow(null).optional(),
    seoTitle: Joi.string().max(255).allow('', null).optional(),
    seoDescription: Joi.string().max(500).allow('', null).optional(),
    seoKeywords: Joi.string().max(255).allow('', null).optional(),
    canonicalUrl: Joi.string().max(2048).allow('', null).optional(),
  }),

  updateCollection: Joi.object({
    name: Joi.string().max(255).optional(),
    slug: Joi.string().max(255).optional(),
    description: Joi.string().allow('', null).optional(),
    imageMediaId: Joi.number().integer().positive().allow(null).optional(),
    status: Joi.string().valid('draft', 'active', 'inactive', 'archived').optional(),
    visibility: Joi.string().valid('public', 'private', 'hidden').optional(),
    sortOrder: Joi.number().integer().allow(null).optional(),
    seoTitle: Joi.string().max(255).allow('', null).optional(),
    seoDescription: Joi.string().max(500).allow('', null).optional(),
    seoKeywords: Joi.string().max(255).allow('', null).optional(),
    canonicalUrl: Joi.string().max(2048).allow('', null).optional(),
  }),

  listCollections: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().allow('').optional(),
    status: Joi.string().valid('draft', 'active', 'inactive', 'archived').optional(),
    visibility: Joi.string().valid('public', 'private', 'hidden').optional(),
  }),

  addProduct: Joi.object({
    productId: Joi.number().integer().positive().required(),
    sortOrder: Joi.number().integer().optional(),
  }),

  replaceProducts: Joi.object({
    productIds: Joi.array().items(Joi.number().integer().positive()).unique().required(),
  }),

  reorderProducts: Joi.object({
    orderedProductIds: Joi.array().items(Joi.number().integer().positive()).unique().required(),
  }),
};
