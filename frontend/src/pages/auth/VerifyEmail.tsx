import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';
import { Sparkles, KeyRound, CheckCircle, AlertCircle, Loader } from 'lucide-react';

export const VerifyEmail: React.FC = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get('email') || '';

  const [email, setEmail] = useState(emailParam);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [emailParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !code) {
      setError('Please fill in both email and code.');
      return;
    }
    if (code.length !== 6) {
      setError('Verification code must be 6 digits.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/auth/verify-email', { email, code });
      const { user, accessToken, refreshToken } = response.data;
      
      setSuccess('Email verified successfully! Redirecting...');
      setTimeout(() => {
        setAuth(user, accessToken, refreshToken);
        navigate('/dashboard');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid verification code. Please check console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Brand */}
      <div className="flex items-center gap-2 mb-8 select-none">
        <Sparkles className="w-8 h-8 text-indigo-400" />
        <h1 className="text-3xl font-black font-heading tracking-tight bg-gradient-to-r from-indigo-200 via-purple-300 to-indigo-100 bg-clip-text text-transparent">
          SkillForge AI
        </h1>
      </div>

      <div className="w-full max-w-md p-8 rounded-2xl glass-panel shadow-2xl relative border border-white/5">
        <h2 className="text-xl font-bold font-heading text-slate-100 mb-2">Verify your email</h2>
        <p className="text-slate-400 text-sm mb-6">
          Enter the 6-digit confirmation code printed in your server logs or sent to your inbox.
        </p>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
            <CheckCircle className="w-4 h-4 shrink-0 animate-bounce" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-white/5 border border-white/5 rounded-lg py-2.5 px-4 text-slate-100 placeholder-slate-500 text-sm outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Verification Code
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-white/5 hover:bg-white/[0.07] focus:bg-white/[0.07] border border-white/5 focus:border-indigo-500/50 rounded-lg py-2.5 pl-10 pr-4 text-center tracking-[0.5em] font-mono text-lg text-slate-100 placeholder-slate-650 outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-650 hover:to-purple-750 text-white rounded-lg py-3 font-semibold text-sm transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            <span>Confirm Email</span>
          </button>
        </form>
      </div>
    </div>
  );
};
