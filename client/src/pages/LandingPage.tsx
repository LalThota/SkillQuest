import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Brain, Trophy, TrendingUp, ChevronRight, Sparkles, Shield, Star } from 'lucide-react';

/* ─── Floating orbs ─── */
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large violet orb */}
      <motion.div
        animate={{ x: [0, 60, 0], y: [0, -40, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-[10%] -left-[5%] w-[500px] h-[500px] bg-brand-violet/15 rounded-full blur-[120px]"
      />
      {/* Fuchsia orb */}
      <motion.div
        animate={{ x: [0, -40, 0], y: [0, 60, 0], scale: [1, 1.3, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[30%] right-[5%] w-[400px] h-[400px] bg-fuchsia-900/20 rounded-full blur-[100px]"
      />
      {/* Gold orb */}
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[10%] left-[30%] w-[300px] h-[300px] bg-amber-900/15 rounded-full blur-[100px]"
      />
      {/* Floating particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            background: `hsla(${260 + Math.random() * 60}, 70%, 60%, ${Math.random() * 0.4 + 0.1})`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{ y: [0, -(Math.random() * 40 + 20), 0], opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: Math.random() * 4 + 3, repeat: Infinity, delay: Math.random() * 3 }}
        />
      ))}
    </div>
  );
}

/* ─── Stats ticker ─── */
function StatsTicker() {
  const stats = [
    { value: '10K+', label: 'Questions' },
    { value: '15+', label: 'Topics' },
    { value: '5', label: 'Categories' },
    { value: '∞', label: 'Practice' },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      className="flex justify-center gap-6 md:gap-12 mt-16"
    >
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 + i * 0.1 }}
          className="text-center"
        >
          <p className="text-2xl md:text-3xl font-space font-bold gradient-text">{s.value}</p>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{s.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Zap className="w-7 h-7" />,
      title: 'XP & Levels',
      desc: 'Earn XP for every correct answer. Climb 10 levels from Beginner to Legend.',
      gradient: 'from-amber-500 to-orange-600',
      glow: 'group-hover:shadow-[0_0_40px_rgba(245,158,11,0.2)]',
    },
    {
      icon: <Brain className="w-7 h-7" />,
      title: 'Smart Practice',
      desc: 'Aptitude, Reasoning & Verbal — with weak-area detection to guide you.',
      gradient: 'from-brand-violet to-fuchsia-600',
      glow: 'group-hover:shadow-[0_0_40px_rgba(124,58,237,0.2)]',
    },
    {
      icon: <Trophy className="w-7 h-7" />,
      title: 'Leaderboards',
      desc: 'Compete globally and track your rank among all players.',
      gradient: 'from-yellow-400 to-amber-500',
      glow: 'group-hover:shadow-[0_0_40px_rgba(234,179,8,0.2)]',
    },
    {
      icon: <TrendingUp className="w-7 h-7" />,
      title: 'Deep Analytics',
      desc: 'Radar charts, heatmaps, and topic breakdowns to master every area.',
      gradient: 'from-emerald-400 to-teal-600',
      glow: 'group-hover:shadow-[0_0_40px_rgba(16,185,129,0.2)]',
    },
  ];

  return (
    <div className="min-h-screen bg-brand-navy text-white font-inter relative noise-overlay">
      <FloatingOrbs />

      {/* ─── Hero ─── */}
      <div className="relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 py-24 md:py-40 text-center relative z-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-brand-violet/10 border border-brand-violet/20 text-brand-violet px-4 py-1.5 rounded-full text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>Level up your aptitude game</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-8xl font-space font-bold mb-6 leading-[1.1]"
          >
            <span className="gradient-text animate-gradient bg-[length:200%_200%]">Skill</span>
            <span className="gradient-text animate-gradient bg-[length:200%_200%]">Quest</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Transform boring aptitude prep into an{' '}
            <span className="text-white font-medium">addictive game</span>. Earn XP, unlock
            badges, climb leaderboards — and actually learn.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/auth')}
              className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2 rounded-2xl"
            >
              Start Your Quest <ChevronRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/auth')}
              className="text-gray-400 hover:text-white px-8 py-4 rounded-2xl border border-gray-700/50 hover:border-gray-600 bg-gray-800/20 hover:bg-gray-800/40 transition-all duration-300 inline-flex items-center gap-2 text-sm font-medium"
            >
              <Shield className="w-4 h-4" /> Free Forever
            </motion.button>
          </motion.div>

          {/* Stats */}
          <StatsTicker />
        </div>
      </div>

      {/* ─── Features ─── */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-space font-bold mb-4">
            Everything you need to <span className="gradient-text">level up</span>
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            A complete gamified platform designed to make learning addictive and effective.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`group glass-card-hover p-7 relative overflow-hidden cursor-default ${f.glow}`}
            >
              {/* Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-shimmer pointer-events-none" />

              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-white mb-5 shadow-lg`}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-space font-bold mb-2 group-hover:text-white transition-colors">{f.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ─── Bottom CTA ─── */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-10 md:p-16 text-center relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-violet/5 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 5, repeat: Infinity, repeatDelay: 2 }}
          />
          <div className="relative z-10">
            <div className="flex justify-center mb-4">
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}>
                <Star className="w-10 h-10 text-brand-gold fill-brand-gold" />
              </motion.div>
            </div>
            <h2 className="text-3xl md:text-4xl font-space font-bold mb-4">
              Ready to begin your quest?
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Join thousands of learners mastering aptitude through gamified practice.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/auth')}
              className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2"
            >
              Get Started Free <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
