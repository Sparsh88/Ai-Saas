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

  const COLORS = ['#2563eb', '#38bdf8', '#818cf8', '#34d399', '#f59e0b'];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const firstName = user?.name ? user.name.split(' ')[0] : 'there';

  return (
    <div className="space-y-6">
      {/* Top Greeting Header & Action Button (Screenshot Style) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            {getGreeting()}, {firstName}!
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-1 font-normal">
            Here's your AI workspace overview for {new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/tools')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-lg shadow-blue-600/30 active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>+ New AI Session</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* Card 1: AI Writing Suite */}
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => navigate('/tools')}
          className="p-5 rounded-2xl bg-[#0d1017] border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                TOTAL AI TOOLS
              </span>
              <div className="text-2xl md:text-3xl font-black text-white mt-1">
                25+
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
              <Wand2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
            <span className="text-zinc-400">Active utilities</span>
            <span className="text-blue-400 font-semibold flex items-center gap-0.5">
              Launch <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </motion.div>

        {/* Card 2: Documents Hub */}
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => navigate('/documents')}
          className="p-5 rounded-2xl bg-[#0d1017] border border-white/5 hover:border-cyan-500/30 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                DOCUMENTS HUB
              </span>
              <div className="text-2xl md:text-3xl font-black text-white mt-1">
                {data?.metrics.totalDocs ?? 0}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
            <span className="text-zinc-400">PDF & DOCX files</span>
            <span className="text-cyan-400 font-semibold flex items-center gap-0.5">
              Explore <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </motion.div>

        {/* Card 3: Kanban Projects */}
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => navigate('/tasks')}
          className="p-5 rounded-2xl bg-[#0d1017] border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                WORKSPACE TASKS
              </span>
              <div className="text-2xl md:text-3xl font-black text-white mt-1">
                {data?.metrics.totalTasks ?? 0}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
            <span className="text-zinc-400">{data?.metrics.totalProjects ?? 0} Projects</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
              Manage <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </motion.div>

        {/* Card 4: Platform Access */}
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => navigate('/chat')}
          className="p-5 rounded-2xl bg-[#0d1017] border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                AI CHAT & MODELS
              </span>
              <div className="text-2xl md:text-3xl font-black text-white mt-1">
                Active
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center shrink-0">
              <BrainCircuit className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
            <span className="text-blue-400 font-semibold">● Unlimited Access</span>
            <span className="text-indigo-400 font-semibold flex items-center gap-0.5">
              Open <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </motion.div>
      </div>

      {/* Analytics & Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Card */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0d1017] border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white">AI Modules Analytics</h3>
              <p className="text-xs text-zinc-400">Invocations & feature usage statistics</p>
            </div>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="h-64 w-full">
            {chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-zinc-500 text-xs">
                No telemetry logs found. Run any AI feature to populate statistics.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2430" opacity={0.6} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0c0e14',
                      borderColor: '#1e2433',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#ffffff',
                    }}
                    labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                    itemStyle={{ color: '#93c5fd' }}
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

        {/* Activity Timeline */}
        <div className="p-6 rounded-2xl bg-[#0d1017] border border-white/5 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>Recent Activity</span>
            </h3>
            <p className="text-xs text-zinc-400 mb-4">Live AI generation logs</p>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto max-h-64 pr-2">
            {!data?.recentActivity || data.recentActivity.length === 0 ? (
              <div className="py-12 text-center text-zinc-500 text-xs">
                No recent activity. Try launching an AI tool.
              </div>
            ) : (
              data.recentActivity.map((act) => (
                <div key={act.id} className="flex gap-3 text-xs">
                  <div className="relative flex flex-col items-center">
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full z-10 shrink-0 ring-4 ring-[#0d1017]" />
                    <div className="w-[1px] flex-1 bg-zinc-800 absolute top-2.5 bottom-[-16px]" />
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="font-medium text-zinc-200">{act.toolUsed}</p>
                    <span className="text-[10px] text-zinc-500">
                      {new Date(act.createdAt).toLocaleTimeString()} • Completed
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
