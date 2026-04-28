import { Request, Response } from 'express';
import { GameSession } from '../models/GameSession';
import { User } from '../models/User';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';

export const submitGameSession = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { categoryId, puzzlesAttempted, puzzlesCorrect, livesLost, finalScore, accuracy, timeElapsed } = req.body;

    if (!categoryId || puzzlesAttempted == null || finalScore == null || timeElapsed == null) {
      throw new ApiError(400, 'Missing required fields');
    }

    const livesRemaining = 3 - (livesLost || 0);
    const starRating = accuracy >= 85 ? 3 : accuracy >= 60 ? 2 : 1;

    // XP formula: score/8 + livesBonus
    const xpEarned = Math.floor(finalScore / 8) + (livesRemaining * 10);

    const session = await GameSession.create({
      userId,
      categoryId,
      puzzlesAttempted,
      puzzlesCorrect: puzzlesCorrect || 0,
      livesLost: livesLost || 0,
      finalScore,
      accuracy: accuracy || 0,
      timeElapsed,
      xpEarned,
      starRating,
    });

    // Award XP to user
    await User.findByIdAndUpdate(userId, {
      $inc: { xp: xpEarned },
    });

    // Recalculate level
    const user = await User.findById(userId);
    if (user) {
      const THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5500];
      let newLevel = 1;
      for (let i = 0; i < THRESHOLDS.length; i++) {
        if (user.xp >= THRESHOLDS[i]) newLevel = i + 1;
      }
      if (newLevel !== user.level) {
        user.level = newLevel;
        await user.save();
      }
    }

    return res.status(201).json(
      new ApiResponse(201, {
        sessionId: session._id,
        xpEarned,
        starRating,
        newTotalXP: user?.xp || 0,
      }, 'Game session saved successfully')
    );
  } catch (error: any) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message, success: false });
    }
    return res.status(500).json({ message: 'Internal server error', success: false });
  }
};

export const getGameHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const sessions = await GameSession.find({ userId })
      .sort({ completedAt: -1 })
      .limit(20);

    return res.json(new ApiResponse(200, sessions, 'Game history'));
  } catch (error: any) {
    return res.status(500).json({ message: 'Internal server error', success: false });
  }
};
