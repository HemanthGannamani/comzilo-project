import { BaseRepository } from '../core/BaseRepository';
import { Plan } from '../database/models/plan';

export class PlanRepository extends BaseRepository<Plan> {
  constructor() {
    super(Plan);
  }

  public async findByCode(code: string): Promise<Plan | null> {
    return this.findOne(null, { where: { code } });
  }
}
