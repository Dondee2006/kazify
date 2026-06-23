import { Router } from 'express';
import { syncUser } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/sync', authMiddleware as any, syncUser as any);

export default router;
