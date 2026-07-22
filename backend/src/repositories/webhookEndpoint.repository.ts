/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseRepository } from '../core/BaseRepository';
import { WebhookEndpoint } from '../database/models/webhookEndpoint';

export class WebhookEndpointRepository extends BaseRepository<WebhookEndpoint> {
  constructor() {
    super(WebhookEndpoint);
  }

  public async findSubscribedEndpoints(
    tenantId: number,
    storeId: number | null,
    eventType: string
  ): Promise<WebhookEndpoint[]> {
    const endpoints = await this.model.findAll({
      where: {
        tenantId,
        isActive: true,
      },
    });

    return endpoints.filter((ep: WebhookEndpoint) => {
      if (ep.storeId && storeId && ep.storeId !== storeId) return false;
      const events: string[] = Array.isArray(ep.events) ? ep.events : [];
      return events.includes('*') || events.includes(eventType);
    });
  }
}
