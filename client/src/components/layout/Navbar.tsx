import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Home, BarChart3, Trophy, UserCircle, Zap, Gamepad2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) return null;

  const links = [
    { to: '/dashboard', icon: <Home className="w-5 h-5" />, label: 'Home' },
    { to: '/categories', icon: <Gamepad2 className="w-5 h-5" />, label: 'Practice' },
    { to: '/leaderboard', icon: <Trophy className="w-5 h-5" />, label: 'Ranks' },
    { to: '/analytics', icon: <BarChart3 className="w-5 h-5" />, label: 'Analytics' },
    { to: '/profile', icon: <UserCircle className="w-5 h-5" />, label: 'Profile' },
  ];

  // Hide navbar on quiz and game pages
  if (location.pathname === '/quiz' || location.pathname.startsWith('/game/')) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:top-0 md:bottom-auto">
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-[#0d1224]/80 backdrop-blur-xl border-t border-gray-800/50 md:border-t-0 md:border-b md:border-gray-800/40" />

      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 relative z-10">
        {/* Logo — desktop only */}
        <Link to="/dashboard" className="hidden md:flex items-center gap-2.5 py-4 group">
          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
            className="w-9 h-9 bg-gradient-to-br from-brand-violet to-fuchsia-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.3)]"
          >
            <Zap className="w-5 h-5 text-white" />
          </motion.div>
          <span className="font-space font-bold text-lg text-white group-hover:text-brand-violet transition-colors">
            SkillQuest
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex w-full md:w-auto justify-around md:gap-1">
          {links.map(link => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-3 md:py-2 md:px-4 rounded-xl text-xs md:text-sm font-medium transition-all duration-300 ${
                  active
                    ? 'text-white'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {/* Active indicator */}
                {active && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute inset-0 bg-brand-violet/15 border border-brand-violet/20 rounded-xl"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 transition-transform duration-200 ${active ? 'scale-110' : ''}`}>
                  {link.icon}
                </span>
                <span className="relative z-10">{link.label}</span>
                {/* Active dot — mobile */}
                {active && (
                  <motion.div
                    layoutId="navDot"
                    className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-violet rounded-full md:hidden"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
