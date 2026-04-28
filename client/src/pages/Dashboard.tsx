import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useUserStore } from '../store/useUserStore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Star, Target, Zap, Trophy, TrendingUp, Gamepad2, ClipboardList, ChevronRight, Sparkles } from 'lucide-react';

/* ─── Animated counter ─── */
function AnimCounter({ value }: { value: number }) {
  return <span>{value.toLocaleString()}</span>;
}

/* ─── Floating particles ─── */
function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            background: `hsla(${260 + Math.random() * 60}, 70%, 60%, ${Math.random() * 0.3 + 0.08})`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{ y: [0, -(Math.random() * 30 + 15), 0], opacity: [0.15, 0.5, 0.15] }}
          transition={{ duration: Math.random() * 4 + 3, repeat: Infinity, delay: Math.random() * 2 }}
        />
      ))}
    </div>
  );
}

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const { stats, fetchStats } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (!user || (!stats && useUserStore.getState().isLoading)) {
    return (
      <div className="min-h-screen bg-brand-navy flex flex-col items-center justify-center gap-3">
        <motion.div className="relative w-12 h-12" animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
          <div className="absolute inset-0 rounded-full border-4 border-brand-violet/20" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-violet" />
        </motion.div>
        <p className="text-gray-500 text-sm">Loading your quest…</p>
      </div>
    );
  }

  const nextLvlXp = 1000;
  const progress = Math.min(((stats?.xp || 0) % nextLvlXp) / nextLvlXp * 100, 100);

  const quickActions = [
    {
      label: 'Quick Test',
      sub: '10 Qs • Mixed',
      icon: <Zap className="w-5 h-5" />,
      gradient: 'from-brand-violet to-fuchsia-600',
      glow: 'shadow-[0_0_25px_rgba(124,58,237,0.2)]',
      onClick: () => navigate('/quiz?mode=quick'),
    },
    {
      label: 'Mock Test',
      sub: '30 Qs • Pick category',
      icon: <ClipboardList className="w-5 h-5" />,
      gradient: 'from-blue-500 to-cyan-600',
      glow: 'shadow-[0_0_25px_rgba(59,130,246,0.2)]',
      onClick: () => navigate('/categories'),
    },
    {
      label: 'Play Game',
      sub: 'Puzzles • Brain teasers',
      icon: <Gamepad2 className="w-5 h-5" />,
      gradient: 'from-red-500 to-rose-600',
      glow: 'shadow-[0_0_25px_rgba(239,68,68,0.2)]',
      onClick: () => navigate('/game/puzzles'),
    },
  ];

  const statCards = [
    { icon: <Target className="w-8 h-8 text-brand-emerald" />, value: `${stats?.accuracy || 0}%`, label: 'Accuracy', color: 'from-emerald-500/10 to-teal-500/5', border: 'border-emerald-500/20' },
    { icon: <Trophy className="w-8 h-8 text-yellow-500" />, value: stats?.totalQuizzes || 0, label: 'Quizzes Done', color: 'from-yellow-500/10 to-amber-500/5', border: 'border-yellow-500/20' },
    { icon: <TrendingUp className="w-8 h-8 text-blue-400" />, value: stats?.totalCorrect || 0, label: 'Correct Answers', color: 'from-blue-500/10 to-indigo-500/5', border: 'border-blue-500/20' },
  ];

  return (
    <div className="min-h-screen bg-brand-navy p-4 md:p-8 text-white font-inter relative noise-overlay">
      <Particles />

      {/* Hero gradient */}
      <div className="absolute top-0 left-0 right-0 h-[350px] bg-gradient-to-b from-brand-violet/6 to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        {/* ─── Quick Launch ─── */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card p-6"
        >
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-violet" /> Quick Launch
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {quickActions.map((action, i) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={action.onClick}
                className={`group flex items-center gap-3 p-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-300 ${action.glow} hover:shadow-none relative overflow-hidden`}
              >
                {/* Shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-shimmer pointer-events-none" />
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-white shadow-lg relative z-10 shrink-0`}>
                  {action.icon}
                </div>
                <div className="text-left relative z-10">
                  <p className="font-semibold text-sm text-white">{action.label}</p>
                  <p className="text-xs text-gray-500">{action.sub}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ─── Welcome ─── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2
}}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-space font-bold">
              Welcome back, <span className="gradient-text">{user?.username}</span>! 🎮
            </h1>
            <p className="text-gray-500 mt-1">Ready for today's challenge?</p>
          </div>
          <div className="flex gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 glass-card px-4 py-2.5 cursor-default"
            >
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="font-bold text-lg">{stats?.streak?.current || 0}</span>
              <span className="text-sm text-gray-500">Streak</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-brand-violet/10 border border-brand-violet/20 px-4 py-2.5 rounded-3xl cursor-default"
            >
              <Star className="w-5 h-5 text-brand-gold fill-brand-gold" />
              <span className="font-bold text-lg">Lvl {stats?.level || 1}</span>
            </motion.div>
          </div>
        </motion.div>

        {/* ─── XP Progress ─── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 relative overflow-hidden"
        >
          {/* Shimmer */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -skew-x-12"
            animate={{ x: ['-200%', '200%'] }}
            transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 }}
          />
          <div className="flex justify-between items-end mb-3 relative z-10">
            <div>
              <p className="text-sm tracking-wider text-gray-500 font-medium uppercase mb-1">Current XP</p>
              <div className="text-3xl font-space font-bold">
                <span className="text-brand-gold"><AnimCounter value={stats?.xp || 0} /></span>
                <span className="text-lg text-gray-600 ml-1">XP</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Next Level</p>
              <div className="font-mono text-sm text-gray-400">{Math.floor((stats?.xp || 0) % nextLvlXp)} / {nextLvlXp}</div>
            </div>
          </div>
          <div className="h-4 bg-gray-900/80 rounded-full overflow-hidden border border-gray-800/50 relative z-10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
              className="h-full bg-gradient-to-r from-brand-violet via-fuchsia-500 to-brand-gold rounded-full relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </motion.div>
          </div>
        </motion.div>

        {/* ─── Stats Cards ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {statCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className={`bg-gradient-to-br ${card.color} rounded-3xl p-6 border ${card.border} flex flex-col items-center justify-center text-center backdrop-blur-sm cursor-default transition-all duration-300`}
            >
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
                className="mb-3"
              >
                {card.icon}
              </motion.div>
              <div className="text-3xl font-space font-bold">{card.value}</div>
              <p className="text-gray-500 mt-1 text-sm">{card.label}</p>
            </motion.div>
          ))}
        </div>

        {/* ─── Practice CTAs ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-xl font-space font-bold pt-4 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-brand-violet" /> Start Practicing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/quiz?mode=quick')}
              className="group relative overflow-hidden bg-gradient-to-br from-brand-violet to-indigo-600 p-6 rounded-3xl hover:shadow-[0_0_40px_rgba(124,58,237,0.25)] transition-all duration-300"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-shimmer" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">Quick Practice</h3>
                  <p className="text-indigo-200 text-sm">10 mixed questions. Perfect for a short session.</p>
                </div>
                <ChevronRight className="w-5 h-5 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/quiz?mode=full')}
              className="group relative overflow-hidden glass-card-hover p-6 transition-all duration-300"
            >
              <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-shimmer" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="bg-gray-700/50 p-3 rounded-2xl">
                  <Target className="w-8 h-8 text-brand-emerald" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">Full Mock Test</h3>
                  <p className="text-gray-400 text-sm">20 mixed questions to test your endurance.</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
            </motion.button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
