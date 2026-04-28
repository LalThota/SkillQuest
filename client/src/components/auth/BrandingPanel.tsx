import { motion } from 'framer-motion';
import { Zap, Star, Trophy } from 'lucide-react';

const floatingItems = [
  { emoji: '⚡', delay: 0, x: 60, y: 100, dur: 6 },
  { emoji: '🏆', delay: 1, x: 200, y: 160, dur: 7 },
  { emoji: '🎯', delay: 2, x: 120, y: 300, dur: 5 },
  { emoji: '💎', delay: 0.5, x: 280, y: 220, dur: 8 },
  { emoji: '🔥', delay: 1.5, x: 50, y: 400, dur: 6.5 },
  { emoji: '⭐', delay: 3, x: 300, y: 350, dur: 7.5 },
];

const testimonials = [
  { text: '"I cracked TCS with 98 percentile thanks to SkillQuest!"', name: 'Rahul K.', college: 'SRKR Engineering' },
  { text: '"The gamified approach made aptitude prep actually fun."', name: 'Priya S.', college: 'JNTU Hyderabad' },
  { text: '"Went from 45% to 89% accuracy in just 3 weeks."', name: 'Arjun M.', college: 'VIT Vellore' },
];

export default function BrandingPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between h-full bg-[#0A0F1E] relative overflow-hidden p-10">
      {/* Animated grid background */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(rgba(124,58,237,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.5) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Floating XP orbs */}
      {floatingItems.map((item, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl select-none pointer-events-none"
          style={{ left: item.x, top: item.y }}
          animate={{ y: [0, -30, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: item.dur, repeat: Infinity, delay: item.delay, ease: 'easeInOut' }}
        >
          {item.emoji}
        </motion.div>
      ))}

      {/* Logo + Tagline */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-brand-violet/20 rounded-xl flex items-center justify-center border border-brand-violet/40">
            <Zap className="w-7 h-7 text-brand-violet" />
          </div>
          <h1 className="text-3xl font-space font-bold bg-gradient-to-r from-brand-violet via-fuchsia-400 to-brand-gold bg-clip-text text-transparent">
            SkillQuest
          </h1>
        </div>
        <h2 className="text-2xl font-space font-bold text-white mt-6 leading-tight">
          Level Up Your<br />Interview Game
        </h2>
        <p className="text-gray-400 mt-3 text-sm leading-relaxed max-w-xs">
          Master aptitude, reasoning & more with gamified practice sessions, XP rewards, and competitive leaderboards.
        </p>
      </div>

      {/* Stats Row */}
      <div className="relative z-10 flex gap-6 my-8">
        {[
          { icon: <Star className="w-4 h-4 text-brand-gold" />, val: '10K+', label: 'Questions' },
          { icon: <Trophy className="w-4 h-4 text-yellow-400" />, val: '5K+', label: 'Students' },
          { icon: <Zap className="w-4 h-4 text-brand-violet" />, val: '95%', label: 'Success' },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">{s.icon}<span className="text-white font-bold text-lg">{s.val}</span></div>
            <span className="text-gray-500 text-xs">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Testimonials */}
      <div className="relative z-10 space-y-3">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.2 }}
            className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-xl p-4"
          >
            <p className="text-gray-300 text-sm italic">{t.text}</p>
            <p className="text-gray-500 text-xs mt-2">{t.name} — {t.college}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
