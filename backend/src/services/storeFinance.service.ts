/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FinanceChartOfAccount,
  FinanceJournalEntry,
  FinanceJournalLine,
  FinanceGeneralLedger,
  FinanceVendorBill,
  FinanceCustomerInvoice,
  FinanceBankAccount,
  FinanceBankReconciliation,
} from '../database/models';
import { createAuditLog } from '../utils/auditHelper';

export class StoreFinanceService {
  // ================= CHART OF ACCOUNTS =================
  static async getAccounts(tenantId: number, storeId: number) {
    const accounts = await FinanceChartOfAccount.findAll({
      where: { tenantId, storeId },
      order: [['code', 'ASC']],
    });
    return accounts;
  }

  static async createAccount(tenantId: number, storeId: number, userId: number, payload: any) {
    const account = await FinanceChartOfAccount.create({
      tenantId,
      storeId,
      parentId: payload.parentId || null,
      code: payload.code,
      name: payload.name,
      type: payload.type, // asset, liability, equity, revenue, expense
      balance: payload.initialBalance || 0.0,
      isActive: true,
    });

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'account.created',
      entityType: 'FinanceChartOfAccount',
      entityId: String(account.id),
    });

    return account;
  }

  // ================= DOUBLE-ENTRY JOURNAL & GENERAL LEDGER =================
  static async postJournalEntry(tenantId: number, storeId: number, userId: number, payload: any) {
    const lines = payload.lines || [];
    let totalDebit = 0;
    let totalCredit = 0;

    for (const l of lines) {
      totalDebit += Number(l.debitAmount || 0);
      totalCredit += Number(l.creditAmount || 0);
    }

    if (Math.abs(totalDebit - totalCredit) > 0.001) {
      throw new Error(
        `Double-entry accounting error: Total Debit ($${totalDebit.toFixed(2)}) must equal Total Credit ($${totalCredit.toFixed(2)})`
      );
    }

    const entryNumber = `JE-${Date.now()}`;
    const entryDate = payload.entryDate || new Date().toISOString().split('T')[0];

    const entry = await FinanceJournalEntry.create({
      tenantId,
      storeId,
      entryNumber,
      entryDate,
      description: payload.description || 'Manual Journal Entry',
      status: 'posted',
    });

    for (const l of lines) {
      await FinanceJournalLine.create({
        entryId: entry.id,
        accountId: l.accountId,
        debitAmount: l.debitAmount || 0.0,
        creditAmount: l.creditAmount || 0.0,
        memo: l.memo || null,
      });

      const account = await FinanceChartOfAccount.findByPk(l.accountId);
      if (account) {
        const netChange = Number(l.debitAmount || 0) - Number(l.creditAmount || 0);
        const newBalance = Number(account.balance) + netChange;
        await account.update({ balance: newBalance });

        await FinanceGeneralLedger.create({
          tenantId,
          storeId,
          accountId: account.id,
          entryId: entry.id,
          postingDate: entryDate,
          debit: l.debitAmount || 0.0,
          credit: l.creditAmount || 0.0,
          runningBalance: newBalance,
        });
      }
    }

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'journal.posted',
      entityType: 'FinanceJournalEntry',
      entityId: String(entry.id),
    });

    return entry;
  }

  static async getGeneralLedger(tenantId: number, storeId: number, accountId?: number) {
    const where: any = { tenantId, storeId };
    if (accountId) where.accountId = accountId;

    const ledger = await FinanceGeneralLedger.findAll({
      where,
      include: [{ model: FinanceChartOfAccount, as: 'account' }],
      order: [['id', 'DESC']],
    });
    return ledger;
  }

  // ================= PAYABLES & RECEIVABLES =================
  static async getVendorBills(tenantId: number, storeId: number) {
    const bills = await FinanceVendorBill.findAll({
      where: { tenantId, storeId },
      order: [['id', 'DESC']],
    });
    return bills;
  }

  static async createVendorBill(tenantId: number, storeId: number, userId: number, payload: any) {
    const billNumber = `BILL-${Date.now()}`;
    const bill = await FinanceVendorBill.create({
      tenantId,
      storeId,
      supplierId: payload.supplierId,
      billNumber,
      totalAmount: payload.totalAmount,
      dueDate: payload.dueDate || new Date().toISOString().split('T')[0],
      status: 'unpaid',
    });

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'vendor_bill.created',
      entityType: 'FinanceVendorBill',
      entityId: String(bill.id),
    });

    return bill;
  }

  static async getCustomerInvoices(tenantId: number, storeId: number) {
    const invoices = await FinanceCustomerInvoice.findAll({
      where: { tenantId, storeId },
      order: [['id', 'DESC']],
    });
    return invoices;
  }

  static async createCustomerInvoice(
    tenantId: number,
    storeId: number,
    userId: number,
    payload: any
  ) {
    const invoiceNumber = `INV-${Date.now()}`;
    const invoice = await FinanceCustomerInvoice.create({
      tenantId,
      storeId,
      customerId: payload.customerId,
      invoiceNumber,
      totalAmount: payload.totalAmount,
      dueDate: payload.dueDate || new Date().toISOString().split('T')[0],
      status: 'unpaid',
    });

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'customer_invoice.created',
      entityType: 'FinanceCustomerInvoice',
      entityId: String(invoice.id),
    });

    return invoice;
  }

  // ================= BANKING & RECONCILIATION =================
  static async getBankAccounts(tenantId: number, storeId: number) {
    const banks = await FinanceBankAccount.findAll({
      where: { tenantId, storeId },
      include: [{ model: FinanceBankReconciliation, as: 'reconciliations' }],
      order: [['id', 'DESC']],
    });
    return banks;
  }

  static async createBankAccount(tenantId: number, storeId: number, userId: number, payload: any) {
    const bank = await FinanceBankAccount.create({
      tenantId,
      storeId,
      bankName: payload.bankName,
      accountNumber: payload.accountNumber,
      balance: payload.initialBalance || 0.0,
      status: 'active',
    });

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'bank_account.created',
      entityType: 'FinanceBankAccount',
      entityId: String(bank.id),
    });

    return bank;
  }

  static async reconcileBankAccount(
    tenantId: number,
    storeId: number,
    userId: number,
    payload: any
  ) {
    const reconciliation = await FinanceBankReconciliation.create({
      tenantId,
      storeId,
      bankAccountId: payload.bankAccountId,
      statementDate: payload.statementDate || new Date().toISOString().split('T')[0],
      endingBalance: payload.endingBalance,
      status: 'reconciled',
    });

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'bank.reconciled',
      entityType: 'FinanceBankReconciliation',
      entityId: String(reconciliation.id),
    });

    return reconciliation;
  }

  // ================= FINANCIAL STATEMENTS =================
  static async getFinancialStatements(tenantId: number, storeId: number) {
    const accounts = await FinanceChartOfAccount.findAll({ where: { tenantId, storeId } });

    let totalAssets = 0;
    let totalLiabilities = 0;
    let totalEquity = 0;
    let totalRevenue = 0;
    let totalExpense = 0;

    const trialBalance = accounts.map((acc) => {
      const bal = Number(acc.balance);
      if (acc.type === 'asset') totalAssets += bal;
      else if (acc.type === 'liability') totalLiabilities += bal;
      else if (acc.type === 'equity') totalEquity += bal;
      else if (acc.type === 'revenue') totalRevenue += bal;
      else if (acc.type === 'expense') totalExpense += bal;

      return {
        code: acc.code,
        name: acc.name,
        type: acc.type,
        debit: bal > 0 ? bal : 0,
        credit: bal < 0 ? Math.abs(bal) : 0,
      };
    });

    const netIncome = totalRevenue - totalExpense;

    return {
      trialBalance,
      profitAndLoss: {
        totalRevenue,
        totalExpense,
        netIncome,
      },
      balanceSheet: {
        totalAssets,
        totalLiabilities,
        totalEquity,
        equityPlusLiabilities: totalLiabilities + totalEquity + netIncome,
        isBalanced: true,
      },
    };
  }
}
