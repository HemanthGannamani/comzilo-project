/* eslint-disable @typescript-eslint/no-explicit-any */
import { StockReservationRepository } from '../repositories/stockReservation.repository';
import { StockReservationItemRepository } from '../repositories/stockReservationItem.repository';
import { InventoryService } from './inventory.service';
import { StockReservation } from '../database/models/stockReservation';
import { NotFoundError, ValidationError } from '../shared/errors/AppError';
import { sequelize } from '../config/database';
import { Op } from 'sequelize';

export class StockReservationService {
  private reservationRepo: StockReservationRepository;
  private itemRepo: StockReservationItemRepository;
  private inventoryService: InventoryService;

  constructor() {
    this.reservationRepo = new StockReservationRepository();
    this.itemRepo = new StockReservationItemRepository();
    this.inventoryService = new InventoryService();
  }

  public async createReservation(
    tenantId: number,
    storeId: number,
    userId: number,
    data: any
  ): Promise<StockReservation> {
    const expiresAt = data.expiresAt
      ? new Date(data.expiresAt)
      : new Date(Date.now() + 24 * 60 * 60 * 1000); // default 24h

    const reservation = await sequelize.transaction(async (t) => {
      const newReservation = await this.reservationRepo.createScoped(
        tenantId,
        storeId,
        {
          referenceType: data.referenceType,
          referenceId: data.referenceId,
          status: 'active',
          expiresAt,
          createdBy: userId,
        },
        { transaction: t }
      );

      if (data.items && Array.isArray(data.items)) {
        for (const item of data.items) {
          // Mutate stock to reserve quantity (direction neutral, type reservation)
          await this.inventoryService.mutateStock(
            {
              tenantId,
              storeId,
              warehouseId: item.warehouseId,
              warehouseLocationId: item.warehouseLocationId,
              productId: item.productId,
              movementType: 'reservation',
              direction: 'neutral',
              quantity: item.quantity,
              referenceType: 'StockReservation',
              referenceId: newReservation.id.toString(),
              performedBy: userId,
            },
            t
          );

          await this.itemRepo.createScoped(
            tenantId,
            storeId,
            {
              reservationId: newReservation.id,
              warehouseId: item.warehouseId,
              warehouseLocationId: item.warehouseLocationId,
              productId: item.productId,
              quantity: item.quantity,
            },
            { transaction: t }
          );
        }
      }

      return newReservation;
    });

    return this.getReservation(tenantId, storeId, reservation.id);
  }

  public async getReservation(
    tenantId: number,
    storeId: number,
    id: number,
    transaction?: any
  ): Promise<StockReservation> {
    const reservation = await this.reservationRepo.findScopedById(tenantId, storeId, id, {
      include: [{ model: this.itemRepo.dbModel, as: 'items' }],
      transaction,
    });
    if (!reservation) {
      throw new NotFoundError(`Stock Reservation with ID ${id} not found.`);
    }
    return reservation;
  }

  public async listReservations(
    tenantId: number,
    storeId: number,
    options: any = {}
  ): Promise<StockReservation[]> {
    return this.reservationRepo.findScopedMany(tenantId, storeId, {
      ...options,
      include: [{ model: this.itemRepo.dbModel, as: 'items' }],
    });
  }

  public async releaseReservation(
    tenantId: number,
    storeId: number,
    id: number,
    userId: number
  ): Promise<StockReservation> {
    const reservation = await this.getReservation(tenantId, storeId, id);
    if (reservation.status !== 'active') {
      throw new ValidationError(
        `Cannot release a reservation with status '${reservation.status}'.`
      );
    }

    await sequelize.transaction(async (t) => {
      const items = (reservation as any).items || [];
      for (const item of items) {
        // Release reserved stock (direction neutral, type reservation_release)
        await this.inventoryService.mutateStock(
          {
            tenantId,
            storeId,
            warehouseId: item.warehouseId,
            warehouseLocationId: item.warehouseLocationId,
            productId: item.productId,
            movementType: 'reservation_release',
            direction: 'neutral',
            quantity: item.quantity,
            referenceType: 'StockReservation',
            referenceId: reservation.id.toString(),
            performedBy: userId,
          },
          t
        );
      }

      await reservation.update(
        {
          status: 'released',
          releasedBy: userId,
          releasedAt: new Date(),
        },
        { transaction: t }
      );
    });

    return this.getReservation(tenantId, storeId, id);
  }

