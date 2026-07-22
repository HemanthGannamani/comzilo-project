/* eslint-disable @typescript-eslint/no-explicit-any */
import { sequelize } from '../config/database';
import { RequestContext } from '../middleware/requestContext';

export interface ActivityLogPayload {
  tenantId?: number | null;
  userId: number;
  activityType: string;
  description: string;
  metadata?: any;
}

export const createActivityLog = async (
  payload: ActivityLogPayload,
  context?: RequestContext
): Promise<void> => {
  const tenantId = payload.tenantId !== undefined ? payload.tenantId : context?.tenantId || null;
  const ipAddress = context?.ipAddress || null;

  if (tenantId === null) {
    throw new Error('Tenant ID is required for logging activity records.');
  }

  await sequelize.query(
    `INSERT INTO activity_logs (
      tenant_id, user_id, activity_type, description, metadata, ip_address, 
      created_at
    ) VALUES (
      :tenantId, :userId, :activityType, :description, :metadata, :ipAddress, 
      NOW()
    )`,
    {
      replacements: {
        tenantId,
        userId: payload.userId,
        activityType: payload.activityType,
        description: payload.description,
        metadata: payload.metadata ? JSON.stringify(payload.metadata) : null,
        ipAddress,
      },
    }
  );
};
