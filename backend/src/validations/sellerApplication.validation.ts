import Joi from 'joi';

export const createSellerApplicationSchema = {
  body: Joi.object({
    businessName: Joi.string().min(2).max(255).required(),
    ownerName: Joi.string().min(2).max(255).required(),
    email: Joi.string().email().max(255).required(),
    phone: Joi.string().max(50).required(),
    businessType: Joi.string()
      .valid('Retail', 'Wholesale', 'Manufacturer', 'Distributor', 'Other')
      .required(),
    gstNumber: Joi.string().max(15).allow('', null).optional(),
    panNumber: Joi.string().max(10).allow('', null).optional(),
    addressLine1: Joi.string().max(255).required(),
    addressLine2: Joi.string().max(255).allow('', null).optional(),
    city: Joi.string().max(100).required(),
    state: Joi.string().max(100).required(),
    country: Joi.string().max(100).required(),
    postalCode: Joi.string().max(20).required(),
    preferredStoreName: Joi.string().min(2).max(255).required(),
    password: Joi.string().min(8).required(),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')),
    logo: Joi.string().allow('', null).optional(),
    license: Joi.string().required(),
    gstCertificate: Joi.string().allow('', null).optional(),
    identityProof: Joi.string().required(),
  }),
};
