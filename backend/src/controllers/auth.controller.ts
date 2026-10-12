import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import User, { IUser } from '../models/User';
import { generateToken } from '../middleware/auth.middleware';
import { ValidationError, NotFoundError, UnauthorizedError, ForbiddenError } from '../utils/errors';

function toUserResponse(user: IUser) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    location: user.location,
    isVerified: user.isVerified,
    isActive: user.isActive,
    status: user.status,
    kycStatus: user.kycStatus,
    farmDetails: user.farmDetails,
    businessDetails: user.businessDetails,
    rejectionReason: user.rejectionReason,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function authResponse(user: IUser) {
  return {
    success: true,
    data: {
      ...toUserResponse(user),
      token: generateToken(user._id.toString(), user.role),
    },
  };
}

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, phone, password, role, location } = req.body;

    if (role !== 'FARMER' && role !== 'BUYER') {
      throw new ForbiddenError('Public registration is limited to FARMER and BUYER accounts');
    }

    const emailNormalized = String(email || '').trim().toLowerCase();
    const existing = await User.findOne({ email: emailNormalized });
    if (existing) {
      throw new ValidationError('An account with this email already exists', {
        email: ['Email is already registered'],
      });
    }

    const user = await User.create({
      name,
      email: emailNormalized,
      phone: String(phone).replace(/\D/g, ''),
      password,
      role,
      location: location ?? '',
      farmDetails: role === 'FARMER' ? (req.body.farmDetails ?? {}) : undefined,
      businessDetails: role === 'BUYER' ? (req.body.businessDetails ?? {}) : undefined,
    } as Partial<IUser>);

    res.status(201).json(authResponse(user));
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: String(email || '').trim().toLowerCase() }).select('+password');
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.isActive || user.status === 'BLOCKED') {
      throw new ForbiddenError('This account has been blocked. Contact support.');
    }

    const isMatch = await user.matchPassword(String(password || ''));
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    user.lastLogin = new Date();
    await user.save();

    res.json(authResponse(user));
  } catch (error) {
    next(error);
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.json({ success: true, message: 'Logged out successfully' });
};

export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user!.id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    res.json({ success: true, data: toUserResponse(user) });
  } catch (error) {
    next(error);
  }
};

const PROFILE_FIELDS = ['name', 'phone', 'location'] as const;

export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user!.id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    for (const field of PROFILE_FIELDS) {
      if (req.body[field] !== undefined) {
        (user as any)[field] = req.body[field];
      }
    }

    if (req.body.farmDetails && user.role === 'FARMER') {
      user.farmDetails = { ...(user.farmDetails ?? {}), ...req.body.farmDetails };
    }
    if (req.body.businessDetails && user.role === 'BUYER') {
      user.businessDetails = { ...(user.businessDetails ?? {}), ...req.body.businessDetails };
    }

    await user.save();
    res.json({ success: true, data: toUserResponse(user) });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { identifier } = req.body;
    if (!identifier) {
      throw new ValidationError('Please provide your registered email address', {
        identifier: ['identifier is required'],
      });
    }

    const user = await User.findOne({ email: String(identifier).trim().toLowerCase() });

    if (user) {
      const rawToken = crypto.randomBytes(32).toString('hex');
      user.passwordResetToken = crypto.createHash('sha256').update(rawToken).digest('hex');
      user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
      await user.save();

      if (process.env.NODE_ENV !== 'production') {
        res.json({
          success: true,
          message: 'Password reset token generated (dev mode: token returned in response)',
          data: { resetToken: rawToken, expiresIn: 3600 },
        });
        return;
      }
    }

    res.json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent.',
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      throw new ValidationError('Reset token and new password are required', {
        ...(token ? {} : { token: ['Reset token is required'] }),
        ...(password ? {} : { password: ['New password is required'] }),
      });
    }

    const hashed = crypto.createHash('sha256').update(String(token)).digest('hex');
    const user = await User.findOne({
      passwordResetToken: hashed,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid or expired reset token');
    }

    user.password = String(password);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ success: true, message: 'Password reset successful. You can now log in with your new password.' });
  } catch (error) {
    next(error);
  }
};
