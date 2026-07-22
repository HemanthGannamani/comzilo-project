/* eslint-disable @typescript-eslint/no-explicit-any */
import { IPaymentProvider, PaymentResponse } from './provider.interface';
import { v4 as uuidv4 } from 'uuid';

export class ManualPaymentProvider implements IPaymentProvider {
  public async authorize(
    _amount: number,
    _currency: string,
    options?: any
  ): Promise<PaymentResponse> {
    const ref = options?.gatewayReference || `AUTH-MAN-${uuidv4().substring(0, 8).toUpperCase()}`;
    return {
      success: true,
      transactionReference: ref,
      gatewayReference: ref,
      status: 'authorized',
    };
  }

  public async capture(
    _transactionReference: string,
    _amount: number,
    options?: any
  ): Promise<PaymentResponse> {
    const ref = options?.gatewayReference || `CAP-MAN-${uuidv4().substring(0, 8).toUpperCase()}`;
    return {
      success: true,
      transactionReference: ref,
      gatewayReference: ref,
      status: 'paid',
    };
  }

  public async refund(
    _transactionReference: string,
    _amount: number,
    options?: any
  ): Promise<PaymentResponse> {
    const ref = options?.gatewayReference || `REF-MAN-${uuidv4().substring(0, 8).toUpperCase()}`;
    return {
      success: true,
      transactionReference: ref,
      gatewayReference: ref,
      status: 'refunded',
    };
  }

  public async cancel(transactionReference: string, _options?: any): Promise<PaymentResponse> {
    return {
      success: true,
      transactionReference,
      gatewayReference: null,
      status: 'cancelled',
    };
  }
}
