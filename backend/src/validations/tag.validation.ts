import Joi from 'joi';

export const tagValidation = {
  createTag: Joi.object({
    name: Joi.string().max(255).required(),
    slug: Joi.string().max(255).optional(),
  }),

  updateTag: Joi.object({
    name: Joi.string().max(255).optional(),
    slug: Joi.string().max(255).optional(),
  }),

  listTags: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().allow('').optional(),
  }),

  assignTags: Joi.object({
    tagIds: Joi.array().items(Joi.number().integer().positive()).unique().required(),
  }),
};
