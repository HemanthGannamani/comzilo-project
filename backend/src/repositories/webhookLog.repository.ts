/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseRepository } from '../core/BaseRepository';
import { WebhookLog } from '../database/models/webhookLog';

export class WebhookLogRepository extends BaseRepository<WebhookLog> {
  constructor() {
    super(WebhookLog);
  }

  public async getLogsByEndpoint(
    tenantId: number,
    webhookEndpointId: number
  ): Promise<WebhookLog[]> {
    return this.model.findAll({
      where: { tenantId, webhookEndpointId },
      order: [['id', 'DESC']],
    });
  }
}
