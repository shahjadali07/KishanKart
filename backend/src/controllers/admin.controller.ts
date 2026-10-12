import { Request, Response, NextFunction } from 'express';
import { isValidObjectId } from 'mongoose';
import User, { IUser, KycStatus } from '../models/User';
import Product from '../models/Product';
import Order from '../models/Order';
import { parsePagination, parseSort } from '../middleware/validate.middleware';
import { NotFoundError, ForbiddenError, ValidationError } from '../utils/errors';

export const getStats = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [totalUsers, totalFarmers, totalBuyers, activeUsers] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'FARMER' }),
      User.countDocuments({ role: 'BUYER' }),
      User.countDocuments({ isActive: true, status: 'ACTIVE' }),
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalFarmers,
        totalBuyers,
        activeUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};

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
    lastLogin: user.lastLogin,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, skip } = parsePagination(req);
    const { sortBy, order } = parseSort(req, ['createdAt', 'name', 'email'], 'createdAt');

    const filter: any = {};
    const role = String(req.query.role ?? '').trim();
    if (role && ['FARMER', 'BUYER', 'ADMIN'].includes(role)) {
      filter.role = role;
    }
    const status = String(req.query.status ?? '').trim();
    if (status && ['ACTIVE', 'BLOCKED'].includes(status)) {
      filter.status = status;
    }
    const kyc = String(req.query.kyc ?? '').trim();
    if (kyc && ['PENDING', 'APPROVED', 'REJECTED', 'NOT_SUBMITTED'].includes(kyc)) {
      filter.kycStatus = kyc;
    }
    const search = String(req.query.search ?? '').trim();
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      User.find(filter).select('-password').sort({ [sortBy]: order }).skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: items.map(toUserResponse),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit), hasMore: skip + items.length < total },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      throw new ValidationError('Invalid user id', { id: ['id must be a valid user id'] });
    }

    const user = await User.findById(id).select('-password');
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const [productsCount, ordersAsBuyer, ordersAsFarmer] = await Promise.all([
      Product.countDocuments({ farmerId: user._id }),
      Order.countDocuments({ buyerId: user._id }),
      Order.countDocuments({ farmerId: user._id }),
    ]);

    res.json({
      success: true,
      data: {
        ...toUserResponse(user),
        stats: {
          productsCount,
          ordersPlaced: ordersAsBuyer,
          ordersReceived: ordersAsFarmer,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    if (!isValidObjectId(id)) {
      throw new ValidationError('Invalid user id', { id: ['id must be a valid user id'] });
    }
    if (!status || !['ACTIVE', 'BLOCKED'].includes(status)) {
      throw new ValidationError('Validation failed', { status: ['status must be ACTIVE or BLOCKED'] });
    }

    if (id === req.user!.id) {
      throw new ForbiddenError('You cannot change your own account status');
    }

    const target = await User.findById(id);
    if (!target) {
      throw new NotFoundError('User not found');
    }

    if (target.role === 'ADMIN' && req.user!.role !== 'ADMIN') {
      throw new ForbiddenError('Only administrators can modify admin accounts');
    }
    if (target.role === 'ADMIN' && status === 'BLOCKED') {
      throw new ForbiddenError('Admin accounts cannot be blocked');
    }

    target.status = status as any;
    if (status === 'BLOCKED' && reason) {
      target.rejectionReason = String(reason).slice(0, 500);
    }
    await target.save();

    res.json({ success: true, message: `User ${status === 'BLOCKED' ? 'blocked' : 'unblocked'} successfully`, data: toUserResponse(target) });
  } catch (error) {
    next(error);
  }
};

export const updateFarmerKYC = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { kycStatus, reason } = req.body;

    if (!isValidObjectId(id)) {
      throw new ValidationError('Invalid user id', { id: ['id must be a valid user id'] });
    }
    if (!kycStatus || !['APPROVED', 'REJECTED', 'PENDING'].includes(kycStatus)) {
      throw new ValidationError('Validation failed', {
        kycStatus: ['kycStatus must be APPROVED, REJECTED or PENDING'],
      });
    }

    const farmer = await User.findById(id);
    if (!farmer) {
      throw new NotFoundError('User not found');
    }
    if (farmer.role !== 'FARMER') {
      throw new ValidationError('KYC verification applies to farmer accounts only');
    }

    farmer.kycStatus = kycStatus as KycStatus;
    if (kycStatus === 'REJECTED') {
      farmer.rejectionReason = reason || 'KYC verification failed.';
    } else {
      farmer.rejectionReason = undefined;
    }
    await farmer.save();

    res.json({ success: true, message: `Farmer KYC ${kycStatus.toLowerCase()}`, data: toUserResponse(farmer) });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      throw new ValidationError('Invalid user id', { id: ['id must be a valid user id'] });
    }
    if (id === req.user!.id) {
      throw new ForbiddenError('You cannot delete your own account');
    }

    const target = await User.findById(id);
    if (!target) {
      throw new NotFoundError('User not found');
    }
    if (target.role === 'ADMIN') {
      throw new ForbiddenError('Administrator accounts cannot be deleted');
    }

    await Product.deleteMany({ farmerId: target._id });
    await Order.deleteMany({ $or: [{ buyerId: target._id }, { farmerId: target._id }] });
    await target.deleteOne();

    res.json({ success: true, message: 'User and related records deleted', data: { id: target._id } });
  } catch (error) {
    next(error);
  }
};

export const getFarmerProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      throw new ValidationError('Invalid user id', { id: ['id must be a valid user id'] });
    }

    const farmer = await User.findById(id).select('-password');
    if (!farmer || farmer.role !== 'FARMER') {
      throw new NotFoundError('Farmer not found');
    }

    const [products, totalOrders, paidOrders] = await Promise.all([
      Product.find({ farmerId: farmer._id }).sort({ createdAt: -1 }).limit(20),
      Order.countDocuments({ farmerId: farmer._id }),
      Order.find({ farmerId: farmer._id, paymentStatus: 'Paid' }),
    ]);

    const totalSales = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    res.json({
      success: true,
      data: {
        ...toUserResponse(farmer),
        stats: {
          productsCount: products.length,
          ordersCount: totalOrders,
          totalSales,
        },
        products,
      },
    });
  } catch (error) {
    next(error);
  }
};
