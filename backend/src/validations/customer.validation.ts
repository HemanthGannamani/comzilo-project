import Joi from 'joi';

export const customerValidation = {
  createCustomer: Joi.object({
    firstName: Joi.string().max(255).required(),
    lastName: Joi.string().max(255).required(),
    email: Joi.string().email().max(255).required(),
    phone: Joi.string().max(50).allow('', null).optional().default('+1000000000'),
    alternatePhone: Joi.string().max(50).allow('', null).optional(),
    gender: Joi.string()
      .valid('male', 'female', 'other', 'prefer_not_to_say')
      .allow('', null)
      .optional(),
    dateOfBirth: Joi.date().iso().allow('', null).optional(),
    profileImageId: Joi.number().integer().positive().allow(null).optional(),
    status: Joi.string().valid('active', 'inactive', 'blocked').default('active'),
    customerType: Joi.string().valid('individual', 'business').default('individual'),
    taxNumber: Joi.string().max(100).allow('', null).optional(),
    companyName: Joi.string().max(255).allow('', null).optional(),
    notes: Joi.string().allow('', null).optional(),
    preferredLanguage: Joi.string().max(10).default('en'),
    preferredCurrency: Joi.string().max(10).default('USD'),
  }).unknown(false),

  updateCustomer: Joi.object({
    firstName: Joi.string().max(255).optional(),
    lastName: Joi.string().max(255).optional(),
    email: Joi.string().email().max(255).optional(),
    phone: Joi.string().max(50).optional(),
    alternatePhone: Joi.string().max(50).allow('', null).optional(),
    gender: Joi.string()
      .valid('male', 'female', 'other', 'prefer_not_to_say')
      .allow('', null)
      .optional(),
    dateOfBirth: Joi.date().iso().allow('', null).optional(),
    profileImageId: Joi.number().integer().positive().allow(null).optional(),
    status: Joi.string().valid('active', 'inactive', 'blocked').optional(),
    customerType: Joi.string().valid('individual', 'business').optional(),
    taxNumber: Joi.string().max(100).allow('', null).optional(),
    companyName: Joi.string().max(255).allow('', null).optional(),
    notes: Joi.string().allow('', null).optional(),
    preferredLanguage: Joi.string().max(10).optional(),
    preferredCurrency: Joi.string().max(10).optional(),
  }).unknown(false),

  listCustomers: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string()
      .valid('createdAt', 'firstName', 'lastName', 'fullName', 'email', 'customerCode')
      .default('createdAt'),
    sortOrder: Joi.string().valid('ASC', 'DESC', 'asc', 'desc').default('DESC'),
    search: Joi.string().allow('').optional(),
    status: Joi.string().valid('active', 'inactive', 'blocked').optional(),
    customerType: Joi.string().valid('individual', 'business').optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
    customerCode: Joi.string().optional(),
    companyName: Joi.string().optional(),
  }).unknown(false),

  createAddress: Joi.object({
    addressType: Joi.string()
      .valid('billing', 'shipping', 'home', 'office', 'other')
      .default('shipping'),
    fullName: Joi.string().max(255).required(),
    phone: Joi.string().max(50).required(),
    company: Joi.string().max(255).allow('', null).optional(),
    addressLine1: Joi.string().max(255).required(),
    addressLine2: Joi.string().max(255).allow('', null).optional(),
    city: Joi.string().max(100).required(),
    state: Joi.string().max(100).required(),
    country: Joi.string().max(100).required(),
    postalCode: Joi.string().max(20).required(),
    landmark: Joi.string().max(255).allow('', null).optional(),
    latitude: Joi.number().min(-90).max(90).allow(null).optional(),
    longitude: Joi.number().min(-180).max(180).allow(null).optional(),
    isDefaultBilling: Joi.boolean().default(false),
    isDefaultShipping: Joi.boolean().default(false),
  }).unknown(false),

  updateAddress: Joi.object({
    addressType: Joi.string().valid('billing', 'shipping', 'home', 'office', 'other').optional(),
    fullName: Joi.string().max(255).optional(),
    phone: Joi.string().max(50).optional(),
    company: Joi.string().max(255).allow('', null).optional(),
    addressLine1: Joi.string().max(255).optional(),
    addressLine2: Joi.string().max(255).allow('', null).optional(),
    city: Joi.string().max(100).optional(),
    state: Joi.string().max(100).optional(),
    country: Joi.string().max(100).optional(),
    postalCode: Joi.string().max(20).optional(),
    landmark: Joi.string().max(255).allow('', null).optional(),
    latitude: Joi.number().min(-90).max(90).allow(null).optional(),
    longitude: Joi.number().min(-180).max(180).allow(null).optional(),
    isDefaultBilling: Joi.boolean().optional(),
    isDefaultShipping: Joi.boolean().optional(),
  }).unknown(false),

  updatePreferences: Joi.object({
    emailNotifications: Joi.boolean().optional(),
    smsNotifications: Joi.boolean().optional(),
    whatsappNotifications: Joi.boolean().optional(),
    marketingEmails: Joi.boolean().optional(),
    marketingSms: Joi.boolean().optional(),
    preferredLanguage: Joi.string().max(10).optional(),
    preferredCurrency: Joi.string().max(10).optional(),
    preferredTimezone: Joi.string().max(100).optional(),
  }).unknown(false),

  replaceTags: Joi.object({
    tags: Joi.array().items(Joi.string().max(100)).unique().required(),
  }).unknown(false),

  uploadDocument: Joi.object({
    mediaId: Joi.number().integer().positive().required(),
    documentType: Joi.string()
      .valid('gst_certificate', 'tax_document', 'identity_proof', 'business_license', 'other')
      .required(),
  }).unknown(false),

  createNote: Joi.object({
    note: Joi.string().required(),
  }).unknown(false),
};