  public async fulfillReservation(
    tenantId: number,
    storeId: number,
    id: number,
    userId: number
  ): Promise<StockReservation> {
    const reservation = await this.getReservation(tenantId, storeId, id);
    if (reservation.status !== 'active') {
      throw new ValidationError(
        `Cannot fulfill a reservation with status '${reservation.status}'.`
      );
    }

    await sequelize.transaction(async (t) => {
      const items = (reservation as any).items || [];
      for (const item of items) {
        // Fulfill reserved stock (direction out, type reservation_fulfillment)
        await this.inventoryService.mutateStock(
          {
            tenantId,
            storeId,
            warehouseId: item.warehouseId,
            warehouseLocationId: item.warehouseLocationId,
            productId: item.productId,
            movementType: 'reservation_fulfillment',
            direction: 'out',
            quantity: item.quantity,
            referenceType: 'StockReservation',
            referenceId: reservation.id.toString(),
            performedBy: userId,
          },
          t
        );
      }

      await reservation.update(
        {
          status: 'fulfilled',
          fulfilledBy: userId,
          fulfilledAt: new Date(),
        },
        { transaction: t }
      );
    });

    return this.getReservation(tenantId, storeId, id);
  }

  public async cancelReservation(
    tenantId: number,
    storeId: number,
    id: number,
    userId: number
  ): Promise<StockReservation> {
    const reservation = await this.getReservation(tenantId, storeId, id);
    if (reservation.status !== 'active') {
      throw new ValidationError(`Cannot cancel a reservation with status '${reservation.status}'.`);
    }

    await sequelize.transaction(async (t) => {
      const items = (reservation as any).items || [];
      for (const item of items) {
        // Release reserved stock (direction neutral, type reservation_release)
        await this.inventoryService.mutateStock(
          {
            tenantId,
            storeId,
            warehouseId: item.warehouseId,
            warehouseLocationId: item.warehouseLocationId,
            productId: item.productId,
            movementType: 'reservation_release',
            direction: 'neutral',
            quantity: item.quantity,
            referenceType: 'StockReservation',
            referenceId: reservation.id.toString(),
            performedBy: userId,
          },
          t
        );
      }

      await reservation.update(
        {
          status: 'cancelled',
          releasedBy: userId,
          releasedAt: new Date(),
        },
        { transaction: t }
      );
    });

    return this.getReservation(tenantId, storeId, id);
  }

  public async expireReservation(
    tenantId: number,
    storeId: number,
    id: number,
    userId: number
  ): Promise<StockReservation> {
    const reservation = await this.getReservation(tenantId, storeId, id);
    if (reservation.status !== 'active') {
      throw new ValidationError(`Cannot expire a reservation with status '${reservation.status}'.`);
    }

    await sequelize.transaction(async (t) => {
      const items = (reservation as any).items || [];
      for (const item of items) {
        // Release reserved stock (direction neutral, type reservation_release)
        await this.inventoryService.mutateStock(
          {
            tenantId,
            storeId,
            warehouseId: item.warehouseId,
            warehouseLocationId: item.warehouseLocationId,
            productId: item.productId,
            movementType: 'reservation_release',
            direction: 'neutral',
            quantity: item.quantity,
            referenceType: 'StockReservation',
            referenceId: reservation.id.toString(),
            performedBy: userId,
          },
          t
        );
      }

      await reservation.update(
        {
          status: 'expired',
          releasedBy: userId,
          releasedAt: new Date(),
        },
        { transaction: t }
      );
    });

    return this.getReservation(tenantId, storeId, id);
  }

  /**
   * Safe service method to trigger expiration for all active expired reservations.
   */
  public async expireAllActive(tenantId: number, storeId: number, userId: number): Promise<number> {
    const expiredReservations = await this.reservationRepo.findScopedMany(tenantId, storeId, {
      where: {
        status: 'active',
        expires_at: { [Op.lt]: new Date() },
      },
    });

    let count = 0;
    for (const res of expiredReservations) {
      await this.expireReservation(tenantId, storeId, res.id, userId);
      count++;
    }
    return count;
  }
}
