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
  credits: number;
  plan: string;
  endDate: string | null;
  recentActivity: Array<{
    id: string;
    toolUsed: string;
    creditsUsed: number;
    createdAt: string;
  }>;
  metrics: {
    totalDocs: number;
    totalProjects: number;
    totalTasks: number;
  };
  usageSummary: Array<{
    toolUsed: string;
    creditsUsed: number;
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
      requests: item.creditsUsed,
    })) || [];

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#3b82f6', '#10b981'];

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative p-6 rounded-2xl border border-indigo-500/20 dark:border-indigo-500/10 overflow-hidden bg-gradient-to-r from-indigo-50/60 via-purple-50/40 to-transparent dark:from-indigo-950/20 dark:via-purple-950/10 dark:to-transparent"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <BrainCircuit className="w-40 h-40 text-indigo-400 dark:text-indigo-400" />
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-500/10 dark:bg-indigo-500/10 border border-indigo-500/25 text-xs font-semibold text-indigo-500 dark:text-indigo-400 mb-4">
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Platform Active • Unlimited Access</span>
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-slate-100 tracking-tight animate-fade-in">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-xl">
          Accelerate your workflow using AI tools, documents analysis, study roadmaps, and workspace tasks.
        </p>
      </motion.div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* AI Assistant Hub */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          whileHover={{ y: -4, scale: 1.01 }}
          onClick={() => navigate('/chat')}
          className="p-5 rounded-xl glass-card relative overflow-hidden group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Assistants & Tools</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-100">{data?.recentActivity?.length || 0}</span>
            <span className="text-xs text-slate-500">recent invocations</span>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-indigo-400 font-semibold uppercase">Active Hub</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate('/chat');
              }}
              className="text-xs text-slate-400 hover:text-indigo-400 font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
            >
              <span>Launch AI</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>

        {/* Documents Extracted */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          whileHover={{ y: -4, scale: 1.01 }}
          className="p-5 rounded-xl glass-card relative overflow-hidden group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Documents Hub</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-100">{data?.metrics.totalDocs}</span>
            <span className="text-xs text-slate-500">parsed files</span>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-slate-500">PDF, DOCX, TXT formats</span>
            <button
              onClick={() => navigate('/documents')}
              className="text-xs text-slate-400 hover:text-purple-400 font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
            >
              <span>Manage hub</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>

        {/* Projects Running */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{ y: -4, scale: 1.01 }}
          className="p-5 rounded-xl glass-card relative overflow-hidden group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Workspace</span>
            <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-100">{data?.metrics.totalProjects}</span>
            <span className="text-xs text-slate-500">projects | {data?.metrics.totalTasks} tasks</span>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-slate-500">Kanban cards & calendars</span>
            <button
              onClick={() => navigate('/tasks')}
              className="text-xs text-slate-400 hover:text-pink-400 font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
            >
              <span>Open tasks</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Analytics & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Card */}
        <div className="lg:col-span-2 p-6 rounded-xl glass-panel border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-200">AI Tool Usage</h3>
              <p className="text-xs text-slate-500">Distribution across features</p>
            </div>
            <TrendingUp className="w-5 h-5 text-indigo-400" />
          </div>

          <div className="h-64 w-full">
            {chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                No telemetry logs found. Run any AI feature to populate statistics.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" strokeOpacity={0.5} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-panel)',
                      borderColor: 'var(--border-color)',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    labelStyle={{ color: 'var(--text-title)', fontWeight: 'bold' }}
                    itemStyle={{ color: 'var(--text-main)' }}
                  />
                  <Bar dataKey="requests" radius={[4, 4, 0, 0]}>
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="p-6 rounded-xl glass-panel border border-white/5 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-200 mb-1 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Recent Activity</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">Activity and prompt logs</p>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto max-h-64 pr-2">
            {!data?.recentActivity || data.recentActivity.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                No recent activity. Try launching the AI assistant.
              </div>
            ) : (
              data.recentActivity.map((act) => (
                <div key={act.id} className="flex gap-3 text-xs">
                  <div className="relative flex flex-col items-center">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full z-10 shrink-0" />
                    <div className="w-[1px] flex-1 bg-slate-800 absolute top-2 bottom-[-16px]" />
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="font-medium text-slate-350">{act.toolUsed}</p>
                    <span className="text-[10px] text-slate-500">
                      {new Date(act.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
