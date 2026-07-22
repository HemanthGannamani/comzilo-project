/* eslint-disable @typescript-eslint/no-explicit-any */
import { StockTransferRepository } from '../repositories/stockTransfer.repository';
import { StockTransferItemRepository } from '../repositories/stockTransferItem.repository';
import { WarehouseRepository } from '../repositories/warehouse.repository';
import { WarehouseLocationRepository } from '../repositories/warehouseLocation.repository';
import { InventoryService } from './inventory.service';
import { StockTransfer } from '../database/models/stockTransfer';
import { NotFoundError, ValidationError } from '../shared/errors/AppError';
import { sequelize } from '../config/database';

export class StockTransferService {
  private transferRepo: StockTransferRepository;
  private itemRepo: StockTransferItemRepository;
  private warehouseRepo: WarehouseRepository;
  private locationRepo: WarehouseLocationRepository;
  private inventoryService: InventoryService;

  constructor() {
    this.transferRepo = new StockTransferRepository();
    this.itemRepo = new StockTransferItemRepository();
    this.warehouseRepo = new WarehouseRepository();
    this.locationRepo = new WarehouseLocationRepository();
    this.inventoryService = new InventoryService();
  }

  public async createTransfer(
    tenantId: number,
    storeId: number,
    userId: number,
    data: any
  ): Promise<StockTransfer> {
    if (data.sourceWarehouseId === data.destinationWarehouseId) {
      throw new ValidationError('Source and destination warehouses must be different.');
    }

    // Verify source and destination warehouses exist and are active
    const sourceWarehouse = await this.warehouseRepo.findScopedById(
      tenantId,
      storeId,
      data.sourceWarehouseId
    );
    if (!sourceWarehouse || sourceWarehouse.status !== 'active') {
      throw new NotFoundError(`Source warehouse not found or is inactive.`);
    }

    const destWarehouse = await this.warehouseRepo.findScopedById(
      tenantId,
      storeId,
      data.destinationWarehouseId
    );
    if (!destWarehouse || destWarehouse.status !== 'active') {
      throw new NotFoundError(`Destination warehouse not found or is inactive.`);
    }

    const transfer = await sequelize.transaction(async (t) => {
      const newTransfer = await this.transferRepo.createScoped(
        tenantId,
        storeId,
        {
          sourceWarehouseId: data.sourceWarehouseId,
          destinationWarehouseId: data.destinationWarehouseId,
          status: 'draft',
          referenceNumber: data.referenceNumber,
          notes: data.notes,
          requestedBy: userId,
        },
        { transaction: t }
      );

      if (data.items && Array.isArray(data.items)) {
        for (const item of data.items) {
          // Verify locations belong to source/dest warehouses
          const srcLoc = await this.locationRepo.findScopedById(
            tenantId,
            storeId,
            item.sourceLocationId,
            { transaction: t }
          );
          if (!srcLoc || srcLoc.warehouseId !== data.sourceWarehouseId) {
            throw new ValidationError(`Source location does not belong to the source warehouse.`);
          }

          const destLoc = await this.locationRepo.findScopedById(
            tenantId,
            storeId,
            item.destinationLocationId,
            { transaction: t }
          );
          if (!destLoc || destLoc.warehouseId !== data.destinationWarehouseId) {
            throw new ValidationError(
              `Destination location does not belong to the destination warehouse.`
            );
          }

          await this.itemRepo.createScoped(
            tenantId,
            storeId,
            {
              stockTransferId: newTransfer.id,
              productId: item.productId,
              sourceLocationId: item.sourceLocationId,
              destinationLocationId: item.destinationLocationId,
              requestedQuantity: item.requestedQuantity,
            },
            { transaction: t }
          );
        }
      }

      return newTransfer;
    });

    return this.getTransfer(tenantId, storeId, transfer.id);
  }

