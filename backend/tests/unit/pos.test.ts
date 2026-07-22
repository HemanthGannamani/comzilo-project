import { posValidation } from '../../src/validations/pos.validation';

describe('Unit Tests: POS Management Module', () => {
  describe('Joi Validation Boundary Checks', () => {
    it('should validate valid open register payloads', () => {
      const payload = {
        registerId: 1,
        openingAmount: 100.0,
      };
      const { error } = posValidation.openRegister.validate(payload);
      expect(error).toBeUndefined();
    });

    it('should reject negative opening cash', () => {
      const payload = {
        registerId: 1,
        openingAmount: -50.0,
      };
      const { error } = posValidation.openRegister.validate(payload);
      expect(error).toBeDefined();
    });

    it('should validate valid POS sale payload', () => {
      const payload = {
        registerId: 1,
        items: [
          {
            productId: 1,
            quantity: 2,
            discountType: 'percentage',
            discountValue: 10,
          },
        ],
        payments: [
          { paymentMethod: 'Cash', amount: 100.0 },
          { paymentMethod: 'Card', amount: 100.0 },
        ],
      };
      const { error } = posValidation.createPOSSale.validate(payload);
      expect(error).toBeUndefined();
    });

    it('should reject empty cart items in POS sale', () => {
      const payload = {
        registerId: 1,
        items: [],
        payments: [{ paymentMethod: 'Cash', amount: 100.0 }],
      };
      const { error } = posValidation.createPOSSale.validate(payload);
      expect(error).toBeDefined();
    });
  });

  describe('Cash Variance Math Theory', () => {
    const norm = (val: number) => Math.round(val * 10000) / 10000;

    it('should calculate cash variance accurately', () => {
      const openingCash = 100.0;
      const totalSales = 350.5;
      const totalRefunds = 50.25;
      const closingCash = 398.0;

      const expectedCash = norm(openingCash + totalSales - totalRefunds); // 400.25
      expect(expectedCash).toBe(400.25);

      const variance = norm(closingCash - expectedCash); // -2.25
      expect(variance).toBe(-2.25);
    });

    it('should validate split payments sum match', () => {
      const orderTotal = 250.0;
      const payment1 = 150.0;
      const payment2 = 100.0;

      const totalPayments = norm(payment1 + payment2);
      expect(totalPayments).toBe(orderTotal);
    });
  });
});
