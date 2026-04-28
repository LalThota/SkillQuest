import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../lib/constants';
import { motion } from 'framer-motion';
import { Gamepad2, Sparkles, ChevronRight } from 'lucide-react';

export default function CategorySelectPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-navy text-white p-4 md:p-8 font-inter relative noise-overlay">
      {/* Ambient */}
      <div className="absolute top-0 left-0 right-0 h-[350px] bg-gradient-to-b from-brand-violet/6 to-transparent pointer-events-none" />
      <div className="absolute top-32 left-[20%] w-[400px] h-[200px] bg-fuchsia-900/8 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="w-7 h-7 text-brand-gold" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-space font-bold gradient-text">Choose Your Arena</h1>
          </div>
          <p className="text-gray-500 ml-10">Select a category to practice or play</p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(`/categories/${cat.id}/mode`)}
              className="group relative bg-white/[0.03] backdrop-blur-sm rounded-3xl p-6 border border-white/[0.06] text-left transition-all duration-500 overflow-hidden hover:bg-white/[0.06]"
              style={{ boxShadow: 'none' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 40px ${cat.color}20`;
                (e.currentTarget as HTMLElement).style.borderColor = `${cat.color}40`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)';
              }}
            >
              {/* Radial glow on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle at 50% 50%, ${cat.color}08, transparent 70%)` }}
              />
              {/* Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-shimmer pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <motion.span
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.2 }}
                    className="text-4xl"
                  >
                    {cat.icon}
                  </motion.span>
                  {cat.hasGameMode && (
                    <span className="flex items-center gap-1 bg-red-500/15 text-red-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-red-500/25 uppercase tracking-wider">
                      <Gamepad2 className="w-3 h-3" /> Play
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-space font-bold mb-1 group-hover:text-white transition-colors">{cat.label}</h3>
                <p className="text-gray-500 text-sm mb-5 leading-relaxed">{cat.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">{cat.topics.length} topics</span>
                  <span
                    className="text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1 transition-all duration-300 group-hover:gap-2"
                    style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                  >
                    Explore <ChevronRight className="w-3 h-3" />
                  </span>
                </div>

                {/* Topics on hover */}
                <div className="mt-4 max-h-0 group-hover:max-h-28 overflow-hidden transition-all duration-500 ease-out">
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/[0.06]">
                    {cat.topics.slice(0, 5).map(t => (
                      <span key={t} className="text-[10px] bg-white/[0.05] text-gray-400 px-2.5 py-1 rounded-lg">{t}</span>
                    ))}
                    {cat.topics.length > 5 && (
                      <span className="text-[10px] text-gray-600 px-2 py-1">+{cat.topics.length - 5} more</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="h-16" />
      </div>
    </div>
  );
}
