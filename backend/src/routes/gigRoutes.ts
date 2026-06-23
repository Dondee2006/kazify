import { Router } from 'express';
import { getGigs, createGig } from '../controllers/gigController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getGigs as any);
router.post('/', authMiddleware as any, createGig as any);

export default router;
