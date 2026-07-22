import Joi from 'joi';

export const productClassificationValidation = {
  replaceCategories: Joi.object({
    categoryIds: Joi.array().items(Joi.number().integer().positive()).unique().required(),
    primaryCategoryId: Joi.number().integer().positive().allow(null).optional(),
  }),

  assignBrand: Joi.object({
    brandId: Joi.number().integer().positive().allow(null).required(),
  }),

  replaceCollections: Joi.object({
    collectionIds: Joi.array().items(Joi.number().integer().positive()).unique().required(),
  }),

  replaceTags: Joi.object({
    tagIds: Joi.array().items(Joi.number().integer().positive()).unique().required(),
  }),
};
