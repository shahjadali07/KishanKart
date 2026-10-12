import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order';
import Product from '../models/Product';
import User from '../models/User';

export const getFarmerDashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const farmerId = req.user!.id;
    const farmerOid = new mongoose.Types.ObjectId(farmerId);

    const [
      totalProducts,
      activeProducts,
      availableStock,
      lowStockProducts,
      outOfStockProducts,
      orders,
    ] = await Promise.all([
      Product.countDocuments({ farmerId }),
      Product.countDocuments({ farmerId, status: 'Active' }),
      Product.aggregate([
        { $match: { farmerId: farmerOid } },
        { $group: { _id: null, total: { $sum: '$availableQuantity' } } },
      ]),
      Product.aggregate([
        { $match: { farmerId: farmerOid, status: { $nin: ['Out of Stock'] } } },
        { $match: { $expr: { $lte: ['$availableQuantity', '$lowStockThreshold'] } } },
        { $count: 'count' },
      ]),
      Product.countDocuments({ farmerId, status: 'Out of Stock' }),
      Order.find({ farmerId }).sort({ createdAt: -1 }).limit(50),
    ]);

    const lowStockCount = lowStockProducts[0]?.count ?? 0;

    const statusCounts: Record<string, number> = {
      Pending: 0,
      Confirmed: 0,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    };
    let totalRevenue = 0;
    let activeOrders = 0;

    for (const order of orders) {
      if (statusCounts[order.orderStatus] !== undefined) {
        statusCounts[order.orderStatus] += 1;
      }
      if (order.paymentStatus === 'Paid') {
        totalRevenue += order.totalAmount;
      }
      if (['Pending', 'Confirmed', 'Processing', 'Shipped'].includes(order.orderStatus)) {
        activeOrders += 1;
      }
    }

    res.json({
      success: true,
      data: {
        totalProducts,
        activeProducts,
        availableStock: availableStock[0]?.total ?? 0,
        lowStockCount: lowStockCount,
        outOfStockCount: outOfStockProducts,
        activeOrders,
        totalOrders: orders.length,
        totalRevenue,
        orderStatusCounts: statusCounts,
        recentOrders: orders.slice(0, 10),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getBuyerDashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const buyerId = req.user!.id;

    const orders = await Order.find({ buyerId }).sort({ createdAt: -1 }).limit(100);

    const statusCounts: Record<string, number> = {
      Pending: 0,
      Confirmed: 0,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    };
    let totalSpent = 0;
    let activeOrders = 0;

    for (const order of orders) {
      if (statusCounts[order.orderStatus] !== undefined) {
        statusCounts[order.orderStatus] += 1;
      }
      if (order.paymentStatus === 'Paid') {
        totalSpent += order.totalAmount;
      }
      if (['Pending', 'Confirmed', 'Processing', 'Shipped'].includes(order.orderStatus)) {
        activeOrders += 1;
      }
    }

    res.json({
      success: true,
      data: {
        totalOrders: orders.length,
        activeOrders,
        totalSpent,
        orderStatusCounts: statusCounts,
        recentOrders: orders.slice(0, 10),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminDashboard = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      totalFarmers,
      totalBuyers,
      activeUsers,
      blockedUsers,
      pendingFarmerApprovals,
      activeProducts,
      totalProducts,
      orders,
      todayOrders,
      paidOrders,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'FARMER' }),
      User.countDocuments({ role: 'BUYER' }),
      User.countDocuments({ isActive: true, status: 'ACTIVE' }),
      User.countDocuments({ status: 'BLOCKED' }),
      User.countDocuments({ role: 'FARMER', kycStatus: 'PENDING' }),
      Product.countDocuments({ status: 'Active' }),
      Product.countDocuments(),
      Order.find().sort({ createdAt: -1 }).limit(100),
      Order.countDocuments({ createdAt: { $gte: today } }),
      Order.find({ paymentStatus: 'Paid' }),
    ]);

    const statusCounts: Record<string, number> = {
      Pending: 0,
      Confirmed: 0,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    };
    let platformRevenue = 0;
    let pendingOrders = 0;
    let todaySales = 0;

    for (const order of orders) {
      if (statusCounts[order.orderStatus] !== undefined) {
        statusCounts[order.orderStatus] += 1;
      }
      platformRevenue += order.commissionAmount;
      if (['Pending', 'Confirmed', 'Processing'].includes(order.orderStatus)) {
        pendingOrders += 1;
      }
      if (order.createdAt && order.createdAt >= today) {
        todaySales += order.totalAmount;
      }
    }

    const lifetimeRevenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalFarmers,
        totalBuyers,
        activeUsers,
        blockedUsers,
        pendingFarmerApprovalsCount: pendingFarmerApprovals,
        activeProducts,
        totalProducts,
        totalOrders: orders.length,
        todayOrders,
        todaySales,
        pendingOrdersCount: pendingOrders,
        platformRevenue,
        lifetimeRevenue,
        orderStatusCounts: statusCounts,
        recentOrders: orders.slice(0, 10),
      },
    });
  } catch (error) {
    next(error);
  }
};
