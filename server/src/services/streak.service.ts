interface StreakResult {
  streakMaintained: boolean;
  newStreak: number;
  isNewRecord: boolean;
}

const isSameDay = (d1: Date, d2: Date): boolean => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

const isYesterday = (date: Date, today: Date): boolean => {
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(date, yesterday);
};

export const updateStreak = (
  lastActiveDate: Date | null,
  currentStreak: number,
  longestStreak: number
): StreakResult => {
  const today = new Date();

  // First ever activity
  if (!lastActiveDate) {
    return {
      streakMaintained: true,
      newStreak: 1,
      isNewRecord: true,
    };
  }

  const lastActive = new Date(lastActiveDate);

  // Already played today - no change
  if (isSameDay(lastActive, today)) {
    return {
      streakMaintained: true,
      newStreak: currentStreak,
      isNewRecord: false,
    };
  }

  // Played yesterday - increment streak
  if (isYesterday(lastActive, today)) {
    const newStreak = currentStreak + 1;
    return {
      streakMaintained: true,
      newStreak,
      isNewRecord: newStreak > longestStreak,
    };
  }

  // Gap of more than 1 day - reset to 1
  return {
    streakMaintained: false,
    newStreak: 1,
    isNewRecord: longestStreak === 0,
  };
};
