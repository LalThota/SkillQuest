import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useUserStore } from '../store/useUserStore';
import { api } from '../lib/api';
import { getLevelInfo, BADGE_MAP } from '../lib/constants';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Flame, Award, LogOut, Shield, Sparkles, Check, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const { stats, badges, fetchStats, fetchBadges } = useUserStore();
  const navigate = useNavigate();
  const [username, setUsername] = useState(user?.username || '');
  const [avatar, setAvatar] = useState(user?.avatar || '😊');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchStats(); fetchBadges(); }, [fetchStats, fetchBadges]);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('/user/profile', { username, avatar });
      useAuthStore.getState().login(data.data, useAuthStore.getState().token!);
      toast.success('Profile updated!');
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => { logout(); navigate('/auth'); };
  const levelInfo = stats ? getLevelInfo(stats.xp) : null;

  const emojis = ['😊', '🦊', '🐱', '🐸', '🦁', '🐼', '🐵', '🦄', '🐲', '🎮', '🧙', '🚀', '⚡', '🌟', '🥷', '🧠'];

  return (
    <div className="min-h-screen bg-brand-navy text-white p-4 md:p-8 font-inter relative noise-overlay">
      {/* Background gradient */}
      <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-brand-violet/8 to-transparent pointer-events-none" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-brand-violet/8 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-2xl mx-auto space-y-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <h1 className="text-3xl md:text-4xl font-space font-bold gradient-text">Profile</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl transition-all"
          >
            <Edit3 className="w-4 h-4" /> {isEditing ? 'Cancel' : 'Edit'}
          </motion.button>
        </motion.div>

        {/* ─── Avatar & Level Card ─── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8 text-center relative overflow-hidden"
        >
          {/* Shimmer */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -skew-x-12"
            animate={{ x: ['-200%', '200%'] }}
            transition={{ duration: 5, repeat: Infinity, repeatDelay: 3 }}
          />

          <div className="relative z-10">
            {/* Avatar display */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-7xl mb-4 inline-block"
            >
              {avatar}
            </motion.div>

            {/* Avatar picker (edit mode) */}
            <AnimatePresence>
              {isEditing && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {emojis.map(e => (
                      <motion.button
                        key={e}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setAvatar(e)}
                        className={`text-2xl p-2.5 rounded-xl transition-all duration-200 ${
                          avatar === e
                            ? 'bg-brand-violet/30 ring-2 ring-brand-violet shadow-[0_0_15px_rgba(124,58,237,0.3)]'
                            : 'hover:bg-white/10 bg-white/5'
                        }`}
                      >
                        {e}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Level info */}
            {levelInfo && (
              <div className="mb-2">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Star className="w-5 h-5 text-brand-gold fill-brand-gold" />
                  <span className="font-space font-bold text-lg">
                    Level {levelInfo.current.level} — <span className="gradient-text">{levelInfo.current.title}</span>
                  </span>
                </div>
                <div className="h-3 bg-gray-900/80 rounded-full overflow-hidden max-w-xs mx-auto border border-gray-800/50">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${levelInfo.progress}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-brand-violet via-fuchsia-500 to-brand-gold rounded-full relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                  </motion.div>
                </div>
                <p className="text-xs text-gray-500 mt-2">{levelInfo.progressXP} / {levelInfo.neededXP} XP to next level</p>
              </div>
            )}

            {/* Quick stats */}
            <div className="flex justify-center gap-6 mt-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="font-space font-bold text-xl">{stats?.streak?.current || 0}</span>
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">Day Streak</p>
              </div>
              <div className="w-px bg-gray-700/50" />
              <div className="text-center">
                <span className="font-space font-bold text-xl text-brand-gold">{stats?.xp || 0}</span>
                <p className="text-[11px] text-gray-500 mt-0.5">Total XP</p>
              </div>
              <div className="w-px bg-gray-700/50" />
              <div className="text-center">
                <span className="font-space font-bold text-xl text-brand-emerald">{stats?.accuracy || 0}%</span>
                <p className="text-[11px] text-gray-500 mt-0.5">Accuracy</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Edit Name ─── */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 15, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="glass-card p-6 space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2 font-medium">Username</label>
                  <input
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700/50 rounded-xl focus:ring-2 focus:ring-brand-violet/50 focus:border-brand-violet/50 focus:outline-none text-white transition-all duration-200 placeholder:text-gray-600"
                    placeholder="Enter username"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUpdate}
                  disabled={saving}
                  className="btn-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4" /> Save Changes
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Badges ─── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-space font-bold mb-5 flex items-center gap-2">
            <Award className="w-5 h-5 text-brand-gold" /> Badges
          </h2>
          {badges.length === 0 ? (
            <div className="text-center py-8">
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-4xl mb-3">🏅</motion.div>
              <p className="text-gray-500 text-sm">Complete quizzes to earn badges!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {badges.map((b: any, i: number) => {
                const info = BADGE_MAP[b.badgeId];
                return info ? (
                  <motion.div
                    key={b.badgeId}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ y: -4, scale: 1.03 }}
                    className="bg-gradient-to-br from-white/[0.04] to-transparent p-5 rounded-2xl border border-white/[0.06] text-center hover:border-brand-violet/30 transition-all duration-300 cursor-default"
                  >
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.2 }}
                      className="text-3xl mb-2"
                    >
                      {info.icon}
                    </motion.div>
                    <p className="font-semibold text-sm">{info.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{info.description}</p>
                  </motion.div>
                ) : null;
              })}
            </div>
          )}
        </motion.div>

        {/* ─── Account Info ─── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-space font-bold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-400" /> Account
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-gray-800/50">
              <span className="text-gray-500">Email</span>
              <span className="text-gray-300">{user?.email || '—'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-800/50">
              <span className="text-gray-500">Member since</span>
              <span className="text-gray-300">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500">Total quizzes</span>
              <span className="text-gray-300">{stats?.totalQuizzes || 0}</span>
            </div>
          </div>
        </motion.div>

        {/* ─── Sign Out ─── */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleLogout}
          className="w-full bg-brand-crimson/10 hover:bg-brand-crimson/15 border border-brand-crimson/20 hover:border-brand-crimson/40 text-brand-crimson py-3.5 rounded-2xl flex items-center justify-center gap-2 font-medium transition-all duration-300"
        >
          <LogOut className="w-5 h-5" /> Sign Out
        </motion.button>

        <div className="h-10" />
      </div>
    </div>
  );
}
