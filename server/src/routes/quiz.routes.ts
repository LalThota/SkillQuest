import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import { getQuestions, submitQuiz, getQuizHistory } from '../controllers/quiz.controller';

const router = Router();

router.get('/questions', protect, getQuestions);
router.post('/submit', protect, submitQuiz);
router.get('/history', protect, getQuizHistory);

export default router;
