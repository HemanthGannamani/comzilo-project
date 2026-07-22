/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseService } from '../core/BaseService';
import { NotificationQueueRepository } from '../repositories/notificationQueue.repository';
import { NotificationQueue } from '../database/models/notificationQueue';

export class QueueService extends BaseService {
  private queueRepo = new NotificationQueueRepository();

  constructor() {
    super('QueueService');
  }

  public async enqueue(
    tenantId: number,
    storeId: number | null,
    notificationId: number,
    maxAttempts = 3
  ): Promise<NotificationQueue> {
    return this.queueRepo.model.create({
      tenantId,
      storeId,
      notificationId,
      status: 'pending',
      attempts: 0,
      maxAttempts,
      nextRetryAt: null,
      failureReason: null,
    });
  }

  public async markSuccess(queueId: number): Promise<NotificationQueue> {
    const queue = await this.queueRepo.model.findByPk(queueId);
    if (queue) {
      await queue.update({ status: 'completed' });
    }
    return queue!;
  }

  public async markFailure(queueId: number, reason: string): Promise<NotificationQueue> {
    const queue = await this.queueRepo.model.findByPk(queueId);
    if (!queue) throw new Error(`Queue item ${queueId} not found`);

    const newAttempts = queue.attempts + 1;
    const isFailed = newAttempts >= queue.maxAttempts;
    const nextRetry = isFailed ? null : new Date(Date.now() + Math.pow(2, newAttempts) * 60000);

    return queue.update({
      attempts: newAttempts,
      status: isFailed ? 'failed' : 'pending',
      nextRetryAt: nextRetry,
      failureReason: reason,
    });
  }
}
