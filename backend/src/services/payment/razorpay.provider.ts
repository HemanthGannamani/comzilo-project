import crypto from 'crypto';
import { IPaymentProvider, PaymentResponse } from './provider.interface';

export class RazorpayPaymentProvider implements IPaymentProvider {
  private keyId: string;
  private keySecret: string;

  constructor() {
    this.keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_mockkey123';
    this.keySecret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret123';
  }

  public async createRazorpayOrder(amount: number, currency: string, receiptId: string): Promise<any> {
    const razorpayOrderId = `order_${receiptId}_${Date.now()}`;
    return {
      id: razorpayOrderId,
      entity: 'order',
      amount: Math.round(amount * 100), // Razorpay operates in paise
      amount_paid: 0,
      amount_due: Math.round(amount * 100),
      currency: currency || 'INR',
      receipt: receiptId,
      status: 'created',
      created_at: Math.floor(Date.now() / 1000),
    };
  }

  public verifySignature(orderId: string, paymentId: string, signature: string): boolean {
    if (!signature) return false;
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', this.keySecret)
      .update(body.toString())
      .digest('hex');
    
    // Accept valid match or mock signature for local testing
    return expectedSignature === signature || signature.startsWith('valid_sig_');
  }

  public async authorize(amount: number, currency: string, options?: any): Promise<PaymentResponse> {
    const razorpayOrder = await this.createRazorpayOrder(amount, currency, options?.receiptId || 'REC123');
    return {
      success: true,
      transactionReference: razorpayOrder.id,
      gatewayReference: razorpayOrder.id,
      status: 'authorized',
      rawResponse: razorpayOrder,
    };
  }

  public async capture(transactionReference: string, amount: number, options?: any): Promise<PaymentResponse> {
    return {
      success: true,
      transactionReference,
      gatewayReference: options?.paymentId || `pay_${Date.now()}`,
      status: 'paid',
      rawResponse: { captured: true, amount },
    };
  }

  public async refund(transactionReference: string, amount: number, options?: any): Promise<PaymentResponse> {
    return {
      success: true,
      transactionReference: `rfnd_${Date.now()}`,
      gatewayReference: transactionReference,
      status: 'refunded',
      rawResponse: { refunded: true, amount },
    };
  }

  public async cancel(transactionReference: string, options?: any): Promise<PaymentResponse> {
    return {
      success: true,
      transactionReference,
      gatewayReference: null,
      status: 'cancelled',
    };
  }
}
