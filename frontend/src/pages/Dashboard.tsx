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
  ArrowDownRight,
  Plus,
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

  const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#38bdf8', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Welcome Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight">
            Good Morning, {user?.name || 'Sparsh'}!
          </h1>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Here's your productivity and workspace overview for August 2026
          </p>
        </div>

        <button
          onClick={() => navigate('/tools')}
          className="self-start md:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold text-xs md:text-sm shadow-lg shadow-blue-500/25 transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Launch AI Tool</span>
        </button>
      </div>

      {/* 4 Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* Card 1: TOTAL BALANCE / SUITE */}
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => navigate('/tools')}
          className="p-5 rounded-2xl bg-white dark:bg-[#0e1217] border border-slate-200 dark:border-[#1b222c] hover:border-blue-500/40 transition-all flex flex-col justify-between cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">AI Writing Suite</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-[#14233a] border border-blue-200 dark:border-[#1e3a61] text-blue-600 dark:text-[#3b82f6] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
          </div>
          <div>
            <span className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">25+</span>
            <p className="text-xs text-slate-500 mt-1">Lifetime net utilities</p>
          </div>
        </motion.div>

        {/* Card 2: MONTHLY INCOME / DOCUMENTS */}
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => navigate('/documents')}
          className="p-5 rounded-2xl bg-blue-50/70 dark:bg-[#081528] border border-blue-200 dark:border-[#0f294a] hover:border-blue-500/50 transition-all flex flex-col justify-between cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-blue-700 dark:text-slate-400 uppercase tracking-wider">Documents Hub</span>
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-[#0c2242] border border-blue-300 dark:border-[#1d4474] text-blue-600 dark:text-[#3b82f6] flex items-center justify-center group-hover:scale-105 transition-transform">
              <TrendingUp className="w-4.5 h-4.5" />
            </div>
          </div>
          <div>
            <span className="text-2xl md:text-3xl font-extrabold text-blue-600 dark:text-[#3b82f6]">{data?.metrics.totalDocs || 0}</span>
            <p className="text-xs text-blue-600/70 dark:text-slate-400 mt-1">This month</p>
          </div>
        </motion.div>

        {/* Card 3: MONTHLY EXPENSES / ACTIVE PROJECTS */}
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => navigate('/tasks')}
          className="p-5 rounded-2xl bg-rose-50/70 dark:bg-[#1a0a0c] border border-rose-200 dark:border-[#381518] hover:border-rose-500/50 transition-all flex flex-col justify-between cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-rose-700 dark:text-slate-400 uppercase tracking-wider">Active Projects</span>
            <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-[#2d1215] border border-rose-300 dark:border-[#521c21] text-rose-600 dark:text-[#ef4444] flex items-center justify-center group-hover:scale-105 transition-transform">
              <ArrowDownRight className="w-4.5 h-4.5" />
            </div>
          </div>
          <div>
            <span className="text-2xl md:text-3xl font-extrabold text-rose-600 dark:text-[#ef4444]">{data?.metrics.totalProjects || 0}</span>
            <p className="text-xs text-rose-600/70 dark:text-slate-400 mt-1">This month</p>
          </div>
        </motion.div>

        {/* Card 4: MONTHLY SAVINGS / TOTAL TASKS */}
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => navigate('/tasks')}
          className="p-5 rounded-2xl bg-sky-50/70 dark:bg-[#081724] border border-sky-200 dark:border-[#0e2c45] hover:border-sky-500/50 transition-all flex flex-col justify-between cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-sky-700 dark:text-slate-400 uppercase tracking-wider">Total Tasks</span>
            <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-[#0c2438] border border-sky-300 dark:border-[#164163] text-sky-600 dark:text-[#38bdf8] flex items-center justify-center group-hover:scale-105 transition-transform">
              <CheckSquare className="w-4.5 h-4.5" />
            </div>
          </div>
          <div>
            <span className="text-2xl md:text-3xl font-extrabold text-sky-600 dark:text-[#38bdf8]">{data?.metrics.totalTasks || 0}</span>
            <p className="text-xs text-sky-600/70 dark:text-slate-400 mt-1">Completed milestones</p>
          </div>
        </motion.div>
      </div>

      {/* Analytics Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Card: Area Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-[#0d0d0d] border border-slate-200 dark:border-[#1c1c1c] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">AI Invocations vs Execution</h3>
              <p className="text-xs text-slate-500 mt-0.5">Last 6 periods</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-blue-600 dark:text-[#3b82f6] font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" /> AI Usage
              </span>
              <span className="flex items-center gap-1.5 text-rose-600 dark:text-[#ef4444] font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" /> Latency
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            {chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-500 text-xs">
                No telemetry logs found. Run any AI feature to populate statistics.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={document.documentElement.classList.contains('dark') ? '#1f1f1f' : '#f1f5f9'} />
                  <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} />
                  <YAxis stroke="#888888" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: document.documentElement.classList.contains('dark') ? '#000000' : '#ffffff',
                      borderColor: document.documentElement.classList.contains('dark') ? '#222222' : '#e2e8f0',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#0f172a',
                    }}
                    labelStyle={{ fontWeight: 'bold' }}
                    itemStyle={{ color: '#3b82f6' }}
                  />
                  <Bar dataKey="count" name="Calls" radius={[6, 6, 0, 0]}>
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Right Card: Activity */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0d0d0d] border border-slate-200 dark:border-[#1c1c1c] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">AI Allocation</h3>
              <p className="text-xs text-slate-500">This month</p>
            </div>
            <span className="text-xs font-bold text-amber-600 dark:text-[#f59e0b] bg-amber-50 dark:bg-[#f59e0b]/10 px-2.5 py-1 rounded-lg">
              100% Active
            </span>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto max-h-64 pr-1">
            {!data?.recentActivity || data.recentActivity.length === 0 ? (
              <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-xs">
                No recent activity. Try launching the AI assistant.
              </div>
            ) : (
              data.recentActivity.map((act) => (
                <div key={act.id} className="flex gap-3 text-xs">
                  <div className="relative flex flex-col items-center">
                    <div className="w-2.5 h-2.5 bg-[#3b82f6] rounded-full z-10 shrink-0 shadow-sm shadow-blue-500/50" />
                    <div className="w-[1px] flex-1 bg-slate-200 dark:bg-[#222222] absolute top-2 bottom-[-16px]" />
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="font-semibold text-slate-900 dark:text-white">{act.toolUsed}</p>
                    <span className="text-[10px] text-slate-500">
                      {new Date(act.createdAt).toLocaleTimeString()} • Generated
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
