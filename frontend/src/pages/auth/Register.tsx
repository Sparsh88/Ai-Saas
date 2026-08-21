import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';
import { Sparkles, User, Mail, Lock, UserPlus, AlertCircle, Loader } from 'lucide-react';

export const Register: React.FC = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/auth/register', {
        name,
        email,
        password,
      });

      const { user, accessToken, refreshToken } = response.data;
      setAuth(user, accessToken, refreshToken);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.22, 0.12] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3b82f6]/20 rounded-full blur-[140px] pointer-events-none"
      />

      {/* Brand Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3 mb-8 select-none cursor-pointer"
        onClick={() => navigate('/')}
      >
        <div className="w-10 h-10 rounded-xl bg-[#3b82f6] flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
          <Sparkles className="w-5 h-5 fill-current" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold font-heading tracking-tight text-white">
            SkillForge AI
          </h1>
          <span className="text-[10px] text-slate-400 font-medium">Smart AI Workspace</span>
        </div>
      </motion.div>

      {/* Form Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md p-8 rounded-2xl bg-[#0d0d0d] shadow-2xl relative border border-[#1c1c1c]"
      >
        <h2 className="text-xl font-bold font-heading text-white mb-1">Create your account</h2>
        <p className="text-slate-400 text-xs mb-6">Start boosting your career growth and coding speed.</p>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#111111] border border-[#222222] focus:border-blue-500/50 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 text-xs md:text-sm outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#111111] border border-[#222222] focus:border-blue-500/50 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 text-xs md:text-sm outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="password"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#111111] border border-[#222222] focus:border-blue-500/50 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 text-xs md:text-sm outline-none transition-all"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 mt-6 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-xl py-3 font-semibold text-xs md:text-sm transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 cursor-pointer"
          >
            {loading ? <Loader className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            <span>Sign Up</span>
          </motion.button>
        </form>

        <p className="text-slate-400 text-center text-xs mt-6">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-[#3b82f6] hover:text-blue-300 transition-colors"
          >
            Log In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
