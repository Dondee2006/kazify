import { Router } from 'express';
import { getJobRequests, createJobRequest } from '../controllers/requestController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getJobRequests as any);
router.post('/', authMiddleware as any, createJobRequest as any);

export default router;
