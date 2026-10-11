import express from 'express';
import { getStats } from '../controllers/admin.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.use(protect);
router.use(authorize('ADMIN'));

router.get('/stats', getStats);

export default router;
