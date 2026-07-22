/* eslint-disable @typescript-eslint/no-explicit-any */
import { StockMovementRepository } from '../repositories/stockMovement.repository';
import { StockMovement } from '../database/models/stockMovement';
import { NotFoundError } from '../shared/errors/AppError';

export class StockMovementService {
  private movementRepo: StockMovementRepository;

  constructor() {
    this.movementRepo = new StockMovementRepository();
  }

  public async getMovement(tenantId: number, storeId: number, id: number): Promise<StockMovement> {
    const movement = await this.movementRepo.findScopedById(tenantId, storeId, id);
    if (!movement) {
      throw new NotFoundError(`Stock movement with ID ${id} not found.`);
    }
    return movement;
  }

  public async listMovements(
    tenantId: number,
    storeId: number,
    options: any = {}
  ): Promise<StockMovement[]> {
    return this.movementRepo.findScopedMany(tenantId, storeId, options);
  }
}
