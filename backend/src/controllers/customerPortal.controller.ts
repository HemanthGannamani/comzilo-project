/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import { CustomerService } from '../services/customer.service';
import { CustomerAddressService } from '../services/customerAddress.service';
import { OrderService } from '../services/order.service';
import { InvoiceService } from '../services/invoice.service';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';
import { Customer, CustomerAddress, Product } from '../database/models';
import { success, created } from '../shared/responses';
import { ValidationError, NotFoundError, UnauthorizedError } from '../shared/errors/AppError';
import { sequelize } from '../config/database';
import bcrypt from 'bcrypt';
import { env } from '../config/env';

export class CustomerPortalController {
  private customerService = new CustomerService();
  private addressService = new CustomerAddressService();
  private orderService = new OrderService();
  private invoiceService = new InvoiceService();
  private notificationService = new NotificationService();
  private authService = new AuthService();

  private async getCustomerFromUser(tenantId: number, userId: number): Promise<Customer> {
    const customer = await Customer.findOne({
      where: { tenantId, userId },
      include: ['preference', 'addresses'],
    });

    if (!customer) {
      throw new NotFoundError('Customer account profile not found');
    }
    return customer;
  }

  // 1. Dashboard Metrics
  public getDashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context.tenantId || 1;
      const userId = req.context.authenticatedUserId;
      if (!userId) throw new UnauthorizedError('Customer credentials missing');

      const customer = await this.getCustomerFromUser(tenantId, userId);
      const storeId = customer.storeId || 1;

      // Fetch Recent Orders & Counts
      const orderResult = await this.orderService.listOrders(tenantId, storeId, {
        customerId: customer.id,
        limit: 50,
      });

      const orders = orderResult.rows || [];
      const recentOrders = orders.slice(0, 5);
      const pendingOrders = orders.filter((o: any) => o.status === 'pending' || o.status === 'processing' || o.status === 'unconfirmed').length;
      const completedOrders = orders.filter((o: any) => o.status === 'completed' || o.status === 'delivered').length;

      // Saved Addresses Count
      const addresses = await this.addressService.listAddresses(tenantId, storeId, customer.id);

      // Notifications
      const notificationResult = await this.notificationService.listInAppNotifications(tenantId, userId, { limit: 5 });

