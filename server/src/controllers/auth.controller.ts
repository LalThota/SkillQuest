import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { env } from '../config/env';

const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ id: userId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as any });
  const refreshToken = jwt.sign({ id: userId }, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN as any });
  return { accessToken, refreshToken };
};

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return next(new ApiError(400, 'User with email or username already exists'));
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      passwordHash,
    });

    const { accessToken, refreshToken } = generateTokens(user._id.toString());

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const userResponse = user.toObject();
    delete (userResponse as any).passwordHash;

    res.status(201).json(new ApiResponse(201, { user: userResponse, accessToken }, 'User registered successfully'));
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(new ApiError(401, 'Invalid credentials'));
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return next(new ApiError(401, 'Invalid credentials'));
    }

    const { accessToken, refreshToken } = generateTokens(user._id.toString());

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const userResponse = user.toObject();
    delete (userResponse as any).passwordHash;

    res.status(200).json(new ApiResponse(200, { user: userResponse, accessToken }, 'Login successful'));
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.cookie('refreshToken', '', {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json(new ApiResponse(200, null, 'Logout successful'));
  } catch (error) {
    next(error);
  }
};

export const refreshTokenHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return next(new ApiError(401, 'No refresh token provided'));
    }

    const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { id: string };
    const user = await User.findById(decoded.id).select('-passwordHash');

    if (!user) {
      return next(new ApiError(401, 'Invalid refresh token'));
    }

    const tokens = generateTokens(user._id.toString());

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json(new ApiResponse(200, { accessToken: tokens.accessToken }, 'Token refreshed successfully'));
  } catch (error) {
    next(new ApiError(401, 'Invalid refresh token'));
  }
};
