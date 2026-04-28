import { useEffect, useState, useMemo } from 'react';
import { api } from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown,
  Medal,
  Award,
  Flame,
  Zap,
  TrendingUp,
  ChevronUp,
  ChevronDown,
  Star,
  Sparkles,
  Users,
  Target,
} from 'lucide-react';

/* ───────── Types ───────── */
interface RankEntry {
  rank: number;
  userId: string;
  username: string;
  avatar: string;
  xp: number;
  level: number;
  totalQuizzes: number;
}
interface MyRank {
  rank: number;
  totalUsers: number;
  xp: number;
}
type Period = 'alltime' | 'weekly' | 'monthly';

/* ───────── Helper: level title ───────── */
const levelTitle = (lvl: number) => {
  if (lvl >= 9) return 'Legend';
  if (lvl >= 7) return 'Master';
  if (lvl >= 5) return 'Expert';
  if (lvl >= 3) return 'Rising';
  return 'Rookie';
};

/* ───────── Animated Counter ───────── */
function AnimatedCounter({ value, className }: { value: number; className?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1200;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setDisplay(end); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <span className={className}>{display.toLocaleString()}</span>;
}

/* ───────── Floating particles background ───────── */
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            background: `hsla(${260 + Math.random() * 60}, 80%, 65%, ${Math.random() * 0.3 + 0.1})`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

/* ───────── Podium card (Top 3) ───────── */
function PodiumCard({ entry, position }: { entry: RankEntry; position: 1 | 2 | 3 }) {
  const configs = {
    1: {
      gradient: 'from-yellow-500/30 via-amber-500/20 to-orange-500/10',
      border: 'border-yellow-500/50',
      glow: 'shadow-[0_0_40px_rgba(234,179,8,0.25)]',
      iconColor: 'text-yellow-400',
      ring: 'ring-yellow-500/40',
      size: 'h-[280px]',
      avatarSize: 'w-20 h-20 text-4xl',
      order: 'order-2',
      delay: 0.3,
      badge: <Crown className="w-8 h-8 text-yellow-400 drop-shadow-lg" />,
    },
    2: {
      gradient: 'from-slate-400/25 via-gray-400/15 to-slate-500/10',
      border: 'border-slate-400/40',
      glow: 'shadow-[0_0_30px_rgba(148,163,184,0.2)]',
      iconColor: 'text-slate-300',
      ring: 'ring-slate-400/30',
      size: 'h-[250px]',
      avatarSize: 'w-16 h-16 text-3xl',
      order: 'order-1',
      delay: 0.4,
      badge: <Medal className="w-7 h-7 text-slate-300 drop-shadow-lg" />,
    },
    3: {
      gradient: 'from-amber-700/25 via-orange-700/15 to-amber-800/10',
      border: 'border-amber-600/40',
      glow: 'shadow-[0_0_30px_rgba(180,83,9,0.2)]',
      iconColor: 'text-amber-500',
      ring: 'ring-amber-600/30',
      size: 'h-[230px]',
      avatarSize: 'w-14 h-14 text-2xl',
      order: 'order-3',
      delay: 0.5,
      badge: <Award className="w-6 h-6 text-amber-500 drop-shadow-lg" />,
    },
  };

  const c = configs[position];

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: c.delay, type: 'spring', stiffness: 120 }}
      className={`${c.order} flex flex-col items-center justify-end ${c.size}`}
    >
      {/* Badge */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="mb-2"
      >
        {c.badge}
      </motion.div>

      {/* Avatar */}
      <motion.div
        whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
        transition={{ duration: 0.4 }}
        className={`${c.avatarSize} rounded-2xl bg-gradient-to-br ${c.gradient} ${c.border} border-2 ring-4 ${c.ring} flex items-center justify-center mb-3 backdrop-blur-sm cursor-pointer`}
      >
        {entry.avatar || '😊'}
      </motion.div>

      {/* Card */}
      <div className={`bg-gradient-to-b ${c.gradient} ${c.border} border rounded-2xl p-4 text-center w-full backdrop-blur-md ${c.glow} relative overflow-hidden`}>
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12"
          animate={{ x: ['-200%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
        />
        <p className="font-space font-bold text-base truncate relative z-10">{entry.username}</p>
        <p className={`text-xs ${c.iconColor} font-medium mt-0.5 relative z-10`}>{levelTitle(entry.level)}</p>
        <div className="flex items-center justify-center gap-1 mt-2 relative z-10">
          <Zap className={`w-4 h-4 ${c.iconColor}`} />
          <AnimatedCounter value={entry.xp} className="font-space font-bold text-lg" />
        </div>
        <p className="text-[11px] text-gray-400 mt-1 relative z-10">{entry.totalQuizzes} quizzes</p>
      </div>
    </motion.div>
  );
}

/* ───────── Tab Button ───────── */
function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
        active
          ? 'text-white'
          : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
      }`}
    >
      {active && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-gradient-to-r from-brand-violet to-fuchsia-600 rounded-xl"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
      <span className="relative z-10">{label}</span>
    </button>
  );
}

/* ───────── Rank Row (4th+) ───────── */
function RankRow({ entry, index }: { entry: RankEntry; index: number }) {
  const isTop5 = entry.rank <= 5;
  const accuracy = entry.totalQuizzes > 0
    ? Math.round((entry.totalQuizzes / Math.max(entry.totalQuizzes, 1)) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 + index * 0.04, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ x: 4, backgroundColor: 'rgba(124, 58, 237, 0.06)' }}
      className={`group flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 cursor-default relative overflow-hidden ${
        isTop5 ? 'bg-white/[0.03]' : ''
      }`}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-violet/0 via-brand-violet/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Rank */}
      <div className="w-10 text-center relative z-10">
        <span
          className={`font-space font-bold text-lg ${
            entry.rank <= 5 ? 'text-brand-violet' : 'text-gray-500'
          }`}
        >
          {entry.rank}
        </span>
      </div>

      {/* Avatar */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-700/80 to-gray-800/80 border border-gray-600/30 flex items-center justify-center text-xl relative z-10 shrink-0"
      >
        {entry.avatar || '😊'}
      </motion.div>

      {/* Info */}
      <div className="flex-1 min-w-0 relative z-10">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-white truncate">{entry.username}</p>
          {entry.rank <= 5 && (
            <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-brand-violet/20 text-brand-violet border border-brand-violet/30 font-medium">
              Top 5
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Star className="w-3 h-3 text-brand-gold" /> Lvl {entry.level}
          </span>
          <span className="text-xs text-gray-500">•</span>
          <span className="text-xs text-gray-500">{entry.totalQuizzes} quizzes</span>
          <span className="text-xs text-gray-500">•</span>
          <span className="text-xs text-gray-500">{levelTitle(entry.level)}</span>
        </div>
      </div>

      {/* XP */}
      <div className="text-right relative z-10 shrink-0">
        <div className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-brand-gold" />
          <span className="font-space font-bold text-lg text-white">
            {entry.xp.toLocaleString()}
          </span>
        </div>
        <p className="text-[11px] text-gray-500 mt-0.5">XP</p>
      </div>

      {/* Trend arrow */}
      <div className="relative z-10 shrink-0 w-6">
        {entry.rank <= 5 ? (
          <ChevronUp className="w-5 h-5 text-brand-emerald" />
        ) : entry.rank <= 10 ? (
          <TrendingUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600" />
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════ MAIN COMPONENT ═══════════ */
export default function LeaderboardPage() {
  const [rankings, setRankings] = useState<RankEntry[]>([]);
  const [myRank, setMyRank] = useState<MyRank | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<Period>('alltime');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [lb, rank] = await Promise.all([
          api.get(`/leaderboard/global?period=${period}`),
          api.get('/leaderboard/rank'),
        ]);
        setRankings(lb.data.data);
        setMyRank(rank.data.data);
      } catch (e) {
        console.error('Leaderboard fetch failed:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [period]);

  const top3 = useMemo(() => rankings.slice(0, 3), [rankings]);
  const rest = useMemo(() => rankings.slice(3), [rankings]);

  /* ───── Loading ───── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-navy flex flex-col items-center justify-center gap-4">
        <motion.div
          className="relative w-16 h-16"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute inset-0 rounded-full border-4 border-brand-violet/20" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-violet" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 text-sm font-medium"
        >
          Loading rankings…
        </motion.p>
      </div>
    );
  }

  const percentile = myRank ? Math.max(0, Math.round(100 - (myRank.rank / myRank.totalUsers) * 100)) : 0;

  return (
    <div className="min-h-screen bg-brand-navy text-white font-inter relative">
      <FloatingParticles />

      {/* ─── Hero gradient ─── */}
      <div className="absolute top-0 left-0 right-0 h-[420px] bg-gradient-to-b from-brand-violet/8 via-fuchsia-900/5 to-transparent pointer-events-none" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-violet/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 relative z-10">
        {/* ─── Header ─── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="w-8 h-8 text-brand-gold" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-space font-bold">
              <span className="bg-gradient-to-r from-brand-violet via-fuchsia-400 to-brand-gold bg-clip-text text-transparent">
                Leaderboard
              </span>
            </h1>
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="w-8 h-8 text-brand-gold" />
            </motion.div>
          </div>
          <p className="text-gray-400 text-base">Top players ranked by experience points</p>
        </motion.div>

        {/* ─── Period Tabs ─── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-10"
        >
          <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700/40 rounded-2xl p-1.5 flex gap-1">
            <TabButton label="All Time" active={period === 'alltime'} onClick={() => setPeriod('alltime')} />
            <TabButton label="Monthly" active={period === 'monthly'} onClick={() => setPeriod('monthly')} />
            <TabButton label="Weekly" active={period === 'weekly'} onClick={() => setPeriod('weekly')} />
          </div>
        </motion.div>

        {/* ─── My Rank Card ─── */}
        {myRank && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-10"
          >
            <div className="relative bg-gradient-to-r from-brand-violet/15 via-fuchsia-900/10 to-brand-violet/15 border border-brand-violet/30 rounded-3xl p-6 md:p-8 overflow-hidden backdrop-blur-md">
              {/* Shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12"
                animate={{ x: ['-200%', '200%'] }}
                transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 }}
              />

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-violet/40 to-fuchsia-600/30 border border-brand-violet/40 flex items-center justify-center">
                    <Target className="w-8 h-8 text-brand-violet" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">Your Rank</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-5xl font-space font-bold bg-gradient-to-r from-brand-violet to-fuchsia-400 bg-clip-text text-transparent">
                        #{myRank.rank}
                      </span>
                      <span className="text-gray-500 text-sm">
                        of {myRank.totalUsers} players
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-6 items-center">
                  {/* Percentile */}
                  <div className="text-center">
                    <div className="relative w-16 h-16">
                      <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="rgba(124,58,237,0.15)"
                          strokeWidth="3"
                        />
                        <motion.path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="url(#grad)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          initial={{ strokeDasharray: '0 100' }}
                          animate={{ strokeDasharray: `${percentile} 100` }}
                          transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                        />
                        <defs>
                          <linearGradient id="grad">
                            <stop offset="0%" stopColor="#7C3AED" />
                            <stop offset="100%" stopColor="#D946EF" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold font-space">{percentile}%</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">Percentile</p>
                  </div>

                  {/* XP */}
                  <div className="text-center">
                    <div className="flex items-center gap-1.5 justify-center">
                      <Zap className="w-5 h-5 text-brand-gold" />
                      <AnimatedCounter value={myRank.xp} className="text-2xl font-space font-bold text-brand-gold" />
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">Total XP</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── Stats Strip ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="grid grid-cols-3 gap-4 mb-10"
        >
          {[
            { icon: <Users className="w-5 h-5 text-brand-violet" />, value: myRank?.totalUsers || rankings.length, label: 'Players' },
            { icon: <Flame className="w-5 h-5 text-orange-500" />, value: rankings[0]?.xp || 0, label: 'Highest XP' },
            { icon: <TrendingUp className="w-5 h-5 text-brand-emerald" />, value: rankings.reduce((s, r) => s + r.totalQuizzes, 0), label: 'Total Quizzes' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-4 text-center hover:bg-gray-800/50 hover:border-gray-600/50 transition-all duration-300"
            >
              <div className="flex justify-center mb-2">{stat.icon}</div>
              <p className="text-xl font-space font-bold">
                <AnimatedCounter value={stat.value} />
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ─── Podium (Top 3) ─── */}
        {top3.length >= 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <div className="grid grid-cols-3 gap-4 items-end max-w-lg mx-auto">
              <PodiumCard entry={top3[1]} position={2} />
              <PodiumCard entry={top3[0]} position={1} />
              <PodiumCard entry={top3[2]} position={3} />
            </div>
          </motion.div>
        )}

        {/* ─── Rankings List (4th+) ─── */}
        {rest.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className="bg-gray-800/20 backdrop-blur-md border border-gray-700/30 rounded-3xl overflow-hidden">
              {/* List header */}
              <div className="flex items-center gap-4 px-6 py-3 border-b border-gray-700/30 text-xs text-gray-500 uppercase tracking-wider font-medium">
                <span className="w-10 text-center">Rank</span>
                <span className="w-12"></span>
                <span className="flex-1">Player</span>
                <span className="text-right w-24">XP</span>
                <span className="w-6"></span>
              </div>

              {/* Rows */}
              <div className="divide-y divide-gray-800/30">
                <AnimatePresence>
                  {rest.map((entry, i) => (
                    <RankRow key={entry.userId} entry={entry} index={i} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── Empty State ─── */}
        {rankings.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              🏆
            </motion.div>
            <h3 className="text-xl font-space font-bold text-gray-300 mb-2">
              No rankings yet
            </h3>
            <p className="text-gray-500">Be the first to claim the throne!</p>
          </motion.div>
        )}

        {/* Bottom spacer */}
        <div className="h-20" />
      </div>
    </div>
  );
}
