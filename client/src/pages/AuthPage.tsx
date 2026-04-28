import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../lib/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0A0F1E]">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-[20%] -left-[10%] w-[50%] h-[70%] rounded-full bg-teal-900/40 blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, -90, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[40%] right-[5%] w-[40%] h-[60%] rounded-full bg-violet-900/30 blur-[100px]"
        />
      </div>

      {/* Main Card Container */}
      <div className="relative z-10 w-full max-w-[1000px] h-[650px] mx-4 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-gray-800 flex bg-[#121214]">
        
        {/* ====== FORM PANELS (Behind the overlay) ====== */}
        <div className="flex w-full h-full relative">
          {/* LEFT SIDE — Login Form (visible when overlay is on RIGHT) */}
          <div className="absolute left-0 top-0 w-1/2 h-full flex items-center justify-center p-12">
            <div className={`w-full max-w-sm transition-all duration-500 delay-100 ${isSignUp ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100 scale-100'}`}>
              <LoginForm onSwitch={() => setIsSignUp(true)} />
            </div>
          </div>
          {/* RIGHT SIDE — Signup Form (visible when overlay is on LEFT) */}
          <div className="absolute right-0 top-0 w-1/2 h-full flex items-center justify-center p-12">
            <div className={`w-full max-w-sm transition-all duration-500 delay-100 ${isSignUp ? 'opacity-100 scale-100' : 'opacity-0 pointer-events-none scale-95'}`}>
              <SignupForm onSwitch={() => setIsSignUp(false)} />
            </div>
          </div>
        </div>

        {/* ====== SLIDING OVERLAY PANEL ====== */}
        <div
          className="absolute top-0 w-1/2 h-full z-20 transition-transform duration-[700ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ transform: isSignUp ? 'translateX(0%)' : 'translateX(100%)' }}
        >
          <div
            className="w-full h-full flex items-center justify-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #2dd4bf 0%, #14b8a6 40%, #0d9488 100%)' }}
          >
            {/* Decorative circles inside overlay */}
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full" />
            <div className="absolute top-1/4 right-12 w-32 h-32 bg-white/5 rounded-full" />
            
            {/* Shapes */}
            <motion.div
              animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-20 right-20 w-16 h-16 bg-white/15 rounded-2xl backdrop-blur-sm"
            />
            <motion.div
              animate={{ y: [0, 10, 0], rotate: [0, -3, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-32 left-16 w-20 h-20 bg-white/10 rounded-full backdrop-blur-sm"
            />

            {/* Content inside overlay */}
            <div className="relative z-10 text-center px-12 pb-8">
              <AnimatePresence mode="wait">
                {isSignUp ? (
                  <motion.div
                    key="login-content"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-4xl font-bold text-white mb-4 leading-tight shadow-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      Welcome<br />back!
                    </h2>
                    <p className="text-white/90 mb-8 text-base">
                      Already have an account? Sign in to continue your quest
                    </p>
                    <button
                      onClick={() => setIsSignUp(false)}
                      className="px-10 py-3 bg-transparent border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-teal-600 transition-all duration-300"
                    >
                      Login →
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="signup-content"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-4xl font-bold text-white mb-4 leading-tight shadow-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      Start your<br />journey now
                    </h2>
                    <p className="text-white/90 mb-8 text-base">
                      If you don't have an account yet, join us and start your journey
                    </p>
                    <button
                      onClick={() => setIsSignUp(true)}
                      className="px-10 py-3 bg-transparent border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-teal-600 transition-all duration-300"
                    >
                      Register →
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const SocialLogins = () => {
  const handleSocialClick = (provider: string) => {
    toast(`Connecting to ${provider}...`, {
      icon: '🔄',
      style: { borderRadius: '10px', background: '#1f2937', color: '#fff' }
    });
  };

  return (
    <div className="mt-6 text-center">
      <p className="text-gray-500 text-xs mb-4 uppercase tracking-wider">or continue with</p>
      <div className="flex justify-center gap-4">
        <button type="button" onClick={() => handleSocialClick('Facebook')} className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-500/10 transition-all">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        </button>
        <button type="button" onClick={() => handleSocialClick('Google')} className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:border-red-500 hover:text-red-500 hover:bg-red-500/10 transition-all">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866.549 3.921 1.453l2.814-2.814C17.503 2.988 15.139 2 12.545 2 7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.761h-9.426z" />
          </svg>
        </button>
        <button type="button" onClick={() => handleSocialClick('LinkedIn')} className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-400 hover:bg-blue-400/10 transition-all">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        </button>
      </div>
    </div>
  );
};

/* ============ LOGIN FORM ============ */
function LoginForm({ onSwitch: _onSwitch }: { onSwitch: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const login = useAuthStore(s => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data.data.user, data.data.accessToken);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        Login <span className="text-teal-400">hire.</span>
      </h1>
      <p className="text-gray-500 text-sm mb-8">Welcome back, warrior</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-xs text-gray-400 mb-1 block uppercase tracking-wide font-semibold">Email</label>
          <input
            type="email" required value={email} onChange={e => setEmail(e.target.value)}
            className="w-full bg-transparent border-b-2 border-gray-700 focus:border-teal-400 py-2.5 text-white outline-none transition-colors placeholder:text-gray-600 text-sm"
            placeholder="warrior@example.com"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block uppercase tracking-wide font-semibold">Password</label>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-transparent border-b-2 border-gray-700 focus:border-teal-400 py-2.5 text-white outline-none transition-colors placeholder:text-gray-600 text-sm pr-10"
              placeholder="••••••••"
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors bg-transparent border-none">
              {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pb-2 mt-4">
          <label className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-gray-300">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-gray-800 accent-teal-500" />
            <span>Remember me</span>
          </label>
          <button type="button" className="text-gray-400 hover:text-teal-400 transition-colors">Forgot password?</button>
        </div>

        <button
          type="submit" disabled={loading}
          className="w-full py-3.5 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-full transition-all text-sm shadow-[0_4px_20px_rgba(20,184,166,0.3)] hover:shadow-[0_4px_25px_rgba(20,184,166,0.4)] hover:-translate-y-0.5 disabled:opacity-60 disabled:transform-none"
        >
          {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" /> : 'Login'}
        </button>
      </form>

      <SocialLogins />
    </div>
  );
}

/* ============ SIGNUP FORM ============ */
function SignupForm({ onSwitch: _onSwitch }: { onSwitch: () => void }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const login = useAuthStore(s => s.login);
  const navigate = useNavigate();

  const getStrength = (pw: string) => {
    let s = 0;
    if (pw.length >= 6) s++;
    if (pw.length >= 10) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    if (s <= 1) return { label: 'Weak', pct: 25, color: '#ef4444' };
    if (s === 2) return { label: 'Fair', pct: 50, color: '#f59e0b' };
    if (s === 3) return { label: 'Strong', pct: 75, color: '#10b981' };
    return { label: 'Elite', pct: 100, color: '#2dd4bf' };
  };
  const strength = getStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      // Auto-generate username from full name for simplicity as requested earlier
      const username = fullName.toLowerCase().replace(/[^a-z0-9]/g, '') + Math.floor(Math.random() * 99);
      const { data } = await api.post('/auth/register', { username, email, password });
      login(data.data.user, data.data.accessToken);
      toast.success('Welcome to SkillQuest!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        Register <span className="text-teal-400">now.</span>
      </h1>
      <p className="text-gray-500 text-sm mb-6">Create your warrior profile</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs text-gray-400 mb-1 block uppercase tracking-wide font-semibold">Full Name</label>
          <input
            type="text" required value={fullName} onChange={e => setFullName(e.target.value)} 
            className="w-full bg-transparent border-b-2 border-gray-700 focus:border-teal-400 py-2 text-white outline-none transition-colors placeholder:text-gray-600 text-sm"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block uppercase tracking-wide font-semibold">Email</label>
          <input
            type="email" required value={email} onChange={e => setEmail(e.target.value)}
            className="w-full bg-transparent border-b-2 border-gray-700 focus:border-teal-400 py-2 text-white outline-none transition-colors placeholder:text-gray-600 text-sm"
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block uppercase tracking-wide font-semibold">Password</label>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-transparent border-b-2 border-gray-700 focus:border-teal-400 py-2 text-white outline-none transition-colors placeholder:text-gray-600 text-sm pr-10"
              placeholder="••••••••"
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 bg-transparent border-none">
              {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {password && (
            <div className="mt-2">
              <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                <motion.div animate={{ width: `${strength.pct}%` }} className="h-full rounded-full" style={{ backgroundColor: strength.color }} transition={{ duration: 0.3 }} />
              </div>
            </div>
          )}
        </div>

        <button
          type="submit" disabled={loading}
          className="w-full py-3.5 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-full transition-all text-sm shadow-[0_4px_20px_rgba(20,184,166,0.3)] hover:shadow-[0_4px_25px_rgba(20,184,166,0.4)] hover:-translate-y-0.5 disabled:opacity-60 disabled:transform-none mt-4"
        >
          {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" /> : 'Register'}
        </button>
      </form>

      <SocialLogins />
    </div>
  );
}
