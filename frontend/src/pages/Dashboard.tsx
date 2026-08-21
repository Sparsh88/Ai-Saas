import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  FileText,
  CheckSquare,
  TrendingUp,
  BrainCircuit,
  ArrowUpRight,
  Clock,
  Zap
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

interface DashboardData {
  recentActivity: Array<{
    id: string;
    toolUsed: string;
    createdAt: string;
  }>;
  metrics: {
    totalDocs: number;
    totalProjects: number;
    totalTasks: number;
  };
  usageSummary: Array<{
    toolUsed: string;
    requestsCount?: number;
    creditsUsed?: number;
  }>;
}

const getStoredCache = (): DashboardData | null => {
  try {
    const raw = sessionStorage.getItem('SF_DASHBOARD_CACHE');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const initialCache = getStoredCache();
  const [data, setData] = useState<DashboardData | null>(initialCache);
  const [loading, setLoading] = useState(!initialCache);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('/api/workspace/dashboard-stats');
      setData(response.data);
      sessionStorage.setItem('SF_DASHBOARD_CACHE', JSON.stringify(response.data));
    } catch (error) {
      console.warn('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading && !data) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Welcome Skeleton */}
        <div className="p-6 rounded-2xl border border-white/5 bg-white/2 relative overflow-hidden shimmer-effect h-36 flex flex-col justify-center">
          <div className="w-28 h-5 bg-white/10 rounded-full mb-3" />
          <div className="w-64 md:w-80 h-7 bg-white/10 rounded-lg mb-2" />
          <div className="w-48 md:w-96 h-4 bg-white/5 rounded" />
        </div>

        {/* 3 Metric Cards Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-white/5 bg-white/2 relative overflow-hidden shimmer-effect h-36 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div className="w-28 h-3.5 bg-white/10 rounded" />
                <div className="w-8 h-8 rounded-lg bg-white/10" />
              </div>
              <div className="w-20 h-8 bg-white/15 rounded" />
              <div className="flex items-center justify-between">
                <div className="w-20 h-3 bg-white/5 rounded" />
                <div className="w-16 h-3 bg-white/10 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Analytics Chart & Activity List Skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 rounded-xl border border-white/5 bg-white/2 relative overflow-hidden shimmer-effect h-80 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="w-32 h-4 bg-white/10 rounded" />
              <div className="w-5 h-5 bg-white/10 rounded" />
            </div>
            <div className="flex items-end gap-6 h-48 pt-4 px-4">
              {[35, 60, 45, 80, 50, 75].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-white/10 rounded-t"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
          <div className="p-6 rounded-xl border border-white/5 bg-white/2 relative overflow-hidden shimmer-effect h-80 flex flex-col justify-between">
            <div className="w-32 h-4 bg-white/10 rounded mb-4" />
            <div className="space-y-4 flex-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-white/10 mt-1" />
                  <div className="flex-1 space-y-1.5">
                    <div className="w-3/4 h-3 bg-white/10 rounded" />
                    <div className="w-1/2 h-2 bg-white/5 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Format chart data directly from grouped data
  const chartData =
    data?.usageSummary.map((item) => ({
      name: item.toolUsed,
      count: item.requestsCount || item.creditsUsed || 1,
    })) || [];

  const COLORS = ['#3b82f6', '#ec4899', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

  return (
    <div className="space-y-6">
      {/* Welcome Card with Vibrant Mesh Glow */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative p-6 md:p-8 rounded-2xl border border-blue-500/20 overflow-hidden bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-pink-950/40 shadow-2xl"
      >
        <div className="absolute -right-10 -top-10 w-60 h-60 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-10 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <BrainCircuit className="w-40 h-40 text-blue-400" />
        </div>
        
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 border border-blue-400/30 text-xs font-bold text-blue-300 mb-4 shadow-sm">
          <Zap className="w-3.5 h-3.5 text-pink-400 fill-current" />
          <span className="bg-gradient-to-r from-blue-300 via-purple-200 to-pink-300 bg-clip-text text-transparent">Platform Active • Unlimited AI Access</span>
        </span>
        
        <h1 className="text-2xl md:text-4xl font-extrabold font-heading text-white tracking-tight">
          Welcome back, <span className="bg-gradient-to-r from-blue-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">{user?.name}</span>!
        </h1>
        <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
          Accelerate your development and career goals with AI-powered resume scoring, mock interviews, roadmap planning, and documents analysis.
        </p>
      </motion.div>

      {/* Metrics Row with Colorful Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* AI Suite - Vibrant Blue */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          whileHover={{ y: -4, scale: 1.01 }}
          onClick={() => navigate('/tools')}
          className="p-6 rounded-2xl glass-card card-blue relative overflow-hidden group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">AI Writing Suite</span>
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">25+</span>
            <span className="text-xs text-blue-200/70">AI tools & utilities</span>
          </div>
          <div className="mt-4 flex items-center justify-between pt-2 border-t border-blue-500/10">
            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">FREE & UNLIMITED</span>
            <span className="text-xs text-blue-300 group-hover:text-blue-200 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              <span>Explore</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </motion.div>

        {/* Documents Hub - Vibrant Purple */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          whileHover={{ y: -4, scale: 1.01 }}
          onClick={() => navigate('/documents')}
          className="p-6 rounded-2xl glass-card card-purple relative overflow-hidden group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">Documents Hub</span>
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-lg shadow-purple-500/20">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{data?.metrics.totalDocs}</span>
            <span className="text-xs text-purple-200/70">parsed files</span>
          </div>
          <div className="mt-4 flex items-center justify-between pt-2 border-t border-purple-500/10">
            <span className="text-[11px] font-semibold text-purple-300">PDF, DOCX, TXT</span>
            <span className="text-xs text-purple-300 group-hover:text-purple-200 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              <span>Manage hub</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </motion.div>

        {/* Active Workspace - Vibrant Pink */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{ y: -4, scale: 1.01 }}
          onClick={() => navigate('/tasks')}
          className="p-6 rounded-2xl glass-card card-pink relative overflow-hidden group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-pink-300 uppercase tracking-wider">Active Workspace</span>
            <div className="p-2.5 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/30 shadow-lg shadow-pink-500/20">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{data?.metrics.totalProjects}</span>
            <span className="text-xs text-pink-200/70">projects | {data?.metrics.totalTasks} tasks</span>
          </div>
          <div className="mt-4 flex items-center justify-between pt-2 border-t border-pink-500/10">
            <span className="text-[11px] font-semibold text-pink-300">Kanban boards</span>
            <span className="text-xs text-pink-300 group-hover:text-pink-200 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              <span>Open tasks</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </motion.div>
      </div>

      {/* Analytics & Activity with Colorful Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Card - Vibrant Cyan & Purple Border */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-panel card-cyan flex flex-col justify-between shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-md shadow-cyan-400/50" />
                <span>AI Features Activity</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Distribution across intelligence modules</p>
            </div>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="h-64 w-full">
            {chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                No telemetry logs found. Run any AI feature to populate statistics.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#080d1a',
                      borderColor: 'rgba(59, 130, 246, 0.4)',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#ffffff',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)'
                    }}
                    labelStyle={{ color: '#60a5fa', fontWeight: 'bold' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Bar dataKey="count" name="Calls" radius={[6, 6, 0, 0]}>
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Activity Timeline - Vibrant Emerald & Rose */}
        <div className="p-6 rounded-2xl glass-panel card-emerald flex flex-col justify-between shadow-2xl">
          <div>
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Clock className="w-4 h-4" />
              </div>
              <span>Recent Activity</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">Historical AI usage timeline</p>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto max-h-64 pr-2">
            {!data?.recentActivity || data.recentActivity.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                No recent activity. Try launching the AI assistant.
              </div>
            ) : (
              data.recentActivity.map((act, idx) => {
                const dotColors = ['bg-blue-400', 'bg-pink-400', 'bg-emerald-400', 'bg-amber-400', 'bg-purple-400', 'bg-rose-400'];
                const dotColor = dotColors[idx % dotColors.length];
                return (
                  <div key={act.id} className="flex gap-3 text-xs">
                    <div className="relative flex flex-col items-center">
                      <div className={`w-2.5 h-2.5 ${dotColor} rounded-full z-10 shrink-0 shadow-md`} />
                      <div className="w-[1px] flex-1 bg-white/10 absolute top-2.5 bottom-[-16px]" />
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-semibold text-slate-200">{act.toolUsed}</p>
                      <span className="text-[10px] text-slate-400">
                        {new Date(act.createdAt).toLocaleTimeString()} • <span className="text-emerald-400 font-medium">Completed</span>
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
