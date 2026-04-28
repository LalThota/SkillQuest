import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import {
  getAnalyticsOverview,
  getAnalyticsWeakAreas,
  getAnalyticsCategoryBreakdown,
  getAnalyticsTopicHeatmap,
} from '../controllers/analytics.controller';

const router = Router();

router.get('/overview', protect, getAnalyticsOverview);
router.get('/weak-areas', protect, getAnalyticsWeakAreas);
router.get('/category-breakdown', protect, getAnalyticsCategoryBreakdown);
router.get('/topic-heatmap', protect, getAnalyticsTopicHeatmap);

export default router;
