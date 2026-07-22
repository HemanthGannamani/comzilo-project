import { Router } from 'express';
import { StoreMarketingController } from '../controllers/storeMarketing.controller';
import { authenticate } from '../middleware/auth.middleware';
import { tenantResolver } from '../middleware/tenantResolver';

const router = Router();

// Apply Auth and Tenant Isolation Middleware
router.use(authenticate);
router.use(tenantResolver);

// Promotions
router.get('/promotions', StoreMarketingController.getPromotions);
router.post('/promotions', StoreMarketingController.createPromotion);

// Coupons & Redemptions
router.get('/coupons', StoreMarketingController.getCoupons);
router.post('/coupons', StoreMarketingController.createCoupon);
router.post('/coupons/redeem', StoreMarketingController.redeemCoupon);

// Gift Cards & Transactions
router.get('/gift-cards', StoreMarketingController.getGiftCards);
router.post('/gift-cards', StoreMarketingController.createGiftCard);
router.post('/gift-cards/transact', StoreMarketingController.transactGiftCard);

// Referrals
router.get('/referrals', StoreMarketingController.getReferrals);

// Campaigns & Automations
router.get('/campaigns', StoreMarketingController.getCampaigns);
router.post('/campaigns', StoreMarketingController.createCampaign);
router.get('/automation', StoreMarketingController.getAutomations);
router.post('/automation', StoreMarketingController.createAutomation);

export default router;