      success(res, 'Customer dashboard metrics retrieved successfully', {
        customer: {
          id: customer.id,
          fullName: customer.fullName,
          email: customer.email,
          phone: customer.phone,
          gender: customer.gender,
          dateOfBirth: customer.dateOfBirth,
          profileImageId: customer.profileImageId,
        },
        metrics: {
          totalOrders: orders.length,
          pendingOrders,
          completedOrders,
          savedAddressesCount: addresses.length,
        },
        recentOrders,
        notifications: notificationResult.rows || [],
      });
    } catch (err) {
      next(err);
    }
  };

  // 2. Profile (Get & Update)
  public getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context.tenantId || 1;
      const userId = req.context.authenticatedUserId;
      if (!userId) throw new UnauthorizedError('Customer credentials missing');

      const customer = await this.getCustomerFromUser(tenantId, userId);
      success(res, 'Customer profile retrieved successfully', customer);
    } catch (err) {
      next(err);
    }
  };

  public updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context.tenantId || 1;
      const userId = req.context.authenticatedUserId;
      if (!userId) throw new UnauthorizedError('Customer credentials missing');

      const customer = await this.getCustomerFromUser(tenantId, userId);
      const storeId = customer.storeId || 1;

      const updated = await this.customerService.updateCustomer(
        tenantId,
        storeId,
        customer.id,
        userId,
        req.body,
        req.ip,
        req.headers['user-agent']
      );

      success(res, 'Profile updated successfully', updated);
    } catch (err) {
      next(err);
    }
  };

  // 3. Orders (List & Detail & Cancel)
  public listMyOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context.tenantId || 1;
      const userId = req.context.authenticatedUserId;
      if (!userId) throw new UnauthorizedError('Customer credentials missing');

      const customer = await this.getCustomerFromUser(tenantId, userId);
      const storeId = customer.storeId || 1;

      const result = await this.orderService.listOrders(tenantId, storeId, {
        ...req.query,
        customerId: customer.id,
      });

      success(res, 'Customer orders retrieved successfully', result);
    } catch (err) {
      next(err);
    }
  };

  public getMyOrderDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context.tenantId || 1;
      const userId = req.context.authenticatedUserId;
      if (!userId) throw new UnauthorizedError('Customer credentials missing');

      const customer = await this.getCustomerFromUser(tenantId, userId);
      const storeId = customer.storeId || 1;
      const orderId = Number(req.params.id);

      const order = await this.orderService.getOrder(tenantId, storeId, orderId);
      if (order.customerId !== customer.id) {
        throw new UnauthorizedError('Access denied: You do not own this order');
      }

      success(res, 'Order details retrieved successfully', order);
    } catch (err) {
      next(err);
    }
  };

  public cancelMyOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context.tenantId || 1;
      const userId = req.context.authenticatedUserId;
      if (!userId) throw new UnauthorizedError('Customer credentials missing');

      const customer = await this.getCustomerFromUser(tenantId, userId);
      const storeId = customer.storeId || 1;
      const orderId = Number(req.params.id);

      const order = await this.orderService.getOrder(tenantId, storeId, orderId);
      if (order.customerId !== customer.id) {
        throw new UnauthorizedError('Access denied: You do not own this order');
      }

      const cancelled = await this.orderService.cancelOrder(
        tenantId,
        storeId,
        orderId,
        userId,
        req.ip,
        req.headers['user-agent']
      );

      success(res, 'Order cancelled successfully', cancelled);
    } catch (err) {
      next(err);
    }
  };

  // 4. Saved Addresses
  public listMyAddresses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context.tenantId || 1;
      const userId = req.context.authenticatedUserId;
      if (!userId) throw new UnauthorizedError('Customer credentials missing');

      const customer = await this.getCustomerFromUser(tenantId, userId);
      const storeId = customer.storeId || 1;

      const addresses = await this.addressService.listAddresses(tenantId, storeId, customer.id);
      success(res, 'Addresses retrieved successfully', addresses);
    } catch (err) {
      next(err);
    }
  };

  public createMyAddress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context.tenantId || 1;
      const userId = req.context.authenticatedUserId;
      if (!userId) throw new UnauthorizedError('Customer credentials missing');

      const customer = await this.getCustomerFromUser(tenantId, userId);
      const storeId = customer.storeId || 1;

      const address = await this.addressService.createAddress(
        tenantId,
        storeId,
        customer.id,
        userId,
        req.body,
        req.ip,
        req.headers['user-agent']
      );

      created(res, 'Address saved successfully', address);
    } catch (err) {
      next(err);
    }
  };

  public updateMyAddress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context.tenantId || 1;
      const userId = req.context.authenticatedUserId;
      if (!userId) throw new UnauthorizedError('Customer credentials missing');

      const customer = await this.getCustomerFromUser(tenantId, userId);
      const storeId = customer.storeId || 1;
      const addressId = Number(req.params.id);

      const address = await this.addressService.getAddress(tenantId, storeId, addressId);
      if (address.customerId !== customer.id) {
        throw new UnauthorizedError('Access denied: You do not own this address');
      }

      const updated = await this.addressService.updateAddress(
        tenantId,
        storeId,
        addressId,
        userId,
        req.body,
        req.ip,
        req.headers['user-agent']
      );

      success(res, 'Address updated successfully', updated);
    } catch (err) {
      next(err);
    }
  };

  public deleteMyAddress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context.tenantId || 1;
      const userId = req.context.authenticatedUserId;
      if (!userId) throw new UnauthorizedError('Customer credentials missing');

      const customer = await this.getCustomerFromUser(tenantId, userId);
      const storeId = customer.storeId || 1;
      const addressId = Number(req.params.id);

      const address = await this.addressService.getAddress(tenantId, storeId, addressId);
      if (address.customerId !== customer.id) {
        throw new UnauthorizedError('Access denied: You do not own this address');
      }

      await this.addressService.deleteAddress(
        tenantId,
        storeId,
        addressId,
        userId,
        req.ip,
        req.headers['user-agent']
      );

      success(res, 'Address deleted successfully');
    } catch (err) {
      next(err);
    }
  };

  public setDefaultAddress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context.tenantId || 1;
      const userId = req.context.authenticatedUserId;
      if (!userId) throw new UnauthorizedError('Customer credentials missing');

      const customer = await this.getCustomerFromUser(tenantId, userId);
      const storeId = customer.storeId || 1;
      const addressId = Number(req.params.id);
      const { type } = req.body; // 'billing' | 'shipping'

      const address = await this.addressService.getAddress(tenantId, storeId, addressId);
      if (address.customerId !== customer.id) {
        throw new UnauthorizedError('Access denied: You do not own this address');
      }

      let updated: CustomerAddress;
      if (type === 'billing') {
        updated = await this.addressService.setDefaultBilling(tenantId, storeId, addressId, userId, req.ip, req.headers['user-agent']);
      } else {
        updated = await this.addressService.setDefaultShipping(tenantId, storeId, addressId, userId, req.ip, req.headers['user-agent']);
      }

      success(res, 'Default address updated successfully', updated);
    } catch (err) {
      next(err);
    }
  };

  // 5. Invoices (List & Details)
  public listMyInvoices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context.tenantId || 1;
      const userId = req.context.authenticatedUserId;
      if (!userId) throw new UnauthorizedError('Customer credentials missing');

      const customer = await this.getCustomerFromUser(tenantId, userId);
      const storeId = customer.storeId || 1;

      // Retrieve customer's orders to scope invoices
      const orderResult = await this.orderService.listOrders(tenantId, storeId, { customerId: customer.id, limit: 100 });
      const orderIds = (orderResult.rows || []).map((o: any) => o.id);

      const invoiceResult = await this.invoiceService.listInvoices(tenantId, storeId, req.query);
      const myInvoices = (invoiceResult.rows || []).filter((inv: any) => orderIds.includes(inv.orderId));

      success(res, 'Customer invoices retrieved successfully', { rows: myInvoices, count: myInvoices.length });
    } catch (err) {
      next(err);
    }
  };

  // 6. Security (Change Password & Privacy Sessions)
  public changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context.tenantId || 1;
      const userId = req.context.authenticatedUserId;
      if (!userId) throw new UnauthorizedError('Customer credentials missing');

      await this.authService.changePassword(tenantId, userId, req.body, req.context);
      success(res, 'Password changed successfully');
    } catch (err) {
      next(err);
    }
  };

  // 7. Checkout & Order Placement Transaction Engine
  public validateCoupon = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context.tenantId || 1;
      const { code, subtotal } = req.body;

      if (!code) throw new ValidationError('Coupon code is required');

      // Demo/Standard coupon check or Coupon DB lookup
      const codeUpper = String(code).toUpperCase().trim();
      let discountAmount = 0;
      let valid = false;

      if (codeUpper === 'SAVE10' || codeUpper === 'WELCOME10') {
        valid = true;
        discountAmount = Math.min(Number(subtotal || 0) * 0.1, 50); // 10% off up to $50
      } else if (codeUpper === 'FREESHIP') {
        valid = true;
        discountAmount = 15;
      } else {
        throw new ValidationError(`Coupon '${codeUpper}' is invalid or expired.`);
      }

      success(res, 'Coupon validated successfully', {
        code: codeUpper,
        discountAmount,
        valid,
      });
    } catch (err) {
      next(err);
    }
  };

  public placeOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context.tenantId || 1;
      const userId = req.context.authenticatedUserId;
      if (!userId) throw new UnauthorizedError('Customer credentials missing');

      const customer = await this.getCustomerFromUser(tenantId, userId);
      const storeId = customer.storeId || 1;

      const {
        items,
        shippingAddressId,
        shippingMethod,
        couponCode,
        paymentMethod = 'cod',
        notes,
      } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        throw new ValidationError('Cart is empty. Cannot place an empty order.');
      }

      // 1. Transactional Execution
      const result = await sequelize.transaction(async (t) => {
        // Validate Address
        let address = null;
        if (shippingAddressId) {
          address = await this.addressService.getAddress(tenantId, storeId, Number(shippingAddressId));
        }

        // Validate Inventory and Products
        const orderItemsInput: any[] = [];
        let calculatedSubtotal = 0;

        for (const cartItem of items) {
          const productId = Number(cartItem.id || cartItem.productId);
          const qty = Number(cartItem.quantity || 1);

          const product = await Product.findOne({
            where: { id: productId, tenantId },
            transaction: t,
          });

          if (!product) {
            throw new NotFoundError(`Product #${productId} not found.`);
          }

          if (product.stockQuantity < qty) {
            throw new ValidationError(
              `Insufficient stock for '${product.name}'. Available: ${product.stockQuantity}, Requested: ${qty}`
            );
          }

          // Reserve Stock
          product.stockQuantity -= qty;
          await product.save({ transaction: t });

          const unitPrice = Number(product.price || 0);
          const lineSubtotal = unitPrice * qty;
          calculatedSubtotal += lineSubtotal;

          orderItemsInput.push({
            productId: product.id,
            sku: product.sku,
            productName: product.name,
            quantity: qty,
            unitPrice,
            subtotal: lineSubtotal,
            total: lineSubtotal,
          });
        }

        // Coupon Calculation
        let discountAmount = 0;
        if (couponCode && String(couponCode).toUpperCase() === 'SAVE10') {
          discountAmount = Math.min(calculatedSubtotal * 0.1, 50);
        }

        // Shipping Fee Calculation
        let shippingAmount = 15;
        if (shippingMethod === 'express') shippingAmount = 25;
        if (shippingMethod === 'pickup' || calculatedSubtotal > 99) shippingAmount = 0;

        // Tax Calculation (8%)
        const taxAmount = (calculatedSubtotal - discountAmount) * 0.08;
        const grandTotal = calculatedSubtotal - discountAmount + taxAmount + shippingAmount;

        // Create Order Record
        const order = await this.orderService.createOrder(
          tenantId,
          storeId,
          userId,
          {
            customerId: customer.id,
            items: orderItemsInput,
            subtotal: calculatedSubtotal,
            discountAmount,
            taxAmount,
            shippingAmount,
            totalAmount: grandTotal,
            paymentMethod,
            notes,
            status: 'confirmed',
            paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
          },
          req.ip,
          req.headers['user-agent']
        );

        // Auto Generate Invoice
        let invoice = null;
        try {
          invoice = await this.invoiceService.createInvoice(
            tenantId,
            storeId,
            userId,
            { orderId: order.id },
            req.ip,
            req.headers['user-agent']
          );
        } catch (e) {
          // If invoice exists, ignore
        }

        // Trigger Notification
        await this.notificationService.createNotification({
          tenantId,
          userId,
          title: `Order Confirmed #${order.orderNumber}`,
          content: `Your order of $${grandTotal.toFixed(2)} has been placed successfully.`,
          type: 'ORDER_STATUS',
          channel: 'in_app',
        });

        return { order, invoice };
      });

      created(res, 'Order placed successfully', result);
    } catch (err) {
      next(err);
    }
  };
}

