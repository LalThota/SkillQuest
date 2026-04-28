export interface User {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  xp: number;
  level: number;
  streak: {
    current: number;
    longest: number;
    lastActiveDate: string | null;
  };
  badges: Array<{ badgeId: string; unlockedAt: string }>;
  totalQuizzes: number;
  totalCorrect: number;
  totalQuestions: number;
  categoryStats: {
    aptitude: CategoryStat;
    reasoning: CategoryStat;
    verbal: CategoryStat;
  };
}

export interface CategoryStat {
  attempted: number;
  correct: number;
  avgTime: number;
}

export interface Question {
  _id: string;
  text: string;
  options: string[];
  category: 'aptitude' | 'reasoning' | 'verbal';
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
}

export interface QuizResult {
  quizId: string;
  score: number;
  total: number;
  accuracy: number;
  xpEarned: number;
  newTotalXP: number;
  levelUp: { leveledUp: boolean; newLevel: number; title: string };
  streak: { streakMaintained: boolean; newStreak: number; isNewRecord: boolean };
  newBadges: Array<{ badgeId: string; name: string; icon: string; description: string }>;
  questions: Array<{
    questionId: string;
    selectedIndex: number;
    isCorrect: boolean;
    timeTaken: number;
    text: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    difficulty: string;
  }>;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar: string;
  xp: number;
  level: number;
  totalQuizzes: number;
}
