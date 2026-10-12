import express from 'express';
import {
  placeOrder,
  getMyOrders,
  getFarmerOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  updateOrderPaymentStatus,
} from '../controllers/order.controller';
import { protect, authorize } from '../middleware/auth.middleware';
import { rateLimit } from '../middleware/rateLimit.middleware';

const router = express.Router();

// Place order (buyer)
router.post('/', protect, authorize('BUYER', 'ADMIN'), rateLimit({ windowMs: 60 * 1000, max: 20, keyPrefix: 'orders-place' }), placeOrder);

// My orders (buyer)
router.get('/mine', protect, authorize('BUYER', 'ADMIN'), getMyOrders);

// Farmer orders
router.get('/farmer', protect, authorize('FARMER', 'ADMIN'), getFarmerOrders);

// All orders (admin)
router.get('/', protect, authorize('ADMIN'), getAllOrders);

router.use(protect);

router.get('/:id', getOrderById);
router.patch('/:id/status', updateOrderStatus);
router.post('/:id/cancel', rateLimit({ windowMs: 60 * 1000, max: 20, keyPrefix: 'orders-cancel' }), cancelOrder);
router.patch('/:id/payment', authorize('ADMIN'), updateOrderPaymentStatus);

export default router;
