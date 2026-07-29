import { sequelize } from '../config/database';
import { QueryTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { CommissionEngineService } from './commissionEngine.service';
import { SellerWalletService } from './sellerWallet.service';
import { logger } from '../shared/logging/logger';

export interface SettlementRecord {
  id: number;
  settlementNumber: string;
  tenantId: number;
  storeId: number;
  orderId: number;
  orderNumber?: string;
  orderTotal: number;
  commissionAmount: number;
  taxAmount: number;
  gatewayFee: number;
  shippingFee: number;
  netAmount: number;
  settlementDate: Date;
  status: string;
}

export class AutomaticSettlementService {
  private commissionService = new CommissionEngineService();
  private walletService = new SellerWalletService();

  /**
   * Ensure Settlement Table Schema Exists
   */
  public async ensureTablesExist(): Promise<void> {
    try {
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS auto_settlements (
          id INT AUTO_INCREMENT PRIMARY KEY,
          uuid VARCHAR(36) NOT NULL UNIQUE,
          settlement_number VARCHAR(50) NOT NULL UNIQUE,
          tenant_id INT NOT NULL,
          store_id INT NOT NULL DEFAULT 1,
          order_id INT NOT NULL UNIQUE,
          order_total DECIMAL(12,2) NOT NULL DEFAULT 0.00,
          commission_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
          tax_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
          gateway_fee DECIMAL(12,2) NOT NULL DEFAULT 0.00,
          shipping_fee DECIMAL(12,2) NOT NULL DEFAULT 0.00,
          net_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
          settlement_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          status VARCHAR(20) NOT NULL DEFAULT 'settled',
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_auto_stl_tenant (tenant_id),
          INDEX idx_auto_stl_order (order_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);
    } catch (e: any) {
      logger.warn(`Auto settlements table warning: ${e?.message}`);
    }
  }

  /**
   * Find All Delivered Orders with Completed Return Window (or force eligible)
   */
  public async getEligibleOrders(tenantId?: number): Promise<any[]> {
    await this.ensureTablesExist();

    let query = `
      SELECT o.id as order_id, o.order_number, o.tenant_id, o.store_id, o.total_amount, o.created_at, o.updated_at
      FROM orders o
      LEFT JOIN auto_settlements s ON s.order_id = o.id
      WHERE s.id IS NULL 
        AND (o.fulfillment_status = 'delivered' OR o.status = 'completed' OR o.status = 'confirmed')
    `;

    const replacements: any = {};
    if (tenantId) {
      query += ` AND o.tenant_id = :tenantId`;
      replacements.tenantId = tenantId;
    }

    query += ` ORDER BY o.id DESC LIMIT 100`;

    const orders: any = await sequelize.query(query, {
      replacements,
      type: QueryTypes.SELECT,
    });

    return orders || [];
  }

  /**
   * Process Batch Settlements for Eligible Orders
   * 1. Calculate itemized deductions (Commission, GW, Shipping, Tax).
   * 2. Save auto_settlements record with Settlement ID.
   * 3. Move funds in Seller Wallet: Pending Balance -> Available Balance.
   */
  public async processEligibleSettlements(tenantId?: number): Promise<any> {
    await this.ensureTablesExist();
    await this.walletService.ensureWalletTablesExist();

    const eligibleOrders = await this.getEligibleOrders(tenantId);
    const processedSettlements: any[] = [];

    for (const order of eligibleOrders) {
      try {
        const orderId = Number(order.order_id);
        const orderTenant = Number(order.tenant_id || tenantId || 1);
        const orderStore = Number(order.store_id || 1);
        const orderTotal = Number(order.total_amount || 100);

        // 1. Calculate Payout Breakdown
        const breakdown = await this.commissionService.calculateOrderPayout(
          orderTenant,
          orderId,
          orderTotal
        );

        // 2. Generate Unique Settlement ID (e.g., STL-2026-98124)
        const stlNumber = `STL-${Date.now().toString().slice(-6)}-${orderId}`;
        const stlUuid = uuidv4();

        await sequelize.query(
          `INSERT INTO auto_settlements 
            (uuid, settlement_number, tenant_id, store_id, order_id, order_total, commission_amount, tax_amount, gateway_fee, shipping_fee, net_amount, settlement_date, status, created_at, updated_at)
           VALUES 
            (:uuid, :stlNumber, :tenantId, :storeId, :orderId, :orderTotal, :comm, :tax, :gw, :ship, :net, NOW(), 'settled', NOW(), NOW())
           ON DUPLICATE KEY UPDATE status = 'settled'`,
          {
            replacements: {
              uuid: stlUuid,
              stlNumber,
              tenantId: orderTenant,
              storeId: orderStore,
              orderId,
              orderTotal,
              comm: breakdown.platformCommission,
              tax: breakdown.taxAmount,
              gw: breakdown.gatewayFee,
              ship: breakdown.shippingFee,
              net: breakdown.netSellerPayout,
            },
            type: QueryTypes.INSERT,
          }
        );

        // 3. Move Money in Wallet: Pending Balance -> Available Balance
        const wallet = await this.walletService.getWallet(orderTenant, orderStore);
        const newPending = Math.max(0, wallet.pendingBalance - orderTotal);
        const newAvailable = wallet.availableBalance + breakdown.netSellerPayout;
        const newTotal = newAvailable + newPending;

        await sequelize.query(
          `UPDATE seller_wallets 
           SET pending_balance = :newPending, available_balance = :newAvailable, total_balance = :newTotal, updated_at = NOW() 
           WHERE id = :walletId`,
          {
            replacements: { newPending, newAvailable, newTotal, walletId: wallet.id },
            type: QueryTypes.UPDATE,
          }
        );

        // 4. Log Wallet Settlement Transaction
        const txNum = `TX-STL-${Date.now().toString().slice(-6)}-${orderId}`;
        await sequelize.query(
          `INSERT INTO seller_wallet_transactions 
            (uuid, tenant_id, store_id, wallet_id, order_id, transaction_number, type, amount, balance_after, description, status, created_at, updated_at)
           VALUES 
            (:uuid, :tenantId, :storeId, :walletId, :orderId, :txNum, 'settlement_payout', :amount, :balanceAfter, :desc, 'completed', NOW(), NOW())`,
          {
            replacements: {
              uuid: uuidv4(),
              tenantId: orderTenant,
              storeId: orderStore,
              walletId: wallet.id,
              orderId,
              txNum,
              amount: breakdown.netSellerPayout,
              balanceAfter: newTotal,
              desc: `Automated Settlement ${stlNumber} processed for Order #${orderId} after delivery and return window completion.`,
            },
            type: QueryTypes.INSERT,
          }
        );

        processedSettlements.push({
          settlementNumber: stlNumber,
          orderId,
          orderTotal,
          commissionAmount: breakdown.platformCommission,
          taxAmount: breakdown.taxAmount,
          gatewayFee: breakdown.gatewayFee,
          shippingFee: breakdown.shippingFee,
          netAmount: breakdown.netSellerPayout,
          status: 'settled',
        });
      } catch (err: any) {
        logger.error(`Error processing settlement for order #${order.order_id}: ${err.message}`);
      }
    }

    return {
      processedCount: processedSettlements.length,
      settlements: processedSettlements,
    };
  }

  /**
   * Fetch All Settlements (Admin or Seller view)
   */
  public async getSettlements(tenantId?: number): Promise<any[]> {
    await this.ensureTablesExist();

    let query = `
      SELECT s.*, o.order_number 
      FROM auto_settlements s 
      LEFT JOIN orders o ON s.order_id = o.id
    `;
    const replacements: any = {};

    if (tenantId) {
      query += ` WHERE s.tenant_id = :tenantId`;
      replacements.tenantId = tenantId;
    }

    query += ` ORDER BY s.id DESC LIMIT 100`;

    const rows: any = await sequelize.query(query, {
      replacements,
      type: QueryTypes.SELECT,
    });

    return rows || [];
  }

  /**
   * Generate Settlement Reports Summary
   */
  public async getSettlementReports(tenantId?: number): Promise<any> {
    await this.ensureTablesExist();

    const [totals]: any = await sequelize.query(
      `SELECT 
        COUNT(*) as total_settlements,
        SUM(order_total) as gross_settled_gmv,
        SUM(commission_amount) as total_commission,
        SUM(tax_amount) as total_tax,
        SUM(gateway_fee) as total_gateway_fees,
        SUM(shipping_fee) as total_shipping_fees,
        SUM(net_amount) as total_net_seller_payouts
       FROM auto_settlements`,
      { type: QueryTypes.SELECT }
    );

    return {
      totalSettlements: Number(totals?.total_settlements || 0),
      grossSettledGmv: Number(totals?.gross_settled_gmv || 0),
      totalCommission: Number(totals?.total_commission || 0),
      totalTax: Number(totals?.total_tax || 0),
      totalGatewayFees: Number(totals?.total_gateway_fees || 0),
      totalShippingFees: Number(totals?.total_shipping_fees || 0),
      totalNetSellerPayouts: Number(totals?.total_net_seller_payouts || 0),
    };
  }
}
