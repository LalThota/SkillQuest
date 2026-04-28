import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import { getGlobalLeaderboard, getUserRank } from '../controllers/leaderboard.controller';

const router = Router();

router.get('/global', protect, getGlobalLeaderboard);
router.get('/rank', protect, getUserRank);

export default router;
