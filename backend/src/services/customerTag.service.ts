/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomerTagRepository } from '../repositories/customerTag.repository';
import { CustomerTagAssignmentRepository } from '../repositories/customerTagAssignment.repository';
import { CustomerTag } from '../database/models';
import { BaseService } from '../core/BaseService';
import { sequelize } from '../config/database';
import { createAuditLog } from '../utils/auditHelper';
import { createActivityLog } from '../utils/activityHelper';

export class CustomerTagService extends BaseService {
  private tagRepo = new CustomerTagRepository();
  private assignmentRepo = new CustomerTagAssignmentRepository();

  constructor() {
    super('CustomerTagService');
  }

  public async replaceTags(
    tenantId: number,
    storeId: number,
    customerId: number,
    userId: number,
    tagNames: string[],
    ip?: string,
    userAgent?: string
  ): Promise<CustomerTag[]> {
    const uniqueNames = Array.from(new Set(tagNames.map((t) => t.trim()).filter(Boolean)));

    const result = await sequelize.transaction(async (t) => {
      await this.assignmentRepo.dbModel.destroy({
        where: { customer_id: customerId },
        transaction: t,
      });

      const tags: CustomerTag[] = [];

      for (const name of uniqueNames) {
        let tag = await this.tagRepo.findScopedOne(tenantId, storeId, {
          where: { name },
          transaction: t,
        });

        if (!tag) {
          tag = await this.tagRepo.createScoped(tenantId, storeId, { name }, { transaction: t });
        }

        await this.assignmentRepo.dbModel.create(
          {
            customerId,
            tagId: tag.id,
          },
          { transaction: t }
        );

        tags.push(tag);
      }

      return tags;
    });

    await createAuditLog(
      {
        tenantId,
        actorId: userId,
        action: 'CUSTOMER_TAGS_UPDATED',
        entityType: 'Customer',
        entityId: String(customerId),
        previousValues: null,
        newValues: { tags: uniqueNames },
      },
      { ipAddress: ip, userAgent } as any
    );

    await createActivityLog(
      {
        tenantId,
        userId,
        activityType: 'CUSTOMER_TAGS_UPDATED',
        description: `Updated tags for customer ${customerId} to: ${uniqueNames.join(', ')}`,
      },
      { ipAddress: ip } as any
    );

    return result;
  }
}
