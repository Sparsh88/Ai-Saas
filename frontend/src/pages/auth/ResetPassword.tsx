import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Sparkles, Lock, ShieldAlert, CheckCircle, AlertCircle, Loader } from 'lucide-react';

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (!token) {
      setError('Reset token is missing from link.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/auth/reset-password', { token, password });
      setSuccess(response.data.message || 'Password updated successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to reset password. Token may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#a855f7]/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Brand */}
      <div className="flex items-center gap-3 mb-8 select-none">
        <div className="w-10 h-10 rounded-xl bg-[#a855f7] flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
          <Sparkles className="w-5 h-5 fill-current" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold font-heading tracking-tight text-white">
            SkillForge AI
          </h1>
          <span className="text-[10px] text-slate-400 font-medium">Smart AI Workspace</span>
        </div>
      </div>

      <div className="w-full max-w-md p-8 rounded-2xl bg-[#0d0d0d] shadow-2xl relative border border-[#1c1c1c]">
        <h2 className="text-xl font-bold font-heading text-white mb-1">Reset Password</h2>
        <p className="text-slate-400 text-xs mb-6">Create a secure new password for your account.</p>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
            <CheckCircle className="w-4 h-4 shrink-0 animate-bounce" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#111111] border border-[#222222] focus:border-purple-500/50 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 text-xs md:text-sm outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#111111] border border-[#222222] focus:border-purple-500/50 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 text-xs md:text-sm outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 mt-6 bg-[#a855f7] hover:bg-[#9333ea] text-white rounded-xl py-3 font-semibold text-xs md:text-sm transition-all shadow-lg shadow-purple-500/25 disabled:opacity-50 cursor-pointer"
          >
            {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Update Password</span>
          </button>
        </form>
      </div>
    </div>
  );
};
