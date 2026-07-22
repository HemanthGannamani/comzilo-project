/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PaymentResponse {
  success: boolean;
  transactionReference: string;
  gatewayReference: string | null;
  status: 'pending' | 'authorized' | 'paid' | 'failed' | 'cancelled' | 'refunded';
  rawResponse?: any;
  error?: string;
}

export interface IPaymentProvider {
  authorize(amount: number, currency: string, options?: any): Promise<PaymentResponse>;
  capture(transactionReference: string, amount: number, options?: any): Promise<PaymentResponse>;
  refund(transactionReference: string, amount: number, options?: any): Promise<PaymentResponse>;
  cancel(transactionReference: string, options?: any): Promise<PaymentResponse>;
}
