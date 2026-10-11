import { Request, Response } from 'express';
import User from '../models/User';

export const getStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFarmers = await User.countDocuments({ role: 'FARMER' });
    const totalBuyers = await User.countDocuments({ role: 'BUYER' });
    const activeUsers = await User.countDocuments({ isActive: true });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalFarmers,
        totalBuyers,
        activeUsers,
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