  public async getTransfer(
    tenantId: number,
    storeId: number,
    id: number,
    transaction?: any
  ): Promise<StockTransfer> {
    const transfer = await this.transferRepo.findScopedById(tenantId, storeId, id, {
      include: [{ model: this.itemRepo.dbModel, as: 'items' }],
      transaction,
    });
    if (!transfer) {
      throw new NotFoundError(`Stock Transfer with ID ${id} not found.`);
    }
    return transfer;
  }

  public async listTransfers(
    tenantId: number,
    storeId: number,
    options: any = {}
  ): Promise<StockTransfer[]> {
    return this.transferRepo.findScopedMany(tenantId, storeId, {
      ...options,
      include: [{ model: this.itemRepo.dbModel, as: 'items' }],
    });
  }

  public async updateTransfer(
    tenantId: number,
    storeId: number,
    id: number,
    _userId: number,
    data: any
  ): Promise<StockTransfer> {
    const transfer = await this.getTransfer(tenantId, storeId, id);
    if (transfer.status !== 'draft') {
      throw new ValidationError(`Cannot update a transfer with status '${transfer.status}'.`);
    }

    await sequelize.transaction(async (t) => {
      await this.transferRepo.updateScoped(
        tenantId,
        storeId,
        id,
        {
          referenceNumber: data.referenceNumber ?? transfer.referenceNumber,
          notes: data.notes ?? transfer.notes,
        },
        { transaction: t }
      );

      if (data.items && Array.isArray(data.items)) {
        // Clear old items and recreate
        await this.itemRepo.dbModel.destroy({
          where: { stock_transfer_id: id },
          transaction: t,
        });

        for (const item of data.items) {
          const srcLoc = await this.locationRepo.findScopedById(
            tenantId,
            storeId,
            item.sourceLocationId,
            { transaction: t }
          );
          if (!srcLoc || srcLoc.warehouseId !== transfer.sourceWarehouseId) {
            throw new ValidationError(`Source location does not belong to the source warehouse.`);
          }

          const destLoc = await this.locationRepo.findScopedById(
            tenantId,
            storeId,
            item.destinationLocationId,
            { transaction: t }
          );
          if (!destLoc || destLoc.warehouseId !== transfer.destinationWarehouseId) {
            throw new ValidationError(
              `Destination location does not belong to the destination warehouse.`
            );
          }

          await this.itemRepo.createScoped(
            tenantId,
            storeId,
            {
              stockTransferId: id,
              productId: item.productId,
              sourceLocationId: item.sourceLocationId,
              destinationLocationId: item.destinationLocationId,
              requestedQuantity: item.requestedQuantity,
            },
            { transaction: t }
          );
        }
      }
    });

    return this.getTransfer(tenantId, storeId, id);
  }

  public async submitTransfer(
    tenantId: number,
    storeId: number,
    id: number
  ): Promise<StockTransfer> {
    const transfer = await this.getTransfer(tenantId, storeId, id);
    if (transfer.status !== 'draft') {
      throw new ValidationError('Only draft transfers can be submitted.');
    }
    await transfer.update({ status: 'pending_approval' });
    return transfer;
  }

  public async approveTransfer(
    tenantId: number,
    storeId: number,
    id: number,
    userId: number
  ): Promise<StockTransfer> {
    const transfer = await this.getTransfer(tenantId, storeId, id);
    if (transfer.status !== 'pending_approval') {
      throw new ValidationError('Only pending transfers can be approved.');
    }
    await transfer.update({
      status: 'approved',
      approvedBy: userId,
      approvedAt: new Date(),
    });
    return transfer;
  }

  public async rejectTransfer(
    tenantId: number,
    storeId: number,
    id: number,
    userId: number
  ): Promise<StockTransfer> {
    const transfer = await this.getTransfer(tenantId, storeId, id);
    if (transfer.status !== 'pending_approval') {
      throw new ValidationError('Only pending transfers can be rejected.');
    }
    await transfer.update({
      status: 'rejected',
      approvedBy: userId,
      approvedAt: new Date(),
    });
    return transfer;
  }

