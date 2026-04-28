import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env';
import { User } from '../models/User';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new ApiError(401, 'Not authorized, no token'));
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
    
    const currentUser = await User.findById(decoded.id).select('-passwordHash');
    if (!currentUser) {
      return next(new ApiError(401, 'The user belonging to this token does no longer exist.'));
    }

    (req as any).user = currentUser;
    next();
  } catch (error) {
    next(new ApiError(401, 'Not authorized, token failed'));
  }
};
