import express from 'express';
import {
  getFarmerDashboard,
  getBuyerDashboard,
  getAdminDashboard,
} from '../controllers/dashboard.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.use(protect);

router.get('/farmer', authorize('FARMER', 'ADMIN'), getFarmerDashboard);
router.get('/buyer', authorize('BUYER', 'ADMIN'), getBuyerDashboard);
router.get('/admin', authorize('ADMIN'), getAdminDashboard);

export default router;
