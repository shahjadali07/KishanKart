import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  getMyProducts,
  updateProduct,
  updateProductStatus,
  deleteProduct,
  adjustStock,
  getProductStockHistory,
} from '../controllers/product.controller';
import { protect, authorize } from '../middleware/auth.middleware';
import { rateLimit } from '../middleware/rateLimit.middleware';

const router = express.Router();

// Public listings
router.get('/', rateLimit({ windowMs: 60 * 1000, max: 300, keyPrefix: 'products-list' }), getProducts);
router.get('/mine', protect, getMyProducts);
router.get('/:id', getProductById);

// Farmer management
router.use(protect);

router.post('/', authorize('FARMER', 'ADMIN'), rateLimit({ windowMs: 60 * 1000, max: 30, keyPrefix: 'products-create' }), createProduct);

router.patch('/:id', updateProduct);
router.patch('/:id/status', updateProductStatus);
router.delete('/:id', deleteProduct);
router.post('/:id/stock', adjustStock);
router.get('/:id/stock', getProductStockHistory);

export default router;
