/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  PaymentGatewayConfig,
  Payment,
  PaymentTransactionAttempt,
  PaymentSettlement,
  PaymentReconciliation,
  CreditNote,
  WalletTransaction,
} from '../database/models';
import { createAuditLog } from '../utils/auditHelper';

export class StorePaymentService {
  // ================= PAYMENT GATEWAYS =================
  static async getGateways(tenantId: number, storeId: number) {
    const gateways = await PaymentGatewayConfig.findAll({
      where: { tenantId, storeId },
      order: [['id', 'DESC']],
    });
    return gateways;
  }

  static async createGateway(tenantId: number, storeId: number, userId: number, payload: any) {
    const gateway = await PaymentGatewayConfig.create({
      tenantId,
      storeId,
      name: payload.name,
      code: payload.code || payload.name.toLowerCase().replace(/\s+/g, '_'),
      apiKeyEncrypted: payload.apiKeyEncrypted || payload.apiKey || null,
      secretKeyEncrypted: payload.secretKeyEncrypted || payload.secretKey || null,
      webhookSecret: payload.webhookSecret || null,
      isSandbox: payload.isSandbox !== undefined ? payload.isSandbox : true,
      status: payload.status || 'active',
    });

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'payment_gateway.created',
      entityType: 'PaymentGatewayConfig',
      entityId: String(gateway.id),
    });

    return gateway;
  }

  // ================= TRANSACTIONS & RETRY ATTEMPTS =================
  static async getTransactions(tenantId: number, storeId: number, query: any) {
    const page = parseInt(query.page || '0', 10);
    const limit = parseInt(query.limit || '10', 10);
    const offset = page * limit;

    const where: any = { tenantId, storeId };
    if (query.status) {
      where.status = query.status;
    }

    const { rows, count } = await Payment.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'DESC']],
    });

    return { transactions: rows, total: count, page, limit };
  }

  static async recordAttempt(tenantId: number, storeId: number, userId: number, payload: any) {
    const attempt = await PaymentTransactionAttempt.create({
      tenantId,
      storeId,
      paymentId: payload.paymentId,
      attemptNumber: payload.attemptNumber || 1,
      status: payload.status || 'success',
      failureReason: payload.failureReason || null,
      gatewayResponse: payload.gatewayResponse || {},
    });

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'payment_attempt.recorded',
      entityType: 'PaymentTransactionAttempt',
      entityId: String(attempt.id),
    });

    return attempt;
  }

  // ================= SETTLEMENTS =================
  static async getSettlements(tenantId: number, storeId: number, query: any) {
    const settlements = await PaymentSettlement.findAll({
      where: { tenantId, storeId },
      limit: parseInt(query.limit || '20', 10),
      order: [['id', 'DESC']],
    });
    return settlements;
  }

  static async createSettlement(tenantId: number, storeId: number, userId: number, payload: any) {
    const settlementNumber = `SETTLE-${Date.now()}`;
    const settlement = await PaymentSettlement.create({
      tenantId,
      storeId,
      gatewayCode: payload.gatewayCode || 'stripe',
      settlementNumber,
      settlementDate: payload.settlementDate || new Date().toISOString().split('T')[0],
      grossAmount: payload.grossAmount || 0.0,
      gatewayFees: payload.gatewayFees || 0.0,
      taxAmount: payload.taxAmount || 0.0,
      netAmount: payload.netAmount || (payload.grossAmount || 0.0) - (payload.gatewayFees || 0.0),
      status: payload.status || 'settled',
    });

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'payment_settlement.created',
      entityType: 'PaymentSettlement',
      entityId: String(settlement.id),
    });

    return settlement;
  }

  // ================= RECONCILIATION =================
  static async runReconciliation(tenantId: number, storeId: number, userId: number, payload: any) {
    const periodStart = payload.periodStart || '2026-01-01';
    const periodEnd = payload.periodEnd || '2026-12-31';

    const reconciliation = await PaymentReconciliation.create({
      tenantId,
      storeId,
      periodStart,
      periodEnd,
      totalOrders: payload.totalOrders || 10,
      totalCaptured: payload.totalCaptured || 5000.0,
      totalSettled: payload.totalSettled || 4900.0,
      mismatchCount: payload.mismatchCount || 0,
      status: payload.mismatchCount > 0 ? 'discrepancy_detected' : 'matched',
    });

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'reconciliation.executed',
      entityType: 'PaymentReconciliation',
      entityId: String(reconciliation.id),
    });

    return reconciliation;
  }

  // ================= CREDIT NOTES =================
  static async createCreditNote(tenantId: number, storeId: number, userId: number, payload: any) {
    const creditNoteNumber = `CN-${Date.now()}`;
    const creditNote = await CreditNote.create({
      tenantId,
      storeId,
      orderId: payload.orderId,
      creditNoteNumber,
      amount: payload.amount,
      reason: payload.reason || 'Order return credit',
      status: 'issued',
    });

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'credit_note.created',
      entityType: 'CreditNote',
      entityId: String(creditNote.id),
    });

    return creditNote;
  }

  // ================= WALLET TRANSACTIONS =================
  static async getWalletTransactions(tenantId: number, storeId: number, customerId: number) {
    const transactions = await WalletTransaction.findAll({
      where: { tenantId, storeId, customerId },
      order: [['id', 'DESC']],
    });
    return transactions;
  }

  static async transactWallet(tenantId: number, storeId: number, userId: number, payload: any) {
    const lastTxn = await WalletTransaction.findOne({
      where: { tenantId, storeId, customerId: payload.customerId },
      order: [['id', 'DESC']],
    });

    const prevBalance = lastTxn ? Number(lastTxn.balanceAfter) : 0;
    const amount = Number(payload.amount);
    const isCredit = payload.transactionType === 'credit' || payload.transactionType === 'refund';
    const balanceAfter = isCredit ? prevBalance + amount : prevBalance - amount;

    const walletTxn = await WalletTransaction.create({
      tenantId,
      storeId,
      customerId: payload.customerId,
      transactionType: payload.transactionType || 'credit',
      amount,
      balanceAfter,
      reference: payload.reference || `REF-${Date.now()}`,
    });

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: `wallet.${payload.transactionType || 'credit'}`,
      entityType: 'WalletTransaction',
      entityId: String(walletTxn.id),
    });

    return walletTxn;
  }
}
