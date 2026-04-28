import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/ApiResponse';
import { getWeakAreas, getCategoryBreakdown, getTopicHeatmap, getOverview } from '../services/analytics.service';

export const getAnalyticsOverview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const overview = await getOverview(user._id.toString());
    res.status(200).json(new ApiResponse(200, overview, 'Analytics overview fetched'));
  } catch (error) {
    next(error);
  }
};

export const getAnalyticsWeakAreas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const weakAreas = await getWeakAreas(user._id.toString());
    res.status(200).json(new ApiResponse(200, weakAreas, 'Weak areas fetched'));
  } catch (error) {
    next(error);
  }
};

export const getAnalyticsCategoryBreakdown = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const breakdown = await getCategoryBreakdown(user._id.toString());
    res.status(200).json(new ApiResponse(200, breakdown, 'Category breakdown fetched'));
  } catch (error) {
    next(error);
  }
};

export const getAnalyticsTopicHeatmap = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const heatmap = await getTopicHeatmap(user._id.toString());
    res.status(200).json(new ApiResponse(200, heatmap, 'Topic heatmap fetched'));
  } catch (error) {
    next(error);
  }
};
