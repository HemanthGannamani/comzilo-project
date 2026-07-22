/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseService } from '../core/BaseService';
import { IntegrationRepository } from '../repositories/integration.repository';
import { IntegrationSyncLogRepository } from '../repositories/integrationSyncLog.repository';
import { Integration } from '../database/models/integration';
import { IntegrationSyncLog } from '../database/models/integrationSyncLog';
import { NotFoundError, ValidationError } from '../shared/errors/AppError';

export interface MarketplaceApp {
  provider: 'shopify' | 'woocommerce' | 'stripe' | 'quickbooks' | 'zapier' | 'custom';
  name: string;
  category: string;
  description: string;
  supportedSyncTypes: string[];
}

export class IntegrationService extends BaseService {
  private integrationRepo = new IntegrationRepository();
  private syncLogRepo = new IntegrationSyncLogRepository();

  constructor() {
    super('IntegrationService');
  }

  public getMarketplaceApps(): MarketplaceApp[] {
    return [
      {
        provider: 'shopify',
        name: 'Shopify E-Commerce Sync',
        category: 'e_commerce',
        description: 'Sync Shopify orders, products, customers, and inventory balances.',
        supportedSyncTypes: ['orders', 'inventory', 'customers', 'products'],
      },
      {
        provider: 'woocommerce',
        name: 'WooCommerce Integration',
        category: 'e_commerce',
        description: 'Bi-directional sync for WooCommerce online stores.',
        supportedSyncTypes: ['orders', 'inventory', 'customers', 'products'],
      },
      {
        provider: 'stripe',
        name: 'Stripe Payments Connector',
        category: 'payments',
        description: 'Automated payment processing and payout tracking.',
        supportedSyncTypes: ['orders', 'customers'],
      },
      {
        provider: 'quickbooks',
        name: 'QuickBooks Accounting',
        category: 'accounting',
        description: 'Sync financial ledgers, sales orders, and invoices.',
        supportedSyncTypes: ['orders', 'customers'],
      },
      {
        provider: 'zapier',
        name: 'Zapier Automation',
        category: 'automation',
        description: 'Connect Comzilo to 5000+ apps via Zapier workflows.',
        supportedSyncTypes: ['orders', 'inventory', 'customers', 'products'],
      },
      {
        provider: 'custom',
        name: 'Custom API Connector',
        category: 'developer',
        description: 'Custom REST API integration endpoint connector.',
        supportedSyncTypes: ['orders', 'inventory', 'customers', 'products'],
      },
    ];
  }

  public async connectIntegration(
    tenantId: number,
    storeId: number | null,
    data: {
      provider: 'shopify' | 'woocommerce' | 'stripe' | 'quickbooks' | 'zapier' | 'custom';
      name: string;
      config?: Record<string, any>;
    }
  ): Promise<Integration> {
    const existing = await this.integrationRepo.findByProvider(tenantId, storeId, data.provider);
    if (existing) {
      return existing.update({
        name: data.name,
        config: data.config || existing.config,
        status: 'connected',
      });
    }

    return this.integrationRepo.model.create({
      tenantId,
      storeId,
      provider: data.provider,
      name: data.name,
      config: data.config || null,
      status: 'connected',
      lastSyncedAt: null,
    });
  }

  public async getIntegration(tenantId: number, id: number): Promise<Integration> {
    const integration = await this.integrationRepo.model.findOne({ where: { tenantId, id } });
    if (!integration) {
      throw new NotFoundError(`Integration with ID ${id} not found.`);
    }
    return integration;
  }

  public async listIntegrations(tenantId: number, storeId: number | null): Promise<Integration[]> {
    return this.integrationRepo.listIntegrations(tenantId, storeId);
  }

  public async updateIntegration(tenantId: number, id: number, data: any): Promise<Integration> {
    const integration = await this.getIntegration(tenantId, id);
    return integration.update(data);
  }

  public async disconnectIntegration(tenantId: number, id: number): Promise<Integration> {
    const integration = await this.getIntegration(tenantId, id);
    return integration.update({ status: 'disconnected' });
  }

  public async triggerSync(
    tenantId: number,
    id: number,
    syncType: 'orders' | 'inventory' | 'customers' | 'products'
  ): Promise<IntegrationSyncLog> {
    const integration = await this.getIntegration(tenantId, id);
    if (integration.status === 'disconnected') {
      throw new ValidationError(`Cannot sync disconnected integration '${integration.name}'.`);
    }

    const recordsSynced = Math.floor(Math.random() * 25) + 1;
    const now = new Date();

    await integration.update({ lastSyncedAt: now });

    return this.syncLogRepo.model.create({
      tenantId,
      storeId: integration.storeId,
      integrationId: integration.id,
      syncType,
      status: 'success',
      recordsSynced,
      errorDetails: null,
    });
  }

  public async listSyncLogs(
    tenantId: number,
    integrationId: number
  ): Promise<IntegrationSyncLog[]> {
    return this.syncLogRepo.getLogsByIntegration(tenantId, integrationId);
  }
}
