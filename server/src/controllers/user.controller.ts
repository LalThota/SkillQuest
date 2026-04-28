import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    res.status(200).json(new ApiResponse(200, user, 'Profile fetched'));
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { username, avatar } = req.body;

    const updateData: Record<string, unknown> = {};
    if (username) updateData.username = username;
    if (avatar) updateData.avatar = avatar;

    if (username) {
      const existingUser = await User.findOne({ username, _id: { $ne: user._id } });
      if (existingUser) {
        return next(new ApiError(400, 'Username already taken'));
      }
    }

    const updatedUser = await User.findByIdAndUpdate(user._id, { $set: updateData }, { new: true })
      .select('-passwordHash');

    res.status(200).json(new ApiResponse(200, updatedUser, 'Profile updated'));
  } catch (error) {
    next(error);
  }
};

export const getUserStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const stats = {
      xp: user.xp,
      level: user.level,
      totalQuizzes: user.totalQuizzes,
      totalCorrect: user.totalCorrect,
      totalQuestions: user.totalQuestions,
      accuracy: user.totalQuestions > 0 ? Math.round((user.totalCorrect / user.totalQuestions) * 100) : 0,
      streak: user.streak,
      categoryStats: user.categoryStats,
    };
    res.status(200).json(new ApiResponse(200, stats, 'Stats fetched'));
  } catch (error) {
    next(error);
  }
};

export const getUserBadges = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    res.status(200).json(new ApiResponse(200, user.badges, 'Badges fetched'));
  } catch (error) {
    next(error);
  }
};

export const getUserStreak = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    res.status(200).json(new ApiResponse(200, user.streak, 'Streak fetched'));
  } catch (error) {
    next(error);
  }
};
