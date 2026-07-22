import { Request, Response, NextFunction } from 'express';
import { CustomerNoteService } from '../services/customerNote.service';
import { success, created } from '../shared/responses';
import { ValidationError } from '../shared/errors/AppError';

export class CustomerNoteController {
  private noteService = new CustomerNoteService();

  private getStoreId(req: Request): number {
    const storeId = Number(req.headers['x-store-id'] || req.query.storeId || req.body.storeId);
    if (!storeId || isNaN(storeId)) {
      throw new ValidationError('Store context is missing');
    }
    return storeId;
  }

  public createNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const customerId = Number(req.params.id);
      const authorId = req.context!.authenticatedUserId!;

      const note = await this.noteService.createNote(
        tenantId,
        storeId,
        customerId,
        authorId,
        req.body.note
      );
      created(res, 'Customer note created successfully', note);
    } catch (error) {
      next(error);
    }
  };

  public listNotes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const customerId = Number(req.params.id);

      const notes = await this.noteService.listNotes(tenantId, storeId, customerId);
      success(res, 'Customer notes listed successfully', notes);
    } catch (error) {
      next(error);
    }
  };

  public deleteNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.context!.tenantId!;
      const storeId = this.getStoreId(req);
      const id = Number(req.params.id);

      await this.noteService.deleteNote(tenantId, storeId, id);
      success(res, 'Customer note deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}
