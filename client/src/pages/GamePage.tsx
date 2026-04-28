import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Flame, Timer, ArrowLeft, RefreshCw, Home, BarChart3 } from 'lucide-react';
import { getRandomPuzzles, Puzzle } from '../lib/puzzleData';
import { CATEGORIES } from '../lib/constants';
import { api } from '../lib/api';

const TOTAL_PUZZLES = 15;
const INITIAL_LIVES = 3;

export default function GamePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const category = CATEGORIES.find(c => c.id === id);

  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [gameState, setGameState] = useState<'playing' | 'over' | 'complete'>('playing');
  const [elapsed, setElapsed] = useState(0);
  const [screenShake, setScreenShake] = useState(false);
  const [crtFlash, setCrtFlash] = useState(true);

  // CRT boot flash
  useEffect(() => {
    const t = setTimeout(() => setCrtFlash(false), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setPuzzles(getRandomPuzzles(TOTAL_PUZZLES));
  }, []);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const timer = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(timer);
  }, [gameState]);

  const currentPuzzle = puzzles[currentIdx];

  const streakMultiplier = streak >= 5 ? 5 : streak >= 3 ? 3 : streak >= 2 ? 2 : 1;

  const handleSelect = useCallback((idx: number) => {
    if (selectedOption !== null || !currentPuzzle) return;
    setSelectedOption(idx);

    const isCorrect = idx === currentPuzzle.correctIndex;
    setFeedback(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      const pts = currentPuzzle.xpReward * streakMultiplier;
      setScore(s => s + pts);
      setStreak(s => s + 1);
    } else {
      setStreak(0);
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 300);
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives <= 0) {
        setTimeout(() => setGameState('over'), 1000);
        return;
      }
    }

    setTimeout(() => {
      setSelectedOption(null);
      setFeedback(null);
      if (currentIdx + 1 >= puzzles.length) {
        setGameState('complete');
      } else {
        setCurrentIdx(i => i + 1);
      }
    }, 1300);
  }, [selectedOption, currentPuzzle, currentIdx, lives, streakMultiplier, puzzles.length]);

  const submitGameSession = async () => {
    try {
      const accuracy = puzzles.length > 0 ? Math.round((score / (puzzles.length * 20)) * 100) : 0;
      await api.post('/game/submit-session', {
        categoryId: id,
        puzzlesAttempted: currentIdx + (gameState === 'complete' ? 1 : 0),
        puzzlesCorrect: Math.round(((currentIdx + 1) * accuracy) / 100),
        livesLost: INITIAL_LIVES - lives,
        finalScore: score,
        accuracy,
        timeElapsed: elapsed,
      });
    } catch (_) { /* silent fail */ }
  };

  useEffect(() => {
    if (gameState === 'over' || gameState === 'complete') {
      submitGameSession();
    }
  }, [gameState]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const restart = () => {
    setPuzzles(getRandomPuzzles(TOTAL_PUZZLES));
    setCurrentIdx(0);
    setLives(INITIAL_LIVES);
    setScore(0);
    setStreak(0);
    setElapsed(0);
    setSelectedOption(null);
    setFeedback(null);
    setGameState('playing');
    setCrtFlash(true);
    setTimeout(() => setCrtFlash(false), 200);
  };

  const accuracy = currentIdx > 0 ? Math.round((score / (currentIdx * 20)) * 100) : 0;
  const starRating = accuracy >= 85 ? 3 : accuracy >= 60 ? 2 : 1;

  // === GAME OVER / COMPLETE ===
  if (gameState === 'over' || gameState === 'complete') {
    const isComplete = gameState === 'complete';
    return (
      <div className="min-h-screen flex items-center justify-center text-white p-4 game-bg">
        {/* Scanlines */}
        <div className="fixed inset-0 pointer-events-none game-scanlines z-10" />
        {gameState === 'over' && <div className="fixed inset-0 bg-red-900/20 pointer-events-none z-0" />}

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-20 bg-[#0D1117] rounded-2xl p-10 text-center max-w-md w-full border-2"
          style={{ borderColor: isComplete ? '#00FF88' : '#FF0080', boxShadow: `0 0 40px ${isComplete ? 'rgba(0,255,136,0.3)' : 'rgba(255,0,128,0.3)'}` }}
        >
          <div className="text-5xl mb-4">{isComplete ? '🏆' : '💀'}</div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Press Start 2P', cursive", fontSize: isComplete ? '16px' : '20px' }}>
            {isComplete ? 'QUEST COMPLETE!' : 'GAME OVER'}
          </h1>
          <p className="text-gray-400 text-sm mb-6 font-[Orbitron]">{isComplete ? 'All puzzles conquered!' : 'You ran out of lives.'}</p>

          {isComplete && (
            <div className="text-3xl mb-4">{Array.from({ length: 3 }).map((_, i) => <span key={i} className={i < starRating ? '' : 'opacity-20'}>⭐</span>)}</div>
          )}

          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="bg-[#1A2332] p-4 rounded-xl border border-[#00CFFF]/30">
              <p className="text-xl font-bold" style={{ fontFamily: "'Orbitron'", color: '#00FF88' }}>{score}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider" style={{ fontFamily: "'Press Start 2P'" }}>PTS</p>
            </div>
            <div className="bg-[#1A2332] p-4 rounded-xl border border-[#00CFFF]/30">
              <p className="text-xl font-bold font-[Orbitron]">{currentIdx}/{puzzles.length}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider" style={{ fontFamily: "'Press Start 2P'" }}>SOLVED</p>
            </div>
            <div className="bg-[#1A2332] p-4 rounded-xl border border-[#00CFFF]/30">
              <p className="text-xl font-bold font-[Orbitron]" style={{ color: '#00FF88' }}>{accuracy}%</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider" style={{ fontFamily: "'Press Start 2P'" }}>ACC</p>
            </div>
            <div className="bg-[#1A2332] p-4 rounded-xl border border-[#00CFFF]/30">
              <p className="text-xl font-bold font-[Orbitron]">{formatTime(elapsed)}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider" style={{ fontFamily: "'Press Start 2P'" }}>TIME</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button onClick={restart} className="w-full py-3 rounded-xl font-bold text-sm transition-all border-2 border-[#00CFFF] text-[#00CFFF] hover:bg-[#00CFFF]/10">
              🎮 PLAY AGAIN
            </button>
            {isComplete && (
              <button onClick={() => navigate('/analytics')} className="w-full py-3 rounded-xl font-bold text-sm transition-all border-2 border-[#00FF88] text-[#00FF88] hover:bg-[#00FF88]/10">
                <BarChart3 className="w-4 h-4 inline mr-2" />VIEW STATS
              </button>
            )}
            <button onClick={() => navigate('/categories')} className="w-full py-3 rounded-xl font-bold text-sm transition-all border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800">
              <Home className="w-4 h-4 inline mr-2" />DASHBOARD
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentPuzzle) {
    return (
      <div className="min-h-screen flex items-center justify-center game-bg">
        <div className="w-8 h-8 border-4 border-[#00CFFF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // === MAIN GAME UI ===
  return (
    <div className={`min-h-screen flex flex-col text-white game-bg ${screenShake ? 'animate-screen-shake' : ''}`}>
      {/* CRT flash */}
      {crtFlash && <div className="fixed inset-0 bg-white z-50 animate-pulse" />}
      {/* Scanlines overlay */}
      <div className="fixed inset-0 pointer-events-none game-scanlines z-10" />

      {/* HUD */}
      <div className="relative z-20 flex items-center justify-between px-4 md:px-8 py-3 bg-[#0D1117]/90 backdrop-blur-sm border-b-2 border-[#1A2332]"
        style={{ fontFamily: "'Press Start 2P', cursive" }}
      >
        <button onClick={() => navigate('/categories')} className="text-gray-500 hover:text-[#00CFFF] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Lives */}
        <div className="flex items-center gap-0.5">
          {Array.from({ length: INITIAL_LIVES }).map((_, i) => (
            <motion.span
              key={i}
              animate={i >= lives ? { scale: [1, 1.3, 0], opacity: [1, 1, 0] } : { scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="text-lg"
            >
              {i < lives ? '❤️' : '🖤'}
            </motion.span>
          ))}
        </div>

        {/* Puzzle Counter */}
        <span className="text-[10px] text-[#00CFFF]">
          PUZZLE {String(currentIdx + 1).padStart(2, '0')}/{String(puzzles.length).padStart(2, '0')}
        </span>

        {/* Score */}
        <div className="flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-[#00FF88]" />
          <motion.span key={score} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className="text-[11px] text-[#00FF88]">{score}</motion.span>
          <span className="text-[8px] text-gray-600">PTS</span>
        </div>

        {/* Streak */}
        {streak > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1"
            style={{ filter: streak >= 3 ? `drop-shadow(0 0 6px #FF8800)` : 'none' }}
          >
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span className="text-[10px] text-orange-400">×{streakMultiplier}</span>
          </motion.div>
        )}

        {/* Timer */}
        <div className="flex items-center gap-1">
          <Timer className="w-3.5 h-3.5 text-gray-500" />
          <span className="text-[10px] text-gray-400">{formatTime(elapsed)}</span>
        </div>
      </div>

      {/* Puzzle Area */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPuzzle.id}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-xl"
          >
            {/* Prompt */}
            <h2 className="text-center mb-8 text-[#E0E0FF] font-medium" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '15px', letterSpacing: '1px' }}>
              {currentPuzzle.prompt}
            </h2>

            {/* Sequence display */}
            {currentPuzzle.sequence && (
              <div className="flex items-center justify-center gap-3 mb-10 flex-wrap">
                {currentPuzzle.sequence.map((val, i) => (
                  <div
                    key={i}
                    className={`w-16 h-16 rounded-lg flex items-center justify-center font-bold text-xl border-2 ${
                      val === null
                        ? 'border-dashed border-[#FF0080] bg-[#FF0080]/10 text-[#FF0080] animate-pulse'
                        : 'border-[#1A2332] bg-[#0D1117] text-[#E0E0FF]'
                    }`}
                    style={{ fontFamily: "'Orbitron'" }}
                  >
                    {val === null ? '?' : val}
                  </div>
                ))}
              </div>
            )}

            {/* Matrix display */}
            {currentPuzzle.grid && (
              <div className="flex justify-center mb-10">
                <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${currentPuzzle.grid[0].length}, 1fr)` }}>
                  {currentPuzzle.grid.flat().map((val, i) => (
                    <div
                      key={i}
                      className={`w-16 h-16 rounded-lg flex items-center justify-center font-bold text-lg border-2 ${
                        val === null
                          ? 'border-dashed border-[#FF0080] bg-[#FF0080]/10 text-[#FF0080] animate-pulse'
                          : 'border-[#00CFFF]/30 bg-[#0D1117] text-[#E0E0FF]'
                      }`}
                      style={{ fontFamily: "'Orbitron'" }}
                    >
                      {val === null ? '?' : val}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Options (tap to select — works on both desktop and mobile) */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {currentPuzzle.options.map((opt, idx) => {
                const isCorrectTile = selectedOption !== null && idx === currentPuzzle.correctIndex;
                const isWrongTile = selectedOption === idx && idx !== currentPuzzle.correctIndex;
                const isIdle = selectedOption === null;

                return (
                  <motion.button
                    key={idx}
                    whileHover={isIdle ? { scale: 1.08, y: -4 } : undefined}
                    whileTap={isIdle ? { scale: 0.95 } : undefined}
                    animate={
                      isWrongTile ? { x: [0, -10, 10, -10, 10, 0] } :
                      isCorrectTile ? { scale: [1, 1.15, 1] } : {}
                    }
                    transition={{ duration: 0.5 }}
                    onClick={() => handleSelect(idx)}
                    disabled={selectedOption !== null}
                    className={`relative p-5 rounded-xl font-bold text-lg transition-all border-2 disabled:cursor-default ${
                      isCorrectTile
                        ? 'border-[#00FF88] bg-[#00FF88]/15 text-[#00FF88]'
                        : isWrongTile
                        ? 'border-[#FF0080] bg-[#FF0080]/15 text-[#FF0080]'
                        : 'border-[#1A2332] bg-[#0D1117] text-[#E0E0FF] hover:border-[#00CFFF]/60 hover:shadow-[0_0_25px_rgba(0,207,255,0.3)] cursor-pointer'
                    }`}
                    style={{
                      fontFamily: "'Orbitron'",
                      boxShadow: isCorrectTile ? '0 0 30px rgba(0,255,136,0.5)' : isWrongTile ? '0 0 20px rgba(255,0,128,0.4)' : undefined,
                    }}
                  >
                    {opt}
                    {/* Floating XP */}
                    {selectedOption === idx && feedback === 'correct' && (
                      <motion.span
                        initial={{ opacity: 1, y: 0 }}
                        animate={{ opacity: 0, y: -40 }}
                        transition={{ duration: 1 }}
                        className="absolute -top-3 right-2 text-sm font-bold"
                        style={{ color: '#00FF88', fontFamily: "'Press Start 2P'" }}
                      >
                        +{currentPuzzle.xpReward * streakMultiplier}
                      </motion.span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation reveal */}
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-4 rounded-xl text-center border"
                style={{
                  borderColor: feedback === 'correct' ? '#00FF8840' : '#FF008040',
                  backgroundColor: feedback === 'correct' ? '#00FF8808' : '#FF008008',
                }}
              >
                <p className="text-sm" style={{ fontFamily: "'Orbitron'", color: '#E0E0FF' }}>
                  {currentPuzzle.explanation}
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
