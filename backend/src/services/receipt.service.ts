/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReceiptRepository } from '../repositories/receipt.repository';
import { Receipt, Order } from '../database/models';
import { BaseService } from '../core/BaseService';
import { NotFoundError } from '../shared/errors/AppError';
import { Op } from 'sequelize';

export class ReceiptService extends BaseService {
  private receiptRepo = new ReceiptRepository();

  constructor() {
    super('ReceiptService');
  }

  public async getReceipt(tenantId: number, storeId: number, id: number): Promise<Receipt> {
    const receipt = await this.receiptRepo.findScopedById(tenantId, storeId, id, {
      include: [{ model: Order, as: 'order' }],
    });
    if (!receipt) {
      throw new NotFoundError(`Receipt with ID ${id} not found.`);
    }
    return receipt;
  }

  public async listReceipts(
    tenantId: number,
    storeId: number,
    query: any
  ): Promise<{ rows: Receipt[]; count: number }> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      receiptNumber,
      cashierId,
      startDate,
      endDate,
    } = query;

    const offset = (Number(page) - 1) * Number(limit);
    const where: any = {};

    if (receiptNumber) where.receiptNumber = { [Op.like]: `%${receiptNumber}%` };
    if (cashierId) where.cashierId = Number(cashierId);

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = new Date(startDate);
      if (endDate) where.createdAt[Op.lte] = new Date(endDate);
    }

    const sortWhitelist = ['createdAt', 'receiptNumber', 'total'];
    const orderField = sortWhitelist.includes(sortBy) ? sortBy : 'createdAt';
    const orderDirection = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    return this.receiptRepo.findAndCountAllScoped(tenantId, storeId, {
      where,
      limit: Number(limit),
      offset,
      order: [[orderField, orderDirection]],
      include: [{ model: Order, as: 'order' }],
    });
  }
}
