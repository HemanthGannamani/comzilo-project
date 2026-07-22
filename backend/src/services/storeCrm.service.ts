/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Customer,
  CustomerSegment,
  CustomerWishlist,
  WishlistItem,
  LoyaltyAccount,
  RewardTransaction,
  SupportTicket,
  TicketReply,
  CustomerCommunicationLog,
} from '../database/models';
import { createAuditLog } from '../utils/auditHelper';

export class StoreCrmService {
  // ================= CUSTOMERS & SEGMENTS =================
  static async getCustomers(tenantId: number, storeId: number, query: any) {
    const page = parseInt(query.page || '0', 10);
    const limit = parseInt(query.limit || '10', 10);
    const offset = page * limit;

    const where: any = { tenantId, storeId };

    const { rows, count } = await Customer.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'DESC']],
    });

    return { customers: rows, total: count, page, limit };
  }

  static async getSegments(tenantId: number, storeId: number) {
    const segments = await CustomerSegment.findAll({
      where: { tenantId, storeId },
      order: [['id', 'DESC']],
    });
    return segments;
  }

  static async createSegment(tenantId: number, storeId: number, userId: number, payload: any) {
    const segment = await CustomerSegment.create({
      tenantId,
      storeId,
      name: payload.name,
      code: payload.code || payload.name.toLowerCase().replace(/\s+/g, '_'),
      criteriaRules: payload.criteriaRules || {},
      status: payload.status || 'active',
    });

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'customer_segment.created',
      entityType: 'CustomerSegment',
      entityId: String(segment.id),
    });

    return segment;
  }

  // ================= WISHLISTS =================
  static async getWishlists(tenantId: number, storeId: number, customerId: number) {
    const wishlists = await CustomerWishlist.findAll({
      where: { tenantId, storeId, customerId },
      include: [{ model: WishlistItem, as: 'items' }],
      order: [['id', 'DESC']],
    });
    return wishlists;
  }

  static async createWishlist(tenantId: number, storeId: number, userId: number, payload: any) {
    const wishlist = await CustomerWishlist.create({
      tenantId,
      storeId,
      customerId: payload.customerId,
      name: payload.name || 'My Wishlist',
      isPublic: payload.isPublic || false,
    });

    if (payload.productId) {
      await WishlistItem.create({
        wishlistId: wishlist.id,
        productId: payload.productId,
        variantId: payload.variantId || null,
        addedPrice: payload.addedPrice || null,
      });
    }

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'wishlist.created',
      entityType: 'CustomerWishlist',
      entityId: String(wishlist.id),
    });

    return wishlist;
  }

  // ================= LOYALTY & REWARDS =================
  static async getLoyaltyAccount(tenantId: number, storeId: number, customerId: number) {
    let account = await LoyaltyAccount.findOne({
      where: { tenantId, storeId, customerId },
      include: [{ model: RewardTransaction, as: 'rewardTransactions' }],
    });

    if (!account) {
      account = await LoyaltyAccount.create({
        tenantId,
        storeId,
        customerId,
        pointsBalance: 0,
        tierLevel: 'bronze',
      });
    }

    return account;
  }

  static async transactRewardPoints(
    tenantId: number,
    storeId: number,
    userId: number,
    payload: any
  ) {
    let account = await LoyaltyAccount.findOne({
      where: { tenantId, storeId, customerId: payload.customerId },
    });

    if (!account) {
      account = await LoyaltyAccount.create({
        tenantId,
        storeId,
        customerId: payload.customerId,
        pointsBalance: 0,
        tierLevel: 'bronze',
      });
    }

    const points = Number(payload.points);
    const isEarn = payload.transactionType === 'earn';
    const newBalance = isEarn ? account.pointsBalance + points : account.pointsBalance - points;

    let tierLevel = 'bronze';
    if (newBalance >= 5000) tierLevel = 'platinum';
    else if (newBalance >= 2000) tierLevel = 'gold';
    else if (newBalance >= 500) tierLevel = 'silver';

    await account.update({ pointsBalance: newBalance, tierLevel });

    const rewardTxn = await RewardTransaction.create({
      tenantId,
      storeId,
      loyaltyAccountId: account.id,
      transactionType: payload.transactionType || 'earn',
      points,
      reference: payload.reference || `REF-${Date.now()}`,
    });

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: `loyalty.${payload.transactionType || 'earn'}`,
      entityType: 'RewardTransaction',
      entityId: String(rewardTxn.id),
    });

    return { account, rewardTxn };
  }

  // ================= SUPPORT TICKETS & REPLIES =================
  static async getTickets(tenantId: number, storeId: number, query: any) {
    const page = parseInt(query.page || '0', 10);
    const limit = parseInt(query.limit || '10', 10);
    const offset = page * limit;

    const where: any = { tenantId, storeId };
    if (query.status) where.status = query.status;

    const { rows, count } = await SupportTicket.findAndCountAll({
      where,
      include: [{ model: TicketReply, as: 'replies' }],
      limit,
      offset,
      order: [['id', 'DESC']],
    });

    return { tickets: rows, total: count, page, limit };
  }

  static async createTicket(tenantId: number, storeId: number, userId: number, payload: any) {
    const ticketNumber = `TICK-${Date.now()}`;
    const ticket = await SupportTicket.create({
      tenantId,
      storeId,
      customerId: payload.customerId,
      ticketNumber,
      subject: payload.subject,
      priority: payload.priority || 'medium',
      status: 'open',
      category: payload.category || 'General Inquiry',
    });

    if (payload.initialMessage) {
      await TicketReply.create({
        ticketId: ticket.id,
        userId,
        message: payload.initialMessage,
        isStaffReply: false,
      });
    }

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'ticket.created',
      entityType: 'SupportTicket',
      entityId: String(ticket.id),
    });

    return ticket;
  }

  static async replyTicket(
    tenantId: number,
    storeId: number,
    userId: number,
    ticketId: number,
    payload: any
  ) {
    const ticket = await SupportTicket.findOne({ where: { id: ticketId, tenantId, storeId } });
    if (!ticket) throw new Error('Support ticket not found');

    const reply = await TicketReply.create({
      ticketId,
      userId,
      message: payload.message,
      isStaffReply: payload.isStaffReply !== undefined ? payload.isStaffReply : true,
    });

    if (payload.status) {
      await ticket.update({ status: payload.status });
    }

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'ticket.reply_posted',
      entityType: 'TicketReply',
      entityId: String(reply.id),
    });

    return reply;
  }

  // ================= COMMUNICATION LOGS =================
  static async logCommunication(tenantId: number, storeId: number, userId: number, payload: any) {
    const log = await CustomerCommunicationLog.create({
      tenantId,
      storeId,
      customerId: payload.customerId,
      channel: payload.channel || 'email',
      subject: payload.subject || null,
      messageBody: payload.messageBody || payload.message,
      sentAt: new Date(),
    });

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'communication.logged',
      entityType: 'CustomerCommunicationLog',
      entityId: String(log.id),
    });

    return log;
  }
}
