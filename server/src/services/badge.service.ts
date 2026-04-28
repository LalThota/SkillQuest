import { IUser } from '../models/User';

export interface Badge {
  badgeId: string;
  name: string;
  description: string;
  icon: string;
}

export const ALL_BADGES: Badge[] = [
  { badgeId: 'first_blood', name: 'First Blood', description: 'Complete your first quiz', icon: '🩸' },
  { badgeId: 'hot_streak', name: 'Hot Streak', description: '7-day streak', icon: '🔥' },
  { badgeId: 'century', name: 'Century', description: '100 correct answers', icon: '💯' },
  { badgeId: 'speed_demon', name: 'Speed Demon', description: '10 questions answered in < 30% time each', icon: '⚡' },
  { badgeId: 'category_king', name: 'Category King', description: '90%+ accuracy in any category (50+ questions)', icon: '👑' },
  { badgeId: 'perfectionist', name: 'Perfectionist', description: 'Perfect score on a 20-question quiz', icon: '✨' },
  { badgeId: 'grinder', name: 'Grinder', description: 'Complete 50 quizzes', icon: '⚙️' },
  { badgeId: 'wordsmith', name: 'Wordsmith', description: 'Master verbal category', icon: '📝' },
  { badgeId: 'logic_lord', name: 'Logic Lord', description: 'Master reasoning category', icon: '🧩' },
  { badgeId: 'number_ninja', name: 'Number Ninja', description: 'Master aptitude category', icon: '🔢' },
];

interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  questionsWithSpeedBonus: number; // answered in < 30% time
}

export const checkBadgeUnlocks = (
  user: IUser,
  quizResult: QuizResult
): Badge[] => {
  const existingBadgeIds = new Set(user.badges.map(b => b.badgeId));
  const newBadges: Badge[] = [];

  const check = (badgeId: string, condition: boolean) => {
    if (!existingBadgeIds.has(badgeId) && condition) {
      const badge = ALL_BADGES.find(b => b.badgeId === badgeId);
      if (badge) newBadges.push(badge);
    }
  };

  // First Blood: Complete first quiz (totalQuizzes is about to become 1 after this quiz)
  check('first_blood', user.totalQuizzes === 0);

  // Hot Streak: 7-day streak
  check('hot_streak', user.streak.current >= 7);

  // Century: 100 correct answers
  check('century', user.totalCorrect + quizResult.correctAnswers >= 100);

  // Speed Demon: 10 questions answered in < 30% time in single session
  check('speed_demon', quizResult.questionsWithSpeedBonus >= 10);

  // Category King: 90%+ accuracy in any category with 50+ questions
  const categories: ('aptitude' | 'reasoning' | 'verbal')[] = ['aptitude', 'reasoning', 'verbal'];
  for (const cat of categories) {
    const stats = user.categoryStats[cat];
    if (stats.attempted >= 50 && stats.correct / stats.attempted >= 0.9) {
      check('category_king', true);
      break;
    }
  }

  // Perfectionist: Perfect score on 20-question quiz
  check(
    'perfectionist',
    quizResult.totalQuestions >= 20 && quizResult.correctAnswers === quizResult.totalQuestions
  );

  // Grinder: 50 quizzes completed
  check('grinder', user.totalQuizzes + 1 >= 50);

  // Wordsmith: verbal category level 5+ (correct >= 50 in verbal)
  check('wordsmith', user.categoryStats.verbal.correct >= 50);

  // Logic Lord: reasoning category level 5+ (correct >= 50 in reasoning)
  check('logic_lord', user.categoryStats.reasoning.correct >= 50);

  // Number Ninja: aptitude category level 5+ (correct >= 50 in aptitude)
  check('number_ninja', user.categoryStats.aptitude.correct >= 50);

  return newBadges;
};
