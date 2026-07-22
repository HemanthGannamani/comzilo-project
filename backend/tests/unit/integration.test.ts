import { WebhookService } from '../../src/services/webhook.service';
import { IntegrationService } from '../../src/services/integration.service';

describe('Unit Tests: Marketplace, Webhooks & Integrations Module', () => {
  let webhookService: WebhookService;
  let integrationService: IntegrationService;

  beforeAll(() => {
    webhookService = new WebhookService();
    integrationService = new IntegrationService();
  });

  describe('Webhook Signing & HMAC Engine', () => {
    it('should generate a secure random webhook secret string', () => {
      const secret = webhookService.generateSecret();
      expect(secret).toBeDefined();
      expect(secret.startsWith('whsec_')).toBe(true);
    });

    it('should compute valid HMAC SHA256 signature for payload', () => {
      const secret = 'whsec_test_secret_key_123';
      const payload = { event: 'order.created', id: 1001, total: 150.0 };
      const sig1 = webhookService.signPayload(secret, payload);
      const sig2 = webhookService.signPayload(secret, payload);
      expect(sig1).toBe(sig2);
      expect(sig1.length).toBe(64);
    });
  });

  describe('Marketplace Catalog Engine', () => {
    it('should return list of available marketplace integration connectors', () => {
      const apps = integrationService.getMarketplaceApps();
      expect(apps.length).toBeGreaterThanOrEqual(6);
      const shopifyApp = apps.find((a) => a.provider === 'shopify');
      expect(shopifyApp).toBeDefined();
      expect(shopifyApp?.supportedSyncTypes).toContain('orders');
    });
  });
});
