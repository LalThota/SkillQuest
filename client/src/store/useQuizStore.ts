import { create } from 'zustand';
import { api } from '../lib/api';

interface Answer {
  questionId: string;
  selectedIndex: number;
  timeTaken: number;
}

interface QuizState {
  questions: any[];
  answers: Answer[];
  currentQuestionIndex: number;
  isStarted: boolean;
  isFinished: boolean;
  result: any | null;
  category: string | null;
  topic: string | null;
  quizMode: 'learn' | 'exam' | 'weak' | 'quick' | 'full' | 'topic' | null;
  isLoading: boolean;

  startQuiz: (questions: any[]) => void;
  startTopicPractice: (categoryId: string, topicId: string, count: number, mode: 'learn' | 'exam' | 'weak') => Promise<void>;
  answerQuestion: (questionId: string, index: number, time: number) => void;
  nextQuestion: () => void;
  finishQuiz: (result: any) => void;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  questions: [],
  answers: [],
  currentQuestionIndex: 0,
  isStarted: false,
  isFinished: false,
  result: null,
  category: null,
  topic: null,
  quizMode: null,
  isLoading: false,

  startQuiz: (questions) => set({
    questions,
    answers: [],
    currentQuestionIndex: 0,
    isStarted: true,
    isFinished: false,
    result: null,
  }),

  startTopicPractice: async (categoryId, topicId, count, mode) => {
    set({ isLoading: true, questions: [], currentQuestionIndex: 0, quizMode: mode });

    const params = new URLSearchParams({
      category: categoryId,
      topic: topicId,
      count: String(count),
      mode: mode === 'learn' ? 'topic' : mode,
    });

    const response = await api.get(`/quiz/questions?${params.toString()}`);

    set({
      questions: response.data.data,
      category: categoryId,
      topic: topicId,
      isStarted: true,
      isFinished: false,
      isLoading: false,
      answers: [],
      result: null,
    });
  },

  answerQuestion: (questionId, index, time) => set((state) => ({
    answers: [...state.answers, { questionId, selectedIndex: index, timeTaken: time }]
  })),

  nextQuestion: () => set((state) => ({
    currentQuestionIndex: state.currentQuestionIndex + 1
  })),

  finishQuiz: (result) => set({ isFinished: true, isStarted: false, result }),

  resetQuiz: () => set({
    questions: [],
    answers: [],
    currentQuestionIndex: 0,
    isStarted: false,
    isFinished: false,
    result: null,
    category: null,
    topic: null,
    quizMode: null,
    isLoading: false,
  })
}));
