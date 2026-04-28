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

export const BADGE_MAP: Record<string, { name: string; icon: string; description: string }> = {
  first_blood: { name: 'First Blood', icon: '🩸', description: 'Complete your first quiz' },
  hot_streak: { name: 'Hot Streak', icon: '🔥', description: '7-day streak' },
  century: { name: 'Century', icon: '💯', description: '100 correct answers' },
  speed_demon: { name: 'Speed Demon', icon: '⚡', description: '10 questions answered in < 30% time' },
  category_king: { name: 'Category King', icon: '👑', description: '90%+ accuracy in any category (50+ questions)' },
  perfectionist: { name: 'Perfectionist', icon: '✨', description: 'Perfect score on a 20-question quiz' },
  grinder: { name: 'Grinder', icon: '⚙️', description: 'Complete 50 quizzes' },
  wordsmith: { name: 'Wordsmith', icon: '📝', description: 'Master verbal category' },
  logic_lord: { name: 'Logic Lord', icon: '🧩', description: 'Master reasoning category' },
  number_ninja: { name: 'Number Ninja', icon: '🔢', description: 'Master aptitude category' },
};

export const getLevelInfo = (xp: number) => {
  let current = LEVEL_THRESHOLDS[0];
  let next = LEVEL_THRESHOLDS[1];
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i].xp) {
      current = LEVEL_THRESHOLDS[i];
      next = LEVEL_THRESHOLDS[i + 1] || LEVEL_THRESHOLDS[i];
    }
  }
  const progressXP = xp - current.xp;
  const neededXP = next.xp - current.xp;
  const progress = neededXP > 0 ? Math.min((progressXP / neededXP) * 100, 100) : 100;
  return { current, next, progress, progressXP, neededXP };
};

export interface CategoryDef {
  id: string;
  label: string;
  icon: string;
  color: string;
  description: string;
  topics: string[];
  hasGameMode?: boolean;
}

export const CATEGORIES: CategoryDef[] = [
  {
    id: 'aptitude',
    label: 'Quantitative Aptitude',
    icon: '🧮',
    color: '#7C3AED',
    description: 'Numbers, percentages, ratios & more',
    topics: ['Percentages', 'Ratios', 'Time & Work', 'Profit & Loss', 'Averages', 'Ages', 'Speed & Distance', 'Simple & Compound Interest', 'Mixtures & Alligations'],
  },
  {
    id: 'reasoning',
    label: 'Logical Reasoning',
    icon: '🧩',
    color: '#0891B2',
    description: 'Patterns, logic & critical thinking',
    topics: ['Syllogisms', 'Blood Relations', 'Seating Arrangement', 'Coding-Decoding', 'Direction Sense', 'Number Series', 'Analogies', 'Odd One Out'],
  },
  {
    id: 'verbal',
    label: 'Verbal Ability',
    icon: '📝',
    color: '#059669',
    description: 'Language, grammar & comprehension',
    topics: ['Antonyms', 'Synonyms', 'Reading Comprehension', 'Fill in the Blanks', 'Sentence Correction', 'Para Jumbles', 'Idioms & Phrases'],
  },
  {
    id: 'puzzles',
    label: 'Brain Puzzles',
    icon: '🎮',
    color: '#DC2626',
    description: 'Play & solve interactive puzzles',
    topics: ['Visual Puzzles', 'Pattern Recognition', 'Sequence Puzzles', 'Matrix Puzzles', 'Logic Grid'],
    hasGameMode: true,
  },
  {
    id: 'coding',
    label: 'Coding Patterns',
    icon: '💻',
    color: '#D97706',
    description: 'DSA concepts & pattern recognition',
    topics: ['Arrays', 'Strings', 'Sorting Concepts', 'Recursion Logic', 'Time Complexity MCQs', 'Output Prediction'],
  },
  {
    id: 'data_interpretation',
    label: 'Data Interpretation',
    icon: '📊',
    color: '#7C3AED',
    description: 'Charts, tables & data analysis',
    topics: ['Bar Charts', 'Pie Charts', 'Line Graphs', 'Tables', 'Caselets', 'Mixed Graphs'],
  },
];
