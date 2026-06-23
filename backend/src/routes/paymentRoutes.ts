import { Router } from 'express';
import { createCheckoutSession, stripeWebhook } from '../controllers/paymentController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/create-checkout-session', authMiddleware as any, createCheckoutSession as any);
router.post('/webhook', stripeWebhook as any);

export default router;
