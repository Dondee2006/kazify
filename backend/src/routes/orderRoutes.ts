import { Router } from 'express';
import { getOrders, getOrderById, submitWork, releaseFunds } from '../controllers/orderController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authMiddleware as any, getOrders as any);
router.get('/:id', authMiddleware as any, getOrderById as any);
router.put('/:id/submit-work', authMiddleware as any, submitWork as any);
router.put('/:id/release-funds', authMiddleware as any, releaseFunds as any);

export default router;
