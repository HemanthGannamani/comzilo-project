/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseRepository } from '../core/BaseRepository';
import { NotificationQueue } from '../database/models/notificationQueue';
import { Op } from 'sequelize';

export class NotificationQueueRepository extends BaseRepository<NotificationQueue> {
  constructor() {
    super(NotificationQueue);
  }

  public async findPending(limit = 20): Promise<NotificationQueue[]> {
    const now = new Date();
    return this.model.findAll({
      where: {
        status: 'pending',
        [Op.or]: [{ nextRetryAt: null }, { nextRetryAt: { [Op.lte]: now } }],
      },
      limit,
    });
  }
}
