import { Router } from 'express';
import { submitGameSession, getGameHistory } from '../controllers/game.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.post('/submit-session', protect, submitGameSession);
router.get('/history', protect, getGameHistory);

export default router;
