import { Router } from 'express';
import { StoreCrmController } from '../controllers/storeCrm.controller';
import { authenticate } from '../middleware/auth.middleware';
import { tenantResolver } from '../middleware/tenantResolver';

const router = Router();

// Apply Auth and Tenant Isolation Middleware
router.use(authenticate);
router.use(tenantResolver);

// Customers & Segments
router.get('/customers', StoreCrmController.getCustomers);
router.get('/segments', StoreCrmController.getSegments);
router.post('/segments', StoreCrmController.createSegment);

// Wishlists
router.get('/wishlists', StoreCrmController.getWishlists);
router.post('/wishlists', StoreCrmController.createWishlist);

// Loyalty & Rewards
router.get('/loyalty', StoreCrmController.getLoyaltyAccount);
router.post('/rewards', StoreCrmController.transactRewardPoints);

// Support Tickets & Replies
router.get('/tickets', StoreCrmController.getTickets);
router.post('/tickets', StoreCrmController.createTicket);
router.post('/tickets/:id/replies', StoreCrmController.replyTicket);

// Communication Logs
router.post('/communications', StoreCrmController.logCommunication);

export default router;
