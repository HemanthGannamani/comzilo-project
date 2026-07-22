import Joi from 'joi';

export const categoryValidation = {
  createCategory: Joi.object({
    name: Joi.string().max(255).required(),
    slug: Joi.string().max(255).optional(),
    description: Joi.string().allow('', null).optional(),
    status: Joi.string().valid('draft', 'active', 'inactive', 'archived').default('draft'),
    visibility: Joi.string().valid('public', 'private', 'hidden').default('public'),
    sortOrder: Joi.number().integer().allow(null).optional(),
    parentId: Joi.number().integer().positive().allow(null).optional(),
    imageMediaId: Joi.number().integer().positive().allow(null).optional(),
    seoTitle: Joi.string().max(255).allow('', null).optional(),
    seoDescription: Joi.string().max(500).allow('', null).optional(),
    seoKeywords: Joi.string().max(255).allow('', null).optional(),
    canonicalUrl: Joi.string().max(2048).allow('', null).optional(),
  }),

  updateCategory: Joi.object({
    name: Joi.string().max(255).optional(),
    slug: Joi.string().max(255).optional(),
    description: Joi.string().allow('', null).optional(),
    status: Joi.string().valid('draft', 'active', 'inactive', 'archived').optional(),
    visibility: Joi.string().valid('public', 'private', 'hidden').optional(),
    sortOrder: Joi.number().integer().allow(null).optional(),
    parentId: Joi.number().integer().positive().allow(null).optional(),
    imageMediaId: Joi.number().integer().positive().allow(null).optional(),
    seoTitle: Joi.string().max(255).allow('', null).optional(),
    seoDescription: Joi.string().max(500).allow('', null).optional(),
    seoKeywords: Joi.string().max(255).allow('', null).optional(),
    canonicalUrl: Joi.string().max(2048).allow('', null).optional(),
  }),

  listCategories: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().allow('').optional(),
    status: Joi.string().valid('draft', 'active', 'inactive', 'archived').optional(),
    visibility: Joi.string().valid('public', 'private', 'hidden').optional(),
    parentId: Joi.number().integer().allow(null).optional(),
  }),

  moveCategory: Joi.object({
    parentId: Joi.number().integer().positive().allow(null).required(),
  }),

  reorderCategories: Joi.object({
    orders: Joi.array()
      .items(
        Joi.object({
          id: Joi.number().integer().positive().required(),
          sortOrder: Joi.number().integer().required(),
        })
      )
      .unique('id')
      .required(),
  }),
};
