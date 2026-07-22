import { Router } from 'express';
import { CustomerDocumentController } from '../controllers/customerDocument.controller';
import { CustomerNoteController } from '../controllers/customerNote.controller';
import { tenantResolver } from '../middleware/tenantResolver';
import { authenticate as requireAuth } from '../middleware/auth.middleware';
import { authorize, requirePermission } from '../middleware/authz.middleware';

const router = Router();
const controller = new CustomerDocumentController();
const noteController = new CustomerNoteController();

router.use(tenantResolver);
router.use(requireAuth);
router.use(authorize);

// Delete customer documents
router.delete(
  '/:id',
  requirePermission('customer.document.delete', 'id'),
  controller.removeDocument
);

// Delete customer notes
router.delete('/notes/:id', requirePermission('customer.update', 'id'), noteController.deleteNote);

export default router;
