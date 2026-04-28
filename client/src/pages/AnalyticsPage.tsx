import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar,
} from 'recharts';
import { AlertCircle, TrendingUp, Zap, Target, Trophy, BarChart3, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const tooltipStyle = {
  backgroundColor: 'rgba(15,23,42,0.95)',
  border: '1px solid rgba(124,58,237,0.3)',
  borderRadius: '12px',
  color: '#fff',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
};

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<any>(null);
  const [weakAreas, setWeakAreas] = useState<any[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<any[]>([]);
  const [topicHeatmap, setTopicHeatmap] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [ov, wa, cb, th] = await Promise.all([
          api.get('/analytics/overview'),
          api.get('/analytics/weak-areas'),
          api.get('/analytics/category-breakdown'),
          api.get('/analytics/topic-heatmap'),
        ]);
        setOverview(ov.data.data);
        setWeakAreas(wa.data.data);
        setCategoryBreakdown(cb.data.data);
        setTopicHeatmap(th.data.data);
      } catch (e) {} finally { setIsLoading(false); }
    };
    fetchAll();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-navy flex flex-col items-center justify-center gap-3">
        <motion.div className="relative w-12 h-12" animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
          <div className="absolute inset-0 rounded-full border-4 border-brand-violet/20" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-violet" />
        </motion.div>
        <p className="text-gray-500 text-sm">Crunching your data…</p>
      </div>
    );
  }

  const radarData = categoryBreakdown.map((c: any) => ({
    category: c.category.charAt(0).toUpperCase() + c.category.slice(1),
    accuracy: c.accuracy,
    fullMark: 100,
  }));

  const overviewStats = overview ? [
    { icon: <Zap className="w-5 h-5 text-brand-gold" />, label: 'Total XP', value: overview.totalXP?.toLocaleString(), gradient: 'from-amber-500/10 to-orange-500/5', border: 'border-amber-500/20' },
    { icon: <Target className="w-5 h-5 text-brand-emerald" />, label: 'Accuracy', value: `${overview.accuracy}%`, gradient: 'from-emerald-500/10 to-teal-500/5', border: 'border-emerald-500/20' },
    { icon: <Trophy className="w-5 h-5 text-brand-violet" />, label: 'Quizzes', value: overview.totalQuizzes, gradient: 'from-violet-500/10 to-fuchsia-500/5', border: 'border-violet-500/20' },
    { icon: <BarChart3 className="w-5 h-5 text-blue-400" />, label: 'Correct', value: `${overview.totalCorrect}/${overview.totalAttempted}`, gradient: 'from-blue-500/10 to-indigo-500/5', border: 'border-blue-500/20' },
  ] : [];

  return (
    <div className="min-h-screen bg-brand-navy text-white p-4 md:p-8 font-inter relative noise-overlay">
      {/* Ambient */}
      <div className="absolute top-0 left-0 right-0 h-[350px] bg-gradient-to-b from-brand-violet/6 to-transparent pointer-events-none" />
      <div className="absolute top-24 right-[10%] w-[400px] h-[200px] bg-brand-emerald/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-1">
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
              <Sparkles className="w-7 h-7 text-brand-gold" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-space font-bold gradient-text">Analytics</h1>
          </div>
          <p className="text-gray-500 text-sm ml-10">Your performance at a glance</p>
        </motion.div>

        {/* ─── Overview Stats ─── */}
        {overview && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {overviewStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className={`bg-gradient-to-br ${stat.gradient} p-5 rounded-2xl border ${stat.border} text-center backdrop-blur-sm cursor-default transition-all duration-300`}
              >
                <div className="flex justify-center mb-2">{stat.icon}</div>
                <p className="text-2xl font-space font-bold">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* ─── XP Timeline ─── */}
        {overview?.xpTimeline && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 relative overflow-hidden"
          >
            <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -skew-x-12" animate={{ x: ['-200%', '200%'] }} transition={{ duration: 5, repeat: Infinity, repeatDelay: 4 }} />
            <h2 className="text-lg font-space font-bold mb-5 flex items-center gap-2 relative z-10">
              <TrendingUp className="w-5 h-5 text-brand-violet" /> XP Over Last 30 Days
            </h2>
            <div className="relative z-10">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={overview.xpTimeline}>
                  <defs>
                    <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(55,65,81,0.3)" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6b7280' }} tickFormatter={(v: string) => v.slice(5)} />
                  <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="xp" stroke="#7C3AED" strokeWidth={2.5} dot={false} fill="url(#xpGradient)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* ─── Radar + Bar row ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar Chart */}
          {radarData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-6"
            >
              <h2 className="text-lg font-space font-bold mb-4">Category Performance</h2>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(55,65,81,0.4)" />
                  <PolarAngleAxis dataKey="category" tick={{ fill: '#d1d5db', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#4b5563', fontSize: 10 }} />
                  <Radar name="Accuracy" dataKey="accuracy" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.25} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Bar Chart */}
          {topicHeatmap.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card p-6"
            >
              <h2 className="text-lg font-space font-bold mb-4">Topic-wise Accuracy</h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={topicHeatmap}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.9} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.4} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(55,65,81,0.3)" />
                  <XAxis dataKey="topic" tick={{ fontSize: 9, fill: '#6b7280' }} angle={-25} textAnchor="end" height={70} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#6b7280' }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="accuracy" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </div>

        {/* ─── Weak Areas ─── */}
        {weakAreas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card p-6"
          >
            <h2 className="text-lg font-space font-bold mb-5 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-brand-crimson" /> Weak Areas
            </h2>
            <div className="space-y-3">
              {weakAreas.map((area: any, i: number) => (
                <motion.div
                  key={area.topic}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.08 }}
                  whileHover={{ x: 4 }}
                  className="group bg-brand-crimson/5 hover:bg-brand-crimson/10 p-5 rounded-2xl border border-brand-crimson/15 hover:border-brand-crimson/30 flex items-center justify-between transition-all duration-300 cursor-default"
                >
                  <div>
                    <p className="font-semibold">
                      {area.topic}{' '}
                      <span className="text-xs text-gray-500 font-normal">({area.category})</span>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{area.suggestion}</p>
                  </div>
                  <div className="text-right ml-4 shrink-0">
                    <p className="text-xl font-bold text-brand-crimson">{area.accuracy}%</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(`/quiz?mode=topic&topic=${area.topic}`)}
                      className="text-xs text-brand-violet hover:text-fuchsia-400 font-medium mt-1 transition-colors"
                    >
                      Practice Now →
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="h-16" />
      </div>
    </div>
  );
}
