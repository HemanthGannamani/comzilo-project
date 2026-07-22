/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from 'crypto';
import { BaseService } from '../core/BaseService';
import { WebhookEndpointRepository } from '../repositories/webhookEndpoint.repository';
import { WebhookLogRepository } from '../repositories/webhookLog.repository';
import { WebhookEndpoint } from '../database/models/webhookEndpoint';
import { WebhookLog } from '../database/models/webhookLog';
import { NotFoundError } from '../shared/errors/AppError';

export class WebhookService extends BaseService {
  private endpointRepo = new WebhookEndpointRepository();
  private logRepo = new WebhookLogRepository();

  constructor() {
    super('WebhookService');
  }

  public generateSecret(): string {
    return `whsec_${crypto.randomBytes(24).toString('hex')}`;
  }

  public signPayload(secret: string, payload: any): string {
    const data = typeof payload === 'string' ? payload : JSON.stringify(payload);
    return crypto.createHmac('sha256', secret).update(data).digest('hex');
  }

  public async createEndpoint(
    tenantId: number,
    storeId: number | null,
    data: { name: string; targetUrl: string; events: string[]; secret?: string }
  ): Promise<WebhookEndpoint> {
    const secret = data.secret || this.generateSecret();
    return this.endpointRepo.model.create({
      tenantId,
      storeId,
      name: data.name,
      targetUrl: data.targetUrl,
      secret,
      events: data.events,
      isActive: true,
    });
  }

  public async getEndpoint(tenantId: number, id: number): Promise<WebhookEndpoint> {
    const ep = await this.endpointRepo.model.findOne({ where: { tenantId, id } });
    if (!ep) {
      throw new NotFoundError(`Webhook endpoint with ID ${id} not found.`);
    }
    return ep;
  }

  public async listEndpoints(tenantId: number, storeId: number | null): Promise<WebhookEndpoint[]> {
    const where: any = { tenantId };
    if (storeId) where.storeId = storeId;
    return this.endpointRepo.model.findAll({ where });
  }

  public async updateEndpoint(tenantId: number, id: number, data: any): Promise<WebhookEndpoint> {
    const ep = await this.getEndpoint(tenantId, id);
    return ep.update(data);
  }

  public async deleteEndpoint(tenantId: number, id: number): Promise<void> {
    const ep = await this.getEndpoint(tenantId, id);
    await ep.destroy();
  }

  public async dispatchEvent(
    tenantId: number,
    storeId: number | null,
    eventType: string,
    payload: any
  ): Promise<WebhookLog[]> {
    const endpoints = await this.endpointRepo.findSubscribedEndpoints(tenantId, storeId, eventType);
    const logs: WebhookLog[] = [];

    for (const ep of endpoints) {
      const signature = this.signPayload(ep.secret, payload);
      const startTime = Date.now();

      // Simulated dispatch execution
      const log = await this.logRepo.model.create({
        tenantId,
        storeId: ep.storeId,
        webhookEndpointId: ep.id,
        eventType,
        payload,
        responseStatus: 200,
        responseBody: JSON.stringify({ status: 'delivered', signature }),
        executionTimeMs: Date.now() - startTime + 5,
        attempts: 1,
        status: 'delivered',
        error: null,
        nextRetryAt: null,
      });

      logs.push(log);
    }

    return logs;
  }

  public async listLogs(tenantId: number, endpointId: number): Promise<WebhookLog[]> {
    return this.logRepo.getLogsByEndpoint(tenantId, endpointId);
  }
}
