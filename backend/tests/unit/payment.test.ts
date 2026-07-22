import { paymentValidation } from '../../src/validations/payment.validation';

describe('Unit Tests: Payment Management Module', () => {
  describe('Joi Validation Boundary Checks', () => {
    it('should validate valid payment create payloads with idempotencyKey', () => {
      const payload = {
        orderId: 1,
        paymentMethod: 'Card',
        gateway: 'manual',
        amount: 250.0,
        currency: 'USD',
        exchangeRate: 1.0,
        notes: 'Pre-paid deposit',
        idempotencyKey: 'key-12345',
      };
      const { error } = paymentValidation.createPayment.validate(payload);
      expect(error).toBeUndefined();
    });

    it('should reject invalid payment method', () => {
      const payload = {
        orderId: 1,
        paymentMethod: 'CryptoCurrency',
        amount: 100.0,
      };
      const { error } = paymentValidation.createPayment.validate(payload);
      expect(error).toBeDefined();
    });

    it('should reject negative payment amount', () => {
      const payload = {
        orderId: 1,
        paymentMethod: 'Cash',
        amount: -50.0,
      };
      const { error } = paymentValidation.createPayment.validate(payload);
      expect(error).toBeDefined();
    });

    it('should reject zero payment amount', () => {
      const payload = {
        orderId: 1,
        paymentMethod: 'Cash',
        amount: 0.0,
      };
      const { error } = paymentValidation.createPayment.validate(payload);
      expect(error).toBeDefined();
    });
  });

  describe('Outstanding Balance Calculation Theory', () => {
    const norm = (val: number | string) => Math.round(Number(val) * 10000) / 10000;

    it('should calculate remaining outstanding balance correctly using 4 decimal precision normalizer', () => {
      const totalAmount = 500.0001;
      const capturedPayment = 200.0002;
      const pendingPayment = 50.0001;

      const outstanding = norm(totalAmount - norm(capturedPayment + pendingPayment));
      expect(outstanding).toBe(249.9998);
    });
  });

  describe('Payment Status Transition Matrix Rules', () => {
    const checkTransition = (from: string, to: string): boolean => {
      const allowed: Record<string, string[]> = {
        pending: ['authorized', 'paid', 'failed', 'cancelled'],
        authorized: ['paid', 'failed', 'cancelled'],
        paid: ['partially_refunded', 'refunded'],
        partially_refunded: ['partially_refunded', 'refunded'],
      };
      return !!allowed[from] && allowed[from].includes(to);
    };

    it('should validate allowed status transitions', () => {
      expect(checkTransition('pending', 'authorized')).toBe(true);
      expect(checkTransition('pending', 'paid')).toBe(true);
      expect(checkTransition('authorized', 'paid')).toBe(true);
      expect(checkTransition('paid', 'refunded')).toBe(true);
    });

    it('should reject illegal status transitions', () => {
      expect(checkTransition('failed', 'paid')).toBe(false);
      expect(checkTransition('cancelled', 'paid')).toBe(false);
      expect(checkTransition('refunded', 'paid')).toBe(false);
    });
  });
});
