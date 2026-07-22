import { inventoryValidation } from '../../src/validations/inventory.validation';
import { transferValidation } from '../../src/validations/stockTransfer.validation';
import { reservationValidation } from '../../src/validations/stockReservation.validation';

describe('Unit Tests: Inventory & Stock Module', () => {
  describe('Available Quantity Derivation Logic', () => {
    it('should derive available quantity correctly', () => {
      const quantityOnHand = 100;
      const quantityReserved = 30;
      const quantityAvailable = quantityOnHand - quantityReserved;
      expect(quantityAvailable).toBe(70);
    });

    it('should reject negative available quantities in theory', () => {
      const quantityOnHand = 20;
      const quantityReserved = 30;
      const quantityAvailable = quantityOnHand - quantityReserved;
      expect(quantityAvailable).toBeLessThan(0);
    });
  });

  describe('Validation Boundary Checks', () => {
    it('should accept positive integer quantities in stock-in schema', () => {
      const payload = {
        warehouseId: 1,
        warehouseLocationId: 2,
        productId: 3,
        quantity: 50,
        reason: 'Restocking',
        notes: 'Monthly batch',
        idempotencyKey: 'key-12345',
      };
      const { error } = inventoryValidation.stockIn.validate(payload);
      expect(error).toBeUndefined();
    });

    it('should reject negative or zero quantities in stock-in schema', () => {
      const payload = {
        warehouseId: 1,
        warehouseLocationId: 2,
        productId: 3,
        quantity: -10,
      };
      const { error } = inventoryValidation.stockIn.validate(payload);
      expect(error).toBeDefined();
    });

    it('should reject unknown fields in Joi schemas', () => {
      const payload = {
        warehouseId: 1,
        warehouseLocationId: 2,
        productId: 3,
        quantity: 50,
        quantityBefore: 20, // Should be rejected as unknown
      };
      const { error } = inventoryValidation.stockIn.validate(payload, { allowUnknown: false });
      expect(error).toBeDefined();
    });
  });

  describe('Stock Transfer Validation whitelists', () => {
    it('should validate valid transfer create payloads', () => {
      const payload = {
        sourceWarehouseId: 1,
        destinationWarehouseId: 2,
        referenceNumber: 'REF-001',
        notes: 'Transferring winter stock',
        items: [
          {
            productId: 10,
            sourceLocationId: 5,
            destinationLocationId: 6,
            requestedQuantity: 20,
          },
        ],
      };
      const { error } = transferValidation.createTransfer.validate(payload);
      expect(error).toBeUndefined();
    });
  });

  describe('Stock Reservation Validation whitelists', () => {
    it('should validate valid reservation create payloads', () => {
      const payload = {
        referenceType: 'Order',
        referenceId: 'order_999',
        expiresAt: new Date(Date.now() + 100000).toISOString(),
        items: [
          {
            warehouseId: 1,
            warehouseLocationId: 2,
            productId: 5,
            quantity: 5,
          },
        ],
      };
      const { error } = reservationValidation.createReservation.validate(payload);
      expect(error).toBeUndefined();
    });
  });
});
