import { IUser } from '../models/User';

export const LEVEL_THRESHOLDS = [
  { level: 1, xp: 0, title: 'Beginner' },
  { level: 2, xp: 100, title: 'Apprentice' },
  { level: 3, xp: 300, title: 'Practitioner' },
  { level: 4, xp: 600, title: 'Intermediate' },
  { level: 5, xp: 1000, title: 'Advanced' },
  { level: 6, xp: 1500, title: 'Expert' },
  { level: 7, xp: 2200, title: 'Master' },
  { level: 8, xp: 3000, title: 'Grandmaster' },
  { level: 9, xp: 4000, title: 'Elite' },
  { level: 10, xp: 5500, title: 'Legend' },
];

const BASE_XP = 10;
const SPEED_BONUS = 5;
const DIFFICULTY_BONUS: Record<string, number> = { easy: 0, medium: 3, hard: 8 };
const STREAK_BONUS_PER_DAY = 2;
const MAX_STREAK_BONUS = 20;

interface QuestionResult {
  isCorrect: boolean;
  timeTaken: number;
  timeLimit: number;
  difficulty: string;
}

export const calculateQuestionXP = (
  result: QuestionResult,
  streakDays: number
): number => {
  if (!result.isCorrect) return 0;

  let xp = BASE_XP;

  // Speed bonus: answered in < 50% of time limit
  if (result.timeTaken < result.timeLimit * 0.5) {
    xp += SPEED_BONUS;
  }

  // Difficulty bonus
  xp += DIFFICULTY_BONUS[result.difficulty] || 0;

  // Streak bonus
  const streakBonus = Math.min(streakDays * STREAK_BONUS_PER_DAY, MAX_STREAK_BONUS);
  xp += streakBonus;

  return xp;
};

export const calculateTotalXP = (
  results: QuestionResult[],
  streakDays: number
): number => {
  return results.reduce((total, result) => {
    return total + calculateQuestionXP(result, streakDays);
  }, 0);
};

export const calculateLevel = (totalXP: number): { level: number; title: string } => {
  let currentLevel = LEVEL_THRESHOLDS[0];
  for (const threshold of LEVEL_THRESHOLDS) {
    if (totalXP >= threshold.xp) {
      currentLevel = threshold;
    } else {
      break;
    }
  }
  return { level: currentLevel.level, title: currentLevel.title };
};

export const getXPForNextLevel = (currentLevel: number): number => {
  const nextThreshold = LEVEL_THRESHOLDS.find(t => t.level === currentLevel + 1);
  return nextThreshold ? nextThreshold.xp : LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1].xp;
};

export const checkLevelUp = (
  previousXP: number,
  newXP: number
): { leveledUp: boolean; newLevel: number; title: string } => {
  const prevLevel = calculateLevel(previousXP);
  const newLevel = calculateLevel(newXP);

  return {
    leveledUp: newLevel.level > prevLevel.level,
    newLevel: newLevel.level,
    title: newLevel.title,
  };
};
