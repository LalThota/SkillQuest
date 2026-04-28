import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import { getProfile, updateProfile, getUserStats, getUserBadges, getUserStreak } from '../controllers/user.controller';

const router = Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/stats', protect, getUserStats);
router.get('/badges', protect, getUserBadges);
router.get('/streak', protect, getUserStreak);

export default router;
