import { TemplateService } from '../../src/services/template.service';
import { ManualNotificationProvider } from '../../src/services/notification/manual.provider';

describe('Unit Tests: Notifications & Communication Module', () => {
  let templateService: TemplateService;
  let provider: ManualNotificationProvider;

  beforeAll(() => {
    templateService = new TemplateService();
    provider = new ManualNotificationProvider();
  });

  describe('Template Compilation Engine', () => {
    it('should replace dynamic handlebars-style placeholders in body string', () => {
      const template =
        'Hello {{customerName}}, your order {{orderNumber}} of amount {{amount}} at {{storeName}} is confirmed!';
      const variables = {
        customerName: 'Alice',
        orderNumber: 'ORD-999',
        amount: '$150.00',
        storeName: 'Comzilo Superstore',
      };
      const compiled = templateService.compileTemplate(template, variables);
      expect(compiled).toBe(
        'Hello Alice, your order ORD-999 of amount $150.00 at Comzilo Superstore is confirmed!'
      );
    });

    it('should return empty string for undefined placeholders', () => {
      const template = 'Hello {{customerName}}, your code is {{otpCode}}';
      const compiled = templateService.compileTemplate(template, { customerName: 'Bob' });
      expect(compiled).toBe('Hello Bob, your code is ');
    });
  });

  describe('Provider Abstraction Layer', () => {
    it('should send email via EmailProvider interface', async () => {
      const result = await provider.sendEmail('test@comzilo.com', 'Welcome', 'Welcome to Comzilo');
      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
    });

    it('should send SMS via SMSProvider interface', async () => {
      const result = await provider.sendSMS('+15550001111', 'Your OTP is 123456');
      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
    });

    it('should send Push notification via PushProvider interface', async () => {
      const result = await provider.sendPush(
        'device-token-xyz',
        'Order Update',
        'Your order is shipped'
      );
      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
    });

    it('should send WhatsApp message via WhatsAppProvider interface', async () => {
      const result = await provider.sendWhatsApp('+15550002222', 'Your invoice is ready');
      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
    });
  });
});
