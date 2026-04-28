import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuizStore } from '../store/useQuizStore';
import { api } from '../lib/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuizPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get('mode') || 'quick';
  const category = searchParams.get('category') || '';
  const topic = searchParams.get('topic') || '';
  const count = searchParams.get('count') || '10';

  const { questions, startQuiz, nextQuestion, answerQuestion, currentQuestionIndex, isStarted } = useQuizStore();
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    // If the store already has questions loaded (e.g. from startTopicPractice), don't re-fetch
    if (isStarted && questions.length > 0) {
      setIsLoading(false);
      return;
    }

    // If no questions and not started, fetch from API with ALL query params
    if (!isStarted && questions.length === 0) {
      const fetchQuestions = async () => {
        try {
          const params = new URLSearchParams({ mode });
          if (category) params.set('category', category);
          if (topic) params.set('topic', topic);
          if (count) params.set('count', count);

          const { data } = await api.get(`/quiz/questions?${params.toString()}`);
          startQuiz(data.data);
        } catch (err) {
          toast.error('Failed to load questions');
          navigate('/categories');
        } finally {
          setIsLoading(false);
        }
      };
      fetchQuestions();
    } else {
      setIsLoading(false);
    }
  }, [mode, category, topic, count, startQuiz, isStarted, questions.length, navigate]);

  const currentQ = questions[currentQuestionIndex];

  useEffect(() => {
    if (currentQ && selectedOption === null) {
      setTimeLeft(currentQ.timeLimit || 30);
    }
  }, [currentQuestionIndex, currentQ, selectedOption]);

  useEffect(() => {
    if (timeLeft > 0 && selectedOption === null && currentQ) {
      const timerId = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0 && selectedOption === null && currentQ) {
      handleComplete(null);
    }
  }, [timeLeft, selectedOption, currentQ]);

  const handleComplete = useCallback(async (optionIndex: number | null) => {
    if (selectedOption !== null) return;

    setSelectedOption(optionIndex);
    const timeTaken = (currentQ?.timeLimit || 30) - timeLeft;
    answerQuestion(currentQ._id, optionIndex ?? -1, timeTaken);

    setTimeout(async () => {
      if (currentQuestionIndex < questions.length - 1) {
        setSelectedOption(null);
        nextQuestion();
      } else {
        setIsLoading(true);
        try {
          const finalAnswers = useQuizStore.getState().answers;
          const submitCategory = category || useQuizStore.getState().category || 'mixed';
          const submitTopic = topic || useQuizStore.getState().topic || undefined;
          const { data } = await api.post('/quiz/submit', {
            mode,
            category: submitCategory,
            topic: submitTopic,
            answers: finalAnswers
          });
          useQuizStore.getState().finishQuiz(data.data);
          navigate('/result');
        } catch (err) {
          toast.error('Failed to submit quiz');
        }
      }
    }, 1000);
  }, [selectedOption, currentQ, timeLeft, currentQuestionIndex, questions.length, answerQuestion, nextQuestion, category, topic, mode, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-navy flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-violet border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm animate-pulse">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (!currentQ) return null;

  const progressPct = ((currentQuestionIndex + 1) / questions.length) * 100;
  const timerPct = (timeLeft / (currentQ.timeLimit || 30)) * 100;
  const timerColor = timeLeft <= 10 ? '#EF4444' : timeLeft <= 20 ? '#F59E0B' : '#7C3AED';

  return (
    <div className="min-h-screen bg-brand-navy text-white font-inter flex flex-col">
      {/* Progress bar at top */}
      <div className="h-1 bg-gray-800 w-full">
        <motion.div
          className="h-full bg-gradient-to-r from-brand-violet to-fuchsia-500"
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="flex-1 flex flex-col p-4 md:p-8">
        <div className="max-w-3xl w-full mx-auto flex-1 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-800/60 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium border border-gray-700/50 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-brand-violet animate-pulse" />
              {currentQ.category?.toUpperCase()} • {currentQ.topic}
            </motion.div>
            <div className="font-space font-bold text-lg">
              <span className="text-brand-violet">{currentQuestionIndex + 1}</span>
              <span className="text-gray-500"> / {questions.length}</span>
            </div>
          </div>

          {/* Timer */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#1f2937" strokeWidth="6" />
                <motion.circle
                  cx="50" cy="50" r="42"
                  fill="none"
                  stroke={timerColor}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={264}
                  animate={{ strokeDashoffset: 264 - (264 * timerPct / 100) }}
                  transition={{ duration: 0.5 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-space font-bold" style={{ color: timerColor }}>{timeLeft}</span>
              </div>
            </div>
          </div>

          {/* Question Area */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="bg-gray-800/40 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-gray-700/50 mb-6 relative overflow-hidden"
              >
                {/* Decorative corner gradient */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-brand-violet/10 to-transparent rounded-bl-full pointer-events-none" />

                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    currentQ.difficulty === 'easy' ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-700/50' :
                    currentQ.difficulty === 'medium' ? 'bg-amber-900/50 text-amber-400 border border-amber-700/50' :
                    'bg-red-900/50 text-red-400 border border-red-700/50'
                  }`}>
                    {currentQ.difficulty?.toUpperCase()}
                  </span>
                </div>

                <h2 className="text-xl md:text-2xl font-medium leading-relaxed mb-8">
                  {currentQ.text}
                </h2>

                <div className="space-y-3">
                  {currentQ.options.map((option: string, idx: number) => {
                    const isSelected = selectedOption === idx;
                    return (
                      <motion.button
                        key={idx}
                        onClick={() => handleComplete(idx)}
                        disabled={selectedOption !== null}
                        whileHover={selectedOption === null ? { scale: 1.01, x: 4 } : {}}
                        whileTap={selectedOption === null ? { scale: 0.99 } : {}}
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                          isSelected
                            ? 'bg-brand-violet/20 border-brand-violet text-white shadow-[0_0_20px_rgba(124,58,237,0.15)]'
                            : 'bg-gray-900/50 border-gray-700/50 hover:border-gray-500 hover:bg-gray-800/80'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-space font-bold mr-4 text-sm transition-colors ${
                            isSelected
                              ? 'bg-brand-violet text-white'
                              : 'bg-gray-800 text-gray-400'
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </div>
                          <span className="text-lg">{option}</span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer controls */}
          <div className="flex justify-between items-center py-4">
            <button
              onClick={() => handleComplete(null)}
              disabled={selectedOption !== null}
              className="text-gray-500 hover:text-gray-300 px-4 py-2 font-medium transition-colors disabled:opacity-30 text-sm"
            >
              Skip →
            </button>
            <div className="flex gap-1.5">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i < currentQuestionIndex ? 'bg-brand-violet' :
                    i === currentQuestionIndex ? 'bg-white' :
                    'bg-gray-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
