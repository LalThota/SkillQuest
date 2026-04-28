import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, ClipboardList, Gamepad2 } from 'lucide-react';

export default function QuickLaunchPad() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-sm"
    >
      <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
        <Zap className="w-4 h-4 text-brand-violet" /> Quick Launch
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => navigate('/quiz?mode=quick')}
          className="group flex items-center gap-3 bg-brand-violet/15 hover:bg-brand-violet/25 border border-brand-violet/20 hover:border-brand-violet/40 p-4 rounded-xl transition-all"
        >
          <div className="w-10 h-10 bg-brand-violet/20 rounded-lg flex items-center justify-center group-hover:bg-brand-violet/30 transition-colors">
            <Zap className="w-5 h-5 text-brand-violet" />
          </div>
          <div className="text-left">
            <p className="font-medium text-sm text-white">Quick Test</p>
            <p className="text-xs text-gray-500">10 Qs • Mixed</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/categories')}
          className="group flex items-center gap-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/15 hover:border-blue-500/30 p-4 rounded-xl transition-all"
        >
          <div className="w-10 h-10 bg-blue-500/15 rounded-lg flex items-center justify-center group-hover:bg-blue-500/25 transition-colors">
            <ClipboardList className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-left">
            <p className="font-medium text-sm text-white">Mock Test</p>
            <p className="text-xs text-gray-500">30 Qs • Pick category</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/game/puzzles')}
          className="group flex items-center gap-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/15 hover:border-red-500/30 p-4 rounded-xl transition-all"
        >
          <div className="w-10 h-10 bg-red-500/15 rounded-lg flex items-center justify-center group-hover:bg-red-500/25 transition-colors">
            <Gamepad2 className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-left">
            <p className="font-medium text-sm text-white">Play Game</p>
            <p className="text-xs text-gray-500">Puzzles • Brain teasers</p>
          </div>
        </button>
      </div>
    </motion.div>
  );
}
