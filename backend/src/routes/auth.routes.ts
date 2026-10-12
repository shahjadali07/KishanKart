import express from 'express';
import { register, login, logout, getMe, updateProfile, forgotPassword, resetPassword } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import { rateLimit } from '../middleware/rateLimit.middleware';
import { validate } from '../middleware/validate.middleware';

const router = express.Router();

router.post(
  '/register',
  rateLimit({ windowMs: 60 * 1000, max: 10, keyPrefix: 'auth-register' }),
  validate([
    { field: 'name', required: true, minLength: 2, maxLength: 80 },
    { field: 'email', required: true, isEmail: true },
    { field: 'phone', required: true, isPhone: true },
    { field: 'password', required: true, minLength: 6, maxLength: 128 },
    { field: 'role', required: true, in: ['FARMER', 'BUYER', 'ADMIN'] },
  ]),
  register
);

router.post(
  '/login',
  rateLimit({ windowMs: 15 * 60 * 1000, max: 20, keyPrefix: 'auth-login' }),
  validate([
    { field: 'email', required: true, isEmail: true },
    { field: 'password', required: true },
  ]),
  login
);

router.post('/logout', logout);

router.get('/me', protect, getMe);

router.patch(
  '/me',
  protect,
  validate([
    { field: 'name', maxLength: 80 },
    { field: 'phone', isPhone: true },
    { field: 'location', maxLength: 200 },
  ]),
  updateProfile
);

router.post(
  '/forgot-password',
  rateLimit({ windowMs: 60 * 1000, max: 5, keyPrefix: 'auth-forgot' }),
  validate([{ field: 'identifier', required: true }]),
  forgotPassword
);

router.post(
  '/reset-password',
  rateLimit({ windowMs: 60 * 1000, max: 5, keyPrefix: 'auth-reset' }),
  validate([
    { field: 'token', required: true },
    { field: 'password', required: true, minLength: 6, maxLength: 128 },
  ]),
  resetPassword
);

export default router;
