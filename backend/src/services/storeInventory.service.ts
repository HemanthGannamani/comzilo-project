/* eslint-disable @typescript-eslint/no-explicit-any */
import { sequelize } from '../config/database';
import {
  Warehouse,
  WarehouseLocation,
  InventoryBalance,
  StockMovement,
  StockTransfer,
  StockTransferItem,
  StockReservation,
  InventoryBatch,
  InventorySerial,
  InventoryCycleCount,
} from '../database/models';
import { logger } from '../shared/logging/logger';
import { createAuditLog } from '../utils/auditHelper';

export class StoreInventoryService {
  // ================= WAREHOUSES & LOCATIONS =================
  static async getWarehouses(tenantId: number, storeId: number) {
    const warehouses = await Warehouse.findAll({
      where: { tenantId, storeId },
      include: [{ model: WarehouseLocation, as: 'locations' }],
      order: [['id', 'DESC']],
    });
    return warehouses;
  }

  static async createWarehouse(tenantId: number, storeId: number, userId: number, payload: any) {
    const warehouse = await Warehouse.create({
      tenantId,
      storeId,
      name: payload.name,
      code: payload.code || `WH-${Date.now()}`,
      addressLine1: payload.addressLine1 || payload.address || null,
      city: payload.city || null,
      state: payload.state || null,
      postalCode: payload.postalCode || null,
      country: payload.country || null,
      contactName: payload.contactName || payload.contactPerson || null,
      contactPhone: payload.contactPhone || payload.phone || null,
      contactEmail: payload.contactEmail || payload.email || null,
      status: payload.status || 'active',
      isDefault: payload.isDefault || false,
    } as any);

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'warehouse.created',
      entityType: 'Warehouse',
      entityId: String(warehouse.id),
    });

    return warehouse;
  }

  static async createLocation(
    tenantId: number,
    storeId: number,
    warehouseId: number,
    payload: any
  ) {
    const location = await WarehouseLocation.create({
      tenantId,
      storeId,
      warehouseId,
      name: payload.name,
      code: payload.code || payload.name.toUpperCase(),
      type: payload.type || 'bin',
    } as any);
    return location;
  }

  // ================= INVENTORY STOCK ITEMS =================
  static async getInventoryItems(tenantId: number, storeId: number, query: any) {
    const page = parseInt(query.page || '0', 10);
    const limit = parseInt(query.limit || '10', 10);
    const offset = page * limit;

    const where: any = { tenantId, storeId };
    if (query.warehouseId) {
      where.warehouseId = query.warehouseId;
    }

    const { rows, count } = await InventoryBalance.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'DESC']],
    });

    return { items: rows, total: count, page, limit };
  }

  static async updateStock(tenantId: number, storeId: number, userId: number, payload: any) {
    const transaction = await sequelize.transaction();
    try {
      const [item] = await InventoryBalance.findOrCreate({
        where: {
          tenantId,
          storeId,
          productId: payload.productId || 1,
          warehouseId: payload.warehouseId || 1,
          warehouseLocationId: payload.warehouseLocationId || payload.locationId || 1,
        } as any,
        defaults: {
          quantityAvailable: 0,
          quantityReserved: 0,
        } as any,
        transaction,
      });

      const prevQty = Number((item as any).quantityAvailable) || 0;
      const changeQty = Number(payload.quantity) || 0;
      const newQty = payload.mode === 'set' ? changeQty : prevQty + changeQty;
      const diff = newQty - prevQty;

      await item.update({ quantityAvailable: newQty } as any, { transaction });

      // Append Ledger Movement Record
      await StockMovement.create(
        {
          tenantId,
          storeId,
          warehouseId: payload.warehouseId || 1,
          warehouseLocationId: payload.warehouseLocationId || payload.locationId || 1,
          productId: payload.productId || 1,
          movementType:
            payload.movementType === 'purchase'
              ? 'stock_in'
              : payload.movementType || (diff >= 0 ? 'stock_in' : 'stock_out'),
          direction: diff >= 0 ? 'in' : 'out',
          quantity: Math.abs(diff),
          quantityBefore: prevQty,
          quantityAfter: newQty,
          previousQuantity: prevQty,
          newQuantity: newQty,
          quantityDelta: diff,
          reason: payload.reason || 'Stock balance update',
          referenceNumber: payload.referenceNumber || `REF-${Date.now()}`,
          createdBy: userId,
        } as any,
        { transaction }
      );

      await transaction.commit();

      await createAuditLog({
        tenantId,
        actorId: userId,
        action: 'stock.updated',
        entityType: 'InventoryBalance',
        entityId: String(item.id),
      });

      return item;
    } catch (error: any) {
      await transaction.rollback();
      logger.error(`[StoreInventoryService] updateStock error: ${error.message}`);
      throw error;
    }
  }

  // ================= MOVEMENTS LEDGER =================
  static async getMovements(tenantId: number, storeId: number, query: any) {
    const movements = await StockMovement.findAll({
      where: { tenantId, storeId },
      limit: parseInt(query.limit || '20', 10),
      order: [['id', 'DESC']],
    });
    return movements;
  }

  // ================= TRANSFERS WORKFLOW =================
  static async getTransfers(tenantId: number, storeId: number, _query: any) {
    const transfers = await StockTransfer.findAll({
      where: { tenantId, storeId },
      include: [{ model: StockTransferItem, as: 'items' }],
      order: [['id', 'DESC']],
    });
    return transfers;
  }

  static async createTransfer(tenantId: number, storeId: number, userId: number, payload: any) {
    const transaction = await sequelize.transaction();
    try {
      const transferNumber = `TRF-${Date.now()}`;
      const transfer = await StockTransfer.create(
        {
          tenantId,
          storeId,
          transferNumber,
          sourceWarehouseId: payload.sourceWarehouseId,
          destinationWarehouseId: payload.destinationWarehouseId,
          status: payload.status || 'draft',
          notes: payload.notes || null,
          createdBy: userId,
        } as any,
        { transaction }
      );

      if (payload.items && Array.isArray(payload.items)) {
        for (const item of payload.items) {
          await StockTransferItem.create(
            {
              tenantId,
              storeId,
              stockTransferId: transfer.id,
              productId: item.productId || 1,
              sourceLocationId: payload.sourceLocationId || 1,
              destinationLocationId: payload.destinationLocationId || 1,
              requestedQuantity: item.quantity || 10,
              quantity: item.quantity || 10,
            } as any,
            { transaction }
          );
        }
      }

      await transaction.commit();

      await createAuditLog({
        tenantId,
        actorId: userId,
        action: 'transfer.created',
        entityType: 'StockTransfer',
        entityId: String(transfer.id),
      });

      return transfer;
    } catch (error: any) {
      await transaction.rollback();
      logger.error(`[StoreInventoryService] createTransfer error: ${error.message}`);
      throw error;
    }
  }

  static async updateTransferStatus(
    tenantId: number,
    storeId: number,
    userId: number,
    id: number,
    status: string
  ) {
    const transfer = await StockTransfer.findOne({ where: { id, tenantId, storeId } });
    if (!transfer) throw new Error('Stock transfer not found');

    await transfer.update({ status } as any);

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: `transfer.${status}`,
      entityType: 'StockTransfer',
      entityId: String(id),
    });

    return transfer;
  }

  // ================= RESERVATIONS =================
  static async createReservation(tenantId: number, storeId: number, userId: number, payload: any) {
    const reservation = await StockReservation.create({
      tenantId,
      storeId,
      warehouseId: payload.warehouseId || 1,
      productId: payload.productId || 1,
      quantity: payload.quantity,
      status: 'active',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    } as any);

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'reservation.created',
      entityType: 'StockReservation',
      entityId: String(reservation.id),
    });

    return reservation;
  }

  // ================= BATCHES & SERIALS =================
  static async createBatch(tenantId: number, storeId: number, userId: number, payload: any) {
    const batch = await InventoryBatch.create({
      tenantId,
      storeId,
      warehouseId: payload.warehouseId,
      batchNumber: payload.batchNumber,
      lotNumber: payload.lotNumber || null,
      mfgDate: payload.mfgDate || null,
      expiryDate: payload.expiryDate || null,
    });

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'batch.created',
      entityType: 'InventoryBatch',
      entityId: String(batch.id),
    });

    return batch;
  }

  static async createSerial(tenantId: number, storeId: number, userId: number, payload: any) {
    const serial = await InventorySerial.create({
      tenantId,
      storeId,
      warehouseId: payload.warehouseId,
      serialNumber: payload.serialNumber,
      imei: payload.imei || null,
      warrantyExpiry: payload.warrantyExpiry || null,
    });

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'serial.created',
      entityType: 'InventorySerial',
      entityId: String(serial.id),
    });

    return serial;
  }

  // ================= CYCLE COUNTING =================
  static async createCycleCount(tenantId: number, storeId: number, userId: number, payload: any) {
    const countNumber = `CC-${Date.now()}`;
    const cycleCount = await InventoryCycleCount.create({
      tenantId,
      storeId,
      warehouseId: payload.warehouseId,
      countNumber,
      notes: payload.notes || null,
    });

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'cycle_count.created',
      entityType: 'InventoryCycleCount',
      entityId: String(cycleCount.id),
    });

    return cycleCount;
  }
}
