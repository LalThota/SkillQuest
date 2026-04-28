import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { ApiResponse } from '../utils/ApiResponse';

export const getGlobalLeaderboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { period } = req.query;
    
    // For simplicity, we always rank by total XP. 
    // A production system would have weekly/monthly XP snapshots.
    const users = await User.find({})
      .select('username avatar xp level totalQuizzes totalCorrect')
      .sort({ xp: -1 })
      .limit(20);

    const rankings = users.map((user, index) => ({
      rank: index + 1,
      userId: user._id,
      username: user.username,
      avatar: user.avatar,
      xp: user.xp,
      level: user.level,
      totalQuizzes: user.totalQuizzes,
    }));

    res.status(200).json(new ApiResponse(200, rankings, `Leaderboard (${period || 'alltime'}) fetched`));
  } catch (error) {
    next(error);
  }
};

export const getUserRank = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    
    const usersAbove = await User.countDocuments({ xp: { $gt: user.xp } });
    const rank = usersAbove + 1;
    const totalUsers = await User.countDocuments();

    res.status(200).json(new ApiResponse(200, { rank, totalUsers, xp: user.xp }, 'Rank fetched'));
  } catch (error) {
    next(error);
  }
};
