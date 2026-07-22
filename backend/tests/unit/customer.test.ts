import { customerValidation } from '../../src/validations/customer.validation';

describe('Unit Tests: Customer Management Module', () => {
  describe('Customer Creation Joi Validation', () => {
    it('should validate valid customer payloads', () => {
      const payload = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        alternatePhone: '+1987654321',
        gender: 'male',
        dateOfBirth: '1990-01-01',
        customerType: 'individual',
        preferredLanguage: 'en',
        preferredCurrency: 'USD',
      };
      const { error } = customerValidation.createCustomer.validate(payload);
      expect(error).toBeUndefined();
    });

    it('should reject invalid email format', () => {
      const payload = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        phone: '+1234567890',
      };
      const { error } = customerValidation.createCustomer.validate(payload);
      expect(error).toBeDefined();
    });

    it('should reject unknown fields', () => {
      const payload = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        unknownField: 'value',
      };
      const { error } = customerValidation.createCustomer.validate(payload);
      expect(error).toBeDefined();
    });
  });

  describe('Customer Address Joi Validation', () => {
    it('should validate valid address payloads', () => {
      const payload = {
        addressType: 'home',
        fullName: 'John Doe',
        phone: '+1234567890',
        addressLine1: '123 Main St',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        postalCode: '10001',
        isDefaultBilling: true,
        isDefaultShipping: true,
      };
      const { error } = customerValidation.createAddress.validate(payload);
      expect(error).toBeUndefined();
    });

    it('should reject missing postal code', () => {
      const payload = {
        addressType: 'home',
        fullName: 'John Doe',
        phone: '+1234567890',
        addressLine1: '123 Main St',
        city: 'New York',
        state: 'NY',
        country: 'USA',
      };
      const { error } = customerValidation.createAddress.validate(payload);
      expect(error).toBeDefined();
    });
  });

  describe('Customer Preferences Joi Validation', () => {
    it('should validate preference payloads', () => {
      const payload = {
        emailNotifications: true,
        smsNotifications: false,
        whatsappNotifications: true,
        marketingEmails: false,
        marketingSms: true,
        preferredLanguage: 'fr',
        preferredCurrency: 'EUR',
        preferredTimezone: 'Europe/Paris',
      };
      const { error } = customerValidation.updatePreferences.validate(payload);
      expect(error).toBeUndefined();
    });
  });

  describe('Customer Tags Joi Validation', () => {
    it('should reject duplicate tags in array', () => {
      const payload = {
        tags: ['VIP', 'VIP', 'Wholesale'],
      };
      const { error } = customerValidation.replaceTags.validate(payload);
      expect(error).toBeDefined();
    });

    it('should validate unique tag array', () => {
      const payload = {
        tags: ['VIP', 'Wholesale'],
      };
      const { error } = customerValidation.replaceTags.validate(payload);
      expect(error).toBeUndefined();
    });
  });
});
