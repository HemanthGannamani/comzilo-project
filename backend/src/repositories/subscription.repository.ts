import { BaseRepository } from '../core/BaseRepository';
import { Subscription } from '../database/models/subscription';
import { Op } from 'sequelize';

export class SubscriptionRepository extends BaseRepository<Subscription> {
  constructor() {
    super(Subscription);
  }

  public async findActiveSubscription(tenantId: number | null): Promise<Subscription | null> {
    return this.findOne(tenantId, {
      where: {
        status: {
          [Op.in]: ['trialing', 'active', 'past_due'],
        },
      },
      order: [['created_at', 'DESC']],
    });
  }
}
