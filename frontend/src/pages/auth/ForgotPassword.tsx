import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Sparkles, Mail, Send, AlertCircle, CheckCircle, Loader } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide your email address.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post('/api/auth/forgot-password', { email });
      setSuccess(response.data.message || 'Reset link triggered successfully.');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Unable to handle reset request.');
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
        <h2 className="text-xl font-bold font-heading text-slate-100 mb-2">Forgot Password</h2>
        <p className="text-slate-400 text-sm mb-6">Enter your email and we'll dispatch a link to reset your credentials.</p>

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
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 hover:bg-white/[0.07] focus:bg-white/[0.07] border border-white/5 focus:border-indigo-500/50 rounded-lg py-2.5 pl-10 pr-4 text-slate-100 placeholder-slate-500 text-sm outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-650 hover:to-purple-750 text-white rounded-lg py-3 font-semibold text-sm transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Send Reset Link</span>
          </button>
        </form>

        <p className="text-slate-400 text-center text-xs mt-6">
          Remember your password?{' '}
          <Link
            to="/login"
            className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};
