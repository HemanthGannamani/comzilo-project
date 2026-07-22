import { CustomerNoteRepository } from '../repositories/customerNote.repository';
import { CustomerNote, User } from '../database/models';
import { BaseService } from '../core/BaseService';
import { NotFoundError } from '../shared/errors/AppError';

export class CustomerNoteService extends BaseService {
  private noteRepo = new CustomerNoteRepository();

  constructor() {
    super('CustomerNoteService');
  }

  public async createNote(
    tenantId: number,
    storeId: number,
    customerId: number,
    authorId: number,
    note: string
  ): Promise<CustomerNote> {
    return this.noteRepo.createScoped(tenantId, storeId, {
      customerId,
      authorId,
      note,
    });
  }

  public async listNotes(
    tenantId: number,
    storeId: number,
    customerId: number
  ): Promise<CustomerNote[]> {
    return this.noteRepo.findScopedMany(tenantId, storeId, {
      where: { customerId },
      include: [
        { model: User, as: 'author', attributes: ['id', 'firstName', 'lastName', 'email'] },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  public async deleteNote(tenantId: number, storeId: number, id: number): Promise<void> {
    const note = await this.noteRepo.findScopedById(tenantId, storeId, id);
    if (!note) {
      throw new NotFoundError(`Note with ID ${id} not found.`);
    }
    await this.noteRepo.deleteScoped(tenantId, storeId, id);
  }
}
