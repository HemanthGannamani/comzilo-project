import { Request, Response, NextFunction } from 'express';
import { StockReservationService } from '../services/stockReservation.service';
import { createAuditLog } from '../utils/auditHelper';
import { success, created } from '../shared/responses';
import { ValidationError } from '../shared/errors/AppError';
import { RESPONSE_MESSAGES } from '../shared/constants';

export class StockReservationController {
  private reservationService: StockReservationService;

  constructor() {
    this.reservationService = new StockReservationService();
  }

  private getStoreId(req: Request): number {
    const storeId = Number(req.headers['x-store-id'] || req.query.storeId || req.body.storeId);
    if (!storeId || isNaN(storeId)) {
      throw new ValidationError('Store context is missing');
    }
    return storeId;
  }

  public createReservation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const userId = req.context!.authenticatedUserId!;

      const reservation = await this.reservationService.createReservation(
        tenantId,
        storeId,
        userId,
        req.body
      );

      await createAuditLog(
        {
          tenantId,
          action: 'STOCK_RESERVATION_CREATED',
          entityType: 'stock_reservation',
          entityId: String(reservation.id),
          newValues: reservation.toJSON(),
        },
        req.context
      );

      created(res, 'Stock reservation created successfully', reservation);
    } catch (error) {
      next(error);
    }
  };

  public getReservation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const id = parseInt(req.params.id, 10);

      const reservation = await this.reservationService.getReservation(tenantId, storeId, id);

      success(res, RESPONSE_MESSAGES.SUCCESS, reservation);
    } catch (error) {
      next(error);
    }
  };

  public listReservations = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);

      const reservations = await this.reservationService.listReservations(
        tenantId,
        storeId,
        req.query
      );

      success(res, RESPONSE_MESSAGES.SUCCESS, reservations);
    } catch (error) {
      next(error);
    }
  };

  public releaseReservation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const userId = req.context!.authenticatedUserId!;
      const id = parseInt(req.params.id, 10);

      const oldRes = await this.reservationService.getReservation(tenantId, storeId, id);
      const reservation = await this.reservationService.releaseReservation(
        tenantId,
        storeId,
        id,
        userId
      );

      await createAuditLog(
        {
          tenantId,
          action: 'STOCK_RESERVATION_RELEASED',
          entityType: 'stock_reservation',
          entityId: String(reservation.id),
          previousValues: oldRes.toJSON(),
          newValues: reservation.toJSON(),
        },
        req.context
      );

      success(res, 'Stock reservation released successfully', reservation);
    } catch (error) {
      next(error);
    }
  };

  public fulfillReservation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const userId = req.context!.authenticatedUserId!;
      const id = parseInt(req.params.id, 10);

      const oldRes = await this.reservationService.getReservation(tenantId, storeId, id);
      const reservation = await this.reservationService.fulfillReservation(
        tenantId,
        storeId,
        id,
        userId
      );

      await createAuditLog(
        {
          tenantId,
          action: 'STOCK_RESERVATION_FULFILLED',
          entityType: 'stock_reservation',
          entityId: String(reservation.id),
          previousValues: oldRes.toJSON(),
          newValues: reservation.toJSON(),
        },
        req.context
      );

      success(res, 'Stock reservation fulfilled successfully', reservation);
    } catch (error) {
      next(error);
    }
  };

  public cancelReservation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const userId = req.context!.authenticatedUserId!;
      const id = parseInt(req.params.id, 10);

      const oldRes = await this.reservationService.getReservation(tenantId, storeId, id);
      const reservation = await this.reservationService.cancelReservation(
        tenantId,
        storeId,
        id,
        userId
      );

      await createAuditLog(
        {
          tenantId,
          action: 'STOCK_RESERVATION_CANCELLED',
          entityType: 'stock_reservation',
          entityId: String(reservation.id),
          previousValues: oldRes.toJSON(),
          newValues: reservation.toJSON(),
        },
        req.context
      );

      success(res, 'Stock reservation cancelled successfully', reservation);
    } catch (error) {
      next(error);
    }
  };
}
