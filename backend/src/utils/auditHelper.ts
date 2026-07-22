import { sequelize } from '../config/database';
import { RequestContext } from '../middleware/requestContext';

export interface AuditLogPayload {
  tenantId?: number | null;
  actorId?: number | null;
  action: string;
  entityType: string;
  entityId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  previousValues?: Record<string, any> | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  newValues?: Record<string, any> | null;
}

export const createAuditLog = async (
  payload: AuditLogPayload,
  context?: RequestContext
): Promise<void> => {
  const tenantId = payload.tenantId !== undefined ? payload.tenantId : context?.tenantId || null;
  const actorId =
    payload.actorId !== undefined ? payload.actorId : context?.authenticatedUserId || null;
  const ipAddress = context?.ipAddress || null;
  const userAgent = context?.userAgent || null;
  const requestId = context?.requestId || null;

  await sequelize.query(
    `INSERT INTO audit_logs (
      tenant_id, user_id, action, entity_type, entity_id, 
      old_values, new_values, ip_address, user_agent, request_id, 
      created_at
    ) VALUES (
      :tenantId, :actorId, :action, :entityType, :entityId, 
      :previousValues, :newValues, :ipAddress, :userAgent, :requestId, 
      NOW()
    )`,
    {
      replacements: {
        tenantId,
        actorId,
        action: payload.action,
        entityType: payload.entityType,
        entityId: payload.entityId,
        previousValues: payload.previousValues ? JSON.stringify(payload.previousValues) : null,
        newValues: payload.newValues ? JSON.stringify(payload.newValues) : null,
        ipAddress,
        userAgent,
        requestId,
      },
    }
  );
};
