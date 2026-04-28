import { Request, Response, NextFunction } from 'express';
import { Question } from '../models/Question';
import { Quiz } from '../models/Quiz';
import { User } from '../models/User';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { calculateQuestionXP, calculateTotalXP, checkLevelUp } from '../services/xp.service';
import { updateStreak } from '../services/streak.service';
import { checkBadgeUnlocks } from '../services/badge.service';

export const getQuestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, mode, topic, count } = req.query;
    const filter: Record<string, unknown> = {};

    if (category && category !== 'mixed') {
      filter.category = category;
    }
    if (topic) {
      filter.topic = { $regex: new RegExp(`^${String(topic).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') };
    }

    let questionCount = 10;
    if (mode === 'full') questionCount = 20;
    else if (mode === 'quick') questionCount = 10;
    else if (count) questionCount = parseInt(count as string, 10);

    const questions = await Question.aggregate([
      { $match: filter },
      { $sample: { size: questionCount } },
    ]);

    if (questions.length === 0) {
      return next(new ApiError(404, 'No questions found for the given criteria'));
    }

    // Strip correctIndex and explanation for the quiz (don't reveal answers)
    const sanitized = questions.map(q => ({
      _id: q._id,
      text: q.text,
      options: q.options,
      category: q.category,
      topic: q.topic,
      difficulty: q.difficulty,
      timeLimit: q.timeLimit,
    }));

    res.status(200).json(new ApiResponse(200, sanitized, 'Questions fetched successfully'));
  } catch (error) {
    next(error);
  }
};

export const submitQuiz = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { mode, category, topic, answers } = req.body;
    // answers: [{ questionId, selectedIndex, timeTaken }]

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return next(new ApiError(400, 'No answers provided'));
    }

    // Fetch all questions to verify answers
    const questionIds = answers.map((a: any) => a.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });
    const questionMap = new Map(questions.map(q => [q._id.toString(), q]));

    // Update streak
    const streakResult = updateStreak(
      user.streak.lastActiveDate,
      user.streak.current,
      user.streak.longest
    );

    // Process each answer
    let correctCount = 0;
    let speedDemonCount = 0;
    const processedQuestions: Array<{
      questionId: string;
      selectedIndex: number;
      isCorrect: boolean;
      timeTaken: number;
    }> = [];

    let totalXPEarned = 0;

    for (const answer of answers) {
      const question = questionMap.get(answer.questionId);
      if (!question) continue;

      const isCorrect = answer.selectedIndex === question.correctIndex;
      if (isCorrect) correctCount++;

      const timeTaken = answer.timeTaken;
      if (timeTaken < question.timeLimit * 0.3) speedDemonCount++;

      const questionXP = calculateQuestionXP(
        { isCorrect, timeTaken, timeLimit: question.timeLimit, difficulty: question.difficulty },
        streakResult.newStreak
      );
      totalXPEarned += questionXP;

      processedQuestions.push({
        questionId: answer.questionId,
        selectedIndex: answer.selectedIndex,
        isCorrect,
        timeTaken,
      });
    }

    const accuracy = Math.round((correctCount / processedQuestions.length) * 100);

    // Create quiz record
    const quiz = await Quiz.create({
      userId: user._id,
      mode: mode || 'quick',
      category: category || 'mixed',
      topic,
      questions: processedQuestions,
      score: correctCount,
      xpEarned: totalXPEarned,
      accuracy,
      completedAt: new Date(),
    });

    // Check for badge unlocks
    const newBadges = checkBadgeUnlocks(user, {
      totalQuestions: processedQuestions.length,
      correctAnswers: correctCount,
      questionsWithSpeedBonus: speedDemonCount,
    });

    const previousXP = user.xp;
    const newXP = user.xp + totalXPEarned;
    const levelUpResult = checkLevelUp(previousXP, newXP);

    // Update user stats
    const categoryKey = category as 'aptitude' | 'reasoning' | 'verbal';
    const updateObj: Record<string, unknown> = {
      xp: newXP,
      level: levelUpResult.newLevel,
      'streak.current': streakResult.newStreak,
      'streak.lastActiveDate': new Date(),
      $inc: {
        totalQuizzes: 1,
        totalCorrect: correctCount,
        totalQuestions: processedQuestions.length,
      },
    };

    if (streakResult.isNewRecord) {
      updateObj['streak.longest'] = streakResult.newStreak;
    }

    // Push new badges
    const badgePushArray = newBadges.map(b => ({ badgeId: b.badgeId, unlockedAt: new Date() }));

    await User.findByIdAndUpdate(user._id, {
      $set: {
        xp: newXP,
        level: levelUpResult.newLevel,
        'streak.current': streakResult.newStreak,
        'streak.lastActiveDate': new Date(),
        ...(streakResult.isNewRecord ? { 'streak.longest': streakResult.newStreak } : {}),
      },
      $inc: {
        totalQuizzes: 1,
        totalCorrect: correctCount,
        totalQuestions: processedQuestions.length,
        [`categoryStats.${categoryKey}.attempted`]: processedQuestions.length,
        [`categoryStats.${categoryKey}.correct`]: correctCount,
      },
      ...(badgePushArray.length > 0 ? { $push: { badges: { $each: badgePushArray } } } : {}),
    });

    // Fetch questions with explanations for result page
    const questionsWithExplanations = processedQuestions.map(pq => {
      const q = questionMap.get(pq.questionId);
      return {
        ...pq,
        text: q?.text,
        options: q?.options,
        correctIndex: q?.correctIndex,
        explanation: q?.explanation,
        difficulty: q?.difficulty,
      };
    });

    res.status(200).json(new ApiResponse(200, {
      quizId: quiz._id,
      score: correctCount,
      total: processedQuestions.length,
      accuracy,
      xpEarned: totalXPEarned,
      newTotalXP: newXP,
      levelUp: levelUpResult,
      streak: streakResult,
      newBadges,
      questions: questionsWithExplanations,
    }, 'Quiz submitted successfully'));
  } catch (error) {
    next(error);
  }
};

export const getQuizHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const quizzes = await Quiz.find({ userId: user._id })
      .sort({ completedAt: -1 })
      .limit(20);

    res.status(200).json(new ApiResponse(200, quizzes, 'Quiz history fetched'));
  } catch (error) {
    next(error);
  }
};
