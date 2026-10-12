import express from 'express';
import {
  getStats,
  getUsers,
  getUserById,
  updateUserStatus,
  updateFarmerKYC,
  deleteUser,
  getFarmerProfile,
} from '../controllers/admin.controller';
import { getAllProductsAdmin } from '../controllers/product.controller';
import { getAllOrders } from '../controllers/order.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.use(protect);
router.use(authorize('ADMIN'));

router.get('/stats', getStats);

// User management
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id/status', updateUserStatus);
router.patch('/users/:id/kyc', updateFarmerKYC);
router.delete('/users/:id', deleteUser);
router.get('/farmers/:id', getFarmerProfile);

// Product moderation
router.get('/products', getAllProductsAdmin);

// Order oversight
router.get('/orders', getAllOrders);

export default router;
