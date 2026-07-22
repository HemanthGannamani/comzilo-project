/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomerDocumentRepository } from '../repositories/customerDocument.repository';
import { CustomerDocument, Media } from '../database/models';
import { BaseService } from '../core/BaseService';
import { NotFoundError } from '../shared/errors/AppError';
import { createAuditLog } from '../utils/auditHelper';
import { createActivityLog } from '../utils/activityHelper';

export class CustomerDocumentService extends BaseService {
  private documentRepo = new CustomerDocumentRepository();

  constructor() {
    super('CustomerDocumentService');
  }

  public async uploadDocument(
    tenantId: number,
    storeId: number,
    customerId: number,
    userId: number,
    data: { mediaId: number; documentType: string },
    ip?: string,
    userAgent?: string
  ): Promise<CustomerDocument> {
    const media = await Media.findOne({
      where: { id: data.mediaId, tenantId },
    });
    if (!media) {
      throw new NotFoundError(`Media item with ID ${data.mediaId} not found.`);
    }

    const doc = await this.documentRepo.createScoped(tenantId, storeId, {
      customerId,
      mediaId: data.mediaId,
      documentType: data.documentType,
    });

    await createAuditLog(
      {
        tenantId,
        actorId: userId,
        action: 'CUSTOMER_DOCUMENT_UPLOADED',
        entityType: 'CustomerDocument',
        entityId: String(doc.id),
        previousValues: null,
        newValues: doc.toJSON(),
      },
      { ipAddress: ip, userAgent } as any
    );

    await createActivityLog(
      {
        tenantId,
        userId,
        activityType: 'CUSTOMER_DOCUMENT_UPLOADED',
        description: `Uploaded document ID ${doc.id} for customer ${customerId}`,
      },
      { ipAddress: ip } as any
    );

    return doc;
  }

  public async removeDocument(
    tenantId: number,
    storeId: number,
    id: number,
    userId: number,
    ip?: string,
    userAgent?: string
  ): Promise<void> {
    const doc = await this.documentRepo.findScopedById(tenantId, storeId, id);
    if (!doc) {
      throw new NotFoundError(`Document reference with ID ${id} not found.`);
    }

    await this.documentRepo.deleteScoped(tenantId, storeId, id);

    await createAuditLog(
      {
        tenantId,
        actorId: userId,
        action: 'CUSTOMER_DOCUMENT_REMOVED',
        entityType: 'CustomerDocument',
        entityId: String(id),
        previousValues: doc.toJSON(),
        newValues: null,
      },
      { ipAddress: ip, userAgent } as any
    );

    await createActivityLog(
      {
        tenantId,
        userId,
        activityType: 'CUSTOMER_DOCUMENT_REMOVED',
        description: `Removed document reference with ID ${id}`,
      },
      { ipAddress: ip } as any
    );
  }

  public async listDocuments(
    tenantId: number,
    storeId: number,
    customerId: number
  ): Promise<CustomerDocument[]> {
    return this.documentRepo.findScopedMany(tenantId, storeId, {
      where: { customerId },
      include: [{ model: Media, as: 'media' }],
    });
  }
}
