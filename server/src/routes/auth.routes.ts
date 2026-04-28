import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { registerUser, loginUser, logoutUser, refreshTokenHandler } from '../controllers/auth.controller';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: 'Too many auth requests, please try again after 15 minutes',
});

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.post('/logout', logoutUser);
router.post('/refresh-token', refreshTokenHandler);

export default router;