  public async shipTransfer(
    tenantId: number,
    storeId: number,
    id: number,
    userId: number
  ): Promise<StockTransfer> {
    const transfer = await this.getTransfer(tenantId, storeId, id);
    if (transfer.status !== 'approved') {
      throw new ValidationError('Only approved transfers can be shipped.');
    }

    await sequelize.transaction(async (t) => {
      const items = (transfer as any).items || [];
      for (const item of items) {
        // Create stock out mutation at source warehouse & location
        await this.inventoryService.mutateStock(
          {
            tenantId,
            storeId,
            warehouseId: transfer.sourceWarehouseId,
            warehouseLocationId: item.sourceLocationId,
            productId: item.productId,
            movementType: 'transfer_out',
            direction: 'out',
            quantity: item.requestedQuantity,
            referenceType: 'StockTransfer',
            referenceId: transfer.id.toString(),
            performedBy: userId,
          },
          t
        );

        await item.update(
          {
            shippedQuantity: item.requestedQuantity,
          },
          { transaction: t }
        );
      }

      await transfer.update(
        {
          status: 'in_transit',
          shippedBy: userId,
          shippedAt: new Date(),
        },
        { transaction: t }
      );
    });

    return this.getTransfer(tenantId, storeId, id);
  }

  public async receiveTransfer(
    tenantId: number,
    storeId: number,
    id: number,
    userId: number,
    data: any
  ): Promise<StockTransfer> {
    const transfer = await this.getTransfer(tenantId, storeId, id);
    if (transfer.status !== 'in_transit') {
      throw new ValidationError('Only transfers in transit can be received.');
    }

    await sequelize.transaction(async (t) => {
      const items = (transfer as any).items || [];
      let allFullyReceived = true;

      for (const item of items) {
        const receivedItemData = data.items?.find((i: any) => i.productId === item.productId);
        const qtyReceived = receivedItemData
          ? Number(receivedItemData.receivedQuantity)
          : item.shippedQuantity;

        if (qtyReceived < 0) {
          throw new ValidationError('Received quantity cannot be negative.');
        }
        if (qtyReceived > item.shippedQuantity) {
          throw new ValidationError('Cannot receive more than shipped quantity.');
        }

        if (qtyReceived < item.shippedQuantity) {
          allFullyReceived = false;
        }

        if (qtyReceived > 0) {
          // Mutate stock in to destination warehouse and location
          await this.inventoryService.mutateStock(
            {
              tenantId,
              storeId,
              warehouseId: transfer.destinationWarehouseId,
              warehouseLocationId: item.destinationLocationId,
              productId: item.productId,
              movementType: 'transfer_in',
              direction: 'in',
              quantity: qtyReceived,
              referenceType: 'StockTransfer',
              referenceId: transfer.id.toString(),
              performedBy: userId,
            },
            t
          );
        }

        await item.update(
          {
            receivedQuantity: qtyReceived,
          },
          { transaction: t }
        );
      }

      const newStatus = allFullyReceived ? 'received' : 'partially_received';

      await transfer.update(
        {
          status: newStatus,
          receivedBy: userId,
          receivedAt: new Date(),
        },
        { transaction: t }
      );
    });

    return this.getTransfer(tenantId, storeId, id);
  }

  public async cancelTransfer(
    tenantId: number,
    storeId: number,
    id: number,
    _userId: number
  ): Promise<StockTransfer> {
    const transfer = await this.getTransfer(tenantId, storeId, id);

    if (['draft', 'pending_approval', 'approved'].indexOf(transfer.status) === -1) {
      throw new ValidationError(`Cannot cancel a transfer with status '${transfer.status}'.`);
    }

    await transfer.update({
      status: 'cancelled',
      cancelledAt: new Date(),
    });

    return transfer;
  }
}
