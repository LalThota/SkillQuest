import { useParams, useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../lib/constants';
import { motion } from 'framer-motion';
import { Zap, ClipboardList, Gamepad2, ArrowLeft } from 'lucide-react';
import { useQuizStore } from '../store/useQuizStore';

export default function ModeSelectPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const cat = CATEGORIES.find(c => c.id === id);

  if (!cat) return <div className="min-h-screen bg-brand-navy flex items-center justify-center text-white">Category not found</div>;

  const modes = [
    {
      key: 'quick',
      icon: <Zap className="w-8 h-8" />,
      title: '⚡ Quick Test',
      desc: '10 questions • ~8 minutes • Timed',
      btnLabel: 'START NOW',
      gradient: 'from-violet-600 to-indigo-600',
      action: () => { useQuizStore.getState().resetQuiz(); navigate(`/quiz?mode=quick&category=${cat.id}`); },
    },
    {
      key: 'full',
      icon: <ClipboardList className="w-8 h-8" />,
      title: '📋 Full Test',
      desc: '30 questions • ~30 minutes • Timed + Rank',
      btnLabel: 'START TEST',
      gradient: 'from-gray-700 to-gray-800',
      action: () => { useQuizStore.getState().resetQuiz(); navigate(`/quiz?mode=full&category=${cat.id}&count=30`); },
    },
    ...(cat.hasGameMode ? [{
      key: 'game',
      icon: <Gamepad2 className="w-8 h-8" />,
      title: '🎮 Game Mode',
      desc: 'Puzzle Play • Unlimited time • Lives system',
      btnLabel: 'PLAY NOW',
      gradient: 'from-red-600 to-orange-600',
      action: () => { useQuizStore.getState().resetQuiz(); navigate(`/game/${cat.id}`); },
    }] : []),
  ];

  return (
    <div className="min-h-screen bg-brand-navy text-white p-4 md:p-8 font-inter">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/categories')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to categories
        </button>

        <div className="flex items-center gap-4 mb-8">
          <span className="text-5xl">{cat.icon}</span>
          <div>
            <h1 className="text-3xl font-space font-bold">{cat.label}</h1>
            <p className="text-gray-400">{cat.description}</p>
          </div>
        </div>

        {/* Mode Cards */}
        <h2 className="text-lg font-space font-bold mb-4">Choose Your Mode</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {modes.map((m, i) => (
            <motion.div
              key={m.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className={`bg-gradient-to-br ${m.gradient} p-6 rounded-2xl border border-white/10 flex flex-col justify-between min-h-[220px]`}
            >
              <div>
                <div className="text-white/80 mb-3">{m.icon}</div>
                <h3 className="text-xl font-bold mb-2">{m.title}</h3>
                <p className="text-white/60 text-sm">{m.desc}</p>
              </div>
              <button
                onClick={m.action}
                className="mt-4 w-full py-2.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-xl text-sm font-bold tracking-wide transition-colors border border-white/10"
              >
                {m.btnLabel}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Topic-Wise Practice */}
        <h2 className="text-lg font-space font-bold mb-4">Practice by Topic</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {cat.topics.map((topic, i) => (
            <motion.button
              key={topic}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.04 }}
              onClick={() => navigate(`/practice/${cat.id}/${encodeURIComponent(topic)}`)}
              className="bg-gray-800/50 hover:bg-gray-800/80 border border-gray-700/50 rounded-xl p-4 text-left transition-all group"
              style={{ borderColor: `${cat.color}15` }}
            >
              <p className="font-medium text-sm group-hover:text-white text-gray-300 mb-1">{topic}</p>
              <p className="text-xs text-gray-600">Practice →</p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
