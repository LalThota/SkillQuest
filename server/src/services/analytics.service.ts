import { Quiz, IQuiz } from '../models/Quiz';
import { Question } from '../models/Question';
import mongoose from 'mongoose';

interface WeakArea {
  topic: string;
  category: string;
  accuracy: number;
  attempted: number;
  suggestion: string;
}

const TOPIC_SUGGESTIONS: Record<string, string> = {
  'Percentages': 'Practice converting between fractions, decimals and percentages. Focus on percentage change problems.',
  'Ratios': 'Work on ratio proportion problems. Practice dividing quantities in given ratios.',
  'Time & Work': 'Focus on understanding rate of work concept. Practice pipe and cistern problems too.',
  'Profit & Loss': 'Revise cost price, selling price, markup formulas. Practice successive discount problems.',
  'Averages': 'Practice weighted average and average speed problems.',
  'Ages': 'Set up equations systematically. Practice problems with "years ago" and "years hence".',
  'Speed & Distance': 'Master the relationship between speed, distance and time. Practice train and boat problems.',
  'Syllogisms': 'Use Venn diagrams for all conclusions. Practice with "some", "all", "no" statements.',
  'Blood Relations': 'Draw family trees for complex problems. Practice coded blood relations.',
  'Seating Arrangement': 'Use diagrams for circular and linear arrangements. Practice step by step elimination.',
  'Coding-Decoding': 'Look for patterns in letter shifts and number substitutions.',
  'Direction Sense': 'Always draw the path on paper. Track left/right turns carefully.',
  'Antonyms': 'Build vocabulary by reading. Learn root words, prefixes and suffixes.',
  'Synonyms': 'Use flashcards for vocabulary. Group similar-meaning words together.',
  'Reading Comprehension': 'Practice skimming and scanning. Focus on understanding main idea vs details.',
  'Fill in the Blanks': 'Learn collocations and common phrases. Practice grammar rules.',
  'Sentence Correction': 'Review subject-verb agreement, tense consistency, and parallelism rules.',
};

export const getWeakAreas = async (userId: string): Promise<WeakArea[]> => {
  const quizzes = await Quiz.find({ userId: new mongoose.Types.ObjectId(userId) });

  const topicStats: Record<string, { correct: number; attempted: number; category: string }> = {};

  for (const quiz of quizzes) {
    for (const q of quiz.questions) {
      const question = await Question.findById(q.questionId);
      if (!question) continue;

      const key = question.topic;
      if (!topicStats[key]) {
        topicStats[key] = { correct: 0, attempted: 0, category: question.category };
      }
      topicStats[key].attempted++;
      if (q.isCorrect) topicStats[key].correct++;
    }
  }

  const weakAreas: WeakArea[] = [];

  for (const [topic, stats] of Object.entries(topicStats)) {
    const accuracy = stats.attempted > 0 ? stats.correct / stats.attempted : 0;
    if (accuracy < 0.6 && stats.attempted >= 5) {
      weakAreas.push({
        topic,
        category: stats.category,
        accuracy: Math.round(accuracy * 100),
        attempted: stats.attempted,
        suggestion: TOPIC_SUGGESTIONS[topic] || 'Practice more problems in this area to improve.',
      });
    }
  }

  return weakAreas.sort((a, b) => a.accuracy - b.accuracy);
};

export const getCategoryBreakdown = async (userId: string) => {
  const quizzes = await Quiz.find({ userId: new mongoose.Types.ObjectId(userId) });
  
  const breakdown: Record<string, { correct: number; attempted: number; totalTime: number }> = {
    aptitude: { correct: 0, attempted: 0, totalTime: 0 },
    reasoning: { correct: 0, attempted: 0, totalTime: 0 },
    verbal: { correct: 0, attempted: 0, totalTime: 0 },
  };

  for (const quiz of quizzes) {
    const cat = quiz.category;
    if (breakdown[cat]) {
      for (const q of quiz.questions) {
        breakdown[cat].attempted++;
        if (q.isCorrect) breakdown[cat].correct++;
        breakdown[cat].totalTime += q.timeTaken;
      }
    }
  }

  return Object.entries(breakdown).map(([category, stats]) => ({
    category,
    accuracy: stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0,
    attempted: stats.attempted,
    correct: stats.correct,
    avgTime: stats.attempted > 0 ? Math.round(stats.totalTime / stats.attempted) : 0,
  }));
};

export const getTopicHeatmap = async (userId: string) => {
  const quizzes = await Quiz.find({ userId: new mongoose.Types.ObjectId(userId) });
  
  const topicMap: Record<string, { correct: number; attempted: number; category: string }> = {};

  for (const quiz of quizzes) {
    for (const q of quiz.questions) {
      const question = await Question.findById(q.questionId);
      if (!question) continue;
      const key = question.topic;
      if (!topicMap[key]) {
        topicMap[key] = { correct: 0, attempted: 0, category: question.category };
      }
      topicMap[key].attempted++;
      if (q.isCorrect) topicMap[key].correct++;
    }
  }

  return Object.entries(topicMap).map(([topic, stats]) => ({
    topic,
    category: stats.category,
    accuracy: stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0,
    attempted: stats.attempted,
  }));
};

export const getOverview = async (userId: string) => {
  const quizzes = await Quiz.find({ userId: new mongoose.Types.ObjectId(userId) })
    .sort({ completedAt: -1 });

  const totalQuizzes = quizzes.length;
  let totalCorrect = 0;
  let totalAttempted = 0;
  let totalXP = 0;

  // XP over last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const xpOverTime: Record<string, number> = {};
  
  for (const quiz of quizzes) {
    totalXP += quiz.xpEarned;
    for (const q of quiz.questions) {
      totalAttempted++;
      if (q.isCorrect) totalCorrect++;
    }

    const dateKey = quiz.completedAt.toISOString().split('T')[0];
    if (quiz.completedAt >= thirtyDaysAgo) {
      xpOverTime[dateKey] = (xpOverTime[dateKey] || 0) + quiz.xpEarned;
    }
  }

  // Build 30-day array
  const xpTimeline = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    xpTimeline.push({ date: key, xp: xpOverTime[key] || 0 });
  }

  return {
    totalQuizzes,
    totalCorrect,
    totalAttempted,
    accuracy: totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0,
    totalXP,
    xpTimeline,
  };
};
