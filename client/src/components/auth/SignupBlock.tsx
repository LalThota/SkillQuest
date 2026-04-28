import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { api } from '../../lib/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Check } from 'lucide-react';

const getStrength = (pw: string): { label: string; pct: number; color: string } => {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { label: 'Weak', pct: 20, color: '#EF4444' };
  if (score === 2) return { label: 'Fair', pct: 40, color: '#F59E0B' };
  if (score === 3) return { label: 'Strong', pct: 70, color: '#10B981' };
  return { label: 'Elite', pct: 100, color: '#7C3AED' };
};

export default function SignupBlock({ onSwitch }: { onSwitch: () => void }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [loading, setLoading] = useState(false);
  const login = useAuthStore(s => s.login);
  const navigate = useNavigate();

  const strength = useMemo(() => getStrength(password), [password]);

  const autoUsername = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    setUsername(slug + Math.floor(Math.random() * 100));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPw) { toast.error('Passwords do not match'); return; }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { username, email, password });
      login(data.data.user, data.data.accessToken);
      toast.success('Welcome to the Quest!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, rotateY: 8 }}
      animate={{ opacity: 1, rotateY: 0 }}
      exit={{ opacity: 0, rotateY: -8, x: 60 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="w-full max-w-md"
      style={{ perspective: '1200px' }}
    >
      <div className="bg-[#111827] rounded-2xl p-8 md:p-10 border border-brand-violet/20 shadow-[0_0_40px_rgba(124,58,237,0.08)]">
        <h2 className="text-2xl font-space font-bold text-white mb-1">Join the Quest 🚀</h2>
        <p className="text-gray-400 text-sm mb-8">Create your warrior profile</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Full Name</label>
            <input
              type="text" required value={fullName}
              onChange={e => { setFullName(e.target.value); if (!username || username === '') autoUsername(e.target.value); }}
              className="w-full px-4 py-3 bg-gray-900/80 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-brand-violet outline-none transition-all placeholder:text-gray-600"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Email address</label>
            <input
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900/80 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-brand-violet outline-none transition-all placeholder:text-gray-600"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Username</label>
            <input
              type="text" required value={username} onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900/80 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-brand-violet outline-none transition-all placeholder:text-gray-600"
              placeholder="warrior42"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/80 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-brand-violet outline-none transition-all placeholder:text-gray-600 pr-12"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {password && (
              <div className="mt-2">
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div animate={{ width: `${strength.pct}%` }} className="h-full rounded-full" style={{ backgroundColor: strength.color }} transition={{ duration: 0.3 }} />
                </div>
                <p className="text-xs mt-1" style={{ color: strength.color }}>{strength.label}</p>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Confirm Password</label>
            <div className="relative">
              <input
                type={showCpw ? 'text' : 'password'} required value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                className={`w-full px-4 py-3 bg-gray-900/80 border rounded-xl text-white focus:ring-2 focus:ring-brand-violet outline-none transition-all placeholder:text-gray-600 pr-12 ${confirmPw && confirmPw !== password ? 'border-brand-crimson' : 'border-gray-700'}`}
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowCpw(!showCpw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                {showCpw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="group w-full py-3.5 bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 text-white font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] disabled:opacity-60 flex items-center justify-center gap-2 relative overflow-hidden mt-2"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>CREATE ACCOUNT <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Already a warrior?{' '}
          <button onClick={onSwitch} className="text-brand-violet hover:text-violet-400 font-medium transition-colors">
            Login →
          </button>
        </p>
      </div>
    </motion.div>
  );
}
