/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Supplier,
  SupplierContact,
  SupplierBankAccount,
  PurchaseRequest,
  PurchaseRequestItem,
  PurchaseOrder,
  PurchaseOrderItem,
  GoodsReceipt,
  GoodsReceiptItem,
  SupplierReturn,
  PurchaseInvoice,
  SupplierPayment,
} from '../database/models';
import { StoreInventoryService } from './storeInventory.service';
import { createAuditLog } from '../utils/auditHelper';

export class StorePurchasingService {
  // ================= SUPPLIERS =================
  static async getSuppliers(tenantId: number, storeId: number) {
    const suppliers = await Supplier.findAll({
      where: { tenantId, storeId },
      include: [
        { model: SupplierContact, as: 'contacts' },
        { model: SupplierBankAccount, as: 'bankAccounts' },
      ],
      order: [['id', 'DESC']],
    });
    return suppliers;
  }

  static async createSupplier(tenantId: number, storeId: number, userId: number, payload: any) {
    const supplier = await Supplier.create({
      tenantId,
      storeId,
      name: payload.name,
      code: payload.code || payload.name.toLowerCase().replace(/\s+/g, '_'),
      email: payload.email || null,
      phone: payload.phone || null,
      taxId: payload.taxId || null,
      rating: payload.rating || 5.0,
      status: 'active',
    });

    if (payload.contactName) {
      await SupplierContact.create({
        supplierId: supplier.id,
        contactName: payload.contactName,
        email: payload.contactEmail || payload.email || null,
        phone: payload.contactPhone || payload.phone || null,
      });
    }

    if (payload.bankName && payload.accountNumber) {
      await SupplierBankAccount.create({
        supplierId: supplier.id,
        bankName: payload.bankName,
        accountNumber: payload.accountNumber,
        ifscCode: payload.ifscCode || null,
      });
    }

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'supplier.created',
      entityType: 'Supplier',
      entityId: String(supplier.id),
    });

    return supplier;
  }

  // ================= PURCHASE REQUESTS =================
  static async getRequests(tenantId: number, storeId: number) {
    const requests = await PurchaseRequest.findAll({
      where: { tenantId, storeId },
      include: [{ model: PurchaseRequestItem, as: 'items' }],
      order: [['id', 'DESC']],
    });
    return requests;
  }

  static async createRequest(tenantId: number, storeId: number, userId: number, payload: any) {
    const requestNumber = `REQ-${Date.now()}`;
    const request = await PurchaseRequest.create({
      tenantId,
      storeId,
      requestNumber,
      department: payload.department || 'Inventory',
      status: 'submitted',
    });

    if (payload.items && Array.isArray(payload.items)) {
      for (const item of payload.items) {
        await PurchaseRequestItem.create({
          requestId: request.id,
          productId: item.productId,
          quantityRequested: item.quantityRequested || 1,
          estimatedUnitCost: item.estimatedUnitCost || 0.0,
        });
      }
    }

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'purchase_request.submitted',
      entityType: 'PurchaseRequest',
      entityId: String(request.id),
    });

    return request;
  }

  // ================= PURCHASE ORDERS (PO) =================
  static async getOrders(tenantId: number, storeId: number) {
    const orders = await PurchaseOrder.findAll({
      where: { tenantId, storeId },
      include: [{ model: PurchaseOrderItem, as: 'items' }],
      order: [['id', 'DESC']],
    });
    return orders;
  }

  static async createOrder(tenantId: number, storeId: number, userId: number, payload: any) {
    const poNumber = `PO-${Date.now()}`;
    const items = payload.items || [];
    let subtotal = 0;

    for (const item of items) {
      subtotal += Number(item.unitCost) * Number(item.quantityOrdered);
    }

    const taxAmount = payload.taxAmount || 0.0;
    const totalAmount = subtotal + taxAmount;

    const order = await PurchaseOrder.create({
      tenantId,
      storeId,
      supplierId: payload.supplierId,
      warehouseId: payload.warehouseId || 1,
      poNumber,
      subtotal,
      taxAmount,
      totalAmount,
      status: 'approved',
    });

    for (const item of items) {
      const itemSubtotal = Number(item.unitCost) * Number(item.quantityOrdered);
      await PurchaseOrderItem.create({
        poId: order.id,
        productId: item.productId,
        variantId: item.variantId || null,
        quantityOrdered: item.quantityOrdered,
        unitCost: item.unitCost,
        subtotal: itemSubtotal,
      });
    }

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'purchase_order.created',
      entityType: 'PurchaseOrder',
      entityId: String(order.id),
    });

    return order;
  }

  // ================= GOODS RECEIPT NOTES (GRN) =================
  static async getGoodsReceipts(tenantId: number, storeId: number) {
    const receipts = await GoodsReceipt.findAll({
      where: { tenantId, storeId },
      include: [{ model: GoodsReceiptItem, as: 'items' }],
      order: [['id', 'DESC']],
    });
    return receipts;
  }

  static async createGoodsReceipt(tenantId: number, storeId: number, userId: number, payload: any) {
    const po = await PurchaseOrder.findOne({
      where: { id: payload.poId, tenantId, storeId },
    });
    if (!po) throw new Error('Purchase order not found');

    const grnNumber = `GRN-${Date.now()}`;
    const grn = await GoodsReceipt.create({
      tenantId,
      storeId,
      poId: po.id,
      warehouseId: po.warehouseId || 1,
      grnNumber,
      receivedAt: new Date(),
      status: 'received',
    });

    const items = payload.items || [];
    for (const item of items) {
      await GoodsReceiptItem.create({
        grnId: grn.id,
        productId: item.productId,
        variantId: item.variantId || null,
        quantityReceived: item.quantityReceived,
        batchNumber: item.batchNumber || `BATCH-${Date.now()}`,
        expiryDate: item.expiryDate || null,
      });

      // Automatically increment stock balance in warehouse
      await StoreInventoryService.updateStock(tenantId, storeId, userId, {
        warehouseId: po.warehouseId || 1,
        productId: item.productId,
        quantity: item.quantityReceived,
        mode: 'add',
      });
    }

    await po.update({ status: 'received' });

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'goods_receipt.created',
      entityType: 'GoodsReceipt',
      entityId: String(grn.id),
    });

    return grn;
  }

  // ================= SUPPLIER RETURNS =================
  static async processReturn(tenantId: number, storeId: number, userId: number, payload: any) {
    const returnNumber = `PRET-${Date.now()}`;
    const supplierReturn = await SupplierReturn.create({
      tenantId,
      storeId,
      grnId: payload.grnId,
      returnNumber,
      refundAmount: payload.refundAmount || 0.0,
      reason: payload.reason || 'Defective Items',
    });

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'supplier_return.processed',
      entityType: 'SupplierReturn',
      entityId: String(supplierReturn.id),
    });

    return supplierReturn;
  }

  // ================= INVOICES & PAYMENTS =================
  static async getInvoices(tenantId: number, storeId: number) {
    const invoices = await PurchaseInvoice.findAll({
      where: { tenantId, storeId },
      include: [{ model: SupplierPayment, as: 'payments' }],
      order: [['id', 'DESC']],
    });
    return invoices;
  }

  static async createInvoice(tenantId: number, storeId: number, userId: number, payload: any) {
    const invoiceNumber = `PINV-${Date.now()}`;
    const invoice = await PurchaseInvoice.create({
      tenantId,
      storeId,
      supplierId: payload.supplierId,
      poId: payload.poId || null,
      invoiceNumber,
      totalAmount: payload.totalAmount,
      status: 'unpaid',
    });

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'purchase_invoice.created',
      entityType: 'PurchaseInvoice',
      entityId: String(invoice.id),
    });

    return invoice;
  }

  static async payInvoice(tenantId: number, storeId: number, userId: number, payload: any) {
    const invoice = await PurchaseInvoice.findOne({
      where: { id: payload.invoiceId, tenantId, storeId },
      include: [{ model: SupplierPayment, as: 'payments' }],
    });
    if (!invoice) throw new Error('Purchase invoice not found');

    const payment = await SupplierPayment.create({
      tenantId,
      storeId,
      invoiceId: invoice.id,
      paymentMethod: payload.paymentMethod || 'bank_transfer',
      amountPaid: payload.amountPaid,
      paidAt: new Date(),
    });

    let totalPaid = Number(payload.amountPaid);
    const existingPayments = (invoice as any).payments || [];
    for (const p of existingPayments) {
      totalPaid += Number(p.amountPaid);
    }

    const newStatus = totalPaid >= Number(invoice.totalAmount) ? 'paid' : 'partially_paid';
    await invoice.update({ status: newStatus });

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'supplier_payment.completed',
      entityType: 'SupplierPayment',
      entityId: String(payment.id),
    });

    return payment;
  }
}
